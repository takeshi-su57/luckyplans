import { runDeterministicBacktest } from '@luckyplans/shared';
import type { GridCandidateResult } from './types';

type OptunaTaskInput = {
  taskId: string;
  symbol: string;
  interval: string;
  prices: number[];
  optimizationParams: Record<string, number[]>;
  trials: number;
  seed: number;
  startTrial: number;
};

type OptunaRunSummary = {
  results: GridCandidateResult[];
  bestConfigIds: string[];
  completedTrials: number;
};

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function runOptunaTask(input: OptunaTaskInput): OptunaRunSummary {
  const random = seededRandom(input.seed);
  const keys = Object.keys(input.optimizationParams);
  const endTrial = input.trials;
  const results: GridCandidateResult[] = [];

  for (let trial = input.startTrial; trial < endTrial; trial++) {
    const strategyConfig: Record<string, number> = {};
    for (const key of keys) {
      const candidates = input.optimizationParams[key];
      const idx = Math.floor(random() * candidates.length);
      strategyConfig[key] = candidates[idx];
    }

    const metrics = runDeterministicBacktest({
      prices: input.prices,
      config: {
        entryThresholdPct: strategyConfig.entryThresholdPct ?? 1,
        stopLossPct: strategyConfig.stopLossPct ?? 2,
        takeProfitPct: strategyConfig.takeProfitPct ?? 3,
        feePct: strategyConfig.feePct ?? 0.1,
      },
    });

    const configId = `${input.taskId}_trial_${trial + 1}`;
    results.push({
      configId,
      strategyConfig,
      metrics,
      resultFolder: `result/${input.taskId}/${configId}`,
    });
  }

  const bestConfigIds = [...results]
    .sort((a, b) => b.metrics.totalPnlPercent - a.metrics.totalPnlPercent)
    .slice(0, 3)
    .map((result) => result.configId);

  return {
    results,
    bestConfigIds,
    completedTrials: results.length,
  };
}
