import { describe, expect, it, vi } from 'vitest';
import { runSinglePollExecution } from './runner';

describe('runSinglePollExecution', () => {
  it('executes grid task and reports completion', async () => {
    const client = {
      pollNextTask: vi.fn().mockResolvedValue({
        success: true,
        task: {
          taskId: 'task_grid',
          name: 'grid',
          symbol: 'BTCUSDT',
          interval: '1m',
          searchStrategy: 'grid',
          optimizationParams: {
            entryThresholdPct: [1],
            stopLossPct: [2],
            takeProfitPct: [3],
            feePct: [0.1],
          },
          optimizationMetrics: ['totalPnlPercent'],
          trials: 1,
        },
      }),
      sendResults: vi.fn().mockResolvedValue({ success: true, accepted: 1, deduplicated: 0 }),
      completeTask: vi.fn().mockResolvedValue({ success: true, status: 'DONE' }),
    };

    const result = await runSinglePollExecution(client as never);

    expect(result.executed).toBe(true);
    expect(client.sendResults).toHaveBeenCalledOnce();
    expect(client.completeTask).toHaveBeenCalledOnce();
  });

  it('executes optuna task and reports completion', async () => {
    const client = {
      pollNextTask: vi.fn().mockResolvedValue({
        success: true,
        task: {
          taskId: 'task_optuna',
          name: 'optuna',
          symbol: 'BTCUSDT',
          interval: '1m',
          searchStrategy: 'optuna',
          optimizationParams: {
            entryThresholdPct: [0.5, 1, 1.5],
            stopLossPct: [2, 3],
            takeProfitPct: [3, 4],
            feePct: [0.1, 0.2],
          },
          optimizationMetrics: ['totalPnlPercent'],
          trials: 3,
        },
      }),
      sendResults: vi.fn().mockResolvedValue({ success: true, accepted: 3, deduplicated: 0 }),
      completeTask: vi.fn().mockResolvedValue({ success: true, status: 'DONE' }),
    };

    const result = await runSinglePollExecution(client as never);

    expect(result.executed).toBe(true);
    expect(client.sendResults).toHaveBeenCalledOnce();
    expect(client.completeTask).toHaveBeenCalledOnce();
  });
});
