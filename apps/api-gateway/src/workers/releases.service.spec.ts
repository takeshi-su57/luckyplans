import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReleasesService } from './releases.service';

describe('ReleasesService', () => {
  const prisma = {
    edgeRelease: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    worker: {
      updateMany: vi.fn(),
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
      checksum: 'abc',
      signature: 'sig',
      notes: 'initial',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const created = await service.createRelease({
      version: '1.0.0',
      windowsUrl: 'https://example.com/windows.exe',
      linuxUrl: 'https://example.com/linux.tar.gz',
      checksum: 'abc',
      signature: 'sig',
      notes: 'initial',
    });

    expect(created.version).toBe('1.0.0');
    expect(prisma.edgeRelease.create).toHaveBeenCalledOnce();
  });

  it('sets target version for selected workers', async () => {
    prisma.worker.updateMany.mockResolvedValue({ count: 2 });

    const updated = await service.setWorkerTargetVersion(['w1', 'w2'], '1.0.1');

    expect(updated).toBe(2);
    expect(prisma.worker.updateMany).toHaveBeenCalledOnce();
  });
});
