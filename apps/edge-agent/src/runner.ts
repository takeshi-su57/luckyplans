import { EdgeApiClient } from './client';
import { runGridTask } from './grid';
import { runOptunaTask } from './optuna';
import { maybeUpgrade, type UpgradeStatus } from './upgrade';

type RunnerOptions = {
  currentVersion?: string;
  downloadUpgradeArtifact?: () => Promise<unknown>;
  verifyUpgradeArtifact?: (artifact: unknown) => Promise<boolean>;
  installUpgradeArtifact?: (artifact: unknown) => Promise<void>;
};

export async function runSinglePollExecution(client: EdgeApiClient, options: RunnerOptions = {}) {
  const lease = await client.pollNextTask();
  const hasActiveTask = Boolean(lease.success && lease.task);
  const currentVersion = options.currentVersion ?? '0.0.0';

  const safeSendConnectivityHeartbeat = async (payload: {
    activeTask: boolean;
    currentVersion: string;
    upgradeStatus?: UpgradeStatus;
    reason?: string;
  }) => {
    if (typeof client.sendConnectivityHeartbeat !== 'function') {
      return null;
    }
    try {
      return await client.sendConnectivityHeartbeat(payload);
    } catch (error) {
      console.warn('[edge-agent] connectivity heartbeat failed', error);
      return null;
    }
  };

  const reportUpgradeStatus = async (status: UpgradeStatus, details?: { reason?: string }) => {
    await safeSendConnectivityHeartbeat({
      activeTask: hasActiveTask,
      currentVersion,
      upgradeStatus: status,
      reason: details?.reason,
    });
  };

  if (typeof client.sendConnectivityHeartbeat === 'function') {
    const connectivity = await safeSendConnectivityHeartbeat({
      activeTask: hasActiveTask,
      currentVersion,
    });

    if (connectivity?.targetVersion) {
      await maybeUpgrade({
        activeTask: hasActiveTask,
        currentVersion,
        targetVersion: connectivity.targetVersion,
        reportStatus: reportUpgradeStatus,
        download: options.downloadUpgradeArtifact,
        verify: options.verifyUpgradeArtifact,
        install: options.installUpgradeArtifact,
      });
    }
  }

  if (!lease.success || !lease.task) {
    return { executed: false };
  }

  try {
    await client.sendHeartbeat(lease.task.taskId, 0, lease.task.trials, undefined, 'started');

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

    const sorted = [...results].sort(
      (a, b) => b.metrics.totalPnlPercent - a.metrics.totalPnlPercent,
    );
    const bestConfigIds = sorted.slice(0, 3).map((result) => result.configId);
    await client.sendHeartbeat(
      lease.task.taskId,
      results.length,
      results.length,
      bestConfigIds[0],
      'completed',
    );
    await client.completeTask(lease.task.taskId, bestConfigIds, results.length);

    return { executed: true, processedConfigs: results.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await client.failTask(lease.task.taskId, message);
    return { executed: false, error: message };
  }
}
