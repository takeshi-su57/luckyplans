import { ForbiddenException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EdgesConnectivityController } from './edges-connectivity.controller';

describe('EdgesConnectivityController', () => {
  const workersService = {
    findWorkerById: vi.fn(),
    markConnectivity: vi.fn(),
  };
  const prisma = {
    edgeRelease: {
      findFirst: vi.fn(),
    },
  };
  const controller = new EdgesConnectivityController(workersService as never, prisma as never);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates connectivity and returns target release metadata when available', async () => {
    workersService.findWorkerById.mockResolvedValue({
      id: 'worker_1',
      deviceNumber: 'edge-seoul-a1b2c3',
      targetVersion: '1.2.3',
    });
    workersService.markConnectivity.mockResolvedValue(undefined);
    prisma.edgeRelease.findFirst.mockResolvedValue({
      version: '1.2.3',
      windowsUrl: 'https://example.com/windows.zip',
      linuxUrl: 'https://example.com/linux.tgz',
      checksum: 'a'.repeat(64),
      signature: 'sig',
      signatureAlgorithm: 'ed25519',
      signingKeyId: 'main',
      notes: 'notes',
    });

    const result = await controller.connectivity(
      {
        workerId: 'worker_1',
        deviceNumber: 'edge-seoul-a1b2c3',
        currentVersion: '0.1.0',
        platform: 'linux',
        arch: 'x64',
      },
      { worker: { workerId: 'worker_1' } },
    );

    expect(result.targetVersion).toBe('1.2.3');
    expect(result.release?.version).toBe('1.2.3');
  });

  it('rejects connectivity when worker binding does not match', async () => {
    workersService.findWorkerById.mockResolvedValue({
      id: 'worker_1',
      deviceNumber: 'edge-other-z9y8x7',
      targetVersion: null,
    });

    await expect(
      controller.connectivity(
        {
          workerId: 'worker_1',
          deviceNumber: 'edge-seoul-a1b2c3',
          currentVersion: '0.1.0',
        },
        { worker: { workerId: 'worker_1' } },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
