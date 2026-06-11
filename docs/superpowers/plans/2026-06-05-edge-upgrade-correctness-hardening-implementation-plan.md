# Edge Upgrade Correctness Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the accepted REST-polling edge upgrade milestone operationally correct by fixing campaign status propagation, platform-specific artifact registration, daemon shutdown interruption, generated GraphQL drift, stale docs, and quarantine policy.

**Architecture:** Keep edge orchestration in the API gateway and edge-agent. Centralize release/campaign status mapping in `ReleasesService`, preserve legacy GraphQL mutation compatibility, and avoid reintroducing deferred WebSocket or generic artifact-transfer scope.

**Tech Stack:** NestJS, GraphQL code-first, Prisma, Vitest, Next.js, Apollo Client, pnpm workspaces.

---

## File Structure

- Modify `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`: call release campaign status synchronization after heartbeat worker update.
- Modify `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`: regression tests for heartbeat-driven campaign worker status updates.
- Modify `apps/api-gateway/src/workers/releases.service.ts`: add artifact-list input support, per-artifact validation/signature verification, and shared campaign status synchronization.
- Modify `apps/api-gateway/src/workers/releases.service.spec.ts`: release registration and campaign status regression coverage.
- Modify `apps/api-gateway/src/workers/releases.resolver.ts`: add GraphQL input types for artifact registration while preserving legacy mutation args.
- Modify `apps/api-gateway/src/backtest/backtest.service.ts`: apply explicit three-failure quarantine policy.
- Modify `apps/api-gateway/src/backtest/backtest.service.spec.ts`: first, second, and third failure coverage plus success reset coverage if missing.
- Modify `apps/edge-agent/src/daemon.ts`: make `ShutdownSignal` observable and sleep interruptible.
- Modify `apps/edge-agent/src/daemon.spec.ts`: test real sleep interruption.
- Modify `apps/web/src/app/(app)/edges/page.tsx` or web GraphQL codegen source patterns: align `WorkersQuery` with generated artifacts.
- Regenerate `apps/web/src/generated/*`: run web codegen after query alignment.
- Modify `docs/issues/*`, `docs/issues/README.md`, and relevant docs under `apps/web/content`: remove stale temporary planning file links and document quarantine/artifact behavior.

## Task 1: Campaign Status Propagation From Heartbeats

**Files:**

- Modify: `apps/api-gateway/src/workers/releases.service.ts`
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`
- Modify: `apps/api-gateway/src/workers/releases.service.spec.ts`

- [ ] **Step 1: Add a failing service test for campaign synchronization**

Add this test to `apps/api-gateway/src/workers/releases.service.spec.ts` near existing upgrade status tests:

```ts
it('updates active campaign worker status from heartbeat-reported terminal upgrade status', async () => {
  const campaignWorkers = {
    updateMany: vi.fn().mockResolvedValue({ count: 1 }),
  };
  (prisma as unknown as Record<string, unknown>).upgradeCampaignWorker = {
    ...campaignWorkers,
  };

  await service.syncWorkerUpgradeStatusFromHeartbeat('w1', 'SUCCEEDED', undefined);

  expect(prisma.worker.update).not.toHaveBeenCalled();
  expect(campaignWorkers.updateMany).toHaveBeenCalledWith({
    where: { workerId: 'w1', status: 'IN_PROGRESS' },
    data: { status: 'SUCCEEDED' },
  });
});
```

- [ ] **Step 2: Run the focused failing test**

Run: `pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts`

Expected: fail because `syncWorkerUpgradeStatusFromHeartbeat` does not exist.

- [ ] **Step 3: Add shared campaign status mapping**

In `apps/api-gateway/src/workers/releases.service.ts`, add:

```ts
  async syncWorkerUpgradeStatusFromHeartbeat(
    workerId: string,
    status?: WorkerUpgradeStatus,
    message?: string,
  ) {
    if (!status) return;
    this.logger.log(
      `edge.upgrade.heartbeat_status workerId=${workerId} status=${status} hasMessage=${Boolean(message)} messageLength=${message?.length ?? 0}`,
    );
    await this.updateActiveCampaignWorkerStatus(workerId, status);
  }

  private async updateActiveCampaignWorkerStatus(workerId: string, status: WorkerUpgradeStatus) {
    const campaignStatus =
      status === 'SUCCEEDED'
        ? 'SUCCEEDED'
        : status === 'FAILED'
          ? 'FAILED'
          : status === 'ROLLED_BACK'
            ? 'ROLLED_BACK'
            : 'IN_PROGRESS';

    await this.campaignWorkers.updateMany({
      where: { workerId, status: 'IN_PROGRESS' },
      data: { status: campaignStatus },
    });
  }
```

Update `reportWorkerUpgradeStatus` to call `await this.updateActiveCampaignWorkerStatus(workerId, status);` instead of its inline `campaignWorkers.updateMany` block.

- [ ] **Step 4: Wire heartbeat controller to the shared method**

In `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`, after `markConnectivity`, add:

```ts
await this.releasesService.syncWorkerUpgradeStatusFromHeartbeat(
  body.workerId,
  body.upgradeStatus,
  body.reason,
);
```

- [ ] **Step 5: Add controller regression coverage**

In `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`, extend the mocked `releasesService` with:

```ts
syncWorkerUpgradeStatusFromHeartbeat: vi.fn(),
```

Add an assertion in the heartbeat upgrade-status test:

```ts
expect(releasesService.syncWorkerUpgradeStatusFromHeartbeat).toHaveBeenCalledWith(
  'worker_1',
  'DOWNLOADING',
  'download started',
);
```

- [ ] **Step 6: Verify API gateway targeted tests**

Run: `pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts edges-connectivity.controller.spec.ts`

Expected: both spec files pass.

## Task 2: Platform-Specific Release Artifact Registration

**Files:**

- Modify: `apps/api-gateway/src/workers/releases.service.ts`
- Modify: `apps/api-gateway/src/workers/releases.resolver.ts`
- Modify: `apps/api-gateway/src/workers/releases.service.spec.ts`
- Modify: `apps/web/content/guides/deployment.mdx`
- Modify: `docs/issues/edge-upg-010-add-edge-release-publishing-pipeline.md`

- [ ] **Step 1: Add failing service test for distinct artifact metadata**

Add to `apps/api-gateway/src/workers/releases.service.spec.ts`:

```ts
it('creates release artifacts with distinct per-platform checksums and signatures', async () => {
  const linuxChecksum = 'a'.repeat(64);
  const windowsChecksum = 'b'.repeat(64);
  const windowsSignature = sign(
    null,
    Buffer.from(windowsChecksum, 'utf8'),
    signingPrivateKeyPem,
  ).toString('base64');
  const linuxSignature = sign(
    null,
    Buffer.from(linuxChecksum, 'utf8'),
    signingPrivateKeyPem,
  ).toString('base64');
  prisma.edgeRelease.create.mockResolvedValue({
    id: 'release_1',
    version: '1.2.3',
    windowsUrl: 'https://example.com/releases/edge-agent-1.2.3-win32-x64-service.zip',
    linuxUrl: 'https://example.com/releases/edge-agent-1.2.3-linux-x64-service.tar.gz',
    checksum: windowsChecksum,
    signature: windowsSignature,
    signatureAlgorithm: 'ed25519',
    notes: null,
    createdAt: new Date(),
    artifacts: [],
  });

  await service.createRelease({
    version: '1.2.3',
    windowsUrl: 'https://example.com/releases/edge-agent-1.2.3-win32-x64-service.zip',
    linuxUrl: 'https://example.com/releases/edge-agent-1.2.3-linux-x64-service.tar.gz',
    checksum: windowsChecksum,
    signature: windowsSignature,
    artifacts: [
      {
        platform: 'win32',
        arch: 'x64',
        installType: 'service',
        url: 'https://example.com/releases/edge-agent-1.2.3-win32-x64-service.zip',
        checksum: windowsChecksum,
        signature: windowsSignature,
        signatureAlgorithm: 'ed25519',
      },
      {
        platform: 'linux',
        arch: 'x64',
        installType: 'service',
        url: 'https://example.com/releases/edge-agent-1.2.3-linux-x64-service.tar.gz',
        checksum: linuxChecksum,
        signature: linuxSignature,
        signatureAlgorithm: 'ed25519',
      },
    ],
  });

  expect(prisma.edgeRelease.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        artifacts: {
          create: expect.arrayContaining([
            expect.objectContaining({ platform: 'win32', checksum: windowsChecksum }),
            expect.objectContaining({ platform: 'linux', checksum: linuxChecksum }),
          ]),
        },
      }),
    }),
  );
});
```

- [ ] **Step 2: Run the focused failing test**

Run: `pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts`

Expected: fail because `CreateReleaseInput` and `createRelease` ignore `artifacts`.

- [ ] **Step 3: Extend service input and artifact normalization**

In `apps/api-gateway/src/workers/releases.service.ts`, add `artifacts?: Array<...>` to `CreateReleaseInput` if not already present, then build artifact rows with:

```ts
const artifacts = input.artifacts?.length
  ? input.artifacts.map((artifact) => ({
      platform: this.normalizePlatform(artifact.platform),
      arch: artifact.arch.trim().toLowerCase(),
      installType: artifact.installType.trim().toLowerCase(),
      url: artifact.url,
      checksum: artifact.checksum,
      signature: artifact.signature,
      signatureAlgorithm: artifact.signatureAlgorithm ?? signatureAlgorithm,
      signingKeyId: artifact.signingKeyId ?? signingKeyId,
      sizeBytes: artifact.sizeBytes,
    }))
  : [
      {
        platform: 'win32',
        arch: 'x64',
        installType: 'service',
        url: input.windowsUrl,
        checksum: input.checksum,
        signature: input.signature,
        signatureAlgorithm,
        signingKeyId,
      },
      {
        platform: 'linux',
        arch: 'x64',
        installType: 'service',
        url: input.linuxUrl,
        checksum: input.checksum,
        signature: input.signature,
        signatureAlgorithm,
        signingKeyId,
      },
    ];
```

Use `artifacts` in `artifacts.create`.

- [ ] **Step 4: Validate duplicate target tuples**

Add before create:

```ts
const seenArtifactTargets = new Set<string>();
for (const artifact of artifacts) {
  const key = `${artifact.platform}/${artifact.arch}/${artifact.installType}`;
  if (seenArtifactTargets.has(key)) {
    throw new BadRequestException(`Duplicate edge release artifact target: ${key}`);
  }
  seenArtifactTargets.add(key);
  this.validateArtifactMetadata(artifact);
  this.verifyArtifactSignature(artifact);
}
```

Add helper methods that mirror current release validation:

```ts
  private validateArtifactMetadata(input: { checksum: string; signature: string }) {
    if (!/^[a-f0-9]{64}$/i.test(input.checksum)) {
      throw new BadRequestException('Invalid release artifact checksum format');
    }
    if (!input.signature.trim()) {
      throw new BadRequestException('Release artifact signature is required');
    }
  }

  private verifyArtifactSignature(input: { checksum: string; signature: string }) {
    const publicKeyPem = getEnvVar('EDGE_RELEASE_SIGNING_PUBLIC_KEY');
    const key = createPublicKey(publicKeyPem);
    const ok = verifySignature(
      null,
      Buffer.from(input.checksum, 'utf8'),
      key,
      Buffer.from(input.signature, 'base64'),
    );
    if (!ok) {
      throw new BadRequestException('Release artifact signature verification failed');
    }
  }
```

- [ ] **Step 5: Add GraphQL artifact input types**

In `apps/api-gateway/src/workers/releases.resolver.ts`, add `InputType` to the `@nestjs/graphql` import, then add:

```ts
@InputType()
class EdgeReleaseArtifactInput {
  @Field()
  platform!: string;

  @Field()
  arch!: string;

  @Field()
  installType!: string;

  @Field()
  url!: string;

  @Field()
  checksum!: string;

  @Field()
  signature!: string;

  @Field({ nullable: true })
  signatureAlgorithm?: string;

  @Field({ nullable: true })
  signingKeyId?: string;

  @Field(() => Int, { nullable: true })
  sizeBytes?: number;
}
```

Add an optional argument to `createEdgeRelease`:

```ts
@Args('artifacts', { type: () => [EdgeReleaseArtifactInput], nullable: true })
artifacts?: EdgeReleaseArtifactInput[],
```

Pass `artifacts` into `createRelease`.

- [ ] **Step 6: Update deployment docs**

In `apps/web/content/guides/deployment.mdx`, replace the “primary registered artifact” instructions with instructions to pass the manifest artifact array to `createEdgeRelease.artifacts`.

- [ ] **Step 7: Verify API gateway release tests**

Run: `pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts`

Expected: release service tests pass.

## Task 3: Interruptible Edge-Agent Daemon Sleep

**Files:**

- Modify: `apps/edge-agent/src/daemon.ts`
- Modify: `apps/edge-agent/src/daemon.spec.ts`

- [ ] **Step 1: Add failing test for real sleep interruption**

Add to `apps/edge-agent/src/daemon.spec.ts`:

```ts
it('interrupts sleep when shutdown is requested', async () => {
  const shutdown = createShutdownSignal();
  const sleepPromise = sleepWithTimeout(60_000, shutdown);

  shutdown.request('signal');

  await expect(sleepPromise).resolves.toBeUndefined();
});
```

- [ ] **Step 2: Run the focused failing test**

Run: `pnpm --filter @luckyplans/edge-agent test -- daemon.spec.ts`

Expected: fail or hang until the test runner timeout because sleep is not interrupted.

- [ ] **Step 3: Make ShutdownSignal observable**

In `apps/edge-agent/src/daemon.ts`, update the type and factory:

```ts
export type ShutdownSignal = {
  readonly requested: boolean;
  readonly reason?: ShutdownReason | string;
  request: (reason: ShutdownReason | string) => void;
  onRequest: (listener: () => void) => () => void;
};
```

```ts
export function createShutdownSignal(): ShutdownSignal {
  let requested = false;
  let reason: ShutdownReason | string | undefined;
  const listeners = new Set<() => void>();

  return {
    get requested() {
      return requested;
    },
    get reason() {
      return reason;
    },
    request(nextReason) {
      if (requested) return;
      requested = true;
      reason = nextReason;
      for (const listener of [...listeners]) listener();
      listeners.clear();
    },
    onRequest(listener) {
      if (requested) {
        listener();
        return () => undefined;
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
```

- [ ] **Step 4: Use listener cleanup in sleepWithTimeout**

Replace `sleepWithTimeout` with:

```ts
export async function sleepWithTimeout(
  durationMs: number,
  shutdown: ShutdownSignal,
): Promise<void> {
  if (shutdown.requested) return;

  await new Promise<void>((resolve) => {
    let cleanup = () => undefined;
    const finish = () => {
      clearTimeout(timeout);
      cleanup();
      resolve();
    };
    const timeout = setTimeout(finish, durationMs);
    cleanup = shutdown.onRequest(finish);
  });
}
```

- [ ] **Step 5: Verify edge-agent daemon tests**

Run: `pnpm --filter @luckyplans/edge-agent test -- daemon.spec.ts`

Expected: daemon tests pass.

## Task 4: Worker Quarantine Threshold

**Files:**

- Modify: `apps/api-gateway/src/backtest/backtest.service.ts`
- Modify: `apps/api-gateway/src/backtest/backtest.service.spec.ts`
- Modify: `apps/web/content/guides/observability.mdx`

- [ ] **Step 1: Add failing first-failure and third-failure tests**

Add tests to `apps/api-gateway/src/backtest/backtest.service.spec.ts`:

```ts
// First add `findUnique: vi.fn()` to the `worker` mock in this spec file.

it('keeps worker active before quarantine threshold', async () => {
  prisma.backtestTask.findUnique.mockResolvedValue({
    id: 'task_1',
    status: 'PROCESSING',
    assignedWorkerId: 'worker_1',
  });
  prisma.backtestTask.update.mockResolvedValue({ id: 'task_1', status: 'FAILED' });
  prisma.worker.findUnique.mockResolvedValue({ id: 'worker_1', consecutiveFailures: 0 });

  await service.fail('task_1', 'worker_1', 'runtime exploded');

  expect(prisma.worker.update).toHaveBeenCalledWith({
    where: { id: 'worker_1' },
    data: { consecutiveFailures: { increment: 1 } },
  });
});

it('quarantines worker on the third consecutive failure', async () => {
  prisma.backtestTask.findUnique.mockResolvedValue({
    id: 'task_1',
    status: 'PROCESSING',
    assignedWorkerId: 'worker_1',
  });
  prisma.backtestTask.update.mockResolvedValue({ id: 'task_1', status: 'FAILED' });
  prisma.worker.findUnique.mockResolvedValue({ id: 'worker_1', consecutiveFailures: 2 });

  await service.fail('task_1', 'worker_1', 'runtime exploded');

  expect(prisma.worker.update).toHaveBeenCalledWith({
    where: { id: 'worker_1' },
    data: {
      consecutiveFailures: { increment: 1 },
      status: 'QUARANTINED',
      quarantinedAt: expect.any(Date),
    },
  });
});
```

- [ ] **Step 2: Run the focused failing test**

Run: `pnpm --filter @luckyplans/api-gateway test -- backtest.service.spec.ts`

Expected: first-failure test fails because current implementation quarantines immediately.

- [ ] **Step 3: Implement threshold logic**

In `apps/api-gateway/src/backtest/backtest.service.ts`, before updating the worker, load the worker:

```ts
const worker = await this.prisma.worker.findUnique({
  where: { id: workerId },
  select: { consecutiveFailures: true },
});
const nextFailureCount = (worker?.consecutiveFailures ?? 0) + 1;
const shouldQuarantine = nextFailureCount >= 3;
```

Replace the worker update data with:

```ts
      data: shouldQuarantine
        ? {
            consecutiveFailures: { increment: 1 },
            status: 'QUARANTINED',
            quarantinedAt: new Date(),
          }
        : {
            consecutiveFailures: { increment: 1 },
          },
```

- [ ] **Step 4: Verify success reset still exists or add it**

If `complete()` does not reset worker failures, add:

```ts
await this.prisma.worker.update({
  where: { id: workerId },
  data: { consecutiveFailures: 0 },
});
```

after successful task completion.

- [ ] **Step 5: Verify backtest tests**

Run: `pnpm --filter @luckyplans/api-gateway test -- backtest.service.spec.ts`

Expected: backtest service tests pass.

## Task 5: Web GraphQL Codegen Synchronization

**Files:**

- Modify: `apps/web/src/app/(app)/edges/page.tsx`
- Regenerate: `apps/web/src/generated/gql.ts`
- Regenerate: `apps/web/src/generated/graphql.ts`

- [ ] **Step 1: Confirm generated query is stale**

Run: `rg -n "runtimeState|connectivityStatus|activeTaskId|uptimeSeconds|lastError" apps/web/src/generated`

Expected before fix: generated `WorkersQuery` does not include all runtime-health fields used by the edges page.

- [ ] **Step 2: Run web codegen**

Run: `pnpm --filter @luckyplans/web codegen`

Expected: generated artifacts are updated. If the inline `gql` query is not discovered, migrate the operation to the repository's existing codegen-discovered pattern and run codegen again.

- [ ] **Step 3: Verify generated query includes runtime fields**

Run: `rg -n "runtimeState|connectivityStatus|activeTaskId|uptimeSeconds|lastError" apps/web/src/generated`

Expected: generated files include all five fields.

- [ ] **Step 4: Run web tests**

Run: `pnpm --filter @luckyplans/web test`

Expected: web tests pass.

## Task 6: Documentation Cleanup

**Files:**

- Modify: `docs/issues/edge-upg-001-audit-current-edge-lifecycle-contracts-against-temp-specs.md`
- Modify: `docs/issues/edge-upg-001-current-state-audit.md`
- Modify: `docs/issues/edge-upg-013-decide-whether-websocket-sessions-are-needed.md`
- Modify: `docs/issues/edge-upg-014-global-verification-and-documentation-sync.md`
- Modify: `docs/issues/deferred-edge-task-artifact-transfer.md`
- Modify: `docs/issues/deferred-edge-websocket-sessions.md`
- Modify: `docs/issues/edge-upg-010-add-edge-release-publishing-pipeline.md`
- Modify: `docs/issues/README.md`

- [ ] **Step 1: Find stale temp references**

Run: `rg -n "temp specs now|new\\.md|temporary planning files" docs/issues apps/web/content`

Expected: references exist before cleanup.

- [ ] **Step 2: Replace deleted file links with active references**

Use this wording where issue docs currently link to deleted temp files:

```md
Historical temp specs were removed after the accepted issue chain and ADRs superseded them. Use the active `EDGE-UPG-*` issues, deferred follow-up issues, and architecture decisions under `apps/web/content/architecture/decisions` as the source of truth.
```

- [ ] **Step 3: Update issue 014 documentation sync**

In `docs/issues/edge-upg-014-global-verification-and-documentation-sync.md`, replace the deleted-file bullet list with:

```md
- The temporary edge architecture drafts were superseded by this issue chain and later removed because they were temporary planning material.
- Active docs now point to the REST polling implementation, release publishing flow, observability runbooks, WebSocket deferral ADR, and task artifact transfer deferral ADR.
```

- [ ] **Step 4: Update issue 010 DoD after artifact fix**

When Task 2 is implemented, set:

```md
- [x] CI job or documented local release command exists.
- [x] Generated artifact naming matches gateway release metadata expectations.
- [x] Docs include release creation and registration steps.
```

- [ ] **Step 5: Verify stale references are gone**

Run: `rg -n "temporary planning files|temp specs now|new\\.md" docs/issues apps/web/content`

Expected: no direct links to deleted temporary planning files remain.

## Task 7: Full Verification

**Files:**

- No source edits unless verification reveals a failure.

- [ ] **Step 1: Run targeted package tests**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test
pnpm --filter @luckyplans/edge-agent test
pnpm --filter @luckyplans/web test
```

Expected: all targeted tests pass.

- [ ] **Step 2: Run repository verification**

Run:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm format:check
```

Expected: each command exits 0.

- [ ] **Step 3: Capture verification in issue 015**

Append a verification table to `docs/issues/edge-upg-015-post-milestone-edge-upgrade-correctness-hardening.md`:

```md
## Verification Output

| Command                                      | Result    |
| -------------------------------------------- | --------- |
| `pnpm --filter @luckyplans/api-gateway test` | Pass: ... |
| `pnpm --filter @luckyplans/edge-agent test`  | Pass: ... |
| `pnpm --filter @luckyplans/web test`         | Pass: ... |
| `pnpm lint`                                  | Pass: ... |
| `pnpm type-check`                            | Pass: ... |
| `pnpm build`                                 | Pass: ... |
| `pnpm format:check`                          | Pass: ... |
```

## Self-Review

- Spec coverage: every requirement in `2026-06-05-edge-upgrade-correctness-hardening-design.md` maps to Tasks 1 through 7.
- Placeholder scan: no task uses TBD/TODO/fill-in language; verification commands and expected outcomes are explicit.
- Type consistency: campaign status names use existing `WorkerUpgradeStatus` and `UpgradeCampaignWorkerStatus` values; artifact metadata names match `EdgeReleaseArtifact`; daemon API uses `ShutdownSignal`.
