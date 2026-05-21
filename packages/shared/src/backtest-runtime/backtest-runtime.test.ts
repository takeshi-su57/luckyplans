import { describe, expect, it } from 'vitest';
import { runDeterministicBacktest } from './index';

describe('runDeterministicBacktest', () => {
  it('returns deterministic metrics for identical input', () => {
    const prices = [100, 101, 102, 99, 105, 104, 110];
    const config = {
      entryThresholdPct: 1.5,
      stopLossPct: 3,
      takeProfitPct: 4,
      feePct: 0.1,
    };

    const first = runDeterministicBacktest({ prices, config });
    const second = runDeterministicBacktest({ prices, config });

    expect(first).toEqual(second);
    expect(first.totalTrades).toBeGreaterThanOrEqual(0);
    expect(first.winRate).toBeGreaterThanOrEqual(0);
    expect(first.winRate).toBeLessThanOrEqual(100);
  });
});
