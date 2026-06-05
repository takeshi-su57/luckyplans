import { EdgeApiClient, type EdgeReleaseArtifactMetadata } from './client';
import { runGridTask } from './grid';
import { edgeAgentLogger, getErrorType, type EdgeAgentLogger } from './logger';
import { runOptunaTask } from './optuna';
import { maybeUpgrade, type UpgradeStatus } from './upgrade';

export type RunnerOptions = {
  currentVersion?: string;
  deviceNumber?: string;
  platform?: string;
  arch?: string;
  installType?: string;
  downloadUpgradeArtifact?: (release: EdgeReleaseArtifactMetadata) => Promise<unknown>;
  verifyUpgradeArtifact?: (
    artifact: unknown,
    release: EdgeReleaseArtifactMetadata,
  ) => Promise<boolean>;
  installUpgradeArtifact?: (artifact: unknown) => Promise<void>;
  suppressUpgradeRetry?: (targetVersion: string) => Promise<boolean> | boolean;
  recoveryStatePath?: string;
  runtimeStartedAtMs?: number;
  now?: () => number;
  logger?: EdgeAgentLogger;
};

function getUptimeSeconds(options: RunnerOptions): number | undefined {
  if (options.runtimeStartedAtMs === undefined) {
    return undefined;
  }
  const now = options.now ?? Date.now;
  return Math.max(0, Math.floor((now() - options.runtimeStartedAtMs) / 1000));
}

export async function runSinglePollExecution(client: EdgeApiClient, options: RunnerOptions = {}) {
  const lease = await client.pollNextTask();
  const hasActiveTask = Boolean(lease.success && lease.task);
  const currentVersion = options.currentVersion ?? '0.0.0';
  const uptimeSeconds = getUptimeSeconds(options);
  const logger = options.logger ?? edgeAgentLogger;

  const safeSendConnectivityHeartbeat = async (
    payload: Parameters<EdgeApiClient['sendConnectivityHeartbeat']>[0],
  ) => {
    if (typeof client.sendConnectivityHeartbeat !== 'function') {
      return null;
    }
    try {
      return await client.sendConnectivityHeartbeat(payload);
    } catch (error) {
      logger.warn('edge.heartbeat.failed', { errorType: getErrorType(error) });
      return null;
    }
  };

  const reportUpgradeStatus = async (status: UpgradeStatus, details?: { reason?: string }) => {
    logger.info('edge.upgrade.status_reported', {
      status,
      hasReason: Boolean(details?.reason),
      reasonLength: details?.reason?.length ?? 0,
    });
    await safeSendConnectivityHeartbeat({
      activeTask: hasActiveTask,
      currentVersion,
      deviceNumber: options.deviceNumber,
      platform: options.platform,
      arch: options.arch,
      installType: options.installType,
      upgradeStatus: status,
      reason: details?.reason,
      runtimeState: 'UPGRADING',
      activeTaskId: lease.task?.taskId,
      uptimeSeconds,
    });
  };

  if (typeof client.sendConnectivityHeartbeat === 'function') {
    const connectivity = await safeSendConnectivityHeartbeat({
      activeTask: hasActiveTask,
      currentVersion,
      deviceNumber: options.deviceNumber,
      platform: options.platform,
      arch: options.arch,
      installType: options.installType,
      runtimeState: hasActiveTask ? 'BUSY' : 'IDLE',
      activeTaskId: lease.task?.taskId,
      uptimeSeconds,
    });

    if (connectivity?.targetVersion) {
      const release = connectivity.release ?? undefined;
      await maybeUpgrade({
        activeTask: hasActiveTask,
        currentVersion,
        targetVersion: connectivity.targetVersion,
        reportStatus: reportUpgradeStatus,
        download:
          release && options.downloadUpgradeArtifact
            ? () => options.downloadUpgradeArtifact!(release)
            : undefined,
        verify:
          release && options.verifyUpgradeArtifact
            ? (artifact: unknown) => options.verifyUpgradeArtifact!(artifact, release)
            : undefined,
        install: release ? options.installUpgradeArtifact : undefined,
        isTargetSuppressed: options.suppressUpgradeRetry,
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
    await safeSendConnectivityHeartbeat({
      activeTask: false,
      currentVersion,
      deviceNumber: options.deviceNumber,
      platform: options.platform,
      arch: options.arch,
      installType: options.installType,
      runtimeState: 'ERROR',
      activeTaskId: lease.task.taskId,
      uptimeSeconds,
      lastError: message,
    });
    return { executed: false, error: message };
  }
}
