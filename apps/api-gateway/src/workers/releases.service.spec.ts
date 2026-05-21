import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateKeyPairSync, sign } from 'crypto';
import { ReleasesService } from './releases.service';

describe('ReleasesService', () => {
  let signingPrivateKeyPem = '';
  const prisma = {
    edgeRelease: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    worker: {
      updateMany: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };

  let service: ReleasesService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ReleasesService(prisma as never);
    const { publicKey, privateKey } = generateKeyPairSync('ed25519');
    signingPrivateKeyPem = privateKey.export({
      type: 'pkcs8',
      format: 'pem',
    }) as string;
    process.env.EDGE_RELEASE_SIGNING_PUBLIC_KEY = publicKey.export({
      type: 'spki',
      format: 'pem',
    }) as string;
  });

  it('creates a release metadata record', async () => {
    const checksum = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const signature = sign(null, Buffer.from(checksum, 'utf8'), signingPrivateKeyPem).toString(
      'base64',
    );
    prisma.edgeRelease.create.mockResolvedValue({
      id: 'rel_1',
      version: '1.0.0',
      windowsUrl: 'https://example.com/windows.exe',
      linuxUrl: 'https://example.com/linux.tar.gz',
      checksum,
      signature,
      signatureAlgorithm: 'ed25519',
      signingKeyId: null,
      notes: 'initial',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const created = await service.createRelease({
      version: '1.0.0',
      windowsUrl: 'https://example.com/windows.exe',
      linuxUrl: 'https://example.com/linux.tar.gz',
      checksum,
      signature,
      notes: 'initial',
    });

    expect(created.version).toBe('1.0.0');
    expect(prisma.edgeRelease.create).toHaveBeenCalledOnce();
  });

  it('sets target version for selected workers', async () => {
    prisma.edgeRelease.findFirst.mockResolvedValue({ id: 'rel_1', version: '1.0.1' });
    prisma.worker.updateMany.mockResolvedValue({ count: 2 });

    const updated = await service.setWorkerTargetVersion(['w1', 'w2'], '1.0.1');

    expect(updated).toBe(2);
    expect(prisma.worker.updateMany).toHaveBeenCalledOnce();
  });

  it('starts rollout campaign and seeds first phase workers', async () => {
    prisma.edgeRelease.findFirst.mockResolvedValue({ id: 'rel_1', version: '1.0.1' });
    prisma.worker.findMany.mockResolvedValue([
      { id: 'w1', version: '1.0.0' },
      { id: 'w2', version: '1.0.0' },
    ]);
    (prisma as unknown as Record<string, unknown>).upgradeCampaign = {
      create: vi.fn().mockResolvedValue({
        id: 'camp_1',
        targetVersion: '1.0.1',
        previousVersion: '1.0.0',
        forceMode: false,
        phaseSize: 1,
        currentPhase: 0,
        successThreshold: 1,
        failureThreshold: 0.5,
        status: 'RUNNING',
      }),
    };
    (prisma as unknown as Record<string, unknown>).upgradeCampaignWorker = {
      createMany: vi.fn().mockResolvedValue({ count: 2 }),
      findMany: vi.fn(),
      updateMany: vi.fn(),
    };
    prisma.worker.updateMany.mockResolvedValue({ count: 1 });

    const created = await service.startUpgradeCampaign({
      workerIds: ['w1', 'w2'],
      targetVersion: '1.0.1',
      phaseSize: 1,
    });

    expect(created.id).toBe('camp_1');
  });

  it('rejects target version update when release is not registered', async () => {
    prisma.edgeRelease.findFirst.mockResolvedValue(null);

    await expect(service.setWorkerTargetVersion(['w1'], '9.9.9')).rejects.toThrow(
      'Target version is not registered as an edge release',
    );
    expect(prisma.worker.updateMany).not.toHaveBeenCalled();
  });

  it('updates worker upgrade status payload', async () => {
    prisma.worker.update.mockResolvedValue({
      id: 'w1',
      upgradeStatus: 'DOWNLOADING',
      upgradeMessage: 'fetching package',
    });

    const updated = await service.reportWorkerUpgradeStatus(
      'w1',
      'DOWNLOADING',
      'fetching package',
    );

    expect(updated.upgradeStatus).toBe('DOWNLOADING');
    expect(prisma.worker.update).toHaveBeenCalledOnce();
  });

  it('rejects invalid release checksum/signature/version payloads', async () => {
    await expect(
      service.createRelease({
        version: 'latest',
        windowsUrl: 'https://example.com/windows.exe',
        linuxUrl: 'https://example.com/linux.tar.gz',
        checksum: 'not-sha256',
        signature: '',
      }),
    ).rejects.toThrow('Invalid release version format');

    expect(prisma.edgeRelease.create).not.toHaveBeenCalled();
  });

  it('returns release artifact metadata for a worker target version', async () => {
    prisma.worker.findUnique.mockResolvedValue({ id: 'worker_1', targetVersion: '1.2.3' });
    prisma.edgeRelease.findFirst.mockResolvedValue({
      id: 'rel_123',
      version: '1.2.3',
      windowsUrl: 'https://example.com/releases/1.2.3/windows.exe',
      linuxUrl: 'https://example.com/releases/1.2.3/linux.tar.gz',
      checksum: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      signature: 'sig',
      signatureAlgorithm: 'ed25519',
      signingKeyId: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const release = await service.getReleaseForWorkerTarget('worker_1');

    expect(release?.version).toBe('1.2.3');
    expect(release?.linuxUrl).toMatch(/^https:/);
  });
});
