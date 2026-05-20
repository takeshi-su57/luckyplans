import { describe, expect, it, vi } from 'vitest';
import { WorkersService } from './workers.service';

describe('WorkersService', () => {
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
