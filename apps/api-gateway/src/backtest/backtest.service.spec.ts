import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BacktestService } from './backtest.service';

describe('BacktestService', () => {
  const prisma = {
    backtestTask: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    backtestResult: {
      createMany: vi.fn(),
    },
    worker: {
      update: vi.fn(),
    },
  };

  let service: BacktestService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new BacktestService(prisma as never);
  });

  it('leases an assigned await task and sets ASSIGNED state with lease', async () => {
    prisma.backtestTask.findFirst.mockResolvedValue({
      id: 'task_1',
      name: 'Task',
      symbol: 'BTCUSDT',
      interval: '1m',
      startDate: new Date('2024-01-01T00:00:00.000Z'),
      endDate: new Date('2024-06-01T00:00:00.000Z'),
      searchStrategy: 'GRID',
      optimizationParams: {},
      optimizationMetrics: ['sharpeRatio'],
      trials: 50,
      assignedWorkerId: 'worker_1',
      status: 'AWAIT',
    });
    prisma.backtestTask.update.mockResolvedValue({
      id: 'task_1',
      name: 'Task',
      symbol: 'BTCUSDT',
      interval: '1m',
      startDate: new Date('2024-01-01T00:00:00.000Z'),
      endDate: new Date('2024-06-01T00:00:00.000Z'),
      searchStrategy: 'GRID',
      optimizationParams: {},
      optimizationMetrics: ['sharpeRatio'],
      trials: 50,
      assignedWorkerId: 'worker_1',
      status: 'ASSIGNED',
      leaseExpiresAt: new Date(Date.now() + 60000),
    });

    const leased = await service.leaseNextTask('worker_1');

    expect(leased?.status).toBe('ASSIGNED');
    expect(prisma.backtestTask.update).toHaveBeenCalledOnce();
  });

  it('heartbeats an ASSIGNED task and transitions it to PROCESSING', async () => {
    prisma.backtestTask.findUnique.mockResolvedValue({
      id: 'task_1',
      status: 'ASSIGNED',
      assignedWorkerId: 'worker_1',
    });
    prisma.backtestTask.update.mockResolvedValue({
      id: 'task_1',
      status: 'PROCESSING',
      leaseExpiresAt: new Date(Date.now() + 60000),
    });

    const heartbeat = await service.heartbeat('task_1', 'worker_1', {
      processedConfigs: 12,
      totalConfigs: 100,
      currentConfig: 'cfg_1',
      trialProgress: 'sampling',
    });

    expect(heartbeat.status).toBe('PROCESSING');
  });

  it('requeues expired leased tasks back to AWAIT', async () => {
    prisma.backtestTask.updateMany.mockResolvedValue({ count: 2 });

    const count = await service.requeueExpiredTasks(new Date());

    expect(count).toBe(2);
    expect(prisma.backtestTask.updateMany).toHaveBeenCalledOnce();
  });

  it('ingests results idempotently and reports accepted/deduplicated counts', async () => {
    prisma.backtestTask.findUnique.mockResolvedValue({
      id: 'task_1',
      status: 'PROCESSING',
      assignedWorkerId: 'worker_1',
    });
    prisma.backtestResult.createMany.mockResolvedValue({ count: 1 });

    const summary = await service.ingestResults('task_1', 'worker_1', [
      {
        configId: 'cfg_1',
        strategyConfig: { fast: 8, slow: 21 },
        metrics: { sharpeRatio: 1.4, winRate: 60 },
        resultFolder: 'result/2026-05-20/task_1/cfg_1',
      },
      {
        configId: 'cfg_2',
        strategyConfig: { fast: 12, slow: 34 },
        metrics: { sharpeRatio: 1.2, winRate: 55 },
        resultFolder: 'result/2026-05-20/task_1/cfg_2',
      },
    ]);

    expect(summary).toEqual({ accepted: 1, deduplicated: 1 });
    expect(prisma.backtestResult.createMany).toHaveBeenCalledOnce();
  });

  it('quarantines worker after repeated failures', async () => {
    prisma.backtestTask.findUnique.mockResolvedValue({
      id: 'task_1',
      status: 'PROCESSING',
      assignedWorkerId: 'worker_1',
    });
    prisma.backtestTask.update.mockResolvedValue({
      id: 'task_1',
      status: 'FAILED',
    });
    prisma.worker.update.mockResolvedValue({
      id: 'worker_1',
      consecutiveFailures: 3,
      status: 'QUARANTINED',
    });

    const result = await service.fail('task_1', 'worker_1', 'runtime exploded');

    expect(result.status).toBe('FAILED');
    expect(prisma.worker.update).toHaveBeenCalledOnce();
  });
});
