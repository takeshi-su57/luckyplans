import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EdgesConnectivityController } from './edges-connectivity.controller';

describe('EdgesConnectivityController', () => {
  const workersService = {
    findWorkerById: vi.fn(),
    markConnectivity: vi.fn(),
  };
  const releasesService = {
    getUpgradeArtifactForWorker: vi.fn(),
  };
  const controller = new EdgesConnectivityController(
    workersService as never,
    releasesService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates connectivity and returns target release metadata when available', async () => {
    workersService.findWorkerById.mockResolvedValue({
      id: 'worker_1',
      deviceNumber: 'edge-test-a1b2c3',
      targetVersion: '1.2.3',
    });
    workersService.markConnectivity.mockResolvedValue(undefined);
    releasesService.getUpgradeArtifactForWorker.mockResolvedValue({
      artifact: {
        version: '1.2.3',
        platform: 'linux',
        arch: 'x64',
        installType: 'service',
        url: 'https://example.com/linux-x64.tgz',
        checksum: 'a'.repeat(64),
        signature: 'sig',
        signatureAlgorithm: 'ed25519',
        signingKeyId: 'main',
        sizeBytes: 1234,
      },
      message: null,
    });

    const result = await controller.connectivity(
      {
        workerId: 'worker_1',
        deviceNumber: 'edge-test-a1b2c3',
        currentVersion: '0.1.0',
        platform: 'linux',
        arch: 'x64',
      },
      { worker: { workerId: 'worker_1' } },
    );

    expect(result.targetVersion).toBe('1.2.3');
    expect(result.release).toEqual({
      version: '1.2.3',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      url: 'https://example.com/linux-x64.tgz',
      checksum: 'a'.repeat(64),
      signature: 'sig',
      signatureAlgorithm: 'ed25519',
      signingKeyId: 'main',
      sizeBytes: 1234,
    });
    expect(releasesService.getUpgradeArtifactForWorker).toHaveBeenCalledWith({
      workerId: 'worker_1',
      platform: 'linux',
      arch: 'x64',
      installType: undefined,
    });
    expect(workersService.markConnectivity).toHaveBeenCalledWith({
      workerId: 'worker_1',
      version: '0.1.0',
      platform: 'linux',
      arch: 'x64',
      upgradeStatus: undefined,
      upgradeMessage: undefined,
    });
  });

  it('rejects connectivity when deviceNumber is missing', async () => {
    await expect(
      controller.connectivity(
        {
          workerId: 'worker_1',
          currentVersion: '0.1.0',
          platform: 'linux',
          arch: 'x64',
        } as never,
        { worker: { workerId: 'worker_1' } },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(workersService.findWorkerById).not.toHaveBeenCalled();
  });

  it('persists upgrade status from connectivity heartbeat', async () => {
    workersService.findWorkerById.mockResolvedValue({
      id: 'worker_1',
      deviceNumber: 'edge-test-a1b2c3',
      targetVersion: null,
      upgradeStatus: 'UPGRADE_PENDING',
      upgradeMessage: null,
    });
    workersService.markConnectivity.mockResolvedValue(undefined);

    const result = await controller.connectivity(
      {
        workerId: 'worker_1',
        deviceNumber: 'edge-test-a1b2c3',
        currentVersion: '1.0.0',
        platform: 'linux',
        arch: 'x64',
        activeTask: false,
        upgradeStatus: 'DOWNLOADING',
        reason: 'download started',
      },
      { worker: { workerId: 'worker_1' } },
    );

    expect(workersService.markConnectivity).toHaveBeenCalledWith({
      workerId: 'worker_1',
      version: '1.0.0',
      platform: 'linux',
      arch: 'x64',
      upgradeStatus: 'DOWNLOADING',
      upgradeMessage: 'download started',
    });
    expect(result.upgradeStatus).toBe('DOWNLOADING');
    expect(result.upgradeMessage).toBe('download started');
  });

  it('returns clear upgrade message when no compatible release artifact exists', async () => {
    workersService.findWorkerById.mockResolvedValue({
      id: 'worker_1',
      deviceNumber: 'edge-test-a1b2c3',
      targetVersion: '1.2.3',
      upgradeStatus: 'UPGRADE_PENDING',
      upgradeMessage: null,
    });
    workersService.markConnectivity.mockResolvedValue(undefined);
    releasesService.getUpgradeArtifactForWorker.mockResolvedValue({
      artifact: null,
      message: 'No compatible edge release artifact found for 1.2.3 on linux/arm64/service',
    });

    const result = await controller.connectivity(
      {
        workerId: 'worker_1',
        deviceNumber: 'edge-test-a1b2c3',
        currentVersion: '1.0.0',
        platform: 'linux',
        arch: 'arm64',
      },
      { worker: { workerId: 'worker_1' } },
    );

    expect(result.release).toBeNull();
    expect(result.upgradeMessage).toBe(
      'No compatible edge release artifact found for 1.2.3 on linux/arm64/service',
    );
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
          deviceNumber: 'edge-test-a1b2c3',
          currentVersion: '0.1.0',
        },
        { worker: { workerId: 'worker_1' } },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('passes runtime health fields from connectivity heartbeat to workers service', async () => {
    workersService.findWorkerById.mockResolvedValue({
      id: 'worker_1',
      deviceNumber: 'edge-test-a1b2c3',
      targetVersion: null,
      upgradeStatus: 'IDLE',
      upgradeMessage: null,
    });
    workersService.markConnectivity.mockResolvedValue(undefined);

    await controller.connectivity(
      {
        workerId: 'worker_1',
        deviceNumber: 'edge-test-a1b2c3',
        currentVersion: '1.0.0',
        platform: 'linux',
        arch: 'x64',
        runtimeState: 'BUSY',
        activeTaskId: 'task_123',
        uptimeSeconds: 120,
        lastError: 'previous error',
      },
      { worker: { workerId: 'worker_1' } },
    );

    expect(workersService.markConnectivity).toHaveBeenCalledWith(
      expect.objectContaining({
        runtimeState: 'BUSY',
        activeTaskId: 'task_123',
        uptimeSeconds: 120,
        lastError: 'previous error',
      }),
    );
  });
});
