import { describe, expect, it, vi } from 'vitest';

vi.mock('./upgrade-installer', () => ({
  installVerifiedUpgradeArtifact: vi.fn(),
}));

vi.mock('./upgrade-recovery', () => ({
  confirmPendingUpgrade: vi.fn(),
  shouldSuppressUpgradeRetry: vi.fn(),
}));

import { installVerifiedUpgradeArtifact } from './upgrade-installer';
import {
  confirmStartupRecovery,
  buildDaemonOptions,
  buildRunnerOptions,
  resolveRuntimeConfig,
} from './main';
import { confirmPendingUpgrade, shouldSuppressUpgradeRetry } from './upgrade-recovery';

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
      deviceNumber: 'edge-test-a1b2c3',
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

describe('main helpers', () => {
  it('wires verified upgrade install with trusted-key env paths', async () => {
    const artifact = { url: 'https://cdn.example.com/upgrade.tgz' };
    const options = buildRunnerOptions(
      {
        serverUrl: 'https://api.example.com',
        workerId: 'worker_1',
        credential: 'wk_live_secret',
        deviceNumber: 'edge-seoul-a1b2c3',
        currentVersion: '1.0.0',
      },
      'linux',
      'x64',
      1_000,
      {
        EDGE_AGENT_UPGRADE_STAGING_DIR: '/var/tmp/luckyplans-edge-upgrades',
        EDGE_AGENT_UPGRADE_TRUSTED_PUBLIC_KEY_PEM:
          '-----BEGIN PUBLIC KEY-----\nkey\n-----END PUBLIC KEY-----',
        EDGE_AGENT_UPGRADE_INSTALL_ROOT: '/srv/luckyplans/edge',
        EDGE_AGENT_UPGRADE_ACTIVE_VERSION_PATH: '/srv/luckyplans/edge/current',
        EDGE_AGENT_UPGRADE_RECOVERY_STATE_PATH: '/var/lib/luckyplans-edge/recovery.json',
        EDGE_AGENT_UPGRADE_FAILED_TARGET_PATH: '/var/lib/luckyplans-edge/failed-target.json',
      },
    );

    expect(options.currentVersion).toBe('1.0.0');
    expect(options.deviceNumber).toBe('edge-seoul-a1b2c3');
    expect(options.platform).toBe('linux');
    expect(options.arch).toBe('x64');
    expect(options.runtimeStartedAtMs).toBe(1_000);
    expect(options.installType).toBe('service');
    expect(options.downloadUpgradeArtifact).toBeTypeOf('function');
    expect(options.verifyUpgradeArtifact).toBeTypeOf('function');
    expect(options.installUpgradeArtifact).toEqual(expect.any(Function));
    expect(options.recoveryStatePath).toBe('/var/lib/luckyplans-edge/recovery.json');
    expect(options.suppressUpgradeRetry).toEqual(expect.any(Function));

    vi.mocked(shouldSuppressUpgradeRetry).mockResolvedValueOnce(false);
    await expect(options.suppressUpgradeRetry?.('1.1.0')).resolves.toBe(false);
    expect(shouldSuppressUpgradeRetry).toHaveBeenCalledWith({
      failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
      targetVersion: '1.1.0',
    });

    await options.installUpgradeArtifact?.(artifact);

    expect(installVerifiedUpgradeArtifact).toHaveBeenCalledWith(artifact, {
      installRoot: '/srv/luckyplans/edge',
      activeVersionPath: '/srv/luckyplans/edge/current',
      previousVersion: '1.0.0',
      recoveryStatePath: '/var/lib/luckyplans-edge/recovery.json',
      failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
    });
  });

  it('confirms pending startup recovery through connectivity heartbeat', async () => {
    vi.mocked(confirmPendingUpgrade).mockResolvedValueOnce({
      handled: true,
      status: 'ROLLED_BACK',
      reason: 'rolled back to previous version',
    });
    const client = {
      sendConnectivityHeartbeat: vi.fn().mockResolvedValue({}),
    };

    const result = await confirmStartupRecovery(client as never, {
      currentVersion: '1.1.0',
      deviceNumber: 'edge-seoul-a1b2c3',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      recoveryStatePath: '/var/lib/luckyplans-edge/recovery.json',
      runtimeStartedAtMs: 1_000,
      now: () => 4_500,
    });

    expect(result).toEqual({
      handled: true,
      status: 'ROLLED_BACK',
      reason: 'rolled back to previous version',
    });
    expect(confirmPendingUpgrade).toHaveBeenCalledWith({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      currentVersion: '1.1.0',
      reportStatus: expect.any(Function),
    });

    const reportStatus = vi.mocked(confirmPendingUpgrade).mock.calls[0]?.[0].reportStatus;
    await reportStatus?.('ROLLED_BACK', { reason: 'rolled back to previous version' });

    expect(client.sendConnectivityHeartbeat).toHaveBeenCalledWith({
      activeTask: false,
      currentVersion: '1.1.0',
      deviceNumber: 'edge-seoul-a1b2c3',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      upgradeStatus: 'ROLLED_BACK',
      reason: 'rolled back to previous version',
      runtimeState: 'UPGRADING',
      uptimeSeconds: 3,
    });
  });

  it('leaves upgrade handlers unavailable when no trusted public key is configured', () => {
    const options = buildRunnerOptions(
      {
        serverUrl: 'https://api.example.com',
        workerId: 'worker_1',
        credential: 'wk_live_secret',
        deviceNumber: 'edge-seoul-a1b2c3',
        currentVersion: '1.0.0',
      },
      'linux',
      'x64',
      1_000,
      {
        EDGE_AGENT_UPGRADE_STAGING_DIR: '/var/tmp/luckyplans-edge-upgrades',
      },
    );

    expect(options.installType).toBe('service');
    expect(options.downloadUpgradeArtifact).toBeUndefined();
    expect(options.verifyUpgradeArtifact).toBeUndefined();
    expect(options.installUpgradeArtifact).toBeUndefined();
  });

  it('builds daemon options from interval environment variables', () => {
    const shutdown = { requested: false, request: vi.fn() };
    const runOnce = vi.fn();
    const options = buildDaemonOptions({
      runOnce,
      shutdown,
      env: {
        EDGE_AGENT_POLL_INTERVAL_MS: '250',
        EDGE_AGENT_FAILURE_BACKOFF_MS: '100',
        EDGE_AGENT_MAX_BACKOFF_MS: '1000',
      },
    });

    expect(options.pollIntervalMs).toBe(250);
    expect(options.failureBackoffMs).toBe(100);
    expect(options.maxFailureBackoffMs).toBe(1000);
  });
});
