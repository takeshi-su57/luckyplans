import { ForbiddenException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EdgesTasksController } from './edges-tasks.controller';

describe('EdgesTasksController', () => {
  const backtestService = {
    leaseNextTask: vi.fn(),
    heartbeat: vi.fn(),
    ingestResults: vi.fn(),
    complete: vi.fn(),
    fail: vi.fn(),
  };

  const controller = new EdgesTasksController(backtestService as never);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success true with null task when no lease available', async () => {
    backtestService.leaseNextTask.mockResolvedValue(null);

    const result = await controller.next(
      { workerId: 'worker_1' },
      { worker: { workerId: 'worker_1' } },
    );

    expect(result).toEqual({ success: true, task: null });
  });

  it('returns done status on complete', async () => {
    backtestService.complete.mockResolvedValue({ status: 'DONE' });

    const result = await controller.complete(
      'task_1',
      {
        workerId: 'worker_1',
        bestConfigIds: ['cfg_1'],
        processedConfigs: 100,
        totalConfigs: 100,
      },
      { worker: { workerId: 'worker_1' } },
    );

    expect(result).toEqual({ success: true, status: 'DONE' });
  });

  it('returns accepted/deduplicated summary for results ingestion', async () => {
    backtestService.ingestResults.mockResolvedValue({ accepted: 2, deduplicated: 1 });

    const result = await controller.results(
      'task_1',
      {
        workerId: 'worker_1',
        results: [
          {
            configId: 'cfg_1',
            strategyConfig: {},
            metrics: { sharpeRatio: 1.4 },
            resultFolder: 'r1',
          },
        ],
      },
      { worker: { workerId: 'worker_1' } },
    );

    expect(result).toEqual({ success: true, accepted: 2, deduplicated: 1 });
  });

  it('rejects next lease when body workerId mismatches authenticated worker', async () => {
    await expect(
      controller.next({ workerId: 'worker_2' }, { worker: { workerId: 'worker_1' } }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(backtestService.leaseNextTask).not.toHaveBeenCalled();
  });
});
