import { describe, expect, it } from 'vitest';
import { expandGridParams, runGridTask } from './grid';

describe('expandGridParams', () => {
  it('expands cartesian product of optimization params', () => {
    const expanded = expandGridParams({
      fast: [8, 12],
      slow: [21, 34],
    });

    expect(expanded).toEqual([
      { fast: 8, slow: 21 },
      { fast: 8, slow: 34 },
      { fast: 12, slow: 21 },
      { fast: 12, slow: 34 },
    ]);
  });
});

describe('runGridTask', () => {
  it('runs deterministic backtest for each config and returns result rows', () => {
    const results = runGridTask({
      taskId: 'task_1',
      searchStrategy: 'grid',
      symbol: 'BTCUSDT',
      interval: '1m',
      prices: [100, 101, 103, 99, 105, 108],
      optimizationParams: {
        entryThresholdPct: [1],
        stopLossPct: [2],
        takeProfitPct: [3],
        feePct: [0.1, 0.2],
      },
      optimizationMetrics: ['totalPnlPercent'],
    });

    expect(results).toHaveLength(2);
    expect(results[0].configId).toContain('task_1_cfg_');
    expect(results[0].metrics.totalTrades).toBeGreaterThanOrEqual(0);
  });
});
