import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { installVerifiedUpgradeArtifact, type UpgradeInstallerFs } from './upgrade-installer';
import type { VerifiedUpgradeArtifact } from './upgrade-artifact';

function artifact(overrides: Partial<VerifiedUpgradeArtifact> = {}): VerifiedUpgradeArtifact {
  return {
    path: '/tmp/staged/edge-agent-1.2.3.tgz',
    version: '1.2.3',
    checksum: 'a'.repeat(64),
    url: 'https://releases.example.com/edge-agent-1.2.3.tgz',
    ...overrides,
  };
}

function createFs(overrides: Partial<UpgradeInstallerFs> = {}): UpgradeInstallerFs {
  return {
    mkdir: vi.fn().mockResolvedValue(undefined),
    copyFile: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
    rename: vi.fn().mockResolvedValue(undefined),
    rm: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('upgrade-installer', () => {
  it('stages the verified artifact, switches active marker, and restarts service', async () => {
    const fs = createFs();
    const restartService = vi.fn().mockResolvedValue(undefined);
    const installRoot = join('/opt/luckyplans/edge-agent', 'releases');
    const activeVersionPath = join('/opt/luckyplans/edge-agent', 'active-version');
    const releaseDir = join(installRoot, '1.2.3');
    const copiedArtifactPath = join(releaseDir, 'edge-agent-1.2.3.tgz');
    const tempMarkerPath = `${activeVersionPath}.42.1700000000000.tmp`;

    const result = await installVerifiedUpgradeArtifact(artifact(), {
      installRoot,
      activeVersionPath,
      fs,
      restartService,
      now: () => 1700000000000,
      pid: 42,
    });

    expect(result).toEqual({
      installedVersion: '1.2.3',
      releaseDir,
      activeVersionPath,
    });
    expect(fs.mkdir).toHaveBeenCalledWith(releaseDir, {
      recursive: true,
    });
    expect(fs.copyFile).toHaveBeenCalledWith(
      '/tmp/staged/edge-agent-1.2.3.tgz',
      copiedArtifactPath,
    );
    expect(fs.writeFile).toHaveBeenCalledWith(tempMarkerPath, '1.2.3\n', 'utf8');
    expect(fs.rename).toHaveBeenCalledWith(tempMarkerPath, activeVersionPath);
    expect(restartService).toHaveBeenCalledTimes(1);
  });

  it('does not switch active marker or restart service when staging copy fails', async () => {
    const fs = createFs({
      copyFile: vi.fn().mockRejectedValue(new Error('copy failed')),
    });
    const restartService = vi.fn();
    const installRoot = join('/opt/luckyplans/edge-agent', 'releases');
    const activeVersionPath = join('/opt/luckyplans/edge-agent', 'active-version');

    await expect(
      installVerifiedUpgradeArtifact(artifact(), {
        installRoot,
        activeVersionPath,
        fs,
        restartService,
      }),
    ).rejects.toThrow('copy failed');

    expect(fs.writeFile).not.toHaveBeenCalled();
    expect(fs.rename).not.toHaveBeenCalled();
    expect(restartService).not.toHaveBeenCalled();
  });

  it('rejects artifacts that are not verified upgrade artifacts', async () => {
    const installRoot = join('/opt/luckyplans/edge-agent', 'releases');
    const activeVersionPath = join('/opt/luckyplans/edge-agent', 'active-version');

    await expect(
      installVerifiedUpgradeArtifact(
        { path: '/tmp/artifact.tgz', version: '1.2.3' },
        {
          installRoot,
          activeVersionPath,
          fs: createFs(),
          restartService: vi.fn(),
        },
      ),
    ).rejects.toThrow('Verified upgrade artifact is required for install');
  });

  it('rejects artifacts with unsafe or empty install path segments', async () => {
    const installRoot = join('/opt/luckyplans/edge-agent', 'releases');
    const activeVersionPath = join('/opt/luckyplans/edge-agent', 'active-version');

    await expect(
      installVerifiedUpgradeArtifact(artifact({ version: '..' }), {
        installRoot,
        activeVersionPath,
        fs: createFs(),
        restartService: vi.fn(),
      }),
    ).rejects.toThrow('Verified upgrade artifact is required for install');

    await expect(
      installVerifiedUpgradeArtifact(artifact({ path: '/tmp/staged/..' }), {
        installRoot,
        activeVersionPath,
        fs: createFs(),
        restartService: vi.fn(),
      }),
    ).rejects.toThrow('Verified upgrade artifact is required for install');

    await expect(
      installVerifiedUpgradeArtifact(artifact({ version: '' }), {
        installRoot,
        activeVersionPath,
        fs: createFs(),
        restartService: vi.fn(),
      }),
    ).rejects.toThrow('Verified upgrade artifact is required for install');

    await expect(
      installVerifiedUpgradeArtifact(artifact({ path: '' }), {
        installRoot,
        activeVersionPath,
        fs: createFs(),
        restartService: vi.fn(),
      }),
    ).rejects.toThrow('Verified upgrade artifact is required for install');
  });

  it('removes the temp marker and rethrows when active marker rename fails', async () => {
    const renameError = new Error('rename failed');
    const fs = createFs({
      rename: vi.fn().mockRejectedValue(renameError),
    });
    const restartService = vi.fn();
    const installRoot = join('/opt/luckyplans/edge-agent', 'releases');
    const activeVersionPath = join('/opt/luckyplans/edge-agent', 'active-version');
    const tempMarkerPath = `${activeVersionPath}.42.1700000000000.tmp`;

    await expect(
      installVerifiedUpgradeArtifact(artifact(), {
        installRoot,
        activeVersionPath,
        fs,
        restartService,
        now: () => 1700000000000,
        pid: 42,
      }),
    ).rejects.toThrow('rename failed');

    expect(fs.rm).toHaveBeenCalledWith(tempMarkerPath, { force: true });
    expect(restartService).not.toHaveBeenCalled();
  });

  it('keeps switched active marker when service restart fails', async () => {
    const fs = createFs();
    const restartService = vi.fn().mockRejectedValue(new Error('restart failed'));
    const installRoot = join('/opt/luckyplans/edge-agent', 'releases');
    const activeVersionPath = join('/opt/luckyplans/edge-agent', 'active-version');

    await expect(
      installVerifiedUpgradeArtifact(artifact(), {
        installRoot,
        activeVersionPath,
        fs,
        restartService,
      }),
    ).rejects.toThrow('restart failed');

    expect(fs.rename).toHaveBeenCalledTimes(1);
    expect(restartService).toHaveBeenCalledTimes(1);
  });
});
