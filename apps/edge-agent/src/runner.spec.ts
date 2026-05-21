import { describe, expect, it, vi } from 'vitest';
import { runSinglePollExecution } from './runner';

describe('runSinglePollExecution', () => {
  it('executes grid task and reports completion', async () => {
    const client = {
      pollNextTask: vi.fn().mockResolvedValue({
        success: true,
        task: {
          taskId: 'task_grid',
          name: 'grid',
          symbol: 'BTCUSDT',
          interval: '1m',
          searchStrategy: 'grid',
          optimizationParams: {
            entryThresholdPct: [1],
            stopLossPct: [2],
            takeProfitPct: [3],
            feePct: [0.1],
          },
          optimizationMetrics: ['totalPnlPercent'],
          trials: 1,
        },
      }),
      sendResults: vi.fn().mockResolvedValue({ success: true, accepted: 1, deduplicated: 0 }),
      sendHeartbeat: vi.fn().mockResolvedValue({ success: true, status: 'PROCESSING' }),
      completeTask: vi.fn().mockResolvedValue({ success: true, status: 'DONE' }),
      failTask: vi.fn().mockResolvedValue({ success: true, status: 'FAILED' }),
    };

    const result = await runSinglePollExecution(client as never);

    expect(result.executed).toBe(true);
    expect(client.sendHeartbeat).toHaveBeenCalled();
    expect(client.sendResults).toHaveBeenCalledOnce();
    expect(client.completeTask).toHaveBeenCalledOnce();
  });

  it('executes optuna task and reports completion', async () => {
    const client = {
      pollNextTask: vi.fn().mockResolvedValue({
        success: true,
        task: {
          taskId: 'task_optuna',
          name: 'optuna',
          symbol: 'BTCUSDT',
          interval: '1m',
          searchStrategy: 'optuna',
          optimizationParams: {
            entryThresholdPct: [0.5, 1, 1.5],
            stopLossPct: [2, 3],
            takeProfitPct: [3, 4],
            feePct: [0.1, 0.2],
          },
          optimizationMetrics: ['totalPnlPercent'],
          trials: 3,
        },
      }),
      sendResults: vi.fn().mockResolvedValue({ success: true, accepted: 3, deduplicated: 0 }),
      sendHeartbeat: vi.fn().mockResolvedValue({ success: true, status: 'PROCESSING' }),
      completeTask: vi.fn().mockResolvedValue({ success: true, status: 'DONE' }),
      failTask: vi.fn().mockResolvedValue({ success: true, status: 'FAILED' }),
    };

    const result = await runSinglePollExecution(client as never);

    expect(result.executed).toBe(true);
    expect(client.sendHeartbeat).toHaveBeenCalled();
    expect(client.sendResults).toHaveBeenCalledOnce();
    expect(client.completeTask).toHaveBeenCalledOnce();
  });

  it('reports failure when task execution throws', async () => {
    const client = {
      pollNextTask: vi.fn().mockResolvedValue({
        success: true,
        task: {
          taskId: 'task_invalid',
          name: 'invalid',
          symbol: 'BTCUSDT',
          interval: '1m',
          searchStrategy: 'optuna',
          optimizationParams: {},
          optimizationMetrics: ['totalPnlPercent'],
          trials: 2,
        },
      }),
      sendResults: vi.fn().mockRejectedValue(new Error('upload failed')),
      sendHeartbeat: vi.fn().mockResolvedValue({ success: true, status: 'PROCESSING' }),
      completeTask: vi.fn(),
      failTask: vi.fn().mockResolvedValue({ success: true, status: 'FAILED' }),
    };

    const result = await runSinglePollExecution(client as never);

    expect(result.executed).toBe(false);
    expect(client.failTask).toHaveBeenCalledOnce();
    expect(client.completeTask).not.toHaveBeenCalled();
  });

  it('tolerates connectivity heartbeat errors and continues task execution', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const client = {
      pollNextTask: vi.fn().mockResolvedValue({
        success: true,
        task: {
          taskId: 'task_grid_connectivity',
          name: 'grid',
          symbol: 'BTCUSDT',
          interval: '1m',
          searchStrategy: 'grid',
          optimizationParams: {
            entryThresholdPct: [1],
            stopLossPct: [2],
            takeProfitPct: [3],
            feePct: [0.1],
          },
          optimizationMetrics: ['totalPnlPercent'],
          trials: 1,
        },
      }),
      sendConnectivityHeartbeat: vi.fn().mockRejectedValue(new Error('heartbeat down')),
      sendResults: vi.fn().mockResolvedValue({ success: true, accepted: 1, deduplicated: 0 }),
      sendHeartbeat: vi.fn().mockResolvedValue({ success: true, status: 'PROCESSING' }),
      completeTask: vi.fn().mockResolvedValue({ success: true, status: 'DONE' }),
      failTask: vi.fn().mockResolvedValue({ success: true, status: 'FAILED' }),
    };

    const result = await runSinglePollExecution(client as never, { currentVersion: '1.0.0' });

    expect(result.executed).toBe(true);
    expect(client.sendResults).toHaveBeenCalledOnce();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('does not report upgrade success when connectivity suggests upgrade but handlers are missing', async () => {
    const client = {
      pollNextTask: vi.fn().mockResolvedValue({ success: false, task: null }),
      sendConnectivityHeartbeat: vi
        .fn()
        .mockResolvedValueOnce({ targetVersion: '1.0.1' })
        .mockResolvedValue({}),
      sendResults: vi.fn(),
      sendHeartbeat: vi.fn(),
      completeTask: vi.fn(),
      failTask: vi.fn(),
    };

    await runSinglePollExecution(client as never, { currentVersion: '1.0.0' });

    const statuses = client.sendConnectivityHeartbeat.mock.calls
      .map((call: unknown[]) => call[0])
      .filter((payload: { upgradeStatus?: string }) => payload.upgradeStatus)
      .map((payload: { upgradeStatus?: string }) => payload.upgradeStatus);
    expect(statuses).toContain('FAILED');
    expect(statuses).not.toContain('SUCCEEDED');
  });
});
