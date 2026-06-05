import { edgeAgentLogger, type EdgeAgentLogger } from './logger';

export type ShutdownReason = 'signal' | 'test';

export type ShutdownSignal = {
  readonly requested: boolean;
  readonly reason?: ShutdownReason | string;
  request: (reason: ShutdownReason | string) => void;
};

export type Sleep = (durationMs: number, shutdown: ShutdownSignal) => Promise<void>;
export type RunOnce = () => Promise<unknown>;

export type EdgeDaemonOptions = {
  runOnce: RunOnce;
  shutdown: ShutdownSignal;
  sleep?: Sleep;
  pollIntervalMs?: number;
  failureBackoffMs?: number;
  maxFailureBackoffMs?: number;
  onError?: (error: unknown) => void;
  logger?: EdgeAgentLogger;
};

export function createShutdownSignal(): ShutdownSignal {
  let requested = false;
  let reason: ShutdownReason | string | undefined;

  return {
    get requested() {
      return requested;
    },
    get reason() {
      return reason;
    },
    request(nextReason: ShutdownReason | string) {
      requested = true;
      reason = nextReason;
    },
  };
}

export async function runEdgeDaemon(options: EdgeDaemonOptions): Promise<void> {
  const shutdown = options.shutdown;
  const sleep = options.sleep ?? sleepWithTimeout;
  const pollIntervalMs = options.pollIntervalMs ?? 15000;
  const failureBackoffMs = options.failureBackoffMs ?? 5000;
  const maxFailureBackoffMs = options.maxFailureBackoffMs ?? 60000;
  const logger = options.logger ?? edgeAgentLogger;
  let nextFailureBackoffMs = failureBackoffMs;

  logger.info('edge.daemon.started', {
    pollIntervalMs,
    failureBackoffMs,
    maxFailureBackoffMs,
  });

  try {
    while (!shutdown.requested) {
      try {
        await options.runOnce();
        nextFailureBackoffMs = failureBackoffMs;
        if (!shutdown.requested) {
          await sleep(pollIntervalMs, shutdown);
        }
      } catch (error) {
        options.onError?.(error);
        if (!shutdown.requested) {
          await sleep(nextFailureBackoffMs, shutdown);
        }
        nextFailureBackoffMs = Math.min(nextFailureBackoffMs * 2, maxFailureBackoffMs);
      }
    }
  } finally {
    logger.info('edge.daemon.stopped', { reason: shutdown.reason ?? 'unknown' });
  }
}

export async function sleepWithTimeout(
  durationMs: number,
  shutdown: ShutdownSignal,
): Promise<void> {
  if (shutdown.requested) {
    return;
  }

  await new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, durationMs);
    if (shutdown.requested) {
      clearTimeout(timeout);
      resolve();
    }
  });
}
