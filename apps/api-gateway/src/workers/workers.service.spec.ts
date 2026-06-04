import { describe, expect, it, vi } from 'vitest';
import { WorkersService } from './workers.service';

describe('WorkersService', () => {
  it('propagates duplicate deviceNumber failure during worker creation', async () => {
    const duplicateError = new Error('Unique constraint failed on the fields: (`deviceNumber`)');
    const prisma = {
      worker: {
        create: vi.fn().mockRejectedValue(duplicateError),
      },
    };
    const service = new WorkersService(prisma as never);

    await expect(
      service.createWorker({
        name: 'Edge Worker',
        platform: 'linux',
        version: '1.0.0',
        deviceNumber: 'edge-test-lab-a7k29f',
        arch: 'x64',
      }),
    ).rejects.toThrow('deviceNumber');
    expect(prisma.worker.create).toHaveBeenCalledWith({
      data: {
        name: 'Edge Worker',
        platform: 'linux',
        version: '1.0.0',
        deviceNumber: 'edge-test-lab-a7k29f',
        arch: 'x64',
      },
    });
  });

  it('rejects creating a worker with a blank name', async () => {
    const prisma = {
      worker: {
        create: vi.fn(),
      },
    };
    const service = new WorkersService(prisma as never);

    await expect(service.createWorker({ name: '   ' })).rejects.toThrow('Worker name is required');
    expect(prisma.worker.create).not.toHaveBeenCalled();
  });

  it('returns null when disabling unknown worker', async () => {
    const prisma = {
      worker: {
        findUnique: vi.fn().mockResolvedValue(null),
        update: vi.fn(),
      },
    };
    const service = new WorkersService(prisma as never);

    const result = await service.disableWorker('missing-id');

    expect(result).toBeNull();
    expect(prisma.worker.update).not.toHaveBeenCalled();
  });

  it('normalizes whitespace deviceNumber to undefined before persistence', async () => {
    const prisma = {
      worker: {
        create: vi.fn().mockResolvedValue({ id: 'worker_1' }),
      },
    };
    const service = new WorkersService(prisma as never);

    await service.createWorker({
      name: 'Edge Worker',
      deviceNumber: '   ',
      arch: 'x64',
    });

    expect(prisma.worker.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        deviceNumber: undefined,
      }),
    });
  });

  it('normalizes whitespace arch to undefined before persistence', async () => {
    const prisma = {
      worker: {
        create: vi.fn().mockResolvedValue({ id: 'worker_1' }),
      },
    };
    const service = new WorkersService(prisma as never);

    await service.createWorker({
      name: 'Edge Worker',
      deviceNumber: 'edge-test-lab-a7k29f',
      arch: '   ',
    });

    expect(prisma.worker.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        arch: undefined,
      }),
    });
  });

  it('records connectivity and upgrade status in a single worker update', async () => {
    const prisma = {
      worker: {
        update: vi.fn().mockResolvedValue({ id: 'worker_1' }),
      },
    };
    const service = new WorkersService(prisma as never);

    await service.markConnectivity({
      workerId: 'worker_1',
      version: '1.0.0',
      platform: 'linux',
      arch: ' x64 ',
      upgradeStatus: 'DOWNLOADING',
      upgradeMessage: 'download started',
    });

    expect(prisma.worker.update).toHaveBeenCalledWith({
      where: { id: 'worker_1' },
      data: expect.objectContaining({
        version: '1.0.0',
        platform: 'linux',
        arch: 'x64',
        upgradeStatus: 'DOWNLOADING',
        upgradeMessage: 'download started',
      }),
    });
  });

  it('records rolled back upgrade status during connectivity update', async () => {
    const prisma = {
      worker: {
        update: vi.fn().mockResolvedValue({ id: 'worker_1' }),
      },
    };
    const service = new WorkersService(prisma as never);

    await service.markConnectivity({
      workerId: 'worker_1',
      version: '1.0.0',
      platform: 'linux',
      arch: 'x64',
      upgradeStatus: 'ROLLED_BACK',
      upgradeMessage: 'rolled back to 1.0.0',
    });

    expect(prisma.worker.update).toHaveBeenCalledWith({
      where: { id: 'worker_1' },
      data: expect.objectContaining({
        upgradeStatus: 'ROLLED_BACK',
        upgradeMessage: 'rolled back to 1.0.0',
      }),
    });
  });

  it('computes worker connectivity status from fixed lastSeenAt thresholds', async () => {
    const now = new Date('2026-06-01T12:00:00.000Z');
    const prisma = {
      worker: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'online',
            name: 'Online Edge',
            lastSeenAt: new Date('2026-06-01T11:59:30.000Z'),
            credentials: [],
          },
          {
            id: 'stale',
            name: 'Stale Edge',
            lastSeenAt: new Date('2026-06-01T11:58:30.000Z'),
            credentials: [],
          },
          {
            id: 'offline',
            name: 'Offline Edge',
            lastSeenAt: new Date('2026-06-01T11:54:30.000Z'),
            credentials: [],
          },
          {
            id: 'never-seen',
            name: 'Never Seen Edge',
            lastSeenAt: null,
            credentials: [],
          },
        ]),
      },
    };
    const service = new WorkersService(prisma as never);
    service.setClockForTesting(() => now);

    const workers = await service.getWorkers();

    expect(workers.map((worker) => [worker.id, worker.connectivityStatus])).toEqual([
      ['online', 'ONLINE'],
      ['stale', 'STALE'],
      ['offline', 'OFFLINE'],
      ['never-seen', 'OFFLINE'],
    ]);
  });

  it('records normalized runtime health fields during connectivity update', async () => {
    const prisma = {
      worker: {
        update: vi.fn().mockResolvedValue({ id: 'worker_1' }),
      },
    };
    const service = new WorkersService(prisma as never);

    await service.markConnectivity({
      workerId: 'worker_1',
      version: '1.0.0',
      platform: 'linux',
      arch: ' x64 ',
      runtimeState: 'ERROR',
      activeTaskId: ' task_123 ',
      uptimeSeconds: 42.8,
      lastError: ' first line\nsecond line '.repeat(30),
    });

    expect(prisma.worker.update).toHaveBeenCalledWith({
      where: { id: 'worker_1' },
      data: expect.objectContaining({
        runtimeState: 'ERROR',
        activeTaskId: 'task_123',
        uptimeSeconds: 42,
        lastError: expect.stringMatching(/^first line second line/),
      }),
    });
    const data = prisma.worker.update.mock.calls[0][0].data;
    expect(data.lastError.length).toBeLessThanOrEqual(500);
  });

  it('ignores invalid runtime state values during connectivity update', async () => {
    const prisma = {
      worker: {
        update: vi.fn().mockResolvedValue({ id: 'worker_1' }),
      },
    };
    const service = new WorkersService(prisma as never);

    await service.markConnectivity({
      workerId: 'worker_1',
      runtimeState: 'BROKEN' as never,
    });

    expect(prisma.worker.update).toHaveBeenCalledWith({
      where: { id: 'worker_1' },
      data: expect.objectContaining({
        runtimeState: undefined,
      }),
    });
  });

  it('clears active task id when runtime state is not busy', async () => {
    const prisma = {
      worker: {
        update: vi.fn().mockResolvedValue({ id: 'worker_1' }),
      },
    };
    const service = new WorkersService(prisma as never);

    await service.markConnectivity({
      workerId: 'worker_1',
      runtimeState: 'IDLE',
      activeTaskId: undefined,
    });

    expect(prisma.worker.update).toHaveBeenCalledWith({
      where: { id: 'worker_1' },
      data: expect.objectContaining({
        runtimeState: 'IDLE',
        activeTaskId: null,
      }),
    });
  });
});
