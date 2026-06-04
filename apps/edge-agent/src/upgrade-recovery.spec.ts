import { describe, expect, it, vi } from 'vitest';
import {
  clearRecoveryState,
  confirmPendingUpgrade,
  createPendingRecoveryState,
  rollbackPendingUpgrade,
  shouldSuppressUpgradeRetry,
  type UpgradeRecoveryFs,
} from './upgrade-recovery';

function createFs(overrides: Partial<UpgradeRecoveryFs> = {}): UpgradeRecoveryFs {
  return {
    readFile: vi.fn().mockRejectedValue(Object.assign(new Error('not found'), { code: 'ENOENT' })),
    writeFile: vi.fn().mockResolvedValue(undefined),
    rename: vi.fn().mockResolvedValue(undefined),
    rm: vi.fn().mockResolvedValue(undefined),
    mkdir: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('upgrade-recovery', () => {
  it('writes pending recovery state atomically before install switch', async () => {
    const fs = createFs();
    const statePath = '/var/lib/luckyplans-edge/recovery.json';
    const tempPath = `${statePath}.42.1700000000000.tmp`;

    await createPendingRecoveryState({
      statePath,
      previousVersion: '1.0.0',
      targetVersion: '1.1.0',
      releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
      activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
      failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
      attemptId: 'attempt-1',
      fs,
      now: () => 1700000000000,
      pid: 42,
    });

    expect(fs.mkdir).toHaveBeenCalledWith('/var/lib/luckyplans-edge', { recursive: true });
    expect(fs.writeFile).toHaveBeenCalledWith(
      tempPath,
      expect.stringContaining('"state":"PENDING_BOOT_CONFIRMATION"'),
      'utf8',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      tempPath,
      expect.stringContaining('"releaseDir":"/opt/luckyplans/edge-agent/releases/1.1.0"'),
      'utf8',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      tempPath,
      expect.stringContaining('"attemptId":"attempt-1"'),
      'utf8',
    );
    expect(fs.rename).toHaveBeenCalledWith(tempPath, statePath);
  });

  it('defaults pending recovery attempt id from pid and attempted time', async () => {
    const fs = createFs();

    await createPendingRecoveryState({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      previousVersion: '1.0.0',
      targetVersion: '1.1.0',
      releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
      activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
      failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
      fs,
      now: () => 1700000000000,
      pid: 42,
    });

    expect(fs.writeFile).toHaveBeenCalledWith(
      '/var/lib/luckyplans-edge/recovery.json.42.1700000000000.tmp',
      expect.stringContaining('"attemptId":"42-1700000000000"'),
      'utf8',
    );
  });

  it('confirms healthy upgrade and clears pending state after successful heartbeat', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          state: 'PENDING_BOOT_CONFIRMATION',
          previousVersion: '1.0.0',
          targetVersion: '1.1.0',
          releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
          activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
          failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
          attemptedAtMs: 1700000000000,
          attemptId: 'attempt-1',
        }),
      ),
    });
    const reportStatus = vi.fn().mockResolvedValue(undefined);
    const restartService = vi.fn();

    const result = await confirmPendingUpgrade({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      currentVersion: '1.1.0',
      reportStatus,
      restartService,
      fs,
    });

    expect(result).toEqual({ handled: true, status: 'SUCCEEDED' });
    expect(reportStatus).toHaveBeenCalledWith('SUCCEEDED');
    expect(fs.rm).toHaveBeenCalledWith('/var/lib/luckyplans-edge/recovery.json', { force: true });
    expect(restartService).not.toHaveBeenCalled();
  });

  it('does not roll back when success cleanup fails after reporting SUCCEEDED', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          state: 'PENDING_BOOT_CONFIRMATION',
          previousVersion: '1.0.0',
          targetVersion: '1.1.0',
          releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
          activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
          failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
          attemptedAtMs: 1700000000000,
          attemptId: 'attempt-1',
        }),
      ),
      rm: vi.fn().mockRejectedValue(new Error('cleanup failed with token=secret')),
    });
    const reportStatus = vi.fn().mockResolvedValue(undefined);
    const restartService = vi.fn().mockResolvedValue(undefined);

    const result = await confirmPendingUpgrade({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      currentVersion: '1.1.0',
      reportStatus,
      restartService,
      fs,
    });

    expect(result).toEqual({
      handled: true,
      status: 'SUCCEEDED',
      reason: 'cleanup failed with token=[REDACTED]',
    });
    expect(reportStatus).toHaveBeenCalledTimes(1);
    expect(reportStatus).toHaveBeenCalledWith('SUCCEEDED');
    expect(fs.rename).not.toHaveBeenCalled();
    expect(restartService).not.toHaveBeenCalled();
  });

  it('does not roll back when reporting SUCCEEDED fails after healthy boot', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          state: 'PENDING_BOOT_CONFIRMATION',
          previousVersion: '1.0.0',
          targetVersion: '1.1.0',
          releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
          activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
          failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
          attemptedAtMs: 1700000000000,
          attemptId: 'attempt-1',
        }),
      ),
    });
    const reportStatus = vi
      .fn()
      .mockRejectedValue(new Error('status failed with token=secret password=hunter2'));
    const restartService = vi.fn().mockResolvedValue(undefined);

    const result = await confirmPendingUpgrade({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      currentVersion: '1.1.0',
      reportStatus,
      restartService,
      fs,
    });

    expect(result).toEqual({
      handled: true,
      status: 'SUCCEEDED',
      reason: 'status failed with token=[REDACTED] password=[REDACTED]',
    });
    expect(reportStatus).toHaveBeenCalledTimes(1);
    expect(reportStatus).toHaveBeenCalledWith('SUCCEEDED');
    expect(fs.writeFile).not.toHaveBeenCalledWith(
      expect.stringContaining('/opt/luckyplans/edge-agent/active-version'),
      expect.any(String),
      'utf8',
    );
    expect(fs.rm).not.toHaveBeenCalledWith('/var/lib/luckyplans-edge/recovery.json', {
      force: true,
    });
    expect(restartService).not.toHaveBeenCalled();
  });

  it('does nothing when no pending recovery state exists', async () => {
    const fs = createFs();
    const reportStatus = vi.fn().mockResolvedValue(undefined);
    const restartService = vi.fn().mockResolvedValue(undefined);

    const result = await confirmPendingUpgrade({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      currentVersion: '1.1.0',
      reportStatus,
      restartService,
      fs,
    });

    expect(result).toEqual({ handled: false });
    expect(reportStatus).not.toHaveBeenCalled();
    expect(restartService).not.toHaveBeenCalled();
  });

  it('rolls back failed boot and persists failed attempt metadata', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          state: 'PENDING_BOOT_CONFIRMATION',
          previousVersion: '1.0.0',
          targetVersion: '1.1.0',
          releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
          activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
          failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
          attemptedAtMs: 1700000000000,
          attemptId: 'attempt-1',
        }),
      ),
    });
    const reportStatus = vi.fn().mockResolvedValue(undefined);
    const restartService = vi.fn().mockResolvedValue(undefined);
    const activeVersionTempPath = expect.stringMatching(
      /^\/opt\/luckyplans\/edge-agent\/active-version\.44\.1700000005000\.tmp$/,
    );
    const failedTargetTempPath = expect.stringMatching(
      /^\/var\/lib\/luckyplans-edge\/failed-target\.json\.44\.1700000005000\.tmp$/,
    );

    const result = await confirmPendingUpgrade({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      currentVersion: '1.0.0',
      reportStatus,
      restartService,
      fs,
      now: () => 1700000005000,
      pid: 44,
    });

    expect(result.status).toBe('ROLLED_BACK');
    expect(reportStatus).toHaveBeenCalledWith('ROLLED_BACK', {
      reason: 'upgrade boot confirmation failed for 1.1.0',
    });
    expect(fs.writeFile).toHaveBeenCalledWith(activeVersionTempPath, '1.0.0\n', 'utf8');
    expect(fs.rename).toHaveBeenCalledWith(
      activeVersionTempPath,
      '/opt/luckyplans/edge-agent/active-version',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      failedTargetTempPath,
      expect.stringMatching(/"targetVersion":"1\.1\.0"/),
      'utf8',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      failedTargetTempPath,
      expect.stringContaining('"attemptId":"attempt-1"'),
      'utf8',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      failedTargetTempPath,
      expect.stringContaining('"releaseDir":"/opt/luckyplans/edge-agent/releases/1.1.0"'),
      'utf8',
    );
    expect(fs.rename).toHaveBeenCalledWith(
      failedTargetTempPath,
      '/var/lib/luckyplans-edge/failed-target.json',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      '/var/lib/luckyplans-edge/recovery.json',
      expect.any(String),
      'utf8',
    );
    expect(fs.rm).toHaveBeenCalledWith('/var/lib/luckyplans-edge/recovery.json', { force: true });
    expect(restartService).toHaveBeenCalledTimes(1);
  });

  it('keeps recovery state when restart fails during rollback', async () => {
    const fs = createFs();
    const restartService = vi.fn().mockRejectedValue(new Error('restart failed'));
    const failedTargetTempPath = expect.stringMatching(
      /^\/var\/lib\/luckyplans-edge\/failed-target\.json\.44\.1700000005000\.tmp$/,
    );

    await expect(
      rollbackPendingUpgrade({
        state: {
          state: 'PENDING_BOOT_CONFIRMATION',
          previousVersion: '1.0.0',
          targetVersion: '1.1.0',
          releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
          activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
          failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
          attemptedAtMs: 1700000000000,
          attemptId: 'attempt-1',
        },
        statePath: '/var/lib/luckyplans-edge/recovery.json',
        reason:
          'rollback because token=secret password=hunter2 apiKey=abc123 secret=shh Authorization: Bearer topsecret Bearer loosebearer https://user:pass@example.com/path?token=secret',
        fs,
        restartService,
        now: () => 1700000005000,
        pid: 44,
      }),
    ).rejects.toThrow('restart failed');

    expect(fs.writeFile).toHaveBeenCalledWith(
      '/opt/luckyplans/edge-agent/active-version.44.1700000005000.tmp',
      '1.0.0\n',
      'utf8',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      failedTargetTempPath,
      expect.stringContaining('token=[REDACTED]'),
      'utf8',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      failedTargetTempPath,
      expect.stringContaining('password=[REDACTED]'),
      'utf8',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      failedTargetTempPath,
      expect.stringContaining('apiKey=[REDACTED]'),
      'utf8',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      failedTargetTempPath,
      expect.stringContaining('secret=[REDACTED]'),
      'utf8',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      failedTargetTempPath,
      expect.stringContaining('Authorization: Bearer [REDACTED]'),
      'utf8',
    );
    const failedTargetWrite = vi
      .mocked(fs.writeFile)
      .mock.calls.find(
        ([path]) => path === '/var/lib/luckyplans-edge/failed-target.json.44.1700000005000.tmp',
      );
    expect(failedTargetWrite?.[1]).not.toContain('token=secret');
    expect(failedTargetWrite?.[1]).not.toContain('password=hunter2');
    expect(failedTargetWrite?.[1]).not.toContain('apiKey=abc123');
    expect(failedTargetWrite?.[1]).not.toContain('secret=shh');
    expect(failedTargetWrite?.[1]).not.toContain('Bearer topsecret');
    expect(failedTargetWrite?.[1]).not.toContain('Bearer loosebearer');
    expect(failedTargetWrite?.[1]).not.toContain('user:pass@');
    expect(failedTargetWrite?.[1]).not.toContain('?token=secret');
    expect(fs.rename).toHaveBeenCalledWith(
      failedTargetTempPath,
      '/var/lib/luckyplans-edge/failed-target.json',
    );
    expect(fs.rm).not.toHaveBeenCalledWith('/var/lib/luckyplans-edge/recovery.json', {
      force: true,
    });
  });

  it('rolls back failed boot when current version is not target version', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          state: 'PENDING_BOOT_CONFIRMATION',
          previousVersion: '1.0.0',
          targetVersion: '1.1.0',
          releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
          activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
          failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
          attemptedAtMs: 1700000000000,
          attemptId: 'attempt-1',
        }),
      ),
    });
    const reportStatus = vi.fn().mockResolvedValue(undefined);
    const restartService = vi.fn().mockResolvedValue(undefined);

    const result = await confirmPendingUpgrade({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      currentVersion: '1.0.0',
      reportStatus,
      restartService,
      fs,
    });

    expect(result.status).toBe('ROLLED_BACK');
    expect(reportStatus).toHaveBeenCalledWith('ROLLED_BACK', {
      reason: 'upgrade boot confirmation failed for 1.1.0',
    });
    expect(fs.rm).toHaveBeenCalledWith('/var/lib/luckyplans-edge/recovery.json', { force: true });
    expect(restartService).toHaveBeenCalledTimes(1);
  });

  it('suppresses reinstall for the same failed target version', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          targetVersion: '1.1.0',
          previousVersion: '1.0.0',
          releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
          failedAtMs: 1700000005000,
          attemptId: 'attempt-1',
          reason: 'upgrade boot confirmation failed for 1.1.0',
        }),
      ),
    });

    await expect(
      shouldSuppressUpgradeRetry({
        failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
        targetVersion: '1.1.0',
        fs,
      }),
    ).resolves.toBe(true);

    await expect(
      shouldSuppressUpgradeRetry({
        failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
        targetVersion: '1.2.0',
        fs,
      }),
    ).resolves.toBe(false);
  });

  it('suppresses retry only for the matching failed attempt when attempt id is provided', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          targetVersion: '1.1.0',
          previousVersion: '1.0.0',
          releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
          failedAtMs: 1700000005000,
          attemptId: 'attempt-1',
          reason: 'upgrade boot confirmation failed for 1.1.0',
        }),
      ),
    });

    await expect(
      shouldSuppressUpgradeRetry({
        failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
        targetVersion: '1.1.0',
        attemptId: 'attempt-1',
        fs,
      }),
    ).resolves.toBe(true);

    await expect(
      shouldSuppressUpgradeRetry({
        failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
        targetVersion: '1.1.0',
        attemptId: 'attempt-2',
        fs,
      }),
    ).resolves.toBe(false);
  });

  it('preserves same-version suppression when attempt id is omitted', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          targetVersion: '1.1.0',
          previousVersion: '1.0.0',
          releaseDir: '/opt/luckyplans/edge-agent/releases/1.1.0',
          failedAtMs: 1700000005000,
          attemptId: 'attempt-1',
          reason: 'upgrade boot confirmation failed for 1.1.0',
        }),
      ),
    });

    await expect(
      shouldSuppressUpgradeRetry({
        failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
        targetVersion: '1.1.0',
        fs,
      }),
    ).resolves.toBe(true);
  });

  it('does not suppress retry when failed-target shape is invalid', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          targetVersion: 123,
          reason: 'bad shape',
        }),
      ),
    });

    await expect(
      shouldSuppressUpgradeRetry({
        failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
        targetVersion: '1.1.0',
        fs,
      }),
    ).resolves.toBe(false);
  });

  it('clears recovery state idempotently', async () => {
    const fs = createFs();

    await clearRecoveryState({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      fs,
    });

    expect(fs.rm).toHaveBeenCalledWith('/var/lib/luckyplans-edge/recovery.json', { force: true });
  });
});
