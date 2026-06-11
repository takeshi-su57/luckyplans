import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { EdgeApiClient } from './client';
import { loadEdgeConfig, type EdgeLocalConfig } from './config';
import { createShutdownSignal, runEdgeDaemon, type EdgeDaemonOptions } from './daemon';
import { edgeAgentLogger, getErrorType, type EdgeAgentLogger } from './logger';
import { runOnboarding } from './onboarding';
import { runSinglePollExecution, type RunnerOptions } from './runner';
import { downloadAndVerifyUpgradeArtifact } from './upgrade-artifact';
import { installVerifiedUpgradeArtifact } from './upgrade-installer';
import { confirmPendingUpgrade, shouldSuppressUpgradeRetry } from './upgrade-recovery';

async function main() {
  const runtimeConfig = await resolveRuntimeConfig();

  const client = new EdgeApiClient(
    runtimeConfig.serverUrl,
    runtimeConfig.workerId,
    runtimeConfig.credential,
  );
  const shutdown = createShutdownSignal();
  registerProcessShutdownHandlers(shutdown, edgeAgentLogger);
  const runnerOptions = buildRunnerOptions(runtimeConfig, process.platform, process.arch);
  edgeAgentLogger.info('edge.runtime.started', {
    workerId: runtimeConfig.workerId,
    deviceNumber: runtimeConfig.deviceNumber,
    currentVersion: runtimeConfig.currentVersion,
    platform: process.platform,
    arch: process.arch,
  });
  await confirmStartupRecovery(client, runnerOptions);

  await runEdgeDaemon(
    buildDaemonOptions({
      shutdown,
      runOnce: () => runSinglePollExecution(client, runnerOptions),
    }),
  );
}

type RuntimeDeps = {
  env: NodeJS.ProcessEnv;
  isInteractive: boolean;
  loadConfig: () => Promise<EdgeLocalConfig>;
  runOnboarding: (input: {
    client: EdgeApiClient;
    edgeVersion: string;
    platform: string;
    arch: string;
  }) => Promise<EdgeLocalConfig>;
  platform: NodeJS.Platform;
  arch: string;
};

export async function resolveRuntimeConfig(
  deps: Partial<RuntimeDeps> = {},
): Promise<EdgeLocalConfig> {
  const env = deps.env ?? process.env;
  const envBaseUrl = env.API_GATEWAY_URL;
  const envWorkerId = env.EDGE_WORKER_ID;
  const envCredential = env.EDGE_WORKER_CREDENTIAL;

  if (envBaseUrl && envWorkerId && envCredential) {
    return {
      serverUrl: envBaseUrl,
      workerId: envWorkerId,
      credential: envCredential,
      currentVersion: env.EDGE_VERSION ?? '0.0.0',
      deviceNumber: env.EDGE_DEVICE_NUMBER ?? 'edge-env',
    };
  }

  const loadConfigImpl = deps.loadConfig ?? (() => loadEdgeConfig());

  try {
    return await loadConfigImpl();
  } catch (error) {
    if (!isConfigNotFoundError(error)) {
      throw error;
    }

    const isInteractive =
      deps.isInteractive ?? Boolean(process.stdin.isTTY && process.stdout.isTTY);
    const onboardingOptIn = env.EDGE_AGENT_ENABLE_ONBOARDING === '1';
    if (!isInteractive && !onboardingOptIn) {
      throw new Error(
        'Edge agent config not found and interactive onboarding is disabled. Set API_GATEWAY_URL, EDGE_WORKER_ID, EDGE_WORKER_CREDENTIAL, or run in interactive TTY, or set EDGE_AGENT_ENABLE_ONBOARDING=1.',
      );
    }

    const tempClient = new EdgeApiClient('', '', '');
    const runOnboardingImpl = deps.runOnboarding ?? runOnboarding;
    return runOnboardingImpl({
      client: tempClient,
      edgeVersion: env.EDGE_VERSION ?? '0.0.0',
      platform: deps.platform ?? process.platform,
      arch: deps.arch ?? process.arch,
    });
  }
}

export function buildRunnerOptions(
  runtimeConfig: EdgeLocalConfig,
  platform: NodeJS.Platform,
  arch: string,
  runtimeStartedAtMs = Date.now(),
  env: NodeJS.ProcessEnv = process.env,
): RunnerOptions {
  const stagingDir =
    env.EDGE_AGENT_UPGRADE_STAGING_DIR ?? join(tmpdir(), 'luckyplans-edge-upgrades');
  const trustedPublicKeyPem = env.EDGE_AGENT_UPGRADE_TRUSTED_PUBLIC_KEY_PEM;
  const installRoot = env.EDGE_AGENT_UPGRADE_INSTALL_ROOT;
  const activeVersionPath = env.EDGE_AGENT_UPGRADE_ACTIVE_VERSION_PATH;
  const recoveryStatePath =
    env.EDGE_AGENT_UPGRADE_RECOVERY_STATE_PATH ??
    join(tmpdir(), 'luckyplans-edge-upgrade-recovery.json');
  const failedTargetPath =
    env.EDGE_AGENT_UPGRADE_FAILED_TARGET_PATH ??
    join(tmpdir(), 'luckyplans-edge-upgrade-failed-target.json');
  return {
    currentVersion: runtimeConfig.currentVersion,
    deviceNumber: runtimeConfig.deviceNumber,
    platform,
    arch,
    installType: 'service',
    downloadUpgradeArtifact: trustedPublicKeyPem
      ? (release) =>
          downloadAndVerifyUpgradeArtifact({
            release,
            stagingDir,
            trustedPublicKeyPem,
          })
      : undefined,
    verifyUpgradeArtifact: trustedPublicKeyPem ? async () => true : undefined,
    installUpgradeArtifact: trustedPublicKeyPem
      ? async (artifact) => {
          await installVerifiedUpgradeArtifact(artifact, {
            installRoot,
            activeVersionPath,
            previousVersion: runtimeConfig.currentVersion,
            recoveryStatePath,
            failedTargetPath,
          });
        }
      : undefined,
    recoveryStatePath: trustedPublicKeyPem ? recoveryStatePath : undefined,
    suppressUpgradeRetry: trustedPublicKeyPem
      ? (targetVersion) =>
          shouldSuppressUpgradeRetry({
            failedTargetPath,
            targetVersion,
          })
      : undefined,
    runtimeStartedAtMs,
  };
}

export async function confirmStartupRecovery(
  client: Pick<EdgeApiClient, 'sendConnectivityHeartbeat'>,
  options: RunnerOptions,
) {
  if (!options.currentVersion || !options.recoveryStatePath) {
    return { handled: false };
  }

  return confirmPendingUpgrade({
    statePath: options.recoveryStatePath,
    currentVersion: options.currentVersion,
    reportStatus: async (status, details) => {
      await client.sendConnectivityHeartbeat({
        activeTask: false,
        currentVersion: options.currentVersion ?? '0.0.0',
        deviceNumber: options.deviceNumber,
        platform: options.platform,
        arch: options.arch,
        installType: options.installType,
        upgradeStatus: status,
        reason: details?.reason,
        runtimeState: 'UPGRADING',
        uptimeSeconds: getUptimeSeconds(options),
      });
    },
  });
}

export function buildDaemonOptions(input: {
  runOnce: () => Promise<unknown>;
  shutdown: EdgeDaemonOptions['shutdown'];
  logger?: EdgeAgentLogger;
  env?: NodeJS.ProcessEnv;
}): EdgeDaemonOptions {
  const env = input.env ?? process.env;
  const logger = input.logger ?? edgeAgentLogger;
  return {
    runOnce: input.runOnce,
    shutdown: input.shutdown,
    logger,
    pollIntervalMs: parsePositiveInt(env.EDGE_AGENT_POLL_INTERVAL_MS, 15000),
    failureBackoffMs: parsePositiveInt(env.EDGE_AGENT_FAILURE_BACKOFF_MS, 5000),
    maxFailureBackoffMs: parsePositiveInt(env.EDGE_AGENT_MAX_BACKOFF_MS, 60000),
    onError: (error) => {
      logger.warn('edge.daemon.iteration_failed', { errorType: getErrorType(error) });
    },
  };
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getUptimeSeconds(options: Pick<RunnerOptions, 'runtimeStartedAtMs' | 'now'>) {
  if (options.runtimeStartedAtMs === undefined) {
    return undefined;
  }
  const now = options.now ?? Date.now;
  return Math.max(0, Math.floor((now() - options.runtimeStartedAtMs) / 1000));
}

function registerProcessShutdownHandlers(
  shutdown: ReturnType<typeof createShutdownSignal>,
  logger: EdgeAgentLogger,
) {
  process.once('SIGINT', () => {
    logger.info('edge.runtime.shutdown_requested', { signal: 'SIGINT' });
    shutdown.request('signal');
  });
  process.once('SIGTERM', () => {
    logger.info('edge.runtime.shutdown_requested', { signal: 'SIGTERM' });
    shutdown.request('signal');
  });
}

function isConfigNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const candidate = error as { code?: unknown };
  return candidate.code === 'ENOENT';
}

export function shouldRunMain(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NODE_ENV !== 'test' && env.VITEST !== 'true';
}

if (shouldRunMain()) {
  main().catch((error) => {
    edgeAgentLogger.error('edge.runtime.fatal', { errorType: getErrorType(error) });
    process.exitCode = 1;
  });
}
