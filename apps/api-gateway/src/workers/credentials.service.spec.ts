import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CredentialsService } from './credentials.service';

vi.mock('@luckyplans/shared', () => ({
  getEnvVar: vi.fn(() => 'test-worker-pepper'),
}));

describe('CredentialsService', () => {
  const prisma = {
    workerCredential: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  };

  let service: CredentialsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CredentialsService(prisma as never);
  });

  it('issues a credential and returns raw value once', async () => {
    prisma.workerCredential.create.mockResolvedValue({
      id: 'cred_1',
      workerId: 'worker_1',
      keyPrefix: 'abcd1234',
      keyHash: 'hash',
      status: 'ACTIVE',
      expiresAt: null,
      rotatedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const issued = await service.issueCredential('worker_1');

    expect(issued.credential).toMatch(/^wk_live_[a-z0-9]{8}_[a-f0-9]{48}$/);
    expect(prisma.workerCredential.create).toHaveBeenCalledOnce();
  });

  it('rejects revoked credentials during verify', async () => {
    const credential = 'wk_live_abcd1234_1234567890abcdef1234567890abcdef1234567890abcdef';
    prisma.workerCredential.findFirst.mockResolvedValue({
      id: 'cred_1',
      workerId: 'worker_1',
      keyPrefix: 'abcd1234',
      keyHash: 'not-a-match',
      status: 'REVOKED',
      expiresAt: null,
    });

    const verified = await service.verifyCredential(credential);

    expect(verified).toBeNull();
  });

  it('rotates credentials with a 24h overlap window', async () => {
    prisma.workerCredential.updateMany.mockResolvedValue({ count: 1 });
    prisma.workerCredential.create.mockResolvedValue({
      id: 'cred_2',
      workerId: 'worker_1',
      keyPrefix: 'beefcafe',
      keyHash: 'hash',
      status: 'ACTIVE',
      expiresAt: null,
      rotatedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const rotated = await service.rotateCredential('worker_1');

    expect(rotated.credential).toMatch(/^wk_live_[a-z0-9]{8}_[a-f0-9]{48}$/);
    expect(prisma.workerCredential.updateMany).toHaveBeenCalledOnce();
    expect(prisma.workerCredential.create).toHaveBeenCalledOnce();
  });
});
