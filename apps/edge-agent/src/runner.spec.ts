import { describe, expect, it, vi } from 'vitest';
import { runSinglePollExecution } from './runner';

function createLeaseTask(overrides: Partial<{ taskId: string }> = {}) {
  return {
    success: true,
    task: {
      taskId: overrides.taskId ?? 'task_grid',
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
  };
}

function createMockClient(input: {
  lease: Awaited<ReturnType<typeof createLeaseTask>> | { success: boolean; task: null };
  connectivity?: { targetVersion?: string | null };
  sendResultsError?: Error;
}) {
  return {
    pollNextTask: vi.fn().mockResolvedValue(input.lease),
    sendConnectivityHeartbeat: vi.fn().mockResolvedValue(input.connectivity ?? {}),
    sendResults: input.sendResultsError
      ? vi.fn().mockRejectedValue(input.sendResultsError)
      : vi.fn().mockResolvedValue({ success: true, accepted: 1, deduplicated: 0 }),
    sendHeartbeat: vi.fn().mockResolvedValue({ success: true, status: 'PROCESSING' }),
    completeTask: vi.fn().mockResolvedValue({ success: true, status: 'DONE' }),
    failTask: vi.fn().mockResolvedValue({ success: true, status: 'FAILED' }),
  };
}

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

    await runSinglePollExecution(client as never, {
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
      platform: 'linux',
      arch: 'x64',
    });

    const statuses = (client.sendConnectivityHeartbeat.mock.calls as unknown[][])
      .map((call) => call[0] as { upgradeStatus?: string } | undefined)
      .filter((payload): payload is { upgradeStatus: string } => Boolean(payload?.upgradeStatus))
      .map((payload) => payload.upgradeStatus);
    expect(statuses).toContain('FAILED');
    expect(statuses).not.toContain('SUCCEEDED');
  });

  it('passes edge identity metadata with connectivity heartbeats', async () => {
    const client = {
      pollNextTask: vi.fn().mockResolvedValue({ success: false, task: null }),
      sendConnectivityHeartbeat: vi.fn().mockResolvedValue({}),
      sendResults: vi.fn(),
      sendHeartbeat: vi.fn(),
      completeTask: vi.fn(),
      failTask: vi.fn(),
    };

    await runSinglePollExecution(client as never, {
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
      platform: 'linux',
      arch: 'x64',
    });

    expect(client.sendConnectivityHeartbeat).toHaveBeenCalledWith({
      activeTask: false,
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
      platform: 'linux',
      arch: 'x64',
      runtimeState: 'IDLE',
      activeTaskId: undefined,
      uptimeSeconds: undefined,
    });
  });

  it('reports IDLE runtime state when no task is leased', async () => {
    const client = createMockClient({
      lease: { success: true, task: null },
    });

    await runSinglePollExecution(client as never, {
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
      runtimeStartedAtMs: 1_000,
      now: () => 16_500,
    });

    expect(client.sendConnectivityHeartbeat).toHaveBeenCalledWith(
      expect.objectContaining({
        activeTask: false,
        runtimeState: 'IDLE',
        uptimeSeconds: 15,
        activeTaskId: undefined,
      }),
    );
  });

  it('reports BUSY runtime state and active task id when a task is leased', async () => {
    const client = createMockClient({
      lease: createLeaseTask({ taskId: 'task_123' }),
    });

    await runSinglePollExecution(client as never, {
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
      runtimeStartedAtMs: 1_000,
      now: () => 11_000,
    });

    expect(client.sendConnectivityHeartbeat).toHaveBeenCalledWith(
      expect.objectContaining({
        activeTask: true,
        runtimeState: 'BUSY',
        activeTaskId: 'task_123',
        uptimeSeconds: 10,
      }),
    );
  });

  it('reports UPGRADING runtime state during upgrade status heartbeats', async () => {
    const client = createMockClient({
      lease: { success: true, task: null },
      connectivity: { targetVersion: '1.0.1' },
    });

    await runSinglePollExecution(client as never, {
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
      runtimeStartedAtMs: 1_000,
      now: () => 3_500,
      downloadUpgradeArtifact: async () => 'artifact',
      verifyUpgradeArtifact: async () => true,
      installUpgradeArtifact: async () => undefined,
    });

    expect(client.sendConnectivityHeartbeat).toHaveBeenCalledWith(
      expect.objectContaining({
        runtimeState: 'UPGRADING',
        uptimeSeconds: 2,
      }),
    );
  });

  it('reports ERROR runtime state and last error when task execution fails', async () => {
    const client = createMockClient({
      lease: createLeaseTask({ taskId: 'task_error' }),
      sendResultsError: new Error('upload failed'),
    });

    await runSinglePollExecution(client as never, {
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
      runtimeStartedAtMs: 1_000,
      now: () => 21_000,
    });

    expect(client.sendConnectivityHeartbeat).toHaveBeenCalledWith(
      expect.objectContaining({
        activeTask: false,
        runtimeState: 'ERROR',
        activeTaskId: 'task_error',
        uptimeSeconds: 20,
        lastError: 'upload failed',
      }),
    );
  });
});
