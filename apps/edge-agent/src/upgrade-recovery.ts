import {
  mkdir as mkdirFs,
  readFile as readFileFs,
  rename as renameFs,
  rm as rmFs,
  writeFile as writeFileFs,
} from 'node:fs/promises';
import { dirname } from 'node:path';
import { restartEdgeService } from './service-manager';
import type { UpgradeStatus } from './upgrade';

export type RecoveryUpgradeStatus = UpgradeStatus | 'ROLLED_BACK';

export type PendingRecoveryState = {
  state: 'PENDING_BOOT_CONFIRMATION';
  previousVersion: string;
  targetVersion: string;
  releaseDir: string;
  activeVersionPath: string;
  failedTargetPath: string;
  attemptedAtMs: number;
  attemptId: string;
};

export type FailedTargetState = {
  targetVersion: string;
  previousVersion: string;
  releaseDir: string;
  failedAtMs: number;
  attemptId: string;
  reason: string;
};

export type UpgradeRecoveryFs = {
  readFile: typeof readFileFs;
  writeFile: typeof writeFileFs;
  rename: typeof renameFs;
  rm: typeof rmFs;
  mkdir: typeof mkdirFs;
};

export type RecoveryReportStatus = (
  status: RecoveryUpgradeStatus,
  details?: { reason?: string },
) => Promise<void> | void;

const defaultFs: UpgradeRecoveryFs = {
  readFile: readFileFs,
  writeFile: writeFileFs,
  rename: renameFs,
  rm: rmFs,
  mkdir: mkdirFs,
};

export async function createPendingRecoveryState(input: {
  statePath: string;
  previousVersion: string;
  targetVersion: string;
  releaseDir: string;
  activeVersionPath: string;
  failedTargetPath: string;
  attemptId?: string;
  fs?: UpgradeRecoveryFs;
  now?: () => number;
  pid?: number;
}): Promise<void> {
  const fs = input.fs ?? defaultFs;
  const now = input.now ?? Date.now;
  const pid = input.pid ?? process.pid;
  const attemptedAtMs = now();
  const state: PendingRecoveryState = {
    state: 'PENDING_BOOT_CONFIRMATION',
    previousVersion: input.previousVersion,
    targetVersion: input.targetVersion,
    releaseDir: input.releaseDir,
    activeVersionPath: input.activeVersionPath,
    failedTargetPath: input.failedTargetPath,
    attemptedAtMs,
    attemptId: input.attemptId ?? `${pid}-${attemptedAtMs}`,
  };

  await fs.mkdir(dirname(input.statePath), { recursive: true });
  await writeJsonAtomically({
    path: input.statePath,
    value: state,
    fs,
    now,
    pid,
  });
}

export async function readPendingRecoveryState(input: {
  statePath: string;
  fs?: UpgradeRecoveryFs;
}): Promise<PendingRecoveryState | null> {
  const fs = input.fs ?? defaultFs;

  try {
    const raw = await fs.readFile(input.statePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PendingRecoveryState>;
    if (!isPendingRecoveryState(parsed)) {
      return null;
    }
    return parsed;
  } catch (error) {
    if (hasCode(error, 'ENOENT') || error instanceof SyntaxError) {
      return null;
    }
    throw error;
  }
}

export async function confirmPendingUpgrade(input: {
  statePath: string;
  currentVersion: string;
  reportStatus: RecoveryReportStatus;
  fs?: UpgradeRecoveryFs;
  restartService?: () => Promise<void>;
  now?: () => number;
  pid?: number;
}): Promise<{ handled: boolean; status?: RecoveryUpgradeStatus; reason?: string }> {
  const fs = input.fs ?? defaultFs;
  const state = await readPendingRecoveryState({ statePath: input.statePath, fs });

  if (!state) {
    return { handled: false };
  }

  if (input.currentVersion === state.targetVersion) {
    try {
      await input.reportStatus('SUCCEEDED');
    } catch (error) {
      const reason = sanitizeRecoveryReason(error instanceof Error ? error.message : String(error));
      return { handled: true, status: 'SUCCEEDED', reason };
    }

    try {
      await clearRecoveryState({ statePath: input.statePath, fs });
      return { handled: true, status: 'SUCCEEDED' };
    } catch (error) {
      const reason = sanitizeRecoveryReason(error instanceof Error ? error.message : String(error));
      return { handled: true, status: 'SUCCEEDED', reason };
    }
  }

  const reason = sanitizeRecoveryReason(
    `upgrade boot confirmation failed for ${state.targetVersion}`,
  );
  await reportRollbackStatus(input.reportStatus, reason);
  await rollbackPendingUpgrade({
    state,
    statePath: input.statePath,
    reason,
    fs,
    restartService: input.restartService,
    now: input.now,
    pid: input.pid,
  });

  return { handled: true, status: 'ROLLED_BACK', reason };
}

export async function rollbackPendingUpgrade(input: {
  state: PendingRecoveryState;
  statePath: string;
  reason: string;
  fs?: UpgradeRecoveryFs;
  restartService?: () => Promise<void>;
  now?: () => number;
  pid?: number;
}): Promise<void> {
  const fs = input.fs ?? defaultFs;
  const now = input.now ?? Date.now;
  const pid = input.pid ?? process.pid;
  const failedAtMs = now();
  const sanitizedReason = sanitizeRecoveryReason(input.reason);
  const markerTempPath = `${input.state.activeVersionPath}.${pid}.${failedAtMs}.tmp`;

  await fs.writeFile(markerTempPath, `${input.state.previousVersion}\n`, 'utf8');
  await fs.rename(markerTempPath, input.state.activeVersionPath);

  await fs.mkdir(dirname(input.state.failedTargetPath), { recursive: true });
  await writeJsonAtomically({
    path: input.state.failedTargetPath,
    value: {
      targetVersion: input.state.targetVersion,
      previousVersion: input.state.previousVersion,
      releaseDir: input.state.releaseDir,
      failedAtMs,
      attemptId: input.state.attemptId,
      reason: sanitizedReason,
    } satisfies FailedTargetState,
    fs,
    now: () => failedAtMs,
    pid,
  });

  // Preserve a final sanitized snapshot briefly so callers never persist the raw failure text.
  await fs.writeFile(
    input.statePath,
    `${JSON.stringify({
      ...input.state,
      reason: sanitizedReason,
    })}\n`,
    'utf8',
  );

  await (input.restartService ?? restartEdgeService)();
  await clearRecoveryState({ statePath: input.statePath, fs });
}

export async function shouldSuppressUpgradeRetry(input: {
  failedTargetPath: string;
  targetVersion: string;
  attemptId?: string;
  fs?: UpgradeRecoveryFs;
}): Promise<boolean> {
  const fs = input.fs ?? defaultFs;

  try {
    const raw = await fs.readFile(input.failedTargetPath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<FailedTargetState>;
    if (!isFailedTargetState(parsed) || parsed.targetVersion !== input.targetVersion) {
      return false;
    }
    return input.attemptId ? parsed.attemptId === input.attemptId : true;
  } catch (error) {
    if (hasCode(error, 'ENOENT') || error instanceof SyntaxError) {
      return false;
    }
    throw error;
  }
}

export async function clearRecoveryState(input: {
  statePath: string;
  fs?: UpgradeRecoveryFs;
}): Promise<void> {
  await (input.fs ?? defaultFs).rm(input.statePath, { force: true });
}

function isPendingRecoveryState(
  value: Partial<PendingRecoveryState>,
): value is PendingRecoveryState {
  return (
    value.state === 'PENDING_BOOT_CONFIRMATION' &&
    typeof value.previousVersion === 'string' &&
    typeof value.releaseDir === 'string' &&
    typeof value.targetVersion === 'string' &&
    typeof value.activeVersionPath === 'string' &&
    typeof value.failedTargetPath === 'string' &&
    typeof value.attemptedAtMs === 'number' &&
    typeof value.attemptId === 'string'
  );
}

function isFailedTargetState(value: Partial<FailedTargetState>): value is FailedTargetState {
  return (
    typeof value.targetVersion === 'string' &&
    typeof value.previousVersion === 'string' &&
    typeof value.releaseDir === 'string' &&
    typeof value.failedAtMs === 'number' &&
    typeof value.attemptId === 'string' &&
    typeof value.reason === 'string'
  );
}

async function writeJsonAtomically(input: {
  path: string;
  value: unknown;
  fs: UpgradeRecoveryFs;
  now: () => number;
  pid: number;
}): Promise<void> {
  const tempPath = `${input.path}.${input.pid}.${input.now()}.tmp`;
  await input.fs.writeFile(tempPath, `${JSON.stringify(input.value)}\n`, 'utf8');
  try {
    await input.fs.rename(tempPath, input.path);
  } catch (error) {
    await input.fs.rm(tempPath, { force: true }).catch(() => undefined);
    throw error;
  }
}

async function reportRollbackStatus(
  reportStatus: RecoveryReportStatus,
  reason: string,
): Promise<void> {
  try {
    await reportStatus('ROLLED_BACK', { reason });
  } catch {
    // Rollback still needs to complete even if reporting is unavailable.
  }
}

function hasCode(error: unknown, code: string): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
}

function sanitizeRecoveryReason(reason: string): string {
  const secretSanitized = reason
    .replace(/\btoken=[^\s&"'`<>]+/gi, 'token=[REDACTED]')
    .replace(/\bpassword=[^\s&"'`<>]+/gi, 'password=[REDACTED]')
    .replace(/\bapiKey=[^\s&"'`<>]+/gi, 'apiKey=[REDACTED]')
    .replace(/\bsecret=[^\s&"'`<>]+/gi, 'secret=[REDACTED]')
    .replace(/Authorization:\s*Bearer\s+[^\s"'`<>]+/gi, 'Authorization: Bearer [REDACTED]')
    .replace(/\bBearer\s+(?!\[REDACTED\]\b)[^\s"'`<>]+/gi, 'Bearer [REDACTED]');
  return secretSanitized.replace(/https?:\/\/[^\s"'`<>]+/gi, (value) => {
    const withHiddenCredentials = value.replace(/(https?:\/\/)[^/?#\s"'`<>@]+@/i, '$1');
    try {
      const url = new URL(withHiddenCredentials);
      url.username = '';
      url.password = '';
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch {
      return withHiddenCredentials.replace(/[?#].*$/, '');
    }
  });
}
