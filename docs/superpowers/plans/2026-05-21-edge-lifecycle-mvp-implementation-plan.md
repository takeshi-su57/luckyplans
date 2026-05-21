# Edge Lifecycle MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Windows/Linux edge onboarding, unique device registration, connectivity heartbeat, and idle-only auto-upgrade based on server target version.

**Architecture:** Extend the existing `apps/edge-agent` runtime with a first-run wizard and persistent config, then extend `apps/api-gateway` worker/edge internal APIs for registration + connectivity heartbeat + upgrade metadata response. Reuse existing release and upgrade status infrastructure in `workers/releases.service.ts` and wire edge runtime to consume it.

**Tech Stack:** TypeScript, NestJS (GraphQL + REST internal endpoints), Prisma/PostgreSQL, Vitest, Node.js runtime

---

## File Map

- Create: `apps/edge-agent/src/config.ts` (local config load/save + path resolver)
- Create: `apps/edge-agent/src/device-number.ts` (slug + shortid generation)
- Create: `apps/edge-agent/src/onboarding.ts` (interactive wizard and registration call)
- Create: `apps/edge-agent/src/upgrade.ts` (download/verify/install orchestration state machine)
- Modify: `apps/edge-agent/src/main.ts` (boot flow: onboarding -> runtime loop)
- Modify: `apps/edge-agent/src/client.ts` (register + connectivity heartbeat + upgrade response contract)
- Modify: `apps/edge-agent/src/runner.ts` (idle detection + upgrade trigger integration)
- Create: `apps/edge-agent/src/onboarding.spec.ts`
- Create: `apps/edge-agent/src/device-number.spec.ts`
- Create: `apps/edge-agent/src/config.spec.ts`
- Create: `apps/edge-agent/src/upgrade.spec.ts`
- Modify: `packages/prisma/prisma/schema.prisma` (worker `deviceNumber`, `arch`, uniqueness/index)
- Create: `packages/prisma/prisma/migrations/<timestamp>_add_worker_device_number_and_arch/migration.sql`
- Modify: `apps/api-gateway/src/workers/workers.service.ts` (create/register/find by device number)
- Create: `apps/api-gateway/src/edges-internal/edges-registration.controller.ts`
- Create: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`
- Modify: `apps/api-gateway/src/edges-internal/edges-internal.module.ts` (register new controllers)
- Modify: `apps/api-gateway/src/workers/releases.service.ts` (resolve release metadata by version/platform)
- Create: `apps/api-gateway/src/edges-internal/edges-registration.controller.spec.ts`
- Create: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`
- Modify: `apps/api-gateway/src/workers/workers.service.spec.ts` (deviceNumber uniqueness and registration paths)
- Modify: `apps/web/src/app/(app)/edges/page.tsx` (show `deviceNumber`, connectivity freshness)
- Modify: `apps/web/src/app/(app)/edges/page.test.tsx`
- Modify: `apps/web/content/system/api.mdx` (document registration/heartbeat endpoints)

### Task 1: Add Worker Device Identity Schema

**Files:**
- Modify: `packages/prisma/prisma/schema.prisma`
- Create: `packages/prisma/prisma/migrations/<timestamp>_add_worker_device_number_and_arch/migration.sql`

- [ ] **Step 1: Write failing schema expectation test (type-level contract in gateway tests)**

```ts
// apps/api-gateway/src/workers/workers.service.spec.ts
it('requires unique deviceNumber for registration flow', async () => {
  expect(true).toBe(false); // replace after schema + service logic lands
});
```

- [ ] **Step 2: Run targeted test to confirm failure**

Run: `pnpm --filter @luckyplans/api-gateway test -- workers.service.spec.ts`
Expected: FAIL with intentional assertion failure.

- [ ] **Step 3: Update Prisma schema and migration**

```prisma
model Worker {
  id           String   @id @default(cuid())
  name         String
  deviceNumber String?  @unique
  platform     String?
  arch         String?
  version      String?
  // ...existing fields

  @@index([status])
  @@index([lastSeenAt])
  @@map("workers")
}
```

```sql
ALTER TABLE "workers" ADD COLUMN "deviceNumber" TEXT;
ALTER TABLE "workers" ADD COLUMN "arch" TEXT;
CREATE UNIQUE INDEX "workers_deviceNumber_key" ON "workers"("deviceNumber");
CREATE INDEX "workers_lastSeenAt_idx" ON "workers"("lastSeenAt");
```

- [ ] **Step 4: Run Prisma generate/type-check**

Run: `pnpm type-check`
Expected: PASS for updated Prisma client types.

- [ ] **Step 5: Commit**

```bash
git add packages/prisma/prisma/schema.prisma packages/prisma/prisma/migrations
git commit -m "feat(prisma): add edge deviceNumber and arch fields"
```

### Task 2: Implement Edge Device Number + Config Persistence

**Files:**
- Create: `apps/edge-agent/src/device-number.ts`
- Create: `apps/edge-agent/src/config.ts`
- Create: `apps/edge-agent/src/device-number.spec.ts`
- Create: `apps/edge-agent/src/config.spec.ts`

- [ ] **Step 1: Write failing tests for format and config round-trip**

```ts
// apps/edge-agent/src/device-number.spec.ts
it('builds edge-<slug>-<shortid> format', () => {
  const value = buildDeviceNumber('Seoul Lab', () => 'a7k29f');
  expect(value).toBe('edge-seoul-lab-a7k29f');
});

// apps/edge-agent/src/config.spec.ts
it('saves and reloads edge config', async () => {
  const cfg = { serverUrl: 'https://api.example.com', workerId: 'w1', deviceNumber: 'edge-x-a1b2c3', credential: 'wk_live_x_y', currentVersion: '0.1.0' };
  await saveEdgeConfig(cfg, testPath);
  await expect(loadEdgeConfig(testPath)).resolves.toMatchObject(cfg);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `pnpm --filter @luckyplans/edge-agent test -- device-number.spec.ts config.spec.ts`
Expected: FAIL due to missing modules/functions.

- [ ] **Step 3: Implement device number generator and config helpers**

```ts
// apps/edge-agent/src/device-number.ts
export function buildDeviceNumber(name: string, shortIdFactory: () => string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'edge';
  return `edge-${slug}-${shortIdFactory()}`;
}
```

```ts
// apps/edge-agent/src/config.ts
export type EdgeLocalConfig = {
  serverUrl: string;
  workerId: string;
  deviceNumber: string;
  credential: string;
  currentVersion: string;
};
```

- [ ] **Step 4: Re-run tests to pass**

Run: `pnpm --filter @luckyplans/edge-agent test -- device-number.spec.ts config.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/edge-agent/src/device-number.ts apps/edge-agent/src/config.ts apps/edge-agent/src/device-number.spec.ts apps/edge-agent/src/config.spec.ts
git commit -m "feat(edge-agent): add device number generation and local config persistence"
```

### Task 3: Implement Interactive Onboarding Wizard

**Files:**
- Create: `apps/edge-agent/src/onboarding.ts`
- Modify: `apps/edge-agent/src/client.ts`
- Modify: `apps/edge-agent/src/main.ts`
- Create: `apps/edge-agent/src/onboarding.spec.ts`

- [ ] **Step 1: Write failing onboarding test**

```ts
it('prompts for name/server/token and persists registration result', async () => {
  const result = await runOnboarding({ prompt: fakePrompt, client: fakeClient, configPath: tempPath });
  expect(result.deviceNumber.startsWith('edge-')).toBe(true);
  expect(result.workerId).toBe('worker_1');
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `pnpm --filter @luckyplans/edge-agent test -- onboarding.spec.ts`
Expected: FAIL missing onboarding flow.

- [ ] **Step 3: Implement onboarding and registration client call**

```ts
// onboarding.ts (core behavior)
// prompt displayName -> serverUrl -> token
// generate deviceNumber
// POST /internal/edges/register
// on conflict regenerate shortid and retry
// persist config
```

```ts
// client.ts add
async registerEdge(input: {
  deviceNumber: string;
  displayName: string;
  platform: string;
  arch: string;
  edgeVersion: string;
  token: string;
}): Promise<{ workerId: string; credential: string; deviceNumber: string }>;
```

- [ ] **Step 4: Re-run onboarding tests**

Run: `pnpm --filter @luckyplans/edge-agent test -- onboarding.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/edge-agent/src/onboarding.ts apps/edge-agent/src/client.ts apps/edge-agent/src/main.ts apps/edge-agent/src/onboarding.spec.ts
git commit -m "feat(edge-agent): add first-run interactive onboarding wizard"
```

### Task 4: Add Registration and Connectivity Endpoints in Gateway

**Files:**
- Create: `apps/api-gateway/src/edges-internal/edges-registration.controller.ts`
- Create: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`
- Modify: `apps/api-gateway/src/edges-internal/edges-internal.module.ts`
- Modify: `apps/api-gateway/src/workers/workers.service.ts`
- Create: `apps/api-gateway/src/edges-internal/edges-registration.controller.spec.ts`
- Create: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`

- [ ] **Step 1: Write failing controller tests**

```ts
it('registers new edge and returns workerId + credential', async () => {
  const res = await controller.register({ deviceNumber: 'edge-seoul-a1b2c3', displayName: 'Seoul Lab', platform: 'linux', arch: 'x64', edgeVersion: '0.1.0', token: 'reg_token' });
  expect(res.workerId).toBeDefined();
  expect(res.credential.startsWith('wk_live_')).toBe(true);
});

it('updates lastSeenAt and returns upgrade intent in heartbeat', async () => {
  const res = await controller.connectivity({ workerId: 'w1', deviceNumber: 'edge-seoul-a1b2c3', currentVersion: '0.1.0', activeTask: false });
  expect(res).toHaveProperty('targetVersion');
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `pnpm --filter @luckyplans/api-gateway test -- edges-registration.controller.spec.ts edges-connectivity.controller.spec.ts`
Expected: FAIL due to missing controllers.

- [ ] **Step 3: Implement registration and heartbeat connectivity controllers**

```ts
// registration controller
// validate token, upsert worker by deviceNumber, issue credential via CredentialsService

// connectivity controller
// auth via bearer credential, verify workerId/deviceNumber binding
// update lastSeenAt/version/platform
// return { targetVersion, release: { windowsUrl, linuxUrl, checksum, signature }, upgradeStatus }
```

- [ ] **Step 4: Re-run controller tests**

Run: `pnpm --filter @luckyplans/api-gateway test -- edges-registration.controller.spec.ts edges-connectivity.controller.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api-gateway/src/edges-internal/edges-registration.controller.ts apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts apps/api-gateway/src/edges-internal/edges-internal.module.ts apps/api-gateway/src/workers/workers.service.ts apps/api-gateway/src/edges-internal/edges-registration.controller.spec.ts apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts
git commit -m "feat(api-gateway): add edge registration and connectivity heartbeat endpoints"
```

### Task 5: Wire Upgrade Metadata Resolution on Server

**Files:**
- Modify: `apps/api-gateway/src/workers/releases.service.ts`
- Modify: `apps/api-gateway/src/workers/releases.service.spec.ts`

- [ ] **Step 1: Write failing test for release lookup by targetVersion**

```ts
it('returns release artifact metadata for a worker target version', async () => {
  const release = await service.getReleaseForWorkerTarget('worker_1');
  expect(release?.version).toBe('1.2.3');
  expect(release?.linuxUrl).toMatch(/^https:/);
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts`
Expected: FAIL missing method.

- [ ] **Step 3: Implement release resolution helper**

```ts
async getReleaseForWorkerTarget(workerId: string) {
  const worker = await this.prisma.worker.findUnique({ where: { id: workerId } });
  if (!worker?.targetVersion) return null;
  return this.releases.findFirst({ where: { version: worker.targetVersion } });
}
```

- [ ] **Step 4: Re-run release tests**

Run: `pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api-gateway/src/workers/releases.service.ts apps/api-gateway/src/workers/releases.service.spec.ts
git commit -m "feat(workers): expose release lookup for worker target version"
```

### Task 6: Implement Edge Idle-Only Auto-Upgrade Loop

**Files:**
- Create: `apps/edge-agent/src/upgrade.ts`
- Modify: `apps/edge-agent/src/runner.ts`
- Modify: `apps/edge-agent/src/client.ts`
- Create: `apps/edge-agent/src/upgrade.spec.ts`

- [ ] **Step 1: Write failing upgrade behavior tests**

```ts
it('defers upgrade while task is active', async () => {
  const result = await maybeUpgrade({ activeTask: true, currentVersion: '1.0.0', targetVersion: '1.0.1' });
  expect(result.performed).toBe(false);
});

it('runs download/verify/install flow when idle and target is newer', async () => {
  const result = await maybeUpgrade({ activeTask: false, currentVersion: '1.0.0', targetVersion: '1.0.1' });
  expect(result.performed).toBe(true);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `pnpm --filter @luckyplans/edge-agent test -- upgrade.spec.ts`
Expected: FAIL missing upgrade module.

- [ ] **Step 3: Implement idle-only upgrade state machine**

```ts
// upgrade.ts
// compare versions
// emit status DOWNLOADING -> VERIFYING -> RESTARTING -> SUCCEEDED/FAILED via API
// keep current version if verification/install fails
```

- [ ] **Step 4: Re-run upgrade tests**

Run: `pnpm --filter @luckyplans/edge-agent test -- upgrade.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/edge-agent/src/upgrade.ts apps/edge-agent/src/runner.ts apps/edge-agent/src/client.ts apps/edge-agent/src/upgrade.spec.ts
git commit -m "feat(edge-agent): add idle-only auto-upgrade execution flow"
```

### Task 7: Update Edges UI and Docs

**Files:**
- Modify: `apps/web/src/app/(app)/edges/page.tsx`
- Modify: `apps/web/src/app/(app)/edges/page.test.tsx`
- Modify: `apps/web/content/system/api.mdx`

- [ ] **Step 1: Write failing UI test expectations**

```tsx
it('renders device number and last seen connectivity', () => {
  render(<EdgesPage />);
  expect(screen.getByText(/edge-/i)).toBeInTheDocument();
  expect(screen.getByText(/last seen/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run UI test and verify failure**

Run: `pnpm --filter @luckyplans/web test -- src/app/(app)/edges/page.test.tsx`
Expected: FAIL for missing columns/labels.

- [ ] **Step 3: Implement UI fields and docs**

```tsx
// add columns: Device Number, Connectivity (Last Seen), Current Version, Target Version, Upgrade Status
```

```mdx
### Internal Edge Registration
POST /internal/edges/register

### Internal Edge Connectivity Heartbeat
POST /internal/edges/connectivity
```

- [ ] **Step 4: Re-run UI tests**

Run: `pnpm --filter @luckyplans/web test -- src/app/(app)/edges/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/(app)/edges/page.tsx apps/web/src/app/(app)/edges/page.test.tsx apps/web/content/system/api.mdx
git commit -m "feat(web): display edge device connectivity and document internal edge APIs"
```

### Task 8: Full Verification Gate

**Files:**
- Modify: (none expected; only if verification exposes defects)

- [ ] **Step 1: Run lint**

Run: `pnpm lint`
Expected: PASS.

- [ ] **Step 2: Run type-check**

Run: `pnpm type-check`
Expected: PASS.

- [ ] **Step 3: Run build**

Run: `pnpm build`
Expected: PASS.

- [ ] **Step 4: Run format check**

Run: `pnpm format:check`
Expected: PASS.

- [ ] **Step 5: Run targeted tests for touched areas**

Run: `pnpm --filter @luckyplans/api-gateway test && pnpm --filter @luckyplans/edge-agent test && pnpm --filter @luckyplans/web test -- src/app/(app)/edges/page.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit final fixes (if any)**

```bash
git add -A
git commit -m "chore: finalize edge lifecycle mvp verification fixes"
```
