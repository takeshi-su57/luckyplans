import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadEdgeConfig } from './config';
import { runOnboarding } from './onboarding';

describe('runOnboarding', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map((path) => rm(path, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('prompts for name/server/token and persists registration result', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'edge-agent-onboarding-'));
    tempDirs.push(tempDir);

    const configPath = join(tempDir, 'config.json');
    const prompt = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('test Lab')
      .mockResolvedValueOnce('https://api.example.com')
      .mockResolvedValueOnce('reg_live_123');

    const registerEdge = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('conflict'), { status: 409 }))
      .mockResolvedValueOnce({
        workerId: 'worker_1',
        credential: 'wk_live_1',
        deviceNumber: 'edge-test-lab-a2b3c4',
      });

    const result = await runOnboarding({
      prompt,
      configPath,
      shortIdFactory: vi.fn().mockReturnValueOnce('a1b2c3').mockReturnValueOnce('a2b3c4'),
      client: {
        registerEdge,
      },
      edgeVersion: '0.1.0',
      platform: 'linux',
      arch: 'x64',
    });

    expect(prompt).toHaveBeenCalledTimes(3);
    expect(registerEdge).toHaveBeenCalledTimes(2);
    expect(registerEdge).toHaveBeenNthCalledWith(1, {
      displayName: 'test Lab',
      serverUrl: 'https://api.example.com',
      token: 'reg_live_123',
      deviceNumber: 'edge-test-lab-a1b2c3',
      platform: 'linux',
      arch: 'x64',
      edgeVersion: '0.1.0',
    });

    expect(result.workerId).toBe('worker_1');
    expect(result.deviceNumber).toBe('edge-test-lab-a2b3c4');

    await expect(loadEdgeConfig(configPath)).resolves.toMatchObject({
      workerId: 'worker_1',
      credential: 'wk_live_1',
      deviceNumber: 'edge-test-lab-a2b3c4',
      serverUrl: 'https://api.example.com',
      currentVersion: '0.1.0',
    });
  });

  it('fails with clear error when device number conflict exceeds max retries', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'edge-agent-onboarding-'));
    tempDirs.push(tempDir);

    const configPath = join(tempDir, 'config.json');
    const prompt = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('test Lab')
      .mockResolvedValueOnce('https://api.example.com')
      .mockResolvedValueOnce('reg_live_123');

    const registerEdge = vi
      .fn()
      .mockRejectedValue(Object.assign(new Error('conflict'), { status: 409 }));

    await expect(
      runOnboarding({
        prompt,
        configPath,
        shortIdFactory: vi.fn().mockReturnValue('zzzzzz'),
        client: { registerEdge },
        edgeVersion: '0.1.0',
        platform: 'linux',
        arch: 'x64',
      }),
    ).rejects.toThrow('Unable to register edge after 5 device number attempts due to conflicts');

    expect(registerEdge).toHaveBeenCalledTimes(5);
  });

  it('does not retry on non-409 registration errors', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'edge-agent-onboarding-'));
    tempDirs.push(tempDir);

    const configPath = join(tempDir, 'config.json');
    const prompt = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('test Lab')
      .mockResolvedValueOnce('https://api.example.com')
      .mockResolvedValueOnce('reg_live_123');

    const failure = new Error('unauthorized');
    const registerEdge = vi.fn().mockRejectedValue(failure);

    await expect(
      runOnboarding({
        prompt,
        configPath,
        shortIdFactory: vi.fn().mockReturnValue('a1b2c3'),
        client: { registerEdge },
        edgeVersion: '0.1.0',
        platform: 'linux',
        arch: 'x64',
      }),
    ).rejects.toThrow('unauthorized');

    expect(registerEdge).toHaveBeenCalledTimes(1);
  });
});
