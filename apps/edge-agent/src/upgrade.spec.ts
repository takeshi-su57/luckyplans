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
    expect(reportStatus.mock.calls.map((call) => call[0])).toEqual([
      'DOWNLOADING',
      'VERIFYING',
      'RESTARTING',
      'SUCCEEDED',
    ]);
  });
});
