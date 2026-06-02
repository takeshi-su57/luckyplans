# Edge Upgrade Download Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. For subagents, default routine delegation to `gpt-5.4-mini` per `AGENTS.md`.

**Goal:** Implement EDGE-UPG-007 so the edge agent downloads HTTPS release artifacts, verifies checksum/signature, stages verified files safely, and reports safe failure states without installing or restarting yet.

**Architecture:** Keep `maybeUpgrade` as the state machine and add real artifact handlers beside it. Extend the connectivity client contract to include gateway release metadata, pass that metadata through `runner.ts`, and wire default download/verify handlers from `main.ts`; keep install behavior injected as a no-op/stub for EDGE-UPG-008.

**Tech Stack:** TypeScript, Vitest, Node `crypto`, Node `fs/promises`, global `fetch`, existing edge-agent runner/client modules.

---

## File Map

- Modify: `apps/edge-agent/src/client.ts`
  - Add `EdgeReleaseArtifactMetadata` type.
  - Extend `ConnectivityHeartbeatResponse` with `release?: EdgeReleaseArtifactMetadata | null` and `upgradeMessage?: string | null`.
- Create: `apps/edge-agent/src/upgrade-artifact.ts`
  - Download HTTPS artifact into a staging directory.
  - Verify SHA-256 checksum.
  - Verify Ed25519 signature over the checksum string with configured trust material.
  - Sanitize URLs and errors so signed query strings are not logged or reported.
- Create: `apps/edge-agent/src/upgrade-artifact.spec.ts`
  - Cover success, checksum mismatch, signature mismatch, non-HTTPS rejection, network failure, and URL sanitization.
- Modify: `apps/edge-agent/src/runner.ts`
  - Pass connectivity `release` metadata into upgrade download/verify handlers.
  - Keep install injected/stubbed.
  - Report safe failure reasons via existing `FAILED` status path.
- Modify: `apps/edge-agent/src/runner.spec.ts`
  - Assert release metadata is supplied to handlers.
  - Assert failed download/verification keeps current version and reports safe `FAILED`.
- Modify: `apps/edge-agent/src/main.ts`
  - Build default artifact download/verify handlers from runtime config/env.
  - Add no-op install handler that intentionally leaves install/restart to EDGE-UPG-008.
- Modify: `apps/edge-agent/src/main.spec.ts`
  - Assert `buildRunnerOptions` wires upgrade artifact handlers and trust material.
- Modify: `docs/issues/edge-upg-007-implement-upgrade-download-and-verification-on-edge-agent.md`
  - Mark Done after verification passes.

---

## Task 1: Extend Connectivity Release Metadata Contract

**Files:**
- Modify: `apps/edge-agent/src/client.ts`
- Test: `apps/edge-agent/src/client.spec.ts`

- [ ] **Step 1: Write the failing client contract test**

Add or update a `sendConnectivityHeartbeat` test in `apps/edge-agent/src/client.spec.ts`:

```ts
it('returns release artifact metadata from connectivity heartbeat', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({
      targetVersion: '1.2.3',
      release: {
        version: '1.2.3',
        platform: 'linux',
        arch: 'x64',
        installType: 'service',
        url: 'https://example.com/releases/linux-x64.tgz?token=secret',
        checksum: 'a'.repeat(64),
        signature: 'c2lnbmF0dXJl',
        signatureAlgorithm: 'ed25519',
        signingKeyId: 'main',
        sizeBytes: 1234,
      },
      upgradeMessage: null,
    }),
  }) as never;

  const client = new EdgeApiClient('https://api.example.com', 'worker_1', 'credential_1');

  const result = await client.sendConnectivityHeartbeat({
    activeTask: false,
    currentVersion: '1.0.0',
    deviceNumber: 'edge-test-a1b2c3',
    platform: 'linux',
    arch: 'x64',
  });

  expect(result.release?.url).toBe('https://example.com/releases/linux-x64.tgz?token=secret');
  expect(result.release?.checksum).toBe('a'.repeat(64));
  expect(result.release?.signatureAlgorithm).toBe('ed25519');
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- client.spec.ts
```

Expected: FAIL because `ConnectivityHeartbeatResponse` does not type/model `release` metadata yet.

- [ ] **Step 3: Add the release artifact metadata type**

In `apps/edge-agent/src/client.ts`, add:

```ts
export type EdgeReleaseArtifactMetadata = {
  version: string;
  platform: string;
  arch: string;
  installType: string;
  url: string;
  checksum: string;
  signature: string;
  signatureAlgorithm: string;
  signingKeyId?: string | null;
  sizeBytes?: number | null;
};
```

Then update:

```ts
export type ConnectivityHeartbeatResponse = {
  targetVersion?: string | null;
  release?: EdgeReleaseArtifactMetadata | null;
  upgradeStatus?: UpgradeLifecycleStatus;
  upgradeMessage?: string | null;
};
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- client.spec.ts
```

Expected: PASS.

---

## Task 2: Add Artifact Download and Verification Module

**Files:**
- Create: `apps/edge-agent/src/upgrade-artifact.ts`
- Create: `apps/edge-agent/src/upgrade-artifact.spec.ts`

- [ ] **Step 1: Write failing success test**

Create `apps/edge-agent/src/upgrade-artifact.spec.ts`:

```ts
import { mkdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadAndVerifyUpgradeArtifact } from './upgrade-artifact';
import type { EdgeReleaseArtifactMetadata } from './client';

const tmpRoots: string[] = [];

function makeTempRoot(name: string) {
  const root = join(tmpdir(), `luckyplans-edge-${name}-${Date.now()}-${Math.random()}`);
  tmpRoots.push(root);
  return root;
}

function createSignedRelease(content: string): {
  release: EdgeReleaseArtifactMetadata;
  publicKeyPem: string;
} {
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  const checksum = createHash('sha256').update(content).digest('hex');
  const signature = sign(null, Buffer.from(checksum, 'utf8'), privateKey).toString('base64');

  return {
    publicKeyPem: publicKey.export({ type: 'spki', format: 'pem' }).toString(),
    release: {
      version: '1.2.3',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      url: 'https://downloads.example.com/edge-agent.tgz?token=secret',
      checksum,
      signature,
      signatureAlgorithm: 'ed25519',
      signingKeyId: 'main',
      sizeBytes: Buffer.byteLength(content),
    },
  };
}

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(tmpRoots.map((root) => rm(root, { recursive: true, force: true })));
  tmpRoots.length = 0;
});

describe('downloadAndVerifyUpgradeArtifact', () => {
  it('downloads an HTTPS artifact, verifies checksum and signature, and stages it', async () => {
    const content = 'verified artifact bytes';
    const { release, publicKeyPem } = createSignedRelease(content);
    const stagingDir = makeTempRoot('success');
    await mkdir(stagingDir, { recursive: true });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(Buffer.from(content).buffer),
    }) as never;

    const artifact = await downloadAndVerifyUpgradeArtifact({
      release,
      stagingDir,
      trustedPublicKeyPem: publicKeyPem,
    });

    await expect(readFile(artifact.path, 'utf8')).resolves.toContain(content);
    expect(artifact.version).toBe('1.2.3');
    expect(artifact.checksum).toBe(release.checksum);
    expect(artifact.url).toBe('https://downloads.example.com/edge-agent.tgz');
  });
});
```

- [ ] **Step 2: Run test and verify it fails**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-artifact.spec.ts
```

Expected: FAIL because `upgrade-artifact.ts` does not exist.

- [ ] **Step 3: Implement minimal successful download/checksum/signature path**

Create `apps/edge-agent/src/upgrade-artifact.ts`:

```ts
import { createHash, verify as verifySignature } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import type { EdgeReleaseArtifactMetadata } from './client';

export type VerifiedUpgradeArtifact = {
  path: string;
  version: string;
  checksum: string;
  url: string;
};

export type DownloadAndVerifyUpgradeArtifactInput = {
  release: EdgeReleaseArtifactMetadata;
  stagingDir: string;
  trustedPublicKeyPem: string;
  fetchImpl?: typeof fetch;
};

export async function downloadAndVerifyUpgradeArtifact(
  input: DownloadAndVerifyUpgradeArtifactInput,
): Promise<VerifiedUpgradeArtifact> {
  const safeUrl = sanitizeArtifactUrl(input.release.url);
  const url = new URL(input.release.url);
  if (url.protocol !== 'https:') {
    throw new Error(`Upgrade artifact URL must use HTTPS: ${safeUrl}`);
  }

  const fetchImpl = input.fetchImpl ?? fetch;
  const response = await fetchImpl(input.release.url);
  if (!response.ok) {
    throw new Error(`Upgrade artifact download failed with status ${response.status}: ${safeUrl}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const checksum = createHash('sha256').update(bytes).digest('hex');
  if (checksum.toLowerCase() !== input.release.checksum.toLowerCase()) {
    throw new Error('Upgrade artifact checksum verification failed');
  }

  if (input.release.signatureAlgorithm !== 'ed25519') {
    throw new Error(`Unsupported upgrade signature algorithm: ${input.release.signatureAlgorithm}`);
  }

  const signatureOk = verifySignature(
    null,
    Buffer.from(input.release.checksum, 'utf8'),
    input.trustedPublicKeyPem,
    Buffer.from(input.release.signature, 'base64'),
  );
  if (!signatureOk) {
    throw new Error('Upgrade artifact signature verification failed');
  }

  await mkdir(input.stagingDir, { recursive: true });
  const artifactPath = join(
    input.stagingDir,
    `${input.release.version}-${basename(url.pathname) || 'edge-agent.artifact'}`,
  );
  await writeFile(artifactPath, bytes, { mode: 0o600 });

  return {
    path: artifactPath,
    version: input.release.version,
    checksum,
    url: safeUrl,
  };
}

export function sanitizeArtifactUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return '[invalid-url]';
  }
}
```

- [ ] **Step 4: Run test and verify it passes**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-artifact.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Add failing security/error tests**

Append tests to `upgrade-artifact.spec.ts`:

```ts
it('rejects non-HTTPS artifact URLs before downloading', async () => {
  const { release, publicKeyPem } = createSignedRelease('content');
  const fetchImpl = vi.fn();

  await expect(
    downloadAndVerifyUpgradeArtifact({
      release: { ...release, url: 'http://downloads.example.com/edge-agent.tgz?token=secret' },
      stagingDir: makeTempRoot('http'),
      trustedPublicKeyPem: publicKeyPem,
      fetchImpl: fetchImpl as never,
    }),
  ).rejects.toThrow('must use HTTPS');

  expect(fetchImpl).not.toHaveBeenCalled();
});

it('fails when checksum does not match', async () => {
  const { release, publicKeyPem } = createSignedRelease('expected');
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    arrayBuffer: vi.fn().mockResolvedValue(Buffer.from('tampered').buffer),
  }) as never;

  await expect(
    downloadAndVerifyUpgradeArtifact({
      release,
      stagingDir: makeTempRoot('checksum'),
      trustedPublicKeyPem: publicKeyPem,
    }),
  ).rejects.toThrow('checksum verification failed');
});

it('fails when signature does not match checksum', async () => {
  const good = createSignedRelease('expected');
  const bad = createSignedRelease('other');
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    arrayBuffer: vi.fn().mockResolvedValue(Buffer.from('expected').buffer),
  }) as never;

  await expect(
    downloadAndVerifyUpgradeArtifact({
      release: { ...good.release, signature: bad.release.signature },
      stagingDir: makeTempRoot('signature'),
      trustedPublicKeyPem: good.publicKeyPem,
    }),
  ).rejects.toThrow('signature verification failed');
});

it('reports network failures without leaking signed URL query strings', async () => {
  const { release, publicKeyPem } = createSignedRelease('content');
  global.fetch = vi.fn().mockRejectedValue(new Error('network failed')) as never;

  await expect(
    downloadAndVerifyUpgradeArtifact({
      release,
      stagingDir: makeTempRoot('network'),
      trustedPublicKeyPem: publicKeyPem,
    }),
  ).rejects.not.toThrow('token=secret');
});
```

- [ ] **Step 6: Run test and verify it fails for unhandled network sanitization if needed**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-artifact.spec.ts
```

Expected: FAIL if network errors are not wrapped safely.

- [ ] **Step 7: Wrap download errors with sanitized reason**

Update the fetch section:

```ts
  let response: Response;
  try {
    response = await fetchImpl(input.release.url);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Upgrade artifact download failed for ${safeUrl}: ${reason}`);
  }
```

- [ ] **Step 8: Run test and verify it passes**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-artifact.spec.ts
```

Expected: PASS.

---

## Task 3: Wire Release Metadata Through Runner

**Files:**
- Modify: `apps/edge-agent/src/runner.ts`
- Test: `apps/edge-agent/src/runner.spec.ts`

- [ ] **Step 1: Write failing runner test for release metadata handoff**

Add to `apps/edge-agent/src/runner.spec.ts`:

```ts
it('passes resolved release metadata to upgrade download handler', async () => {
  const release = {
    version: '1.0.1',
    platform: 'linux',
    arch: 'x64',
    installType: 'service',
    url: 'https://example.com/edge.tgz',
    checksum: 'a'.repeat(64),
    signature: 'sig',
    signatureAlgorithm: 'ed25519',
    signingKeyId: 'main',
    sizeBytes: 10,
  };
  const client = createMockClient({
    lease: { success: true, task: null },
    connectivity: { targetVersion: '1.0.1', release },
  });
  const downloadUpgradeArtifact = vi.fn().mockResolvedValue('artifact');

  await runSinglePollExecution(client as never, {
    currentVersion: '1.0.0',
    deviceNumber: 'edge-test-a1b2c3',
    platform: 'linux',
    arch: 'x64',
    downloadUpgradeArtifact,
    verifyUpgradeArtifact: async () => true,
    installUpgradeArtifact: async () => undefined,
  });

  expect(downloadUpgradeArtifact).toHaveBeenCalledWith(release);
});
```

- [ ] **Step 2: Run focused runner test and verify it fails**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- runner.spec.ts
```

Expected: FAIL because `downloadUpgradeArtifact` currently receives no release argument.

- [ ] **Step 3: Update runner handler types and invocation**

In `apps/edge-agent/src/runner.ts`, change imports and options:

```ts
import { EdgeApiClient, type EdgeReleaseArtifactMetadata, type RuntimeState } from './client';

export type RunnerOptions = {
  currentVersion?: string;
  deviceNumber?: string;
  platform?: string;
  arch?: string;
  installType?: string;
  downloadUpgradeArtifact?: (release: EdgeReleaseArtifactMetadata) => Promise<unknown>;
  verifyUpgradeArtifact?: (artifact: unknown, release: EdgeReleaseArtifactMetadata) => Promise<boolean>;
  installUpgradeArtifact?: (artifact: unknown) => Promise<void>;
  runtimeStartedAtMs?: number;
  now?: () => number;
};
```

When sending connectivity heartbeat, include `installType`:

```ts
installType: options.installType,
```

When invoking `maybeUpgrade`, only proceed if `connectivity.release` exists:

```ts
    if (connectivity?.targetVersion) {
      const release = connectivity.release;
      await maybeUpgrade({
        activeTask: hasActiveTask,
        currentVersion,
        targetVersion: connectivity.targetVersion,
        reportStatus: reportUpgradeStatus,
        download: release ? () => options.downloadUpgradeArtifact?.(release) : undefined,
        verify: release ? (artifact) => options.verifyUpgradeArtifact?.(artifact, release) ?? Promise.resolve(false) : undefined,
        install: options.installUpgradeArtifact,
      });
    }
```

- [ ] **Step 4: Run runner tests and verify pass**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- runner.spec.ts
```

Expected: PASS.

---

## Task 4: Wire Default Handlers from Main

**Files:**
- Modify: `apps/edge-agent/src/main.ts`
- Test: `apps/edge-agent/src/main.spec.ts`

- [ ] **Step 1: Write failing main options test**

Update the existing `buildRunnerOptions` test in `apps/edge-agent/src/main.spec.ts` to include trust env:

```ts
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
    EDGE_AGENT_UPGRADE_STAGING_DIR: '/tmp/luckyplans-upgrades',
    EDGE_AGENT_UPGRADE_TRUSTED_PUBLIC_KEY_PEM: '-----BEGIN PUBLIC KEY-----\\nkey\\n-----END PUBLIC KEY-----',
  },
);

expect(options.installType).toBe('service');
expect(options.downloadUpgradeArtifact).toEqual(expect.any(Function));
expect(options.verifyUpgradeArtifact).toEqual(expect.any(Function));
expect(options.installUpgradeArtifact).toEqual(expect.any(Function));
```

- [ ] **Step 2: Run focused test and verify it fails**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- main.spec.ts
```

Expected: FAIL because `buildRunnerOptions` does not accept env/trust configuration or wire handlers.

- [ ] **Step 3: Update `buildRunnerOptions` with default handlers**

In `apps/edge-agent/src/main.ts`, import:

```ts
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { downloadAndVerifyUpgradeArtifact } from './upgrade-artifact';
```

Change signature:

```ts
export function buildRunnerOptions(
  runtimeConfig: EdgeLocalConfig,
  platform: NodeJS.Platform,
  arch: string,
  runtimeStartedAtMs = Date.now(),
  env: NodeJS.ProcessEnv = process.env,
): RunnerOptions {
  const stagingDir = env.EDGE_AGENT_UPGRADE_STAGING_DIR ?? join(tmpdir(), 'luckyplans-edge-upgrades');
  const trustedPublicKeyPem = env.EDGE_AGENT_UPGRADE_TRUSTED_PUBLIC_KEY_PEM;

  return {
    currentVersion: runtimeConfig.currentVersion,
    deviceNumber: runtimeConfig.deviceNumber,
    platform,
    arch,
    installType: 'service',
    runtimeStartedAtMs,
    downloadUpgradeArtifact:
      trustedPublicKeyPem === undefined
        ? undefined
        : (release) =>
            downloadAndVerifyUpgradeArtifact({
              release,
              stagingDir,
              trustedPublicKeyPem,
            }),
    verifyUpgradeArtifact: trustedPublicKeyPem === undefined ? undefined : async () => true,
    installUpgradeArtifact: async () => undefined,
  };
}
```

Rationale: `downloadAndVerifyUpgradeArtifact` performs both download and verification, so the state machine `verify` hook only confirms the artifact returned by the combined handler. EDGE-UPG-008 will replace the no-op install handler.

- [ ] **Step 4: Run focused test and verify it passes**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- main.spec.ts
```

Expected: PASS.

---

## Task 5: Safe Failure Reasons and Issue Closure

**Files:**
- Modify: `apps/edge-agent/src/upgrade.ts`
- Modify: `apps/edge-agent/src/upgrade.spec.ts`
- Modify: `docs/issues/edge-upg-007-implement-upgrade-download-and-verification-on-edge-agent.md`

- [ ] **Step 1: Add failing test for safe failure reason**

Add to `apps/edge-agent/src/upgrade.spec.ts`:

```ts
it('reports sanitized failure reasons from download handlers', async () => {
  const reportStatus = vi.fn();
  const result = await maybeUpgrade({
    activeTask: false,
    currentVersion: '1.0.0',
    targetVersion: '1.0.1',
    reportStatus,
    download: vi.fn().mockRejectedValue(new Error('download failed for https://example.com/a.tgz?token=secret')),
    verify: vi.fn(),
    install: vi.fn(),
  });

  expect(result.reason).not.toContain('token=secret');
  expect(reportStatus).toHaveBeenCalledWith(
    'FAILED',
    expect.objectContaining({ reason: expect.not.stringContaining('token=secret') }),
  );
});
```

- [ ] **Step 2: Run test and verify it fails**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade.spec.ts
```

Expected: FAIL because `maybeUpgrade` currently reports raw error messages.

- [ ] **Step 3: Sanitize upgrade failure reasons**

In `apps/edge-agent/src/upgrade.ts`, add:

```ts
function sanitizeReason(reason: string): string {
  return reason.replace(/https:\/\/[^\s?]+[^\s]*/g, (match) => {
    try {
      const url = new URL(match);
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch {
      return '[redacted-url]';
    }
  });
}
```

Use it in the `catch`:

```ts
    const rawReason = error instanceof Error ? error.message : String(error);
    const reason = sanitizeReason(rawReason);
```

- [ ] **Step 4: Run upgrade tests and verify pass**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Mark EDGE-UPG-007 done**

After all verification passes, update `docs/issues/edge-upg-007-implement-upgrade-download-and-verification-on-edge-agent.md`:

```md
## Status

Closed by implementation.

## Verification

- `pnpm --filter @luckyplans/edge-agent test -- upgrade-artifact.spec.ts upgrade.spec.ts runner.spec.ts main.spec.ts client.spec.ts`
- `pnpm --filter @luckyplans/edge-agent lint`
- `pnpm --filter @luckyplans/edge-agent type-check`
- `pnpm --filter @luckyplans/edge-agent build`
```

---

## Final Verification

- [ ] Run targeted edge-agent tests:

```bash
pnpm --filter @luckyplans/edge-agent test -- upgrade-artifact.spec.ts upgrade.spec.ts runner.spec.ts main.spec.ts client.spec.ts
```

- [ ] Run edge-agent lint:

```bash
pnpm --filter @luckyplans/edge-agent lint
```

- [ ] Run edge-agent type-check:

```bash
pnpm --filter @luckyplans/edge-agent type-check
```

- [ ] Run edge-agent build:

```bash
pnpm --filter @luckyplans/edge-agent build
```

- [ ] Run repository format check:

```bash
pnpm format:check
```

- [ ] Run whitespace check:

```bash
git diff --check
```

---

## Self-Review Notes

- Spec coverage:
  - HTTPS-only download: Task 2.
  - Checksum verification: Task 2.
  - Signature verification with trust material: Task 2 and Task 4.
  - `DOWNLOADING`, `VERIFYING`, `FAILED` reporting: existing `maybeUpgrade` plus Task 3 and Task 5.
  - Current version untouched on failure: existing `maybeUpgrade` tests plus Task 5.
  - Safe logs/reasons: Task 2 network sanitization and Task 5 reason sanitization.
- Out of scope preserved:
  - Install/restart remains no-op/injected in Task 4.
  - Rollback remains untouched for EDGE-UPG-009.
