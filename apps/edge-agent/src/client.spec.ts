import { afterEach, describe, expect, it, vi } from 'vitest';
import { EdgeApiClient } from './client';

describe('EdgeApiClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends complete connectivity heartbeat identity and runtime payload', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ targetVersion: null }),
    } as Response);
    const client = new EdgeApiClient('https://api.example.com', 'worker_1', 'wk_live_secret');

    await client.sendConnectivityHeartbeat({
      activeTask: true,
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
      platform: 'linux',
      arch: 'x64',
      upgradeStatus: 'DOWNLOADING',
      reason: 'testing status payload',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/internal/edges/connectivity',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          workerId: 'worker_1',
          deviceNumber: 'edge-test-a1b2c3',
          currentVersion: '1.0.0',
          platform: 'linux',
          arch: 'x64',
          activeTask: true,
          upgradeStatus: 'DOWNLOADING',
          reason: 'testing status payload',
        }),
      }),
    );
  });

  it('sends runtime health fields in connectivity heartbeat', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);
    const client = new EdgeApiClient('https://api.example.com', 'worker_1', 'wk_secret');

    await client.sendConnectivityHeartbeat({
      activeTask: true,
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
      runtimeState: 'BUSY',
      activeTaskId: 'task_123',
      uptimeSeconds: 12,
      lastError: 'previous error',
    });

    const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);
    expect(body).toEqual(
      expect.objectContaining({
        runtimeState: 'BUSY',
        activeTaskId: 'task_123',
        uptimeSeconds: 12,
        lastError: 'previous error',
      }),
    );
  });
});
