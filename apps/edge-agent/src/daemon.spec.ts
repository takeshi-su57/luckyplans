import { describe, expect, it, vi } from 'vitest';
import { createShutdownSignal, runEdgeDaemon } from './daemon';

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
});
