import { EdgeApiClient } from './client';
import { loadEdgeConfig, type EdgeLocalConfig } from './config';
import { createShutdownSignal, runEdgeDaemon, type EdgeDaemonOptions } from './daemon';
import { runOnboarding } from './onboarding';
import { runSinglePollExecution, type RunnerOptions } from './runner';

async function main() {
  const runtimeConfig = await resolveRuntimeConfig();

  const client = new EdgeApiClient(
    runtimeConfig.serverUrl,
    runtimeConfig.workerId,
    runtimeConfig.credential,
  );
  const shutdown = createShutdownSignal();
  registerProcessShutdownHandlers(shutdown);
  const runnerOptions = buildRunnerOptions(runtimeConfig, process.platform, process.arch);

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
): RunnerOptions {
  return {
    currentVersion: runtimeConfig.currentVersion,
    deviceNumber: runtimeConfig.deviceNumber,
    platform,
    arch,
    runtimeStartedAtMs,
  };
}

export function buildDaemonOptions(input: {
  runOnce: () => Promise<unknown>;
  shutdown: EdgeDaemonOptions['shutdown'];
  env?: NodeJS.ProcessEnv;
}): EdgeDaemonOptions {
  const env = input.env ?? process.env;
  return {
    runOnce: input.runOnce,
    shutdown: input.shutdown,
    pollIntervalMs: parsePositiveInt(env.EDGE_AGENT_POLL_INTERVAL_MS, 15000),
    failureBackoffMs: parsePositiveInt(env.EDGE_AGENT_FAILURE_BACKOFF_MS, 5000),
    maxFailureBackoffMs: parsePositiveInt(env.EDGE_AGENT_MAX_BACKOFF_MS, 60000),
    onError: (error) => {
      console.warn('[edge-agent] daemon iteration failed', error);
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

function registerProcessShutdownHandlers(shutdown: ReturnType<typeof createShutdownSignal>) {
  process.once('SIGINT', () => shutdown.request('signal'));
  process.once('SIGTERM', () => shutdown.request('signal'));
}

function isConfigNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const candidate = error as { code?: unknown };
  return candidate.code === 'ENOENT';
}

if (process.env.NODE_ENV !== 'test') {
  main().catch((error) => {
    console.error('[edge-agent] fatal', error);
    process.exitCode = 1;
  });
}
