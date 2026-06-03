import {
  copyFile as copyFileFs,
  mkdir as mkdirFs,
  rename as renameFs,
  rm as rmFs,
  writeFile as writeFileFs,
} from 'node:fs/promises';
import { basename, join } from 'node:path';
import { restartEdgeService } from './service-manager';
import type { VerifiedUpgradeArtifact } from './upgrade-artifact';

export type UpgradeInstallResult = {
  installedVersion: string;
  releaseDir: string;
  activeVersionPath: string;
};

export type UpgradeInstallerFs = {
  mkdir: typeof mkdirFs;
  copyFile: typeof copyFileFs;
  writeFile: typeof writeFileFs;
  rename: typeof renameFs;
  rm: typeof rmFs;
};

export type InstallVerifiedUpgradeArtifactOptions = {
  installRoot?: string;
  activeVersionPath?: string;
  fs?: UpgradeInstallerFs;
  restartService?: () => Promise<void>;
  now?: () => number;
  pid?: number;
};

const DEFAULT_INSTALL_ROOT = '/opt/luckyplans/edge-agent/releases';
const DEFAULT_ACTIVE_VERSION_PATH = '/opt/luckyplans/edge-agent/active-version';

function sanitizeFileSegment(segment: string): string {
  return segment.trim().replace(/[^a-zA-Z0-9._-]/g, '_');
}

function sanitizeInstallSegment(segment: string): string | null {
  const sanitized = sanitizeFileSegment(segment);
  if (!sanitized || sanitized === '.' || sanitized === '..') {
    return null;
  }

  return sanitized;
}

function isVerifiedUpgradeArtifact(artifact: unknown): artifact is VerifiedUpgradeArtifact {
  if (!artifact || typeof artifact !== 'object') {
    return false;
  }

  const candidate = artifact as Record<string, unknown>;
  if (
    typeof candidate.path !== 'string' ||
    typeof candidate.version !== 'string' ||
    typeof candidate.checksum !== 'string' ||
    typeof candidate.url !== 'string'
  ) {
    return false;
  }

  const safeVersion = sanitizeInstallSegment(candidate.version);
  const safeArtifactName = sanitizeInstallSegment(basename(candidate.path));
  return (
    candidate.path.length > 0 &&
    candidate.version.length > 0 &&
    candidate.checksum.length > 0 &&
    candidate.url.length > 0 &&
    safeVersion !== null &&
    safeArtifactName !== null
  );
}

export async function installVerifiedUpgradeArtifact(
  artifact: unknown,
  options: InstallVerifiedUpgradeArtifactOptions = {},
): Promise<UpgradeInstallResult> {
  if (!isVerifiedUpgradeArtifact(artifact)) {
    throw new Error('Verified upgrade artifact is required for install');
  }

  const installRoot = options.installRoot ?? DEFAULT_INSTALL_ROOT;
  const activeVersionPath = options.activeVersionPath ?? DEFAULT_ACTIVE_VERSION_PATH;
  const fs = options.fs ?? {
    mkdir: mkdirFs,
    copyFile: copyFileFs,
    writeFile: writeFileFs,
    rename: renameFs,
    rm: rmFs,
  };
  const restartService = options.restartService ?? (() => restartEdgeService());
  const now = options.now ?? Date.now;
  const pid = options.pid ?? process.pid;

  const sanitizedVersion = sanitizeInstallSegment(artifact.version);
  const sanitizedArtifactName = sanitizeInstallSegment(basename(artifact.path));
  if (!sanitizedVersion || !sanitizedArtifactName) {
    throw new Error('Verified upgrade artifact is required for install');
  }

  const releaseDir = join(installRoot, sanitizedVersion);
  const stagedArtifactPath = join(releaseDir, sanitizedArtifactName);
  const tempMarkerPath = `${activeVersionPath}.${pid}.${now()}.tmp`;

  await fs.mkdir(releaseDir, { recursive: true });
  await fs.copyFile(artifact.path, stagedArtifactPath);
  await fs.writeFile(tempMarkerPath, `${artifact.version}\n`, 'utf8');

  try {
    await fs.rename(tempMarkerPath, activeVersionPath);
  } catch (error) {
    await fs.rm(tempMarkerPath, { force: true }).catch(() => undefined);
    throw error;
  }

  await restartService();

  return {
    installedVersion: artifact.version,
    releaseDir,
    activeVersionPath,
  };
}
