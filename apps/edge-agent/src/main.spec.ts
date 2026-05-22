import { describe, expect, it, vi } from 'vitest';
import { resolveRuntimeConfig } from './main';

describe('resolveRuntimeConfig', () => {
  it('fails fast in non-interactive mode when env and config are unavailable', async () => {
    const loadConfig = vi
      .fn()
      .mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENOENT' }));
    const runOnboarding = vi.fn();

    await expect(
      resolveRuntimeConfig({
        env: {},
        isInteractive: false,
        loadConfig,
        runOnboarding,
        platform: 'linux',
        arch: 'x64',
      }),
    ).rejects.toThrow('Edge agent config not found and interactive onboarding is disabled');

    expect(runOnboarding).not.toHaveBeenCalled();
  });

  it('runs onboarding when config is missing and interactive mode is available', async () => {
    const loadConfig = vi
      .fn()
      .mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENOENT' }));
    const runOnboarding = vi.fn().mockResolvedValue({
      serverUrl: 'https://api.example.com',
      workerId: 'w1',
      credential: 'wk_live_1',
      deviceNumber: 'edge-seoul-a1b2c3',
      currentVersion: '0.1.0',
    });

    const config = await resolveRuntimeConfig({
      env: {},
      isInteractive: true,
      loadConfig,
      runOnboarding,
      platform: 'linux',
      arch: 'x64',
    });

    expect(config.workerId).toBe('w1');
    expect(runOnboarding).toHaveBeenCalledOnce();
  });

  it('fails without onboarding when config exists but is invalid', async () => {
    const loadConfig = vi
      .fn()
      .mockRejectedValue(new Error('Invalid edge config schema at /tmp/edge/config.json'));
    const runOnboarding = vi.fn();

    await expect(
      resolveRuntimeConfig({
        env: {},
        isInteractive: true,
        loadConfig,
        runOnboarding,
        platform: 'linux',
        arch: 'x64',
      }),
    ).rejects.toThrow('Invalid edge config schema at /tmp/edge/config.json');

    expect(runOnboarding).not.toHaveBeenCalled();
  });
});
