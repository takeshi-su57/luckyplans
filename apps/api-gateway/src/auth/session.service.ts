import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import { randomBytes } from 'node:crypto';
import { getEnvVar, getRedisConfig } from '@luckyplans/shared';

export interface SessionData {
  userId: string;
  email: string;
  name?: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  expiresAt: number; // epoch seconds
}

const SESSION_PREFIX = 'session:';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private redis: Redis;

  constructor() {
    const { host, port } = getRedisConfig();
    this.redis = new Redis({ host, port, lazyConnect: true });
    this.redis.connect().catch((err) => {
      this.logger.error('Failed to connect to Redis', err);
    });
  }

  private get ttlSeconds(): number {
    return parseInt(getEnvVar('SESSION_TTL_SECONDS', '36000'), 10);
  }

  async createSession(data: SessionData): Promise<string> {
    const sessionId = randomBytes(32).toString('hex');
    await this.redis.set(
      `${SESSION_PREFIX}${sessionId}`,
      JSON.stringify(data),
      'EX',
      this.ttlSeconds,
    );
    return sessionId;
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const raw = await this.redis.get(`${SESSION_PREFIX}${sessionId}`);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  }

  async updateSession(sessionId: string, data: Partial<SessionData>): Promise<void> {
    const key = `${SESSION_PREFIX}${sessionId}`;
    const ttl = await this.redis.ttl(key);
    if (ttl <= 0) return;

    const existing = await this.getSession(sessionId);
    if (!existing) return;

    const updated = { ...existing, ...data };
    await this.redis.set(key, JSON.stringify(updated), 'EX', ttl);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.redis.del(`${SESSION_PREFIX}${sessionId}`);
  }

  /**
   * Refresh the Keycloak access token if it's within 60s of expiry.
   * Updates the session in Redis and returns the (possibly refreshed) data.
   */
  async refreshIfNeeded(sessionId: string, session: SessionData): Promise<SessionData> {
    const now = Math.floor(Date.now() / 1000);
    if (session.expiresAt - now > 60) {
      return session;
    }

    try {
      const issuer = getEnvVar('KEYCLOAK_ISSUER');
      const tokenUrl = `${issuer}/protocol/openid-connect/token`;

      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: getEnvVar('KEYCLOAK_CLIENT_ID'),
        client_secret: getEnvVar('KEYCLOAK_CLIENT_SECRET'),
        refresh_token: session.refreshToken,
      });

      const res = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!res.ok) {
        throw new Error(`Token refresh failed: ${res.status}`);
      }

      const tokens = (await res.json()) as {
        access_token: string;
        refresh_token: string;
        id_token?: string;
        expires_in: number;
      };

      const updated: SessionData = {
        ...session,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token ?? session.idToken,
        expiresAt: now + tokens.expires_in,
      };

      await this.updateSession(sessionId, updated);
      return updated;
    } catch (err) {
      // Only destroy the session if Keycloak explicitly rejected the refresh token
      // (4xx means the token is invalid/revoked). Transient errors (network timeout,
      // 5xx from Keycloak) should NOT nuke the user's session — just skip the refresh
      // and let the existing (possibly stale) access token ride until the next request.
      const isTokenRejected =
        err instanceof Error && /Token refresh failed: 4\d{2}/.test(err.message);

      if (isTokenRejected) {
        this.logger.warn('Refresh token rejected by Keycloak — deleting session');
        await this.deleteSession(sessionId);
        throw new UnauthorizedException('Session expired — please log in again');
      }

      this.logger.warn('Token refresh failed (transient) — using existing session');
      return session;
    }
  }
}
