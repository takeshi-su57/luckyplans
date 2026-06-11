# Edge Release Publishing Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local and CI release producer for versioned edge-agent Linux and Windows artifacts, checksums, signatures, and gateway-compatible release metadata.

**Architecture:** Add a focused Node.js release builder under `apps/edge-agent/scripts` and expose it through `@luckyplans/edge-agent`. GitHub Actions runs the same command, uploads the artifact set, and optionally publishes release assets. Deployment docs describe the required signing secrets and registration flow.

**Tech Stack:** Node.js ESM, TypeScript build output, Vitest, GitHub Actions, Ed25519 signing via Node `crypto`.

---

## File Structure

- Create `apps/edge-agent/scripts/release-metadata.mjs`: pure helper functions for version validation, artifact naming, checksums, signing, and manifest records.
- Create `apps/edge-agent/scripts/release-metadata.spec.mjs`: Vitest tests for helper behavior.
- Create `apps/edge-agent/scripts/build-release.mjs`: CLI that builds package directories, archives them, signs checksums, and writes manifest files.
- Modify `apps/edge-agent/package.json`: add `release:build` script and include script tests in the package test command.
- Create `.github/workflows/edge-agent-release.yml`: manual/tag workflow for CI release packaging.
- Modify `apps/web/content/guides/deployment.mdx`: document release secrets, local release command, CI workflow, artifact names, and registration steps.

## Task 1: Release Metadata Helpers

**Files:**

- Create: `apps/edge-agent/scripts/release-metadata.spec.mjs`
- Create: `apps/edge-agent/scripts/release-metadata.mjs`

- [ ] **Step 1: Write the failing tests**

```javascript
import { generateKeyPairSync, verify } from 'crypto';
import { describe, expect, it } from 'vitest';
import {
  assertValidVersion,
  buildArtifactName,
  buildArtifactRecord,
  sha256Hex,
  signChecksum,
} from './release-metadata.mjs';

describe('edge release metadata helpers', () => {
  it('builds stable Linux and Windows service artifact names', () => {
    expect(
      buildArtifactName({
        version: '1.2.3',
        platform: 'linux',
        arch: 'x64',
        installType: 'service',
      }),
    ).toBe('luckyplans-edge-agent-v1.2.3-linux-x64-service.tar.gz');
    expect(
      buildArtifactName({
        version: '1.2.3',
        platform: 'win32',
        arch: 'x64',
        installType: 'service',
      }),
    ).toBe('luckyplans-edge-agent-v1.2.3-win32-x64-service.zip');
  });

  it('rejects invalid release versions', () => {
    expect(() => assertValidVersion('latest')).toThrow('Invalid edge release version');
  });

  it('generates sha256 checksums and verifiable Ed25519 signatures', () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    const checksum = sha256Hex(Buffer.from('edge-agent'));
    const signature = signChecksum(
      checksum,
      privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
    );

    expect(checksum).toMatch(/^[a-f0-9]{64}$/);
    expect(
      verify(null, Buffer.from(checksum, 'utf8'), publicKey, Buffer.from(signature, 'base64')),
    ).toBe(true);
  });

  it('builds gateway-compatible artifact metadata records', () => {
    const record = buildArtifactRecord({
      version: '1.2.3',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      baseUrl: 'https://github.com/takeshi-su57/luckyplans/releases/download/edge-agent-v1.2.3',
      checksum: 'a'.repeat(64),
      signature: 'signature',
      signingKeyId: 'edge-release-2026-06',
      sizeBytes: 1234,
    });

    expect(record).toEqual({
      version: '1.2.3',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      url: 'https://github.com/takeshi-su57/luckyplans/releases/download/edge-agent-v1.2.3/luckyplans-edge-agent-v1.2.3-linux-x64-service.tar.gz',
      checksum: 'a'.repeat(64),
      signature: 'signature',
      signatureAlgorithm: 'ed25519',
      signingKeyId: 'edge-release-2026-06',
      sizeBytes: 1234,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @luckyplans/edge-agent test -- release-metadata.spec.mjs`

Expected: FAIL because `release-metadata.mjs` does not exist.

- [ ] **Step 3: Implement helper functions**

Implement `assertValidVersion`, `buildArtifactName`, `sha256Hex`, `signChecksum`, and `buildArtifactRecord` in `apps/edge-agent/scripts/release-metadata.mjs`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @luckyplans/edge-agent test -- release-metadata.spec.mjs`

Expected: PASS.

## Task 2: Release Build CLI

**Files:**

- Create: `apps/edge-agent/scripts/build-release.mjs`
- Modify: `apps/edge-agent/package.json`

- [ ] **Step 1: Write a failing CLI behavior test**

Add a test in `release-metadata.spec.mjs` proving the default supported artifact targets are Linux x64 service and Windows x64 service, using exported target constants.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @luckyplans/edge-agent test -- release-metadata.spec.mjs`

Expected: FAIL because the target constants are missing.

- [ ] **Step 3: Implement CLI**

Create a CLI that parses `--version`, `--base-url`, `--out-dir`, and optional `--signing-key-id`; requires `EDGE_RELEASE_SIGNING_PRIVATE_KEY`; packages `dist`, `package.json`, and a generated README into target archives; computes checksums; signs each checksum; writes `manifest.json` and `SHA256SUMS`.

- [ ] **Step 4: Add package script**

Add `"release:build": "node scripts/build-release.mjs"` to `apps/edge-agent/package.json`.

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @luckyplans/edge-agent test -- release-metadata.spec.mjs`

Expected: PASS.

## Task 3: GitHub Actions Workflow

**Files:**

- Create: `.github/workflows/edge-agent-release.yml`

- [ ] **Step 1: Add workflow**

Create a workflow triggered by `workflow_dispatch` and `push` tags matching `edge-agent-v*`. It checks out the repo, installs pnpm and Node, builds `@luckyplans/edge-agent`, runs `release:build`, uploads release artifacts, and publishes assets to GitHub Releases for tag runs.

- [ ] **Step 2: Verify workflow file formatting**

Run: `pnpm format:check`

Expected: no Prettier errors from modified JSON/JS/docs files. YAML is not covered by the current format script.

## Task 4: Deployment Docs

**Files:**

- Modify: `apps/web/content/guides/deployment.mdx`

- [ ] **Step 1: Update edge release docs**

Replace the existing short edge release registration flow with the concrete local command, CI workflow, required secrets, artifact names, manifest fields, and GraphQL registration guidance.

- [ ] **Step 2: Run docs-adjacent verification**

Run: `pnpm --filter @luckyplans/web type-check`

Expected: PASS.

## Task 5: Final Verification

**Files:**

- All touched files

- [ ] **Step 1: Run edge-agent tests**

Run: `pnpm --filter @luckyplans/edge-agent test`

Expected: PASS.

- [ ] **Step 2: Run required repository gates**

Run:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm format:check
```

Expected: all commands exit 0.

- [ ] **Step 3: Inspect diff**

Run: `git diff -- .github/workflows/edge-agent-release.yml apps/edge-agent apps/web/content/guides/deployment.mdx docs/superpowers/specs/2026-06-05-edge-release-publishing-pipeline-design.md docs/superpowers/plans/2026-06-05-edge-release-publishing-pipeline-implementation-plan.md`

Expected: diff contains only release pipeline, tests, workflow, and docs changes.
