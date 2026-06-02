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
      installType: 'service',
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
          installType: 'service',
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

  it('returns release artifact metadata from connectivity heartbeat response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        targetVersion: '2.0.0',
        release: {
          version: '2.0.0',
          platform: 'linux',
          arch: 'x64',
          installType: 'tarball',
          url: 'https://downloads.example.com/edge-agent-2.0.0.tar.gz',
          checksum: 'a'.repeat(64),
          signature: 'sig-123',
          signatureAlgorithm: 'ed25519',
          signingKeyId: 'key-abc',
          sizeBytes: 1024,
        },
        upgradeStatus: 'DOWNLOADING',
        upgradeMessage: null,
      }),
    } as Response);
    const client = new EdgeApiClient('https://api.example.com', 'worker_1', 'wk_secret');

    const response = await client.sendConnectivityHeartbeat({
      activeTask: true,
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
      runtimeState: 'BUSY',
      activeTaskId: 'task_123',
      uptimeSeconds: 12,
      lastError: 'previous error',
    });

    expect(response.targetVersion).toBe('2.0.0');
    expect(response.release?.url).toBe('https://downloads.example.com/edge-agent-2.0.0.tar.gz');
    expect(response.release?.checksum).toBe('a'.repeat(64));
    expect(response.release?.signatureAlgorithm).toBe('ed25519');
    expect(response.upgradeStatus).toBe('DOWNLOADING');
    expect(response.upgradeMessage).toBeNull();
  });

  it('accepts persisted upgrade status responses without release metadata', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        targetVersion: '2.0.0',
        release: null,
        upgradeStatus: 'UPGRADE_PENDING',
        upgradeMessage: 'No compatible artifact found',
      }),
    } as Response);
    const client = new EdgeApiClient('https://api.example.com', 'worker_1', 'wk_secret');

    const response = await client.sendConnectivityHeartbeat({
      activeTask: false,
      currentVersion: '1.0.0',
      deviceNumber: 'edge-test-a1b2c3',
    });

    expect(response.release).toBeNull();
    expect(response.upgradeStatus).toBe('UPGRADE_PENDING');
    expect(response.upgradeMessage).toBe('No compatible artifact found');
  });
});
