import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { type JWTVerifyGetKey, createRemoteJWKSet, jwtVerify } from 'jose';
import { type AuthUser, getEnvVar } from '@luckyplans/shared';
import { SessionService, type SessionData } from './session.service';

// Lazily initialised on first request — avoids calling getEnvVar at module-load
// time (before dotenv-cli has injected env vars into the process).
let jwks: JWTVerifyGetKey | null = null;

function getJWKS(): JWTVerifyGetKey {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(getEnvVar('KEYCLOAK_JWKS_URI')));
  }
  return jwks;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
}

@Controller('auth')
export class OidcController {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * POST /auth/login
   * Accepts email + password, authenticates via Keycloak ROPC, creates session.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { email?: string; password?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const tokens = await this.authenticateWithRopc(email, password);
    const user = await this.extractUserFromIdToken(tokens.id_token);
    await this.createSessionAndSetCookie(user, tokens, res);

    return { success: true, user };
  }

  /**
   * POST /auth/register
   * Creates a new user in Keycloak via Admin API, then auto-logs in.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body()
    body: {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password, firstName, lastName } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Get an admin token via client_credentials grant
    const adminToken = await this.getAdminToken();

    // Create user via Keycloak Admin REST API
    const adminUrl = getEnvVar('KEYCLOAK_ADMIN_URL', 'http://localhost:8080');
    const createUserRes = await fetch(
      `${adminUrl}/admin/realms/luckyplans/users`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          enabled: true,
          emailVerified: true,
          credentials: [
            { type: 'password', value: password, temporary: false },
          ],
        }),
      },
    );

    if (createUserRes.status === 409) {
      throw new ConflictException('A user with this email already exists');
    }

    if (!createUserRes.ok) {
      const detail = await createUserRes.text();
      throw new BadRequestException(`Registration failed: ${detail}`);
    }

    // Auto-login the new user
    const tokens = await this.authenticateWithRopc(email, password);
    const user = await this.extractUserFromIdToken(tokens.id_token);
    await this.createSessionAndSetCookie(user, tokens, res);

    return { success: true, user };
  }

  /**
   * POST /auth/logout
   * Clears the session and cookie.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = req.cookies?.['session_id'] as string | undefined;

    if (sessionId) {
      await this.sessionService.deleteSession(sessionId);
    }

    res.clearCookie('session_id', { path: '/' });

    return { success: true };
  }

  // --- Private helpers ---

  private async authenticateWithRopc(
    email: string,
    password: string,
  ): Promise<TokenResponse> {
    const issuer = getEnvVar('KEYCLOAK_ISSUER');
    const tokenUrl = `${issuer}/protocol/openid-connect/token`;

    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: getEnvVar('KEYCLOAK_CLIENT_ID'),
      client_secret: getEnvVar('KEYCLOAK_CLIENT_SECRET'),
      username: email,
      password,
      scope: 'openid profile email roles',
    });

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return (await tokenRes.json()) as TokenResponse;
  }

  private async getAdminToken(): Promise<string> {
    const issuer = getEnvVar('KEYCLOAK_ISSUER');
    const tokenUrl = `${issuer}/protocol/openid-connect/token`;

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: getEnvVar('KEYCLOAK_CLIENT_ID'),
      client_secret: getEnvVar('KEYCLOAK_CLIENT_SECRET'),
    });

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      throw new BadRequestException('Failed to obtain admin token');
    }

    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  }

  private async extractUserFromIdToken(idToken: string): Promise<AuthUser> {
    const issuer = getEnvVar('KEYCLOAK_ISSUER');
    const { payload } = await jwtVerify(idToken, getJWKS(), { issuer });

    const realmAccess = payload['realm_access'] as
      | { roles?: string[] }
      | undefined;

    return {
      userId: payload.sub ?? '',
      email: (payload['email'] as string | undefined) ?? '',
      name: payload['name'] as string | undefined,
      roles: realmAccess?.roles ?? [],
    };
  }

  private async createSessionAndSetCookie(
    user: AuthUser,
    tokens: TokenResponse,
    res: Response,
  ): Promise<void> {
    const sessionData: SessionData = {
      ...user,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in,
    };

    const sessionId = await this.sessionService.createSession(sessionData);
    const isProduction = getEnvVar('NODE_ENV', 'development') === 'production';

    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge:
        parseInt(getEnvVar('SESSION_TTL_SECONDS', '36000'), 10) * 1000,
    });
  }
}
