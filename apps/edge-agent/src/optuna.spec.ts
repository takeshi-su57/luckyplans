import { describe, expect, it } from 'vitest';
import { runOptunaTask } from './optuna';

describe('runOptunaTask', () => {
  it('produces bestConfigIds and deterministic trials for a fixed seed', () => {
    const first = runOptunaTask({
      taskId: 'task_optuna',
      symbol: 'BTCUSDT',
      interval: '1m',
      prices: [100, 101, 105, 102, 108, 110],
      optimizationParams: {
        entryThresholdPct: [0.5, 1, 1.5],
        stopLossPct: [2, 3],
        takeProfitPct: [3, 4],
        feePct: [0.1, 0.2],
      },
      trials: 5,
      seed: 42,
      startTrial: 0,
    });

    const second = runOptunaTask({
      taskId: 'task_optuna',
      symbol: 'BTCUSDT',
      interval: '1m',
      prices: [100, 101, 105, 102, 108, 110],
      optimizationParams: {
        entryThresholdPct: [0.5, 1, 1.5],
        stopLossPct: [2, 3],
        takeProfitPct: [3, 4],
        feePct: [0.1, 0.2],
      },
      trials: 5,
      seed: 42,
      startTrial: 0,
    });

    expect(first.bestConfigIds).toEqual(second.bestConfigIds);
    expect(first.results).toEqual(second.results);
    expect(first.completedTrials).toBe(5);
  });

  it('supports resume by starting from a later trial index', () => {
    const resumed = runOptunaTask({
      taskId: 'task_optuna',
      symbol: 'BTCUSDT',
      interval: '1m',
      prices: [100, 101, 105, 102, 108, 110],
      optimizationParams: {
        entryThresholdPct: [0.5, 1, 1.5],
        stopLossPct: [2, 3],
        takeProfitPct: [3, 4],
        feePct: [0.1, 0.2],
      },
      trials: 6,
      seed: 42,
      startTrial: 3,
    });

    expect(resumed.completedTrials).toBe(3);
    expect(resumed.results).toHaveLength(3);
  });
});
