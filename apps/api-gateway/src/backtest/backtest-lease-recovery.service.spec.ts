import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BacktestLeaseRecoveryService } from './backtest-lease-recovery.service';

describe('BacktestLeaseRecoveryService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('runs periodic stale-task requeue loop', async () => {
    const backtestService = {
      requeueExpiredTasks: vi.fn().mockResolvedValue(1),
    };
    const service = new BacktestLeaseRecoveryService(backtestService as never);

    service.onModuleInit();
    await vi.advanceTimersByTimeAsync(11_000);

    expect(backtestService.requeueExpiredTasks).toHaveBeenCalled();

    service.onModuleDestroy();
  });
});
