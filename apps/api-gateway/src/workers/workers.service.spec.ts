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
        deviceNumber: 'edge-seoul-lab-a7k29f',
        arch: 'x64',
      }),
    ).rejects.toThrow('deviceNumber');
    expect(prisma.worker.create).toHaveBeenCalledWith({
      data: {
        name: 'Edge Worker',
        platform: 'linux',
        version: '1.0.0',
        deviceNumber: 'edge-seoul-lab-a7k29f',
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
});
