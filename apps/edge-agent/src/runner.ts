import { EdgeApiClient } from './client';
import { runGridTask } from './grid';
import { runOptunaTask } from './optuna';

export async function runSinglePollExecution(client: EdgeApiClient) {
  const lease = await client.pollNextTask();
  if (!lease.success || !lease.task) {
    return { executed: false };
  }
  const pricesCandidate = (lease.task as { prices?: unknown }).prices;
  const prices =
    Array.isArray(pricesCandidate) && pricesCandidate.every((value) => typeof value === 'number')
      ? pricesCandidate
      : [100, 102, 101, 105, 108, 109];

  const results =
    lease.task.searchStrategy === 'grid'
      ? runGridTask({
          taskId: lease.task.taskId,
          searchStrategy: 'grid',
          symbol: lease.task.symbol,
          interval: lease.task.interval,
          prices,
          optimizationParams: lease.task.optimizationParams,
          optimizationMetrics: lease.task.optimizationMetrics,
        })
      : runOptunaTask({
          taskId: lease.task.taskId,
          symbol: lease.task.symbol,
          interval: lease.task.interval,
          prices,
          optimizationParams: lease.task.optimizationParams,
          trials: lease.task.trials,
          seed: lease.task.seed ?? 42,
          startTrial: lease.task.startTrial ?? 0,
        }).results;

  await client.sendResults(lease.task.taskId, results);

  const sorted = [...results].sort((a, b) => b.metrics.totalPnlPercent - a.metrics.totalPnlPercent);
  const bestConfigIds = sorted.slice(0, 3).map((result) => result.configId);
  await client.completeTask(lease.task.taskId, bestConfigIds, results.length);

  return { executed: true, processedConfigs: results.length };
}
