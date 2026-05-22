import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { Injectable } from '@nestjs/common';
import { getEnvVar } from '@luckyplans/shared';
import { PrismaService } from '../database/prisma.service';

type EnrollmentTokenParsed = {
  prefix: string;
  secret: string;
};

type VerifyEnrollmentTokenResult = {
  ok: boolean;
};

@Injectable()
export class EnrollmentTokensService {
  constructor(private readonly prisma: PrismaService) {}

  async listTokens() {
    return this.prisma.edgeEnrollmentToken.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createToken(input: { label?: string; expiresAt?: Date; maxUses?: number }) {
    const prefix = randomBytes(4).toString('hex');
    const secret = randomBytes(24).toString('hex');
    const tokenHash = this.hashSecret(secret);

    const created = await this.prisma.edgeEnrollmentToken.create({
      data: {
        label: input.label?.trim() || null,
        tokenPrefix: prefix,
        tokenHash,
        status: 'ACTIVE',
        expiresAt: input.expiresAt ?? null,
        maxUses: input.maxUses ?? null,
      },
    });

    return {
      ...created,
      token: `etr_live_${prefix}_${secret}`,
    };
  }

  async revokeToken(id: string) {
    await this.prisma.edgeEnrollmentToken.update({
      where: { id },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
      },
    });
    return true;
  }

  async verifyAndConsume(rawToken: string): Promise<VerifyEnrollmentTokenResult> {
    const parsed = this.parseToken(rawToken);
    if (!parsed) return { ok: false };

    const candidate = await this.prisma.edgeEnrollmentToken.findUnique({
      where: { tokenPrefix: parsed.prefix },
    });
    if (!candidate) return { ok: false };
    if (candidate.status !== 'ACTIVE') return { ok: false };
    if (candidate.expiresAt && candidate.expiresAt.getTime() <= Date.now()) return { ok: false };
    if (candidate.maxUses !== null && candidate.usedCount >= candidate.maxUses)
      return { ok: false };

    const expected = Buffer.from(candidate.tokenHash, 'hex');
    const presented = Buffer.from(this.hashSecret(parsed.secret), 'hex');
    if (expected.length !== presented.length) return { ok: false };
    if (!timingSafeEqual(expected, presented)) return { ok: false };

    const consumed = await this.prisma.edgeEnrollmentToken.updateMany({
      where: {
        id: candidate.id,
        status: 'ACTIVE',
        usedCount: candidate.usedCount,
      },
      data: {
        usedCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    return { ok: consumed.count === 1 };
  }

  private parseToken(raw: string): EnrollmentTokenParsed | null {
    const match = /^etr_live_([a-z0-9]{8})_([a-f0-9]{48})$/.exec(raw);
    if (!match) return null;
    return { prefix: match[1], secret: match[2] };
  }

  private hashSecret(secret: string): string {
    return createHmac('sha256', getEnvVar('WORKER_CREDENTIAL_PEPPER')).update(secret).digest('hex');
  }
}
