import { describe, expect, it, vi } from 'vitest';
import { createShutdownSignal, runEdgeDaemon, sleepWithTimeout } from './daemon';

describe('runEdgeDaemon', () => {
  it('runs one iteration and sleeps with the poll interval before shutdown', async () => {
    const shutdown = createShutdownSignal();
    const runOnce = vi.fn().mockResolvedValue({ executed: false });
    const sleep = vi.fn().mockImplementation(async () => {
      shutdown.request('test');
    });

    await runEdgeDaemon({
      runOnce,
      shutdown,
      sleep,
      pollIntervalMs: 15000,
      failureBackoffMs: 5000,
      maxFailureBackoffMs: 60000,
    });

    expect(runOnce).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(15000, shutdown);
  });

  it('logs daemon start and stop lifecycle events', async () => {
    const shutdown = createShutdownSignal();
    const runOnce = vi.fn().mockResolvedValue({ executed: false });
    const sleep = vi.fn().mockImplementation(async () => {
      shutdown.request('test');
    });
    const logger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    await runEdgeDaemon({
      runOnce,
      shutdown,
      sleep,
      pollIntervalMs: 15000,
      failureBackoffMs: 5000,
      maxFailureBackoffMs: 60000,
      logger,
    });

    expect(logger.info).toHaveBeenCalledWith('edge.daemon.started', {
      pollIntervalMs: 15000,
      failureBackoffMs: 5000,
      maxFailureBackoffMs: 60000,
    });
    expect(logger.info).toHaveBeenCalledWith('edge.daemon.stopped', { reason: 'test' });
  });

  it('uses capped exponential backoff for transient failures', async () => {
    const shutdown = createShutdownSignal();
    const runOnce = vi
      .fn()
      .mockRejectedValueOnce(new Error('first failure'))
      .mockRejectedValueOnce(new Error('second failure'))
      .mockRejectedValueOnce(new Error('third failure'));
    const sleep = vi.fn().mockImplementation(async () => {
      if (sleep.mock.calls.length === 3) {
        shutdown.request('test');
      }
    });
    const onError = vi.fn();

    await runEdgeDaemon({
      runOnce,
      shutdown,
      sleep,
      pollIntervalMs: 15000,
      failureBackoffMs: 5000,
      maxFailureBackoffMs: 12000,
      onError,
    });

    expect(onError).toHaveBeenCalledTimes(3);
    expect(sleep.mock.calls.map((call) => call[0])).toEqual([5000, 10000, 12000]);
  });

  it('resets failure backoff after a successful iteration', async () => {
    const shutdown = createShutdownSignal();
    const runOnce = vi
      .fn()
      .mockRejectedValueOnce(new Error('first failure'))
      .mockResolvedValueOnce({ executed: false })
      .mockRejectedValueOnce(new Error('second failure'));
    const sleep = vi.fn().mockImplementation(async () => {
      if (sleep.mock.calls.length === 3) {
        shutdown.request('test');
      }
    });

    await runEdgeDaemon({
      runOnce,
      shutdown,
      sleep,
      pollIntervalMs: 15000,
      failureBackoffMs: 5000,
      maxFailureBackoffMs: 60000,
    });

    expect(sleep.mock.calls.map((call) => call[0])).toEqual([5000, 15000, 5000]);
  });

  it('interrupts timeout sleep when shutdown is requested', async () => {
    vi.useFakeTimers();
    const shutdown = createShutdownSignal();

    try {
      const sleepPromise = sleepWithTimeout(60000, shutdown);
      let interrupted = false;
      sleepPromise.then(() => {
        interrupted = true;
      });

      shutdown.request('signal');
      await Promise.resolve();
      await Promise.resolve();

      expect(interrupted).toBe(true);
    } finally {
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });
});
