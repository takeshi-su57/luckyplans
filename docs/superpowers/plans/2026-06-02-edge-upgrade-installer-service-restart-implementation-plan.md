# Edge Upgrade Installer Service Restart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement EDGE-UPG-008 so a verified edge-agent upgrade artifact is installed through an updater boundary, switches the active version only after staging succeeds, and restarts the OS service through the existing service manager abstraction.

**Architecture:** Keep the running agent responsible for download and verification, then delegate install/restart to a focused `upgrade-installer` module. The installer stages the verified artifact into a versioned directory, writes an active-version marker only after staging succeeds, and invokes `restartEdgeService`; failed staging leaves the previous active marker unchanged. The current process reports `RESTARTING` before handoff and lets the next boot report `SUCCEEDED`, leaving failed-boot rollback to EDGE-UPG-009.

**Tech Stack:** TypeScript, Node.js `fs/promises`, Vitest, existing edge-agent service manager (`systemctl` / `sc.exe` abstraction), pnpm workspace scripts.

---

## File Structure

- Create `apps/edge-agent/src/upgrade-installer.ts`
  - Owns installer input types, default path resolution, staging copy, active marker switch, service restart handoff, and injectable filesystem/service dependencies for tests.
- Create `apps/edge-agent/src/upgrade-installer.spec.ts`
  - Covers successful staging/switch/restart, failed staging preserving previous active marker, unsupported artifact shape, and restart failure reporting.
- Modify `apps/edge-agent/src/upgrade.ts`
  - Preserve existing download and verify behavior.
  - Change install success semantics so `maybeUpgrade` reports `RESTARTING`, calls `install`, and returns `RESTARTING` without reporting `SUCCEEDED` in the old process.
- Modify `apps/edge-agent/src/upgrade.spec.ts`
  - Update current success expectations and keep failure-before-switch behavior covered.
- Modify `apps/edge-agent/src/main.ts`
  - Wire `installUpgradeArtifact` to `installVerifiedUpgradeArtifact` when the trusted public key is configured.
  - Add optional install root and active marker env vars for deterministic installs and tests.
- Modify `apps/edge-agent/src/main.spec.ts`
  - Assert installer wiring is present only when upgrade trust config is present.
- Modify `apps/edge-agent/src/runner.spec.ts`
  - Update upgrade status expectations from old-process `SUCCEEDED` to `RESTARTING`.
- Modify `docs/issues/edge-upg-008-implement-external-updater-install-and-service-restart.md`
  - Mark implemented checklist items after verification.
- Modify `apps/web/content/guides/developer.mdx`
  - Add manual smoke checklist for Linux and Windows upgrade install/restart privileges.

---

### Task 1: Add Installer Boundary Tests

**Files:**
- Create: `apps/edge-agent/src/upgrade-installer.spec.ts`
- Create later: `apps/edge-agent/src/upgrade-installer.ts`

- [ ] **Step 1: Write failing tests for install staging, switch, and restart**

Create `apps/edge-agent/src/upgrade-installer.spec.ts`:

```ts
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

    const result = await installVerifiedUpgradeArtifact(artifact(), {
      installRoot: '/opt/luckyplans/edge-agent/releases',
      activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
      fs,
      restartService,
      now: () => 1700000000000,
      pid: 42,
    });

    expect(result).toEqual({
      installedVersion: '1.2.3',
      releaseDir: '/opt/luckyplans/edge-agent/releases/1.2.3',
      activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
    });
    expect(fs.mkdir).toHaveBeenCalledWith('/opt/luckyplans/edge-agent/releases/1.2.3', {
      recursive: true,
    });
    expect(fs.copyFile).toHaveBeenCalledWith(
      '/tmp/staged/edge-agent-1.2.3.tgz',
      '/opt/luckyplans/edge-agent/releases/1.2.3/edge-agent-1.2.3.tgz',
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      '/opt/luckyplans/edge-agent/active-version.42.1700000000000.tmp',
      '1.2.3\n',
      'utf8',
    );
    expect(fs.rename).toHaveBeenCalledWith(
      '/opt/luckyplans/edge-agent/active-version.42.1700000000000.tmp',
      '/opt/luckyplans/edge-agent/active-version',
    );
    expect(restartService).toHaveBeenCalledTimes(1);
  });

  it('does not switch active marker or restart service when staging copy fails', async () => {
    const fs = createFs({
      copyFile: vi.fn().mockRejectedValue(new Error('copy failed')),
    });
    const restartService = vi.fn();

    await expect(
      installVerifiedUpgradeArtifact(artifact(), {
        installRoot: '/opt/luckyplans/edge-agent/releases',
        activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
        fs,
        restartService,
      }),
    ).rejects.toThrow('copy failed');

    expect(fs.writeFile).not.toHaveBeenCalled();
    expect(fs.rename).not.toHaveBeenCalled();
    expect(restartService).not.toHaveBeenCalled();
  });

  it('rejects artifacts that are not verified upgrade artifacts', async () => {
    await expect(
      installVerifiedUpgradeArtifact(
        { path: '/tmp/artifact.tgz', version: '1.2.3' },
        {
          installRoot: '/opt/luckyplans/edge-agent/releases',
          activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
          fs: createFs(),
          restartService: vi.fn(),
        },
      ),
    ).rejects.toThrow('Verified upgrade artifact is required for install');
  });

  it('keeps switched active marker when service restart fails', async () => {
    const fs = createFs();
    const restartService = vi.fn().mockRejectedValue(new Error('restart failed'));

    await expect(
      installVerifiedUpgradeArtifact(artifact(), {
        installRoot: '/opt/luckyplans/edge-agent/releases',
        activeVersionPath: '/opt/luckyplans/edge-agent/active-version',
        fs,
        restartService,
      }),
    ).rejects.toThrow('restart failed');

    expect(fs.rename).toHaveBeenCalledTimes(1);
    expect(restartService).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the new test to verify it fails**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-installer.spec.ts
```

Expected: FAIL because `./upgrade-installer` does not exist.

---

### Task 2: Implement Installer Boundary

**Files:**
- Create: `apps/edge-agent/src/upgrade-installer.ts`
- Test: `apps/edge-agent/src/upgrade-installer.spec.ts`

- [ ] **Step 1: Add the installer implementation**

Create `apps/edge-agent/src/upgrade-installer.ts`:

```ts
import { copyFile, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { restartEdgeService } from './service-manager';
import type { VerifiedUpgradeArtifact } from './upgrade-artifact';

export type UpgradeInstallResult = {
  installedVersion: string;
  releaseDir: string;
  activeVersionPath: string;
};

export type UpgradeInstallerFs = {
  mkdir: typeof mkdir;
  copyFile: typeof copyFile;
  writeFile: typeof writeFile;
  rename: typeof rename;
  rm: typeof rm;
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

const defaultFs: UpgradeInstallerFs = {
  mkdir,
  copyFile,
  writeFile,
  rename,
  rm,
};

export async function installVerifiedUpgradeArtifact(
  artifact: unknown,
  options: InstallVerifiedUpgradeArtifactOptions = {},
): Promise<UpgradeInstallResult> {
  const verified = assertVerifiedUpgradeArtifact(artifact);
  const fs = options.fs ?? defaultFs;
  const installRoot = options.installRoot ?? DEFAULT_INSTALL_ROOT;
  const activeVersionPath = options.activeVersionPath ?? DEFAULT_ACTIVE_VERSION_PATH;
  const releaseDir = join(installRoot, sanitizePathSegment(verified.version));
  const artifactName = sanitizePathSegment(basename(verified.path) || 'artifact.bin');
  const releaseArtifactPath = join(releaseDir, artifactName);
  const markerTempPath = `${activeVersionPath}.${options.pid ?? process.pid}.${options.now?.() ?? Date.now()}.tmp`;

  await fs.mkdir(releaseDir, { recursive: true });
  await fs.copyFile(verified.path, releaseArtifactPath);
  await fs.writeFile(markerTempPath, `${verified.version}\n`, 'utf8');
  try {
    await fs.rename(markerTempPath, activeVersionPath);
  } catch (error) {
    await fs.rm(markerTempPath, { force: true }).catch(() => undefined);
    throw error;
  }

  const restartService = options.restartService ?? (() => restartEdgeService());
  await restartService();

  return {
    installedVersion: verified.version,
    releaseDir,
    activeVersionPath,
  };
}

function assertVerifiedUpgradeArtifact(artifact: unknown): VerifiedUpgradeArtifact {
  if (!artifact || typeof artifact !== 'object') {
    throw new Error('Verified upgrade artifact is required for install');
  }
  const candidate = artifact as Partial<VerifiedUpgradeArtifact>;
  if (
    typeof candidate.path !== 'string' ||
    typeof candidate.version !== 'string' ||
    typeof candidate.checksum !== 'string' ||
    typeof candidate.url !== 'string'
  ) {
    throw new Error('Verified upgrade artifact is required for install');
  }
  return candidate as VerifiedUpgradeArtifact;
}

function sanitizePathSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9._-]/g, '_');
}
```

- [ ] **Step 2: Run installer tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-installer.spec.ts
```

Expected: PASS.

---

### Task 3: Update Upgrade Status Semantics

**Files:**
- Modify: `apps/edge-agent/src/upgrade.ts`
- Modify: `apps/edge-agent/src/upgrade.spec.ts`
- Modify: `apps/edge-agent/src/runner.spec.ts`

- [ ] **Step 1: Update tests so old process stops at `RESTARTING`**

In `apps/edge-agent/src/upgrade.spec.ts`, update the install-success test to expect no same-process `SUCCEEDED` report:

```ts
expect(reportStatus).toHaveBeenCalledWith('DOWNLOADING');
expect(reportStatus).toHaveBeenCalledWith('VERIFYING');
expect(reportStatus).toHaveBeenCalledWith('RESTARTING');
expect(reportStatus).not.toHaveBeenCalledWith('SUCCEEDED');
expect(result).toEqual({
  performed: true,
  nextVersion: '1.2.0',
  status: 'RESTARTING',
});
```

In `apps/edge-agent/src/runner.spec.ts`, update the upgrade status assertion for successful install handoff so the captured heartbeat statuses end at `RESTARTING`, not `SUCCEEDED`.

- [ ] **Step 2: Run focused tests to verify failure**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade.spec.ts runner.spec.ts
```

Expected: FAIL because `maybeUpgrade` still reports `SUCCEEDED` after `install`.

- [ ] **Step 3: Change `maybeUpgrade` install handoff behavior**

In `apps/edge-agent/src/upgrade.ts`, replace the successful install block:

```ts
    await input.reportStatus('RESTARTING');
    await input.install(artifact);
    await input.reportStatus('SUCCEEDED');
    return { performed: true, nextVersion: target, status: 'SUCCEEDED' };
```

with:

```ts
    await input.reportStatus('RESTARTING');
    await input.install(artifact);
    return { performed: true, nextVersion: target, status: 'RESTARTING' };
```

- [ ] **Step 4: Run focused tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade.spec.ts runner.spec.ts
```

Expected: PASS.

---

### Task 4: Wire Installer From Main

**Files:**
- Modify: `apps/edge-agent/src/main.ts`
- Modify: `apps/edge-agent/src/main.spec.ts`

- [ ] **Step 1: Write failing main wiring tests**

In `apps/edge-agent/src/main.spec.ts`, update the test that currently expects `installUpgradeArtifact` to be undefined when a trusted key is configured:

```ts
expect(options.installUpgradeArtifact).toEqual(expect.any(Function));
```

Add a test that verifies no install handler is wired without trust config:

```ts
it('does not wire upgrade install handler without trusted public key', () => {
  const options = buildRunnerOptions(
    {
      serverUrl: 'https://api.example.com',
      workerId: 'worker-1',
      credential: 'credential',
      currentVersion: '1.0.0',
      deviceNumber: 'edge-1',
    },
    'linux',
    'x64',
    1700000000000,
    {},
  );

  expect(options.downloadUpgradeArtifact).toBeUndefined();
  expect(options.verifyUpgradeArtifact).toBeUndefined();
  expect(options.installUpgradeArtifact).toBeUndefined();
});
```

- [ ] **Step 2: Run main tests to verify failure**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- main.spec.ts
```

Expected: FAIL because `buildRunnerOptions` does not wire `installUpgradeArtifact`.

- [ ] **Step 3: Wire `installVerifiedUpgradeArtifact` in `buildRunnerOptions`**

In `apps/edge-agent/src/main.ts`, add the import:

```ts
import { installVerifiedUpgradeArtifact } from './upgrade-installer';
```

Then add install path env resolution in `buildRunnerOptions`:

```ts
  const installRoot = env.EDGE_AGENT_UPGRADE_INSTALL_ROOT;
  const activeVersionPath = env.EDGE_AGENT_UPGRADE_ACTIVE_VERSION_PATH;
```

Then add this field to the returned `RunnerOptions` object:

```ts
    installUpgradeArtifact: trustedPublicKeyPem
      ? (artifact) =>
          installVerifiedUpgradeArtifact(artifact, {
            installRoot,
            activeVersionPath,
          })
      : undefined,
```

- [ ] **Step 4: Run main tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- main.spec.ts
```

Expected: PASS.

---

### Task 5: Add Manual Smoke Docs

**Files:**
- Modify: `apps/web/content/guides/developer.mdx`

- [ ] **Step 1: Add Linux and Windows smoke checklist**

Add a concise section near the existing edge-agent service command docs:

```mdx
### Edge Agent Upgrade Install Smoke Checklist

Upgrade install and service restart require the same privileges as service management.

Linux:

- Build the edge-agent package and install the service with `pnpm --filter @luckyplans/edge-agent service:install`.
- Set `EDGE_AGENT_UPGRADE_TRUSTED_PUBLIC_KEY_PEM`, `EDGE_AGENT_UPGRADE_STAGING_DIR`, `EDGE_AGENT_UPGRADE_INSTALL_ROOT`, and `EDGE_AGENT_UPGRADE_ACTIVE_VERSION_PATH` for the service environment.
- Trigger a release decision from the gateway and confirm the edge heartbeat reports `DOWNLOADING`, `VERIFYING`, then `RESTARTING`.
- Confirm `systemctl status luckyplans-edge-agent --no-pager` shows the restarted service.
- Confirm the active version marker contains the target version.

Windows:

- Build the edge-agent package and install the service from an elevated terminal with `pnpm --filter @luckyplans/edge-agent service:install`.
- Set the upgrade trust and path environment variables for the service account.
- Trigger a release decision from the gateway and confirm the edge heartbeat reports `DOWNLOADING`, `VERIFYING`, then `RESTARTING`.
- Confirm `sc.exe query luckyplans-edge-agent` shows the service running after restart.
- Confirm the active version marker contains the target version.
```

- [ ] **Step 2: Run format check on docs**

Run:

```bash
pnpm format:check
```

Expected: PASS, or clear Prettier path output that can be fixed before final verification.

---

### Task 6: Close EDGE-UPG-008 Issue Checklist

**Files:**
- Modify: `docs/issues/edge-upg-008-implement-external-updater-install-and-service-restart.md`

- [ ] **Step 1: Update the Definition of Done**

Replace the unchecked Definition of Done list with:

```md
- [x] Tests cover staging, switch, failed install, and status reporting.
- [x] Manual smoke checklist exists for Linux and Windows.
- [x] Docs explain required privileges.
```

Add an implementation summary:

```md
## Implementation Notes

Implemented a focused edge-agent updater boundary:

- Verified artifacts are staged into a versioned release directory.
- The active version marker is switched only after staging succeeds.
- Service restart is delegated through the existing OS service manager abstraction.
- The running agent reports `RESTARTING` before handoff and leaves `SUCCEEDED` confirmation to the next successful boot.
- Failed staging leaves the previous active marker untouched.
```

- [ ] **Step 2: Run targeted verification**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-installer.spec.ts upgrade.spec.ts runner.spec.ts main.spec.ts service-manager.spec.ts
pnpm --filter @luckyplans/edge-agent lint
pnpm --filter @luckyplans/edge-agent type-check
pnpm --filter @luckyplans/edge-agent build
pnpm format:check
git diff --check
```

Expected: all commands PASS.

---

## Final Verification

- [ ] Run full repository verification required by `AGENTS.md`:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm format:check
```

Expected: all commands PASS.

- [ ] Run a final staged diff check before commit:

```bash
git diff --check
```

Expected: no output.

---

## Commit Plan

Use conventional commits:

```bash
git add apps/edge-agent/src/upgrade-installer.ts apps/edge-agent/src/upgrade-installer.spec.ts apps/edge-agent/src/upgrade.ts apps/edge-agent/src/upgrade.spec.ts apps/edge-agent/src/runner.spec.ts apps/edge-agent/src/main.ts apps/edge-agent/src/main.spec.ts apps/web/content/guides/developer.mdx docs/issues/edge-upg-008-implement-external-updater-install-and-service-restart.md docs/superpowers/plans/2026-06-02-edge-upgrade-installer-service-restart-implementation-plan.md
git commit -m "feat(edge-agent): install verified upgrades"
```

---

## Self-Review

- Spec coverage: The plan covers updater delegation, staging, active switch, service restart, `RESTARTING` status, next-boot `SUCCEEDED` deferral, failed install before switch, tests, smoke docs, and privilege docs.
- Placeholder scan: No `TBD`, `TODO`, or open implementation placeholders remain.
- Type consistency: `VerifiedUpgradeArtifact`, `installVerifiedUpgradeArtifact`, `UpgradeInstallerFs`, and `RunnerOptions.installUpgradeArtifact` names are consistent across tasks.
