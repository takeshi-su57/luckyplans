import { describe, expect, it, vi } from 'vitest';
import { maybeUpgrade } from './upgrade';

describe('maybeUpgrade', () => {
  it('defers upgrade while task is active', async () => {
    const reportStatus = vi.fn();
    const result = await maybeUpgrade({
      activeTask: true,
      currentVersion: '1.0.0',
      targetVersion: '1.0.1',
      reportStatus,
      download: vi.fn(),
      verify: vi.fn(),
      install: vi.fn(),
    });

    expect(result.performed).toBe(false);
    expect(reportStatus).not.toHaveBeenCalled();
  });

  it('performs upgrade when idle and targetVersion > currentVersion', async () => {
    const reportStatus = vi.fn();
    const result = await maybeUpgrade({
      activeTask: false,
      currentVersion: '1.0.0',
      targetVersion: '1.0.1',
      reportStatus,
      download: vi.fn().mockResolvedValue('artifact'),
      verify: vi.fn().mockResolvedValue(true),
      install: vi.fn().mockResolvedValue(undefined),
    });

    expect(result.performed).toBe(true);
    expect(result.nextVersion).toBe('1.0.1');
    expect(result.status).toBe('RESTARTING');
    expect(reportStatus.mock.calls.map((call) => call[0])).toEqual([
      'DOWNLOADING',
      'VERIFYING',
      'RESTARTING',
    ]);
    expect(reportStatus).not.toHaveBeenCalledWith('SUCCEEDED');
  });

  it('fails upgrade and keeps current version when verification returns false', async () => {
    const reportStatus = vi.fn();
    const result = await maybeUpgrade({
      activeTask: false,
      currentVersion: '1.0.0',
      targetVersion: '1.0.1',
      reportStatus,
      download: vi.fn().mockResolvedValue('artifact'),
      verify: vi.fn().mockResolvedValue(false),
      install: vi.fn().mockResolvedValue(undefined),
    });

    expect(result.performed).toBe(true);
    expect(result.nextVersion).toBe('1.0.0');
    expect(result.status).toBe('FAILED');
    expect(reportStatus.mock.calls.map((call) => call[0])).toEqual([
      'DOWNLOADING',
      'VERIFYING',
      'FAILED',
    ]);
  });

  it('fails upgrade and keeps current version when install throws', async () => {
    const reportStatus = vi.fn();
    const result = await maybeUpgrade({
      activeTask: false,
      currentVersion: '1.0.0',
      targetVersion: '1.0.1',
      reportStatus,
      download: vi.fn().mockResolvedValue('artifact'),
      verify: vi.fn().mockResolvedValue(true),
      install: vi.fn().mockRejectedValue(new Error('install failed')),
    });

    expect(result.performed).toBe(true);
    expect(result.nextVersion).toBe('1.0.0');
    expect(result.status).toBe('FAILED');
    expect(result.reason).toBe('install failed');
    expect(reportStatus.mock.calls.map((call) => call[0])).toEqual([
      'DOWNLOADING',
      'VERIFYING',
      'RESTARTING',
      'FAILED',
    ]);
  });

  it('sanitizes sensitive download failure reasons before returning and reporting them', async () => {
    const reportStatus = vi.fn();
    const sensitiveReason =
      'download failed: https://user:pass@example.com/a.tgz?token=secret&signature=abc123';

    const result = await maybeUpgrade({
      activeTask: false,
      currentVersion: '1.0.0',
      targetVersion: '1.0.1',
      reportStatus,
      download: vi.fn().mockRejectedValue(new Error(sensitiveReason)),
      verify: vi.fn(),
      install: vi.fn(),
    });

    expect(result.performed).toBe(true);
    expect(result.status).toBe('FAILED');
    expect(result.reason).not.toContain('token=secret');
    expect(result.reason).not.toContain('user:pass');
    expect(reportStatus).toHaveBeenCalledWith(
      'FAILED',
      expect.objectContaining({
        reason: expect.not.stringContaining('token=secret'),
      }),
    );
    expect(reportStatus).toHaveBeenCalledWith(
      'FAILED',
      expect.objectContaining({
        reason: expect.not.stringContaining('user:pass'),
      }),
    );
  });

  it('sanitizes malformed URL-shaped failure reasons before returning and reporting them', async () => {
    const reportStatus = vi.fn();
    const sensitiveReason =
      'download failed: https://user:pass@[::1?X-Amz-Signature=secret&X-Amz-Credential=credential';

    const result = await maybeUpgrade({
      activeTask: false,
      currentVersion: '1.0.0',
      targetVersion: '1.0.1',
      reportStatus,
      download: vi.fn().mockRejectedValue(new Error(sensitiveReason)),
      verify: vi.fn(),
      install: vi.fn(),
    });

    expect(result.reason).not.toContain('X-Amz-Signature');
    expect(result.reason).not.toContain('X-Amz-Credential');
    expect(result.reason).not.toContain('user:pass');
    expect(reportStatus).toHaveBeenCalledWith(
      'FAILED',
      expect.objectContaining({
        reason: expect.not.stringContaining('X-Amz-Signature'),
      }),
    );
    expect(reportStatus).toHaveBeenCalledWith(
      'FAILED',
      expect.objectContaining({
        reason: expect.not.stringContaining('user:pass'),
      }),
    );
  });

  it('does not execute upgrade when handlers are missing and reports failed status', async () => {
    const reportStatus = vi.fn();
    const result = await maybeUpgrade({
      activeTask: false,
      currentVersion: '1.0.0',
      targetVersion: '1.0.1',
      reportStatus,
      download: undefined,
      verify: undefined,
      install: undefined,
    });

    expect(result.performed).toBe(false);
    expect(result.nextVersion).toBe('1.0.0');
    expect(result.status).toBe('FAILED');
    expect(result.reason).toContain('handlers');
    expect(reportStatus).toHaveBeenCalledWith(
      'FAILED',
      expect.objectContaining({ reason: expect.stringContaining('handlers') }),
    );
  });

  it('treats prefixed versions as semver-like values', async () => {
    const reportStatus = vi.fn();
    const result = await maybeUpgrade({
      activeTask: false,
      currentVersion: 'v1.0.0',
      targetVersion: 'v1.0.1-beta.2',
      reportStatus,
      download: vi.fn().mockResolvedValue('artifact'),
      verify: vi.fn().mockResolvedValue(true),
      install: vi.fn().mockResolvedValue(undefined),
    });

    expect(result.performed).toBe(true);
    expect(result.nextVersion).toBe('v1.0.1-beta.2');
    expect(result.status).toBe('RESTARTING');
  });
});
