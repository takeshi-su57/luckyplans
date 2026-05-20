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
});
