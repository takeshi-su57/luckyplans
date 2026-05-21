import { runDeterministicBacktest } from '@luckyplans/shared';
import type { GridCandidateResult, GridSearchTask } from './types';

export function expandGridParams(params: Record<string, number[]>): Array<Record<string, number>> {
  const entries = Object.entries(params);
  if (entries.length === 0) return [];

  const [headKey, headValues] = entries[0];
  let result = headValues.map((value) => ({ [headKey]: value }));

  for (const [key, values] of entries.slice(1)) {
    const next: Array<Record<string, number>> = [];
    for (const current of result) {
      for (const value of values) {
        next.push({ ...current, [key]: value });
      }
    }
    result = next;
  }

  return result;
}

export function runGridTask(task: GridSearchTask): GridCandidateResult[] {
  const configs = expandGridParams(task.optimizationParams);

  return configs.map((config, index) => {
    const metrics = runDeterministicBacktest({
      prices: task.prices,
      config: {
        entryThresholdPct: config.entryThresholdPct ?? 1,
        stopLossPct: config.stopLossPct ?? 2,
        takeProfitPct: config.takeProfitPct ?? 3,
        feePct: config.feePct ?? 0.1,
      },
    });

    const configId = `${task.taskId}_cfg_${index + 1}`;
    return {
      configId,
      strategyConfig: config,
      metrics,
      resultFolder: `result/${task.taskId}/${configId}`,
    };
  });
}
