import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReleasesService } from './releases.service';

describe('ReleasesService', () => {
  const prisma = {
    edgeRelease: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    worker: {
      updateMany: vi.fn(),
      update: vi.fn(),
    },
  };

  let service: ReleasesService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ReleasesService(prisma as never);
  });

  it('creates a release metadata record', async () => {
    prisma.edgeRelease.create.mockResolvedValue({
      id: 'rel_1',
      version: '1.0.0',
      windowsUrl: 'https://example.com/windows.exe',
      linuxUrl: 'https://example.com/linux.tar.gz',
      checksum: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      signature: 'sig',
      notes: 'initial',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const created = await service.createRelease({
      version: '1.0.0',
      windowsUrl: 'https://example.com/windows.exe',
      linuxUrl: 'https://example.com/linux.tar.gz',
      checksum: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      signature: 'sig',
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
});
