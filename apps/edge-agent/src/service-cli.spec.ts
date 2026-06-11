import { describe, expect, it, vi } from 'vitest';
import { runServiceCli } from './service-cli';

describe('service-cli', () => {
  it('runs install action and logs completion', async () => {
    const install = vi.fn().mockResolvedValue(undefined);
    const info = vi.fn();

    const exitCode = await runServiceCli(['install'], {
      install,
      info,
      error: vi.fn(),
    });

    expect(exitCode).toBe(0);
    expect(install).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('Edge service install completed.');
  });

  it('returns 1 and prints usage for unknown action', async () => {
    const error = vi.fn();

    const exitCode = await runServiceCli(['bad-action'], {
      install: vi.fn(),
      uninstall: vi.fn(),
      status: vi.fn(),
      restart: vi.fn(),
      info: vi.fn(),
      error,
    });

    expect(exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith('Usage: service-cli <install|status|restart|uninstall>');
  });

  it('redacts service command errors before logging', async () => {
    const error = vi.fn();

    const exitCode = await runServiceCli(['install'], {
      install: vi.fn().mockRejectedValue(new Error('failed with wk_live_secret')),
      uninstall: vi.fn(),
      status: vi.fn(),
      restart: vi.fn(),
      info: vi.fn(),
      error,
      secrets: ['wk_live_secret'],
    });

    expect(exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('[REDACTED]'));
    expect(error).not.toHaveBeenCalledWith(expect.stringContaining('wk_live_secret'));
  });

  it('dispatches restart action', async () => {
    const restart = vi.fn().mockResolvedValue(undefined);

    const exitCode = await runServiceCli(['restart'], {
      install: vi.fn(),
      uninstall: vi.fn(),
      status: vi.fn(),
      restart,
      info: vi.fn(),
      error: vi.fn(),
    });

    expect(exitCode).toBe(0);
    expect(restart).toHaveBeenCalledTimes(1);
  });
});
