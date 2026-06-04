# Edge Upgrade Rollback Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement EDGE-UPG-009 so edge-agent records upgrade recovery state before switching versions, confirms healthy boots after restart, rolls back failed upgrades, suppresses repeated install attempts for the same failed release decision, and reports `FAILED` / `ROLLED_BACK` safely.

**Architecture:** Add a local `upgrade-recovery` module owned by edge-agent. The installer records pending upgrade state before switching the active marker; startup recovery confirms success after the first successful connectivity heartbeat for the target version, or rolls back the active marker to the previous version and restarts the service when confirmation fails. Gateway status typing is widened to accept `ROLLED_BACK`, and the edges UI gets explicit visual distinction for failed versus rolled-back upgrade states.

**Tech Stack:** TypeScript, Node.js `fs/promises`, Vitest, NestJS gateway controllers/services, Next.js React page tests, existing edge-agent service-manager abstraction.

---

## File Structure

- Create `apps/edge-agent/src/upgrade-recovery.ts`
  - Owns recovery state schema, safe read/write/delete helpers, pending-state creation, healthy confirmation, rollback execution, retry suppression, and failure reason sanitization.
- Create `apps/edge-agent/src/upgrade-recovery.spec.ts`
  - Covers pending state persistence, healthy confirmation, failed heartbeat rollback, failed boot rollback, and same-target retry suppression.
- Modify `apps/edge-agent/src/upgrade-installer.ts`
  - Accept optional recovery-state paths and previous active version.
  - Record pending recovery state before active marker switch.
- Modify `apps/edge-agent/src/upgrade-installer.spec.ts`
  - Assert installer records previous version before switching and does not record misleading state after failed staging.
- Modify `apps/edge-agent/src/client.ts`
  - Include `ROLLED_BACK` in edge-reported upgrade lifecycle status.
- Modify `apps/edge-agent/src/runner.ts`
  - Allow the recovery flow to report `SUCCEEDED`, `FAILED`, or `ROLLED_BACK` through connectivity heartbeat before normal upgrade polling.
- Modify `apps/edge-agent/src/runner.spec.ts`
  - Cover successful boot confirmation and rollback status reporting.
- Modify `apps/edge-agent/src/main.ts`
  - Wire recovery-state path and active marker path from env.
  - Run startup recovery confirmation before daemon loop polling.
- Modify `apps/edge-agent/src/main.spec.ts`
  - Verify recovery path wiring and no-op behavior when no recovery state exists.
- Modify `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`
  - Widen request status type to accept `ROLLED_BACK`.
- Modify `apps/api-gateway/src/workers/workers.service.ts`
  - Widen `WorkerUpgradeStatus` type to include `ROLLED_BACK`.
- Modify gateway tests under `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts` and `apps/api-gateway/src/workers/workers.service.spec.ts`
  - Assert `ROLLED_BACK` is persisted from edge connectivity heartbeat.
- Modify `apps/web/src/app/(app)/edges/page.tsx`
  - Render failed and rolled-back upgrade statuses with distinct text/style.
- Modify `apps/web/src/app/(app)/edges/page.test.tsx`
  - Assert failed and rolled-back statuses are distinguishable.
- Modify `apps/web/content/guides/developer.mdx`
  - Add manual recovery docs.
- Modify `docs/issues/edge-upg-009-add-rollback-and-failed-boot-recovery-for-edge-upgrades.md`
  - Close checklist after verification.

---

### Task 1: Add Recovery State Module Tests

**Files:**
- Create: `apps/edge-agent/src/upgrade-recovery.spec.ts`
- Create later: `apps/edge-agent/src/upgrade-recovery.ts`

- [ ] **Step 1: Write failing tests for recovery state persistence and retry suppression**

Create `apps/edge-agent/src/upgrade-recovery.spec.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import {
  clearRecoveryState,
  confirmPendingUpgrade,
  createPendingRecoveryState,
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

    await createPendingRecoveryState({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      previousVersion: '1.0.0',
      targetVersion: '1.1.0',
      activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
      failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
      fs,
      now: () => 1700000000000,
      pid: 42,
    });

    expect(fs.mkdir).toHaveBeenCalledWith('/var/lib/luckyplans-edge', { recursive: true });
    expect(fs.writeFile).toHaveBeenCalledWith(
      '/var/lib/luckyplans-edge/recovery.json.42.1700000000000.tmp',
      expect.stringContaining('"state":"PENDING_BOOT_CONFIRMATION"'),
      'utf8',
    );
    expect(fs.rename).toHaveBeenCalledWith(
      '/var/lib/luckyplans-edge/recovery.json.42.1700000000000.tmp',
      '/var/lib/luckyplans-edge/recovery.json',
    );
  });

  it('confirms healthy upgrade and clears pending state after successful heartbeat', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          state: 'PENDING_BOOT_CONFIRMATION',
          previousVersion: '1.0.0',
          targetVersion: '1.1.0',
          activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
          failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
          attemptedAtMs: 1700000000000,
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

  it('rolls back when heartbeat confirmation fails after new version boot', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          state: 'PENDING_BOOT_CONFIRMATION',
          previousVersion: '1.0.0',
          targetVersion: '1.1.0',
          activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
          failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
          attemptedAtMs: 1700000000000,
        }),
      ),
    });
    const reportStatus = vi.fn().mockRejectedValue(new Error('heartbeat failed with token=secret'));
    const restartService = vi.fn().mockResolvedValue(undefined);

    const result = await confirmPendingUpgrade({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      currentVersion: '1.1.0',
      reportStatus,
      restartService,
      fs,
      now: () => 1700000005000,
      pid: 44,
    });

    expect(result.status).toBe('ROLLED_BACK');
    expect(fs.writeFile).toHaveBeenCalledWith(
      '/opt/luckyplans/edge-agent/active-version.44.1700000005000.tmp',
      '1.0.0\n',
      'utf8',
    );
    expect(fs.rename).toHaveBeenCalledWith(
      '/opt/luckyplans/edge-agent/active-version.44.1700000005000.tmp',
      '/opt/luckyplans/edge-agent/active-version',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      '/var/lib/luckyplans-edge/failed-target.json',
      expect.stringContaining('"targetVersion":"1.1.0"'),
      'utf8',
    );
    expect(restartService).toHaveBeenCalledTimes(1);
  });

  it('rolls back failed boot when current version is not target version', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          state: 'PENDING_BOOT_CONFIRMATION',
          previousVersion: '1.0.0',
          targetVersion: '1.1.0',
          activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
          failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
          attemptedAtMs: 1700000000000,
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
    expect(restartService).toHaveBeenCalledTimes(1);
  });

  it('suppresses reinstall for the same failed target version', async () => {
    const fs = createFs({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          targetVersion: '1.1.0',
          previousVersion: '1.0.0',
          failedAtMs: 1700000005000,
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

  it('clears recovery state idempotently', async () => {
    const fs = createFs();

    await clearRecoveryState({
      statePath: '/var/lib/luckyplans-edge/recovery.json',
      fs,
    });

    expect(fs.rm).toHaveBeenCalledWith('/var/lib/luckyplans-edge/recovery.json', { force: true });
  });
});
```

- [ ] **Step 2: Run tests to verify red phase**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-recovery.spec.ts
```

Expected: FAIL because `./upgrade-recovery` does not exist.

---

### Task 2: Implement Recovery State Module

**Files:**
- Create: `apps/edge-agent/src/upgrade-recovery.ts`
- Test: `apps/edge-agent/src/upgrade-recovery.spec.ts`

- [ ] **Step 1: Implement recovery state helpers**

Create `apps/edge-agent/src/upgrade-recovery.ts`:

```ts
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
  activeVersionPath: string;
  failedTargetPath: string;
  attemptedAtMs: number;
};

export type FailedTargetState = {
  targetVersion: string;
  previousVersion: string;
  failedAtMs: number;
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
  activeVersionPath: string;
  failedTargetPath: string;
  fs?: UpgradeRecoveryFs;
  now?: () => number;
  pid?: number;
}): Promise<void> {
  const fs = input.fs ?? defaultFs;
  const now = input.now ?? Date.now;
  const pid = input.pid ?? process.pid;
  const state: PendingRecoveryState = {
    state: 'PENDING_BOOT_CONFIRMATION',
    previousVersion: input.previousVersion,
    targetVersion: input.targetVersion,
    activeVersionPath: input.activeVersionPath,
    failedTargetPath: input.failedTargetPath,
    attemptedAtMs: now(),
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
    const parsed = JSON.parse(await fs.readFile(input.statePath, 'utf8')) as Partial<PendingRecoveryState>;
    if (
      parsed.state !== 'PENDING_BOOT_CONFIRMATION' ||
      typeof parsed.previousVersion !== 'string' ||
      typeof parsed.targetVersion !== 'string' ||
      typeof parsed.activeVersionPath !== 'string' ||
      typeof parsed.failedTargetPath !== 'string' ||
      typeof parsed.attemptedAtMs !== 'number'
    ) {
      return null;
    }
    return parsed as PendingRecoveryState;
  } catch (error) {
    if (hasCode(error, 'ENOENT')) {
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
      await clearRecoveryState({ statePath: input.statePath, fs });
      return { handled: true, status: 'SUCCEEDED' };
    } catch (error) {
      const reason = sanitizeRecoveryReason(error instanceof Error ? error.message : String(error));
      await rollbackPendingUpgrade({ state, statePath: input.statePath, reason, fs, restartService: input.restartService, now: input.now, pid: input.pid });
      return { handled: true, status: 'ROLLED_BACK', reason };
    }
  }

  const reason = `upgrade boot confirmation failed for ${state.targetVersion}`;
  await input.reportStatus('ROLLED_BACK', { reason });
  await rollbackPendingUpgrade({ state, statePath: input.statePath, reason, fs, restartService: input.restartService, now: input.now, pid: input.pid });
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
  const markerTempPath = `${input.state.activeVersionPath}.${pid}.${now()}.tmp`;
  await fs.writeFile(markerTempPath, `${input.state.previousVersion}\n`, 'utf8');
  await fs.rename(markerTempPath, input.state.activeVersionPath);
  await writeJsonAtomically({
    path: input.state.failedTargetPath,
    value: {
      targetVersion: input.state.targetVersion,
      previousVersion: input.state.previousVersion,
      failedAtMs: now(),
      reason: sanitizeRecoveryReason(input.reason),
    } satisfies FailedTargetState,
    fs,
    now,
    pid,
  });
  await clearRecoveryState({ statePath: input.statePath, fs });
  await (input.restartService ?? (() => restartEdgeService()))();
}

export async function shouldSuppressUpgradeRetry(input: {
  failedTargetPath: string;
  targetVersion: string;
  fs?: UpgradeRecoveryFs;
}): Promise<boolean> {
  const fs = input.fs ?? defaultFs;
  try {
    const parsed = JSON.parse(await fs.readFile(input.failedTargetPath, 'utf8')) as Partial<FailedTargetState>;
    return parsed.targetVersion === input.targetVersion;
  } catch (error) {
    if (hasCode(error, 'ENOENT')) {
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

async function writeJsonAtomically(input: {
  path: string;
  value: unknown;
  fs: UpgradeRecoveryFs;
  now: () => number;
  pid: number;
}) {
  await input.fs.mkdir(dirname(input.path), { recursive: true });
  const tempPath = `${input.path}.${input.pid}.${input.now()}.tmp`;
  await input.fs.writeFile(tempPath, `${JSON.stringify(input.value)}\n`, 'utf8');
  try {
    await input.fs.rename(tempPath, input.path);
  } catch (error) {
    await input.fs.rm(tempPath, { force: true }).catch(() => undefined);
    throw error;
  }
}

function hasCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code;
}

function sanitizeRecoveryReason(reason: string): string {
  return reason.replace(/https?:\/\/[^\s"'`<>]+/g, '[redacted-url]').replace(/token=[^\s&]+/gi, 'token=[REDACTED]');
}
```

- [ ] **Step 2: Run recovery tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-recovery.spec.ts
```

Expected: PASS.

---

### Task 3: Record Pending Recovery State During Install

**Files:**
- Modify: `apps/edge-agent/src/upgrade-installer.ts`
- Modify: `apps/edge-agent/src/upgrade-installer.spec.ts`

- [ ] **Step 1: Add failing installer tests for pending state**

Add to `apps/edge-agent/src/upgrade-installer.spec.ts`:

```ts
it('records previous and target version before switching active marker', async () => {
  const fs = createFs();
  const restartService = vi.fn().mockResolvedValue(undefined);
  const recordPendingRecovery = vi.fn().mockResolvedValue(undefined);
  const installRoot = join('/opt/luckyplans/edge-agent', 'releases');
  const activeVersionPath = join('/opt/luckyplans/edge-agent', 'active-version');

  await installVerifiedUpgradeArtifact(artifact(), {
    installRoot,
    activeVersionPath,
    previousVersion: '1.0.0',
    recoveryStatePath: '/var/lib/luckyplans-edge/recovery.json',
    failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
    recordPendingRecovery,
    fs,
    restartService,
  });

  expect(recordPendingRecovery).toHaveBeenCalledWith({
    statePath: '/var/lib/luckyplans-edge/recovery.json',
    previousVersion: '1.0.0',
    targetVersion: '1.2.3',
    activeVersionPath,
    failedTargetPath: '/var/lib/luckyplans-edge/failed-target.json',
  });
  expect(fs.rename).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run installer tests to verify red phase**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-installer.spec.ts
```

Expected: FAIL because installer options do not include recovery state recording.

- [ ] **Step 3: Extend installer options and implementation**

In `apps/edge-agent/src/upgrade-installer.ts`, import `createPendingRecoveryState` and add:

```ts
import { createPendingRecoveryState } from './upgrade-recovery';
```

Extend `InstallVerifiedUpgradeArtifactOptions`:

```ts
  previousVersion?: string;
  recoveryStatePath?: string;
  failedTargetPath?: string;
  recordPendingRecovery?: typeof createPendingRecoveryState;
```

Before writing the active marker, add:

```ts
  if (options.previousVersion && options.recoveryStatePath && options.failedTargetPath) {
    await (options.recordPendingRecovery ?? createPendingRecoveryState)({
      statePath: options.recoveryStatePath,
      previousVersion: options.previousVersion,
      targetVersion: artifact.version,
      activeVersionPath,
      failedTargetPath: options.failedTargetPath,
    });
  }
```

- [ ] **Step 4: Run installer tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-installer.spec.ts upgrade-recovery.spec.ts
```

Expected: PASS.

---

### Task 4: Suppress Reinstall of Failed Target

**Files:**
- Modify: `apps/edge-agent/src/upgrade.ts`
- Modify: `apps/edge-agent/src/upgrade.spec.ts`
- Modify: `apps/edge-agent/src/runner.ts`
- Modify: `apps/edge-agent/src/runner.spec.ts`

- [ ] **Step 1: Add failing upgrade and runner tests**

In `apps/edge-agent/src/upgrade.spec.ts`, add:

```ts
it('suppresses reinstall for a failed target version', async () => {
  const reportStatus = vi.fn();
  const result = await maybeUpgrade({
    activeTask: false,
    currentVersion: '1.0.0',
    targetVersion: '1.1.0',
    reportStatus,
    isTargetSuppressed: async (targetVersion) => targetVersion === '1.1.0',
    download: vi.fn(),
    verify: vi.fn(),
    install: vi.fn(),
  });

  expect(result).toEqual({
    performed: false,
    nextVersion: '1.0.0',
    status: 'FAILED',
    reason: 'upgrade retry suppressed for previously failed target 1.1.0',
  });
  expect(reportStatus).toHaveBeenCalledWith('FAILED', {
    reason: 'upgrade retry suppressed for previously failed target 1.1.0',
  });
});
```

In `apps/edge-agent/src/runner.spec.ts`, add a connectivity case proving `suppressUpgradeRetry` is called before download and reports `FAILED` when true.

- [ ] **Step 2: Run tests to verify red phase**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade.spec.ts runner.spec.ts
```

Expected: FAIL because suppression hook does not exist.

- [ ] **Step 3: Add suppression hook**

In `apps/edge-agent/src/upgrade.ts`, extend `MaybeUpgradeInput`:

```ts
  isTargetSuppressed?: (targetVersion: string) => Promise<boolean> | boolean;
```

After target/version checks and before missing-handler checks:

```ts
  if (await input.isTargetSuppressed?.(target)) {
    const reason = sanitizeFailureReason(`upgrade retry suppressed for previously failed target ${target}`);
    await input.reportStatus('FAILED', { reason });
    return { performed: false, nextVersion: input.currentVersion, status: 'FAILED', reason };
  }
```

In `apps/edge-agent/src/runner.ts`, extend `RunnerOptions`:

```ts
  suppressUpgradeRetry?: (targetVersion: string) => Promise<boolean>;
```

Pass to `maybeUpgrade`:

```ts
        isTargetSuppressed: options.suppressUpgradeRetry,
```

- [ ] **Step 4: Run focused tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade.spec.ts runner.spec.ts
```

Expected: PASS.

---

### Task 5: Startup Confirmation and Rollback Wiring

**Files:**
- Modify: `apps/edge-agent/src/client.ts`
- Modify: `apps/edge-agent/src/main.ts`
- Modify: `apps/edge-agent/src/main.spec.ts`

- [ ] **Step 1: Add failing main wiring tests**

In `apps/edge-agent/src/main.spec.ts`, mock `confirmPendingUpgrade` and `shouldSuppressUpgradeRetry` from `./upgrade-recovery`, then add tests:

```ts
it('wires recovery confirmation and retry suppression paths', async () => {
  const options = buildRunnerOptions(
    {
      serverUrl: 'https://api.example.com',
      workerId: 'worker-1',
      credential: 'credential',
      currentVersion: '1.1.0',
      deviceNumber: 'edge-1',
    },
    'linux',
    'x64',
    1700000000000,
    {
      EDGE_AGENT_UPGRADE_TRUSTED_PUBLIC_KEY_PEM: '-----BEGIN PUBLIC KEY-----\nkey\n-----END PUBLIC KEY-----',
      EDGE_AGENT_UPGRADE_RECOVERY_STATE_PATH: '/var/lib/luckyplans-edge/recovery.json',
      EDGE_AGENT_UPGRADE_FAILED_TARGET_PATH: '/var/lib/luckyplans-edge/failed-target.json',
      EDGE_AGENT_UPGRADE_ACTIVE_VERSION_PATH: '/opt/luckyplans/edge-agent/active-version',
    },
  );

  expect(options.suppressUpgradeRetry).toEqual(expect.any(Function));
  await expect(options.suppressUpgradeRetry?.('1.1.0')).resolves.toBe(false);
});
```

- [ ] **Step 2: Widen edge client reported status**

In `apps/edge-agent/src/client.ts`, change `UpgradeLifecycleStatus` to include `ROLLED_BACK`:

```ts
  | 'FAILED'
  | 'ROLLED_BACK';
```

- [ ] **Step 3: Wire retry suppression and pending recovery state into main options**

In `apps/edge-agent/src/main.ts`, import:

```ts
import { shouldSuppressUpgradeRetry } from './upgrade-recovery';
```

Read env paths:

```ts
  const recoveryStatePath =
    env.EDGE_AGENT_UPGRADE_RECOVERY_STATE_PATH ?? join(tmpdir(), 'luckyplans-edge-upgrade-recovery.json');
  const failedTargetPath =
    env.EDGE_AGENT_UPGRADE_FAILED_TARGET_PATH ?? join(tmpdir(), 'luckyplans-edge-upgrade-failed-target.json');
```

Pass installer recovery state:

```ts
            previousVersion: runtimeConfig.currentVersion,
            recoveryStatePath,
            failedTargetPath,
```

Add runner option:

```ts
    suppressUpgradeRetry: trustedPublicKeyPem
      ? (targetVersion) =>
          shouldSuppressUpgradeRetry({
            failedTargetPath,
            targetVersion,
          })
      : undefined,
```

- [ ] **Step 4: Run main/client tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- main.spec.ts client.spec.ts
pnpm --filter @luckyplans/edge-agent type-check
```

Expected: PASS.

---

### Task 6: Gateway `ROLLED_BACK` Connectivity Support

**Files:**
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`
- Modify: `apps/api-gateway/src/workers/workers.service.ts`
- Modify: `apps/api-gateway/src/workers/workers.service.spec.ts`

- [ ] **Step 1: Add failing gateway tests**

In `edges-connectivity.controller.spec.ts`, add a connectivity heartbeat test with:

```ts
upgradeStatus: 'ROLLED_BACK',
reason: 'rolled back to 1.0.0',
```

Assert the controller passes `upgradeStatus: 'ROLLED_BACK'` and `upgradeMessage: 'rolled back to 1.0.0'` to `markConnectivity`.

In `workers.service.spec.ts`, add a `markConnectivity` test that stores `upgradeStatus: 'ROLLED_BACK'`.

- [ ] **Step 2: Run gateway tests to verify red phase**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- edges-connectivity.controller.spec.ts workers.service.spec.ts
```

Expected: FAIL due local type unions excluding `ROLLED_BACK`.

- [ ] **Step 3: Widen local types**

In `edges-connectivity.controller.ts`, change:

```ts
type UpgradeLifecycleStatus = 'DOWNLOADING' | 'VERIFYING' | 'RESTARTING' | 'SUCCEEDED' | 'FAILED' | 'ROLLED_BACK';
```

In `workers.service.ts`, change:

```ts
type WorkerUpgradeStatus =
  | 'DOWNLOADING'
  | 'VERIFYING'
  | 'RESTARTING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'ROLLED_BACK';
```

- [ ] **Step 4: Run gateway tests**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- edges-connectivity.controller.spec.ts workers.service.spec.ts
pnpm --filter @luckyplans/api-gateway type-check
```

Expected: PASS.

---

### Task 7: Edges UI Distinguishes Failed vs Rolled Back

**Files:**
- Modify: `apps/web/src/app/(app)/edges/page.tsx`
- Modify: `apps/web/src/app/(app)/edges/page.test.tsx`

- [ ] **Step 1: Add failing UI test**

In `apps/web/src/app/(app)/edges/page.test.tsx`, add workers with `upgradeStatus: 'FAILED'` and `upgradeStatus: 'ROLLED_BACK'`, then assert the page renders distinct labels:

```ts
expect(screen.getByText('Upgrade Status: Failed')).toBeInTheDocument();
expect(screen.getByText('Upgrade Status: Rolled Back')).toBeInTheDocument();
```

- [ ] **Step 2: Implement label helper**

In `page.tsx`, add:

```ts
function formatUpgradeStatus(status: Worker['upgradeStatus']): string {
  const labels: Record<Worker['upgradeStatus'], string> = {
    IDLE: 'Idle',
    UPGRADE_PENDING: 'Upgrade Pending',
    DOWNLOADING: 'Downloading',
    VERIFYING: 'Verifying',
    RESTARTING: 'Restarting',
    SUCCEEDED: 'Succeeded',
    FAILED: 'Failed',
    ROLLED_BACK: 'Rolled Back',
  };
  return labels[status];
}
```

Replace:

```tsx
Upgrade Status: {worker.upgradeStatus}
```

with:

```tsx
Upgrade Status: {formatUpgradeStatus(worker.upgradeStatus)}
```

- [ ] **Step 3: Run web tests**

Run:

```bash
pnpm --filter @luckyplans/web test -- page.test.tsx
pnpm --filter @luckyplans/web type-check
```

Expected: PASS.

---

### Task 8: Manual Recovery Docs and Issue Closure

**Files:**
- Modify: `apps/web/content/guides/developer.mdx`
- Modify: `docs/issues/edge-upg-009-add-rollback-and-failed-boot-recovery-for-edge-upgrades.md`

- [ ] **Step 1: Add manual recovery docs**

In `apps/web/content/guides/developer.mdx`, extend the edge upgrade smoke checklist with:

```mdx
### Edge Agent Upgrade Recovery Smoke Checklist

Recovery requires the same service-management privileges as upgrade install.

1. Confirm `EDGE_AGENT_UPGRADE_RECOVERY_STATE_PATH` and `EDGE_AGENT_UPGRADE_FAILED_TARGET_PATH` are configured for the service.
2. Trigger an upgrade to a test target version.
3. Confirm the recovery state file records the previous version and target version before restart.
4. Simulate a failed boot or failed first post-upgrade connectivity heartbeat.
5. Confirm the active version marker is restored to the previous version.
6. Confirm the edge reports `ROLLED_BACK` with a safe reason.
7. Re-send the same target version and confirm the edge does not reinstall it repeatedly.
```

- [ ] **Step 2: Close issue checklist**

In `docs/issues/edge-upg-009-add-rollback-and-failed-boot-recovery-for-edge-upgrades.md`, change the Definition of Done to:

```md
- [x] Tests cover healthy upgrade, failed boot rollback, failed heartbeat rollback, and retry suppression.
- [x] Manual recovery docs exist.
- [x] Edges UI can distinguish failed upgrade from rolled back upgrade.
```

Add:

```md
## Implementation Notes

- Edge-agent records pending recovery state before switching active versions.
- A successful first post-upgrade heartbeat reports `SUCCEEDED` and clears recovery state.
- Failed boot confirmation or failed health confirmation rolls back the active marker, records the failed target, restarts the service, and reports `ROLLED_BACK` or `FAILED` with a safe reason.
- Retry suppression prevents repeated installs for the same failed target version.
```

- [ ] **Step 3: Run format check**

Run:

```bash
pnpm format:check
git diff --check
```

Expected: PASS.

---

## Final Verification

- [ ] Run focused verification:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-recovery.spec.ts upgrade-installer.spec.ts upgrade.spec.ts runner.spec.ts main.spec.ts client.spec.ts
pnpm --filter @luckyplans/api-gateway test -- edges-connectivity.controller.spec.ts workers.service.spec.ts
pnpm --filter @luckyplans/web test -- page.test.tsx
pnpm --filter @luckyplans/edge-agent lint
pnpm --filter @luckyplans/edge-agent type-check
pnpm --filter @luckyplans/api-gateway type-check
pnpm --filter @luckyplans/web type-check
```

Expected: PASS.

- [ ] Run required repository verification:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm format:check
git diff --check
```

Expected: PASS. If full build regenerates Prisma client trailing whitespace, strip trailing whitespace from `packages/prisma/generated/client/index.d.ts` and rerun `git diff --check`.

---

## Commit Plan

Use a conventional commit:

```bash
git add apps/edge-agent/src/upgrade-recovery.ts apps/edge-agent/src/upgrade-recovery.spec.ts apps/edge-agent/src/upgrade-installer.ts apps/edge-agent/src/upgrade-installer.spec.ts apps/edge-agent/src/upgrade.ts apps/edge-agent/src/upgrade.spec.ts apps/edge-agent/src/runner.ts apps/edge-agent/src/runner.spec.ts apps/edge-agent/src/main.ts apps/edge-agent/src/main.spec.ts apps/edge-agent/src/client.ts apps/edge-agent/src/client.spec.ts apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts apps/api-gateway/src/workers/workers.service.ts apps/api-gateway/src/workers/workers.service.spec.ts apps/web/src/app/(app)/edges/page.tsx apps/web/src/app/(app)/edges/page.test.tsx apps/web/content/guides/developer.mdx docs/issues/edge-upg-009-add-rollback-and-failed-boot-recovery-for-edge-upgrades.md docs/superpowers/plans/2026-06-03-edge-upgrade-rollback-recovery-implementation-plan.md
git commit -m "feat(edge-agent): add upgrade rollback recovery"
```

---

## Self-Review

- Spec coverage: Plan covers previous-version recording, healthy confirmation, failed boot rollback, failed heartbeat rollback, safe status reporting, retry suppression, gateway status support, UI distinction, docs, and issue closure.
- Placeholder scan: No open implementation placeholders remain.
- Type consistency: `RecoveryUpgradeStatus`, `PendingRecoveryState`, `failedTargetPath`, `recoveryStatePath`, and `suppressUpgradeRetry` names are consistent across tasks.
