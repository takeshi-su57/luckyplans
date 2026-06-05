import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '@nestjs/common';
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
    edgeReleaseArtifact: {
      findFirst: vi.fn(),
    },
    worker: {
      updateMany: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };

  let service: ReleasesService;
  let loggerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    loggerSpy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
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
    expect(prisma.edgeRelease.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        version: '1.0.0',
        artifacts: {
          create: [
            expect.objectContaining({
              platform: 'win32',
              arch: 'x64',
              installType: 'service',
              url: 'https://example.com/windows.exe',
              checksum,
              signature,
            }),
            expect.objectContaining({
              platform: 'linux',
              arch: 'x64',
              installType: 'service',
              url: 'https://example.com/linux.tar.gz',
              checksum,
              signature,
            }),
          ],
        },
      }),
    });
  });

  it('sets target version for selected workers', async () => {
    prisma.edgeRelease.findFirst.mockResolvedValue({ id: 'rel_1', version: '1.0.1' });
    prisma.worker.updateMany.mockResolvedValue({ count: 2 });

    const updated = await service.setWorkerTargetVersion(['w1', 'w2'], '1.0.1');

    expect(updated).toBe(2);
    expect(prisma.worker.updateMany).toHaveBeenCalledOnce();
  });

  it('logs target version assignments without release payload details', async () => {
    prisma.edgeRelease.findFirst.mockResolvedValue({ id: 'rel_1', version: '1.0.1' });
    prisma.worker.updateMany.mockResolvedValue({ count: 2 });

    await service.setWorkerTargetVersion(['w1', 'w2'], '1.0.1');

    expect(loggerSpy).toHaveBeenCalledWith(
      'edge.upgrade.target_assigned workerCount=2 targetVersion=1.0.1 updatedCount=2',
    );
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

  it('logs worker upgrade status transitions without raw messages', async () => {
    (prisma as unknown as Record<string, unknown>).upgradeCampaignWorker = {
      updateMany: vi.fn().mockResolvedValue({ count: 0 }),
    };
    prisma.worker.update.mockResolvedValue({
      id: 'w1',
      upgradeStatus: 'FAILED',
      upgradeMessage: 'verification failed for token=secret',
    });

    await service.reportWorkerUpgradeStatus('w1', 'FAILED', 'verification failed for token=secret');

    expect(loggerSpy).toHaveBeenCalledWith(
      'edge.upgrade.status_transition workerId=w1 status=FAILED hasMessage=true messageLength=36',
    );
    expect(loggerSpy).not.toHaveBeenCalledWith(expect.stringContaining('token=secret'));
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

  it('returns Linux x64 service artifact metadata for a worker target version', async () => {
    prisma.worker.findUnique.mockResolvedValue({
      id: 'worker_1',
      targetVersion: '1.2.3',
      platform: 'linux',
      arch: 'x64',
    });
    prisma.edgeReleaseArtifact.findFirst.mockResolvedValue({
      release: { version: '1.2.3', notes: null },
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      url: 'https://example.com/releases/1.2.3/linux-x64.tar.gz',
      checksum: 'a'.repeat(64),
      signature: 'sig-linux',
      signatureAlgorithm: 'ed25519',
      signingKeyId: 'main',
      sizeBytes: BigInt(1234),
    });

    const result = await service.getUpgradeArtifactForWorker({
      workerId: 'worker_1',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
    });

    expect(result).toEqual({
      artifact: {
        version: '1.2.3',
        platform: 'linux',
        arch: 'x64',
        installType: 'service',
        url: 'https://example.com/releases/1.2.3/linux-x64.tar.gz',
        checksum: 'a'.repeat(64),
        signature: 'sig-linux',
        signatureAlgorithm: 'ed25519',
        signingKeyId: 'main',
        sizeBytes: 1234,
      },
      message: null,
    });
    expect(prisma.edgeReleaseArtifact.findFirst).toHaveBeenCalledWith({
      where: {
        release: { version: '1.2.3' },
        platform: 'linux',
        arch: 'x64',
        installType: 'service',
      },
      select: expect.any(Object),
    });
  });

  it('normalizes windows platform before resolving artifact metadata', async () => {
    prisma.worker.findUnique.mockResolvedValue({
      id: 'worker_2',
      targetVersion: '1.2.3',
      platform: 'windows',
      arch: 'x64',
    });
    prisma.edgeReleaseArtifact.findFirst.mockResolvedValue({
      release: { version: '1.2.3', notes: null },
      platform: 'win32',
      arch: 'x64',
      installType: 'service',
      url: 'https://example.com/releases/1.2.3/windows-x64.zip',
      checksum: 'b'.repeat(64),
      signature: 'sig-windows',
      signatureAlgorithm: 'ed25519',
      signingKeyId: 'main',
      sizeBytes: null,
    });

    const result = await service.getUpgradeArtifactForWorker({
      workerId: 'worker_2',
      platform: 'windows',
      arch: 'x64',
    });

    expect(result.artifact?.platform).toBe('win32');
    expect(result.artifact?.url).toBe('https://example.com/releases/1.2.3/windows-x64.zip');
    expect(prisma.edgeReleaseArtifact.findFirst.mock.calls[0][0].where).toMatchObject({
      platform: 'win32',
      arch: 'x64',
      installType: 'service',
    });
  });

  it('returns no artifact when worker has no target version', async () => {
    prisma.worker.findUnique.mockResolvedValue({
      id: 'worker_3',
      targetVersion: null,
      platform: 'linux',
      arch: 'x64',
    });

    const result = await service.getUpgradeArtifactForWorker({
      workerId: 'worker_3',
      platform: 'linux',
      arch: 'x64',
    });

    expect(result).toEqual({ artifact: null, message: null });
    expect(prisma.edgeReleaseArtifact.findFirst).not.toHaveBeenCalled();
  });

  it('returns clear message when artifact is incompatible with worker platform and arch', async () => {
    prisma.worker.findUnique.mockResolvedValue({
      id: 'worker_4',
      targetVersion: '1.2.3',
      platform: 'linux',
      arch: 'arm64',
    });
    prisma.edgeReleaseArtifact.findFirst.mockResolvedValue(null);

    const result = await service.getUpgradeArtifactForWorker({
      workerId: 'worker_4',
      platform: 'linux',
      arch: 'arm64',
    });

    expect(result).toEqual({
      artifact: null,
      message: 'No compatible edge release artifact found for 1.2.3 on linux/arm64/service',
    });
  });
});
