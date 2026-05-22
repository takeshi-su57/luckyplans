import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { getEnvVar } from '@luckyplans/shared';
import { PrismaService } from '../database/prisma.service';

type VerifiedCredential = {
  workerId: string;
  credentialId: string;
};

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async issueCredential(workerId: string) {
    const prefix = randomBytes(4).toString('hex');
    const secret = randomBytes(24).toString('hex');
    const keyHash = this.hashSecret(secret);

    const created = await this.prisma.workerCredential.create({
      data: {
        workerId,
        keyPrefix: prefix,
        keyHash,
        status: 'ACTIVE',
      },
    });
    this.logger.log(`audit credential.issue workerId=${workerId} credentialId=${created.id}`);

    return {
      id: created.id,
      workerId: created.workerId,
      keyPrefix: created.keyPrefix,
      credential: `wk_live_${prefix}_${secret}`,
    };
  }

  async verifyCredential(rawCredential: string): Promise<VerifiedCredential | null> {
    const parsed = this.parseCredential(rawCredential);
    if (!parsed) return null;

    const candidate = await this.prisma.workerCredential.findFirst({
      where: { keyPrefix: parsed.prefix },
    });
    if (!candidate) return null;
    if (candidate.status !== 'ACTIVE') return null;
    if (candidate.expiresAt && candidate.expiresAt.getTime() <= Date.now()) return null;

    const expected = Buffer.from(candidate.keyHash, 'hex');
    const presented = Buffer.from(this.hashSecret(parsed.secret), 'hex');
    if (expected.length !== presented.length) return null;
    if (!timingSafeEqual(expected, presented)) return null;

    return {
      workerId: candidate.workerId,
      credentialId: candidate.id,
    };
  }

  async revokeCredential(id: string) {
    const revoked = await this.prisma.workerCredential.update({
      where: { id },
      data: { status: 'REVOKED' },
    });
    this.logger.log(`audit credential.revoke workerId=${revoked.workerId} credentialId=${id}`);
    return revoked;
  }

  async rotateCredential(workerId: string) {
    const overlapExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const rotated = await this.prisma.workerCredential.updateMany({
      where: {
        workerId,
        status: 'ACTIVE',
      },
      data: {
        rotatedAt: new Date(),
        expiresAt: overlapExpiresAt,
      },
    });
    this.logger.log(`audit credential.rotate workerId=${workerId} rotatedCount=${rotated.count}`);

    return this.issueCredential(workerId);
  }

  private parseCredential(raw: string): { prefix: string; secret: string } | null {
    const match = /^wk_live_([a-z0-9]{8})_([a-f0-9]{48})$/.exec(raw);
    if (!match) return null;
    return { prefix: match[1], secret: match[2] };
  }

  private hashSecret(secret: string): string {
    return createHmac('sha256', getEnvVar('WORKER_CREDENTIAL_PEPPER')).update(secret).digest('hex');
  }
}
