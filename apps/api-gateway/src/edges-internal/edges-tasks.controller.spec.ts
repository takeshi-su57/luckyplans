import { describe, expect, it, vi } from 'vitest';
import { EdgesTasksController } from './edges-tasks.controller';

describe('EdgesTasksController', () => {
  const backtestService = {
    leaseNextTask: vi.fn(),
    heartbeat: vi.fn(),
    complete: vi.fn(),
    fail: vi.fn(),
  };

  const controller = new EdgesTasksController(backtestService as never);

  it('returns success true with null task when no lease available', async () => {
    backtestService.leaseNextTask.mockResolvedValue(null);

    const result = await controller.next({ workerId: 'worker_1' });

    expect(result).toEqual({ success: true, task: null });
  });

  it('returns done status on complete', async () => {
    backtestService.complete.mockResolvedValue({ status: 'DONE' });

    const result = await controller.complete('task_1', {
      workerId: 'worker_1',
      bestConfigIds: ['cfg_1'],
      processedConfigs: 100,
      totalConfigs: 100,
    });

    expect(result).toEqual({ success: true, status: 'DONE' });
  });
});
