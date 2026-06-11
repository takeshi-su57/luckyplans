# Edge Release Metadata Resolution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make edge upgrade release lookup deterministic by resolving artifacts by target version, platform, architecture, and install type.

**Architecture:** Keep `EdgeRelease` as the version-level release record and add platform-specific artifact metadata as child rows. Move heartbeat release lookup out of `EdgesConnectivityController` and into `ReleasesService`, so compatibility logic, platform normalization, and clear missing-artifact messages live in one gateway service.

**Tech Stack:** NestJS API gateway, Prisma/PostgreSQL, Vitest, code-first GraphQL, existing edge connectivity REST endpoint.

---

## Scope

Implements `EDGE-UPG-006`.

In scope:

- Add safe Prisma schema support for platform-specific release artifacts.
- Preserve existing `edge_releases` rows and backfill default Linux/Windows artifacts.
- Resolve upgrade artifacts by version, platform, arch, and install type.
- Return no artifact plus a clear upgrade message for missing/incompatible artifacts.
- Keep release management inside the API gateway workers module.
- Cover Linux, Windows, unsupported arch, missing release, and checksum/signature metadata.

Out of scope:

- Downloading or verifying artifacts on edge-agent (`EDGE-UPG-007`).
- Installing or restarting OS services (`EDGE-UPG-008`).
- Release publishing pipeline (`EDGE-UPG-010`).
- New microservice creation.

## Current State

- `Worker` already stores `platform`, `arch`, `targetVersion`, `upgradeStatus`, and `upgradeMessage`.
- `EdgesConnectivityController` accepts heartbeat `platform` and `arch`, but performs release lookup inline by version only.
- `EdgeRelease` currently stores `windowsUrl`, `linuxUrl`, one checksum, one signature, and optional signing key.
- `ReleasesService.getReleaseForWorkerTarget(workerId)` currently returns any release matching `worker.targetVersion`, without platform/arch filtering.

## Target Contract

For heartbeat response, keep the top-level `targetVersion`, `upgradeStatus`, and `upgradeMessage` shape. Replace version-only release metadata with a selected artifact:

```ts
type EdgeUpgradeArtifactMetadata = {
  version: string;
  url: string;
  checksum: string;
  signature: string;
  signatureAlgorithm: string;
  signingKeyId?: string | null;
  sizeBytes?: number | null;
  platform: string;
  arch: string;
  installType: string;
};
```

When no compatible artifact exists, return `release: null` and a message such as:

```ts
`No compatible edge release artifact found for 1.2.3 on linux/x64/service`
```

## File Map

- Modify: `packages/prisma/prisma/schema.prisma`
  - Add `EdgeReleaseArtifact`.
  - Add `artifacts` relation to `EdgeRelease`.
- Create: `packages/prisma/prisma/migrations/<generated_timestamp>_add_edge_release_artifacts/migration.sql`
  - Add table/indexes.
  - Backfill artifacts from existing `windowsUrl` and `linuxUrl`.
- Modify: `apps/api-gateway/src/workers/releases.service.ts`
  - Add artifact types, normalization helpers, and platform-specific lookup.
  - Keep legacy release creation working by creating default artifacts.
- Modify: `apps/api-gateway/src/workers/releases.service.spec.ts`
  - Add TDD coverage for artifact lookup.
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`
  - Delegate release lookup to `ReleasesService`.
  - Include clear missing/incompatible release messages.
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`
  - Update heartbeat tests for selected artifact metadata.
- Modify: `apps/api-gateway/src/edges-internal/edges-internal.module.ts`
  - Ensure `ReleasesService` is injectable by the connectivity controller if not already available through module imports.
- Modify: `docs/issues/edge-upg-006-harden-release-metadata-resolution-for-platform-specific-upgrades.md`
  - Add outcome and verification notes after implementation.

## Prisma Safety

Use a nullable/default-first additive migration. Do not remove existing `windowsUrl`, `linuxUrl`, `checksum`, or `signature` in this issue.

Add a new table instead of changing existing required release columns:

```prisma
model EdgeRelease {
  id                 String                @id @default(cuid())
  version            String                @unique
  windowsUrl         String
  linuxUrl           String
  checksum           String
  signature          String
  signatureAlgorithm String                @default("ed25519")
  signingKeyId       String?
  notes              String?
  createdAt          DateTime              @default(now())
  updatedAt          DateTime              @updatedAt
  artifacts          EdgeReleaseArtifact[]

  @@map("edge_releases")
}

model EdgeReleaseArtifact {
  id                 String      @id @default(cuid())
  releaseId          String
  release            EdgeRelease @relation(fields: [releaseId], references: [id], onDelete: Cascade)
  platform           String
  arch               String
  installType        String      @default("service")
  url                String
  checksum           String
  signature          String
  signatureAlgorithm String      @default("ed25519")
  signingKeyId       String?
  sizeBytes          BigInt?
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  @@unique([releaseId, platform, arch, installType])
  @@index([platform, arch, installType])
  @@map("edge_release_artifacts")
}
```

Backfill existing rows in `migration.sql`:

```sql
INSERT INTO "edge_release_artifacts" (
  "id",
  "releaseId",
  "platform",
  "arch",
  "installType",
  "url",
  "checksum",
  "signature",
  "signatureAlgorithm",
  "signingKeyId",
  "createdAt",
  "updatedAt"
)
SELECT
  concat('era_', replace(gen_random_uuid()::text, '-', '')),
  "id",
  'win32',
  'x64',
  'service',
  "windowsUrl",
  "checksum",
  "signature",
  "signatureAlgorithm",
  "signingKeyId",
  now(),
  now()
FROM "edge_releases"
WHERE "windowsUrl" IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO "edge_release_artifacts" (
  "id",
  "releaseId",
  "platform",
  "arch",
  "installType",
  "url",
  "checksum",
  "signature",
  "signatureAlgorithm",
  "signingKeyId",
  "createdAt",
  "updatedAt"
)
SELECT
  concat('era_', replace(gen_random_uuid()::text, '-', '')),
  "id",
  'linux',
  'x64',
  'service',
  "linuxUrl",
  "checksum",
  "signature",
  "signatureAlgorithm",
  "signingKeyId",
  now(),
  now()
FROM "edge_releases"
WHERE "linuxUrl" IS NOT NULL
ON CONFLICT DO NOTHING;
```

Before committing the migration, run it locally. If PostgreSQL reports that `gen_random_uuid()` is unavailable, add `CREATE EXTENSION IF NOT EXISTS "pgcrypto";` at the top of the migration and rerun the migration from a fresh local database state.

## Task 1: Add Release Artifact Lookup Tests

**Files:**

- Modify: `apps/api-gateway/src/workers/releases.service.spec.ts`

- [ ] **Step 1: Extend Prisma mock with artifact relation behavior**

Update the test mock near the top of `releases.service.spec.ts`:

```ts
const prisma = {
  edgeRelease: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
  edgeReleaseArtifact: {
    findFirst: vi.fn(),
  },
  worker: {
    updateMany: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
};
```

- [ ] **Step 2: Write failing Linux artifact lookup test**

Append to the `ReleasesService` describe block:

```ts
it('returns Linux x64 service artifact metadata for a worker target version', async () => {
  prisma.worker.findUnique.mockResolvedValue({
    id: 'worker_1',
    targetVersion: '1.2.3',
    platform: 'linux',
    arch: 'x64',
  });
  prisma.edgeReleaseArtifact.findFirst.mockResolvedValue({
    release: { version: '1.2.3', notes: null },
    platform: 'linux',
    arch: 'x64',
    installType: 'service',
    url: 'https://example.com/releases/1.2.3/linux-x64.tar.gz',
    checksum: 'a'.repeat(64),
    signature: 'sig-linux',
    signatureAlgorithm: 'ed25519',
    signingKeyId: 'main',
    sizeBytes: BigInt(1234),
  });

  const result = await service.getUpgradeArtifactForWorker({
    workerId: 'worker_1',
    platform: 'linux',
    arch: 'x64',
    installType: 'service',
  });

  expect(result).toEqual({
    artifact: {
      version: '1.2.3',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      url: 'https://example.com/releases/1.2.3/linux-x64.tar.gz',
      checksum: 'a'.repeat(64),
      signature: 'sig-linux',
      signatureAlgorithm: 'ed25519',
      signingKeyId: 'main',
      sizeBytes: 1234,
    },
    message: null,
  });
  expect(prisma.edgeReleaseArtifact.findFirst).toHaveBeenCalledWith({
    where: {
      release: { version: '1.2.3' },
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
    },
    select: expect.any(Object),
  });
});
```

- [ ] **Step 3: Write failing Windows platform normalization test**

Append:

```ts
it('normalizes windows platform before resolving artifact metadata', async () => {
  prisma.worker.findUnique.mockResolvedValue({
    id: 'worker_2',
    targetVersion: '1.2.3',
    platform: 'windows',
    arch: 'x64',
  });
  prisma.edgeReleaseArtifact.findFirst.mockResolvedValue({
    release: { version: '1.2.3', notes: null },
    platform: 'win32',
    arch: 'x64',
    installType: 'service',
    url: 'https://example.com/releases/1.2.3/windows-x64.zip',
    checksum: 'b'.repeat(64),
    signature: 'sig-windows',
    signatureAlgorithm: 'ed25519',
    signingKeyId: 'main',
    sizeBytes: null,
  });

  const result = await service.getUpgradeArtifactForWorker({
    workerId: 'worker_2',
    platform: 'windows',
    arch: 'x64',
  });

  expect(result.artifact?.platform).toBe('win32');
  expect(result.artifact?.url).toBe('https://example.com/releases/1.2.3/windows-x64.zip');
  expect(prisma.edgeReleaseArtifact.findFirst.mock.calls[0][0].where).toMatchObject({
    platform: 'win32',
    arch: 'x64',
    installType: 'service',
  });
});
```

- [ ] **Step 4: Write failing missing and unsupported metadata tests**

Append:

```ts
it('returns no artifact when worker has no target version', async () => {
  prisma.worker.findUnique.mockResolvedValue({
    id: 'worker_3',
    targetVersion: null,
    platform: 'linux',
    arch: 'x64',
  });

  const result = await service.getUpgradeArtifactForWorker({
    workerId: 'worker_3',
    platform: 'linux',
    arch: 'x64',
  });

  expect(result).toEqual({ artifact: null, message: null });
  expect(prisma.edgeReleaseArtifact.findFirst).not.toHaveBeenCalled();
});

it('returns clear message when artifact is incompatible with worker platform and arch', async () => {
  prisma.worker.findUnique.mockResolvedValue({
    id: 'worker_4',
    targetVersion: '1.2.3',
    platform: 'linux',
    arch: 'arm64',
  });
  prisma.edgeReleaseArtifact.findFirst.mockResolvedValue(null);

  const result = await service.getUpgradeArtifactForWorker({
    workerId: 'worker_4',
    platform: 'linux',
    arch: 'arm64',
  });

  expect(result).toEqual({
    artifact: null,
    message: 'No compatible edge release artifact found for 1.2.3 on linux/arm64/service',
  });
});
```

- [ ] **Step 5: Run release service tests to verify red**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts
```

Expected: FAIL because `getUpgradeArtifactForWorker` and `edgeReleaseArtifact` service typing are missing.

## Task 2: Add Prisma Artifact Schema And Migration

**Files:**

- Modify: `packages/prisma/prisma/schema.prisma`
- Create: `packages/prisma/prisma/migrations/<timestamp>_add_edge_release_artifacts/migration.sql`

- [ ] **Step 1: Add schema model**

Modify `schema.prisma` to add the `artifacts` relation and `EdgeReleaseArtifact` model shown in the Prisma Safety section.

- [ ] **Step 2: Create migration**

Run:

```bash
pnpm --filter @luckyplans/prisma db:migrate:dev -- --name add_edge_release_artifacts
```

Expected: migration file is created and Prisma client is regenerated.

- [ ] **Step 3: Review generated SQL**

Open the generated `migration.sql` and verify it creates:

```sql
CREATE TABLE "edge_release_artifacts" (
  "id" TEXT NOT NULL,
  "releaseId" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "arch" TEXT NOT NULL,
  "installType" TEXT NOT NULL DEFAULT 'service',
  "url" TEXT NOT NULL,
  "checksum" TEXT NOT NULL,
  "signature" TEXT NOT NULL,
  "signatureAlgorithm" TEXT NOT NULL DEFAULT 'ed25519',
  "signingKeyId" TEXT,
  "sizeBytes" BIGINT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "edge_release_artifacts_pkey" PRIMARY KEY ("id")
);
```

Add the backfill SQL from the Prisma Safety section after table creation and before final verification.

- [ ] **Step 4: Run Prisma build**

Run:

```bash
pnpm --filter @luckyplans/prisma build
```

Expected: PASS.

## Task 3: Implement Release Artifact Resolution

**Files:**

- Modify: `apps/api-gateway/src/workers/releases.service.ts`

- [ ] **Step 1: Add service types and prisma accessor**

Add near the existing local types:

```ts
type EdgeReleaseArtifactRecord = {
  release: { version: string; notes?: string | null };
  platform: string;
  arch: string;
  installType: string;
  url: string;
  checksum: string;
  signature: string;
  signatureAlgorithm: string;
  signingKeyId?: string | null;
  sizeBytes?: bigint | number | null;
};

export type EdgeUpgradeArtifactMetadata = {
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

export type EdgeUpgradeArtifactLookupResult = {
  artifact: EdgeUpgradeArtifactMetadata | null;
  message: string | null;
};
```

Update the Prisma cast used by `ReleasesService` to include:

```ts
edgeReleaseArtifact: {
  findFirst: (args: unknown) => Promise<EdgeReleaseArtifactRecord | null>;
};
```

Add:

```ts
private get releaseArtifacts() {
  return (
    this.prisma as unknown as {
      edgeReleaseArtifact: {
        findFirst: (args: unknown) => Promise<EdgeReleaseArtifactRecord | null>;
      };
    }
  ).edgeReleaseArtifact;
}
```

- [ ] **Step 2: Add normalization helpers**

Add private methods:

```ts
private normalizePlatform(platform: string | null | undefined): string | null {
  if (!platform) return null;
  const normalized = platform.toLowerCase();
  if (normalized === 'windows') return 'win32';
  if (normalized === 'win32') return 'win32';
  if (normalized === 'linux') return 'linux';
  return normalized;
}

private normalizeArch(arch: string | null | undefined): string | null {
  if (!arch) return null;
  const normalized = arch.toLowerCase();
  if (normalized === 'amd64') return 'x64';
  if (normalized === 'x86_64') return 'x64';
  if (normalized === 'arm64' || normalized === 'aarch64') return 'arm64';
  return normalized;
}

private normalizeInstallType(installType: string | null | undefined): string {
  return installType?.toLowerCase() || 'service';
}
```

- [ ] **Step 3: Implement lookup method**

Add:

```ts
async getUpgradeArtifactForWorker(input: {
  workerId: string;
  platform?: string | null;
  arch?: string | null;
  installType?: string | null;
}): Promise<EdgeUpgradeArtifactLookupResult> {
  const worker = await this.workers.findUnique({
    where: { id: input.workerId },
    select: { id: true, targetVersion: true, platform: true, arch: true },
  });

  if (!worker?.targetVersion) {
    return { artifact: null, message: null };
  }

  const platform = this.normalizePlatform(input.platform ?? worker.platform);
  const arch = this.normalizeArch(input.arch ?? worker.arch);
  const installType = this.normalizeInstallType(input.installType);

  if (!platform || !arch) {
    return {
      artifact: null,
      message: `Cannot resolve edge release artifact for ${worker.targetVersion}: platform and arch are required`,
    };
  }

  const artifact = await this.releaseArtifacts.findFirst({
    where: {
      release: { version: worker.targetVersion },
      platform,
      arch,
      installType,
    },
    select: {
      release: { select: { version: true, notes: true } },
      platform: true,
      arch: true,
      installType: true,
      url: true,
      checksum: true,
      signature: true,
      signatureAlgorithm: true,
      signingKeyId: true,
      sizeBytes: true,
    },
  });

  if (!artifact) {
    return {
      artifact: null,
      message: `No compatible edge release artifact found for ${worker.targetVersion} on ${platform}/${arch}/${installType}`,
    };
  }

  return {
    artifact: {
      version: artifact.release.version,
      platform: artifact.platform,
      arch: artifact.arch,
      installType: artifact.installType,
      url: artifact.url,
      checksum: artifact.checksum,
      signature: artifact.signature,
      signatureAlgorithm: artifact.signatureAlgorithm,
      signingKeyId: artifact.signingKeyId ?? null,
      sizeBytes: artifact.sizeBytes == null ? null : Number(artifact.sizeBytes),
    },
    message: null,
  };
}
```

- [ ] **Step 4: Run release service tests**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts
```

Expected: PASS.

## Task 4: Preserve Legacy Release Creation With Default Artifacts

**Files:**

- Modify: `apps/api-gateway/src/workers/releases.service.ts`
- Modify: `apps/api-gateway/src/workers/releases.service.spec.ts`

- [ ] **Step 1: Write failing test for artifact creation**

Update the `creates a release metadata record` test to expect nested artifact creation:

```ts
expect(prisma.edgeRelease.create).toHaveBeenCalledWith({
  data: expect.objectContaining({
    version: '1.0.0',
    artifacts: {
      create: [
        expect.objectContaining({
          platform: 'win32',
          arch: 'x64',
          installType: 'service',
          url: 'https://example.com/windows.exe',
          checksum,
          signature,
        }),
        expect.objectContaining({
          platform: 'linux',
          arch: 'x64',
          installType: 'service',
          url: 'https://example.com/linux.tar.gz',
          checksum,
          signature,
        }),
      ],
    },
  }),
});
```

- [ ] **Step 2: Run test to verify red**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts
```

Expected: FAIL because nested artifact creation is not present.

- [ ] **Step 3: Add nested artifact creation**

Change `createRelease` data to:

```ts
const signatureAlgorithm = input.signatureAlgorithm ?? 'ed25519';
const signingKeyId = input.signingKeyId ?? null;
return this.releases.create({
  data: {
    ...input,
    signatureAlgorithm,
    signingKeyId,
    artifacts: {
      create: [
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
      ],
    },
  },
});
```

- [ ] **Step 4: Run release service tests**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts
```

Expected: PASS.

## Task 5: Route Connectivity Release Lookup Through ReleasesService

**Files:**

- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`
- Modify: `apps/api-gateway/src/edges-internal/edges-internal.module.ts`

- [ ] **Step 1: Update connectivity controller tests for selected artifact**

Change the controller spec setup to use `releasesService` instead of direct Prisma release lookup:

```ts
const releasesService = {
  getUpgradeArtifactForWorker: vi.fn(),
};
const controller = new EdgesConnectivityController(
  workersService as never,
  releasesService as never,
);
```

In the first test, return selected artifact metadata:

```ts
releasesService.getUpgradeArtifactForWorker.mockResolvedValue({
  artifact: {
    version: '1.2.3',
    platform: 'linux',
    arch: 'x64',
    installType: 'service',
    url: 'https://example.com/linux-x64.tgz',
    checksum: 'a'.repeat(64),
    signature: 'sig',
    signatureAlgorithm: 'ed25519',
    signingKeyId: 'main',
    sizeBytes: 1234,
  },
  message: null,
});
```

Expect:

```ts
expect(result.release).toEqual({
  version: '1.2.3',
  platform: 'linux',
  arch: 'x64',
  installType: 'service',
  url: 'https://example.com/linux-x64.tgz',
  checksum: 'a'.repeat(64),
  signature: 'sig',
  signatureAlgorithm: 'ed25519',
  signingKeyId: 'main',
  sizeBytes: 1234,
});
expect(releasesService.getUpgradeArtifactForWorker).toHaveBeenCalledWith({
  workerId: 'worker_1',
  platform: 'linux',
  arch: 'x64',
  installType: undefined,
});
```

- [ ] **Step 2: Add missing artifact heartbeat test**

Append:

```ts
it('returns clear upgrade message when no compatible release artifact exists', async () => {
  workersService.findWorkerById.mockResolvedValue({
    id: 'worker_1',
    deviceNumber: 'edge-test-a1b2c3',
    targetVersion: '1.2.3',
    upgradeStatus: 'UPGRADE_PENDING',
    upgradeMessage: null,
  });
  workersService.markConnectivity.mockResolvedValue(undefined);
  releasesService.getUpgradeArtifactForWorker.mockResolvedValue({
    artifact: null,
    message: 'No compatible edge release artifact found for 1.2.3 on linux/arm64/service',
  });

  const result = await controller.connectivity(
    {
      workerId: 'worker_1',
      deviceNumber: 'edge-test-a1b2c3',
      currentVersion: '1.0.0',
      platform: 'linux',
      arch: 'arm64',
    },
    { worker: { workerId: 'worker_1' } },
  );

  expect(result.release).toBeNull();
  expect(result.upgradeMessage).toBe(
    'No compatible edge release artifact found for 1.2.3 on linux/arm64/service',
  );
});
```

- [ ] **Step 3: Run controller tests to verify red**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- edges-connectivity.controller.spec.ts
```

Expected: FAIL because the controller still injects Prisma and queries `edgeRelease` directly.

- [ ] **Step 4: Update controller constructor and response**

Change constructor:

```ts
constructor(
  private readonly workersService: WorkersService,
  private readonly releasesService: ReleasesService,
) {}
```

Add `installType?: string` to the heartbeat body type.

Replace direct `this.prisma.edgeRelease.findFirst(...)` with:

```ts
const releaseResult = targetVersion
  ? await this.releasesService.getUpgradeArtifactForWorker({
      workerId: body.workerId,
      platform: body.platform ?? updatedWorker.platform ?? worker.platform,
      arch: body.arch ?? updatedWorker.arch ?? worker.arch,
      installType: body.installType,
    })
  : { artifact: null, message: null };
```

Return:

```ts
return {
  targetVersion,
  release: releaseResult.artifact,
  upgradeStatus: body.upgradeStatus ?? updatedWorker.upgradeStatus,
  upgradeMessage: body.reason ?? releaseResult.message ?? updatedWorker.upgradeMessage,
};
```

- [ ] **Step 5: Update module wiring**

If `EdgesInternalModule` does not already import/provide `WorkersModule`, update it so `ReleasesService` resolves through Nest dependency injection. Prefer importing the existing workers module over duplicating providers.

- [ ] **Step 6: Run controller tests**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- edges-connectivity.controller.spec.ts
```

Expected: PASS.

## Task 6: GraphQL Release Type Alignment

**Files:**

- Modify: `apps/api-gateway/src/workers/releases.resolver.ts`
- Modify: `apps/api-gateway/src/workers/releases.service.spec.ts`

- [ ] **Step 1: Add artifact fields to GraphQL type**

Add:

```ts
@ObjectType()
class EdgeReleaseArtifact {
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

  @Field()
  signatureAlgorithm!: string;

  @Field({ nullable: true })
  signingKeyId?: string;

  @Field(() => Int, { nullable: true })
  sizeBytes?: number;
}
```

Add to `EdgeRelease`:

```ts
@Field(() => [EdgeReleaseArtifact])
artifacts!: EdgeReleaseArtifact[];
```

- [ ] **Step 2: Include artifacts in list service query**

Update `listReleases()`:

```ts
async listReleases(): Promise<EdgeReleaseRecord[]> {
  return this.releases.findMany({
    orderBy: { createdAt: 'desc' },
    include: { artifacts: true },
  });
}
```

Update local `EdgeReleaseRecord` type to include:

```ts
artifacts?: Array<{
  platform: string;
  arch: string;
  installType: string;
  url: string;
  checksum: string;
  signature: string;
  signatureAlgorithm: string;
  signingKeyId?: string | null;
  sizeBytes?: bigint | number | null;
}>;
```

- [ ] **Step 3: Map artifacts in resolver**

In `edgeReleases()` mapping:

```ts
artifacts: (release.artifacts ?? []).map((artifact) => ({
  ...artifact,
  signingKeyId: artifact.signingKeyId ?? undefined,
  sizeBytes: artifact.sizeBytes == null ? undefined : Number(artifact.sizeBytes),
})),
```

For `createEdgeRelease`, return `artifacts: []` if the Prisma mock or returned record does not include relation data.

- [ ] **Step 4: Run API gateway type-check**

Run:

```bash
pnpm --filter @luckyplans/api-gateway type-check
```

Expected: PASS.

## Task 7: Close EDGE-UPG-006 Issue Documentation

**Files:**

- Modify: `docs/issues/edge-upg-006-harden-release-metadata-resolution-for-platform-specific-upgrades.md`

- [ ] **Step 1: Add outcome section**

Append before `## Definition of Done`:

```md
## Outcome

Implemented platform-specific release metadata resolution:

- Added artifact-level release metadata for platform, arch, install type, URL, checksum, signature, signing key id, and size.
- Preserved existing release records and backfilled default Linux/Windows service artifacts.
- Routed edge connectivity upgrade lookup through `ReleasesService`.
- Returned no artifact plus a clear message when no compatible artifact exists.
- Kept release management in the API gateway workers module.

Verification notes:

- `pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts edges-connectivity.controller.spec.ts` passed.
- `pnpm --filter @luckyplans/api-gateway type-check` passed.
- Full repository gates passed.
```

- [ ] **Step 2: Update Definition of Done**

Change checklist to:

```md
- [x] Release service tests pass.
- [x] Connectivity controller tests pass.
- [x] No new microservice is introduced.
```

## Task 8: Verification Gate

**Files:**

- No planned file changes.

- [ ] **Step 1: Run targeted tests**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts edges-connectivity.controller.spec.ts
```

Expected: PASS.

- [ ] **Step 2: Run Prisma and API gateway checks**

Run:

```bash
pnpm --filter @luckyplans/prisma build
pnpm --filter @luckyplans/api-gateway type-check
pnpm --filter @luckyplans/api-gateway lint
```

Expected: all PASS.

- [ ] **Step 3: Run full repository gates**

Run:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm format:check
git diff --check
```

Expected: all PASS.

- [ ] **Step 4: Commit scoped work**

Stage only EDGE-UPG-006 files:

```bash
git add packages/prisma/prisma/schema.prisma packages/prisma/prisma/migrations apps/api-gateway/src/workers/releases.service.ts apps/api-gateway/src/workers/releases.service.spec.ts apps/api-gateway/src/workers/releases.resolver.ts apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts apps/api-gateway/src/edges-internal/edges-internal.module.ts docs/issues/edge-upg-006-harden-release-metadata-resolution-for-platform-specific-upgrades.md docs/superpowers/plans/2026-06-01-edge-release-metadata-resolution-implementation-plan.md
git commit -m "feat(edge): resolve platform release artifacts"
```

## Self-Review

Spec coverage:

- Version/platform/arch/install type lookup: Tasks 1, 3, 5.
- Gateway avoids incompatible artifacts: Tasks 1, 3, 5.
- HTTPS URL, checksum, signature, signing key id, size: Tasks 1, 2, 3, 6.
- Missing/incompatible release returns no artifact and clear message: Tasks 1, 3, 5.
- Linux, Windows, missing release, unsupported arch, checksum/signature coverage: Tasks 1, 5, 8.
- No new microservice: File map and Task 7.

Placeholder scan:

- No forbidden placeholder markers or unspecified edge handling remains.
- Every production behavior task has a failing-test step before implementation.

Type consistency:

- `EdgeUpgradeArtifactMetadata` is the service output and heartbeat `release` payload.
- Prisma model uses `sizeBytes BigInt?`; service converts to `number | null` for API payloads.
- Platform normalization uses `win32` and `linux`; Windows input aliases normalize before lookup.
