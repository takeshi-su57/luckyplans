# Edge Runtime Health Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add latest-known edge runtime health, fixed stale/offline semantics, and UI display for `EDGE-UPG-004`.

**Architecture:** Keep health on the existing `Worker` model as additive latest-snapshot fields. The edge-agent reports runtime health through the existing connectivity heartbeat; the gateway persists it and computes `ONLINE`/`STALE`/`OFFLINE` from `lastSeenAt`; the Edges UI renders the new fields in the existing worker list.

**Tech Stack:** TypeScript, NestJS, Prisma, GraphQL code-first, Next.js, React, Apollo Client, Vitest.

---

## Scope

Implements `EDGE-UPG-004`.

In scope:

- Runtime states: `IDLE`, `BUSY`, `UPGRADING`, `ERROR`.
- Heartbeat fields: `runtimeState`, `activeTaskId`, `uptimeSeconds`, `lastError`.
- Gateway fixed connectivity thresholds: `ONLINE <= 60s`, `STALE <= 5m`, otherwise `OFFLINE`.
- GraphQL worker fields for runtime health and connectivity status.
- Edges UI display and tests.
- Issue doc outcome and verification notes.

Out of scope:

- `edge_sessions` table.
- WebSocket or push transport.
- OS service installer behavior.
- Artifact download/install/rollback behavior.
- Configurable gateway thresholds.

## File Map

- Modify: `packages/prisma/prisma/schema.prisma`
  - Add `WorkerRuntimeState` enum and nullable/default Worker health fields.
- Create: `packages/prisma/prisma/migrations/<timestamp>_add_worker_runtime_health/migration.sql`
  - Add enum/columns safely with defaults or nullable fields.
- Modify: `apps/api-gateway/src/workers/workers.service.ts`
  - Persist runtime health and compute connectivity status.
- Modify: `apps/api-gateway/src/workers/workers.service.spec.ts`
  - Test persistence normalization and fixed threshold computation.
- Modify: `apps/api-gateway/src/workers/workers.resolver.ts`
  - Expose GraphQL enums/fields.
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`
  - Accept additive heartbeat fields and pass them to `WorkersService`.
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`
  - Test heartbeat runtime health contract.
- Modify: `apps/edge-agent/src/client.ts`
  - Extend connectivity heartbeat request type/body.
- Modify: `apps/edge-agent/src/client.spec.ts`
  - Test runtime health fields are sent.
- Modify: `apps/edge-agent/src/runner.ts`
  - Send `IDLE`/`BUSY`/`UPGRADING`/`ERROR` runtime state snapshots.
- Modify: `apps/edge-agent/src/runner.spec.ts`
  - Test state payloads.
- Modify: `apps/web/src/app/(app)/edges/page.tsx`
  - Query and render health fields.
- Modify: `apps/web/src/app/(app)/edges/page.test.tsx`
  - Test health rendering.
- Modify: `docs/issues/edge-upg-004-add-edge-runtime-health-snapshot-and-stale-worker-semantics.md`
  - Add outcome and verification notes.

## Design Decisions

1. `WorkerRuntimeState` is persisted as latest-known state on `Worker`; `WorkerConnectivityStatus` is computed in gateway code and not stored.
2. `runtimeState` defaults to `IDLE`; other health fields are nullable.
3. `lastError` is normalized to a short single-line summary with a maximum of 500 characters.
4. Invalid optional health fields are normalized by `WorkersService`, not rejected by the controller.
5. `uptimeSeconds` is accepted only when it is a non-negative finite integer.
6. Edge-agent `uptimeSeconds` is derived from `runtimeStartedAtMs` and injectable `now()` for tests.
7. The runner reports `ERROR` for task execution failures it handles locally. Gateway transport failures cannot reliably report health to the gateway because the gateway call itself failed.

## Task 1: Add Gateway Health Contract Tests

**Files:**

- Modify: `apps/api-gateway/src/workers/workers.service.spec.ts`
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`

- [ ] **Step 1: Add failing connectivity status tests**

Append to `apps/api-gateway/src/workers/workers.service.spec.ts` inside the existing `describe('WorkersService', ...)` block:

```ts
it('computes worker connectivity status from fixed lastSeenAt thresholds', async () => {
  const now = new Date('2026-06-01T12:00:00.000Z');
  const prisma = {
    worker: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'online',
          name: 'Online Edge',
          lastSeenAt: new Date('2026-06-01T11:59:30.000Z'),
          credentials: [],
        },
        {
          id: 'stale',
          name: 'Stale Edge',
          lastSeenAt: new Date('2026-06-01T11:58:30.000Z'),
          credentials: [],
        },
        {
          id: 'offline',
          name: 'Offline Edge',
          lastSeenAt: new Date('2026-06-01T11:54:30.000Z'),
          credentials: [],
        },
        {
          id: 'never-seen',
          name: 'Never Seen Edge',
          lastSeenAt: null,
          credentials: [],
        },
      ]),
    },
  };
  const service = new WorkersService(prisma as never, () => now);

  const workers = await service.getWorkers();

  expect(workers.map((worker) => [worker.id, worker.connectivityStatus])).toEqual([
    ['online', 'ONLINE'],
    ['stale', 'STALE'],
    ['offline', 'OFFLINE'],
    ['never-seen', 'OFFLINE'],
  ]);
});
```

- [ ] **Step 2: Add failing runtime health persistence test**

Append to `apps/api-gateway/src/workers/workers.service.spec.ts`:

```ts
it('records normalized runtime health fields during connectivity update', async () => {
  const prisma = {
    worker: {
      update: vi.fn().mockResolvedValue({ id: 'worker_1' }),
    },
  };
  const service = new WorkersService(prisma as never);

  await service.markConnectivity({
    workerId: 'worker_1',
    version: '1.0.0',
    platform: 'linux',
    arch: ' x64 ',
    runtimeState: 'ERROR',
    activeTaskId: ' task_123 ',
    uptimeSeconds: 42.8,
    lastError: ' first line\nsecond line '.repeat(30),
  });

  expect(prisma.worker.update).toHaveBeenCalledWith({
    where: { id: 'worker_1' },
    data: expect.objectContaining({
      runtimeState: 'ERROR',
      activeTaskId: 'task_123',
      uptimeSeconds: 42,
      lastError: expect.stringMatching(/^first line second line/),
    }),
  });
  const data = prisma.worker.update.mock.calls[0][0].data;
  expect(data.lastError.length).toBeLessThanOrEqual(500);
});
```

- [ ] **Step 3: Add failing controller contract test**

Append to `apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts`:

```ts
it('passes runtime health fields from connectivity heartbeat to workers service', async () => {
  workersService.findWorkerById.mockResolvedValue({
    id: 'worker_1',
    deviceNumber: 'edge-test-a1b2c3',
    targetVersion: null,
    upgradeStatus: 'IDLE',
    upgradeMessage: null,
  });
  workersService.markConnectivity.mockResolvedValue(undefined);

  await controller.connectivity(
    {
      workerId: 'worker_1',
      deviceNumber: 'edge-test-a1b2c3',
      currentVersion: '1.0.0',
      platform: 'linux',
      arch: 'x64',
      runtimeState: 'BUSY',
      activeTaskId: 'task_123',
      uptimeSeconds: 120,
      lastError: 'previous error',
    },
    { worker: { workerId: 'worker_1' } },
  );

  expect(workersService.markConnectivity).toHaveBeenCalledWith(
    expect.objectContaining({
      runtimeState: 'BUSY',
      activeTaskId: 'task_123',
      uptimeSeconds: 120,
      lastError: 'previous error',
    }),
  );
});
```

- [ ] **Step 4: Run gateway tests to verify red**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- workers.service.spec.ts edges-connectivity.controller.spec.ts
```

Expected: FAIL because `WorkersService` does not accept a clock dependency, does not compute `connectivityStatus`, and does not persist runtime health fields.

- [ ] **Step 5: Commit tests**

Do not commit yet if the repository policy requires green commits only. Otherwise commit the red tests on a local WIP branch:

```bash
git add apps/api-gateway/src/workers/workers.service.spec.ts apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts
git commit -m "test(edge): cover runtime health gateway contract"
```

## Task 2: Add Prisma Runtime Health Fields

**Files:**

- Modify: `packages/prisma/prisma/schema.prisma`
- Create: `packages/prisma/prisma/migrations/<timestamp>_add_worker_runtime_health/migration.sql`

- [ ] **Step 1: Update Prisma schema**

Modify `packages/prisma/prisma/schema.prisma`:

```prisma
enum WorkerRuntimeState {
  IDLE
  BUSY
  UPGRADING
  ERROR
}
```

Add fields to `model Worker`:

```prisma
  runtimeState WorkerRuntimeState @default(IDLE)
  activeTaskId String?
  uptimeSeconds Int?
  lastError String?
```

- [ ] **Step 2: Create migration**

Run:

```bash
pnpm --filter @luckyplans/prisma db:migrate:dev -- --name add_worker_runtime_health
```

Expected: Prisma creates a migration with an enum and additive Worker columns.

- [ ] **Step 3: Review migration SQL**

Open the generated migration SQL and confirm it follows the safe pattern:

```sql
CREATE TYPE "WorkerRuntimeState" AS ENUM ('IDLE', 'BUSY', 'UPGRADING', 'ERROR');

ALTER TABLE "workers"
ADD COLUMN "runtimeState" "WorkerRuntimeState" NOT NULL DEFAULT 'IDLE',
ADD COLUMN "activeTaskId" TEXT,
ADD COLUMN "uptimeSeconds" INTEGER,
ADD COLUMN "lastError" TEXT;
```

This is safe for populated tables because only the required column has a default.

- [ ] **Step 4: Generate Prisma client through package build**

Run:

```bash
pnpm --filter @luckyplans/prisma build
```

Expected: PASS and generated client includes `WorkerRuntimeState` and new Worker fields.

- [ ] **Step 5: Commit schema and migration**

```bash
git add packages/prisma/prisma/schema.prisma packages/prisma/prisma/migrations packages/prisma/generated
git commit -m "feat(prisma): add worker runtime health fields"
```

## Task 3: Implement Gateway Health Persistence And GraphQL Fields

**Files:**

- Modify: `apps/api-gateway/src/workers/workers.service.ts`
- Modify: `apps/api-gateway/src/workers/workers.resolver.ts`
- Modify: `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`

- [ ] **Step 1: Implement worker health types and constants**

In `apps/api-gateway/src/workers/workers.service.ts`, add:

```ts
type WorkerRuntimeState = 'IDLE' | 'BUSY' | 'UPGRADING' | 'ERROR';
type WorkerConnectivityStatus = 'ONLINE' | 'STALE' | 'OFFLINE';

const STALE_AFTER_MS = 60_000;
const OFFLINE_AFTER_MS = 5 * 60_000;
const MAX_LAST_ERROR_LENGTH = 500;
```

Update the constructor:

```ts
constructor(
  private readonly prisma: PrismaService,
  private readonly now: () => Date = () => new Date(),
) {}
```

- [ ] **Step 2: Add helper functions**

Add to `WorkersService`:

```ts
private getConnectivityStatus(lastSeenAt: Date | null | undefined): WorkerConnectivityStatus {
  if (!lastSeenAt) {
    return 'OFFLINE';
  }

  const ageMs = this.now().getTime() - lastSeenAt.getTime();
  if (ageMs <= STALE_AFTER_MS) {
    return 'ONLINE';
  }
  if (ageMs <= OFFLINE_AFTER_MS) {
    return 'STALE';
  }
  return 'OFFLINE';
}

private normalizeRuntimeState(state: WorkerRuntimeState | undefined): WorkerRuntimeState | undefined {
  return state;
}

private normalizeOptionalString(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

private normalizeUptimeSeconds(value: number | undefined): number | undefined {
  if (!Number.isFinite(value) || value === undefined || value < 0) {
    return undefined;
  }
  return Math.floor(value);
}

private normalizeLastError(value: string | undefined): string | undefined {
  const singleLine = value?.replace(/\s+/g, ' ').trim();
  return singleLine ? singleLine.slice(0, MAX_LAST_ERROR_LENGTH) : undefined;
}
```

- [ ] **Step 3: Update `getWorkers` mapping**

Change the return mapper in `getWorkers()`:

```ts
return workers.map((worker) => ({
  ...worker,
  hasActiveCredential: worker.credentials.length > 0,
  connectivityStatus: this.getConnectivityStatus(worker.lastSeenAt),
}));
```

- [ ] **Step 4: Update `markConnectivity` input and update data**

Extend `markConnectivity` input:

```ts
runtimeState?: WorkerRuntimeState;
activeTaskId?: string;
uptimeSeconds?: number;
lastError?: string;
```

Add fields to the Prisma update data:

```ts
runtimeState: this.normalizeRuntimeState(data.runtimeState),
activeTaskId: this.normalizeOptionalString(data.activeTaskId),
uptimeSeconds: this.normalizeUptimeSeconds(data.uptimeSeconds),
lastError: this.normalizeLastError(data.lastError),
```

- [ ] **Step 5: Update controller body and service call**

In `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`, add:

```ts
type WorkerRuntimeState = 'IDLE' | 'BUSY' | 'UPGRADING' | 'ERROR';
```

Extend body:

```ts
runtimeState?: WorkerRuntimeState;
activeTaskId?: string;
uptimeSeconds?: number;
lastError?: string;
```

Pass fields into `markConnectivity`:

```ts
runtimeState: body.runtimeState,
activeTaskId: body.activeTaskId,
uptimeSeconds: body.uptimeSeconds,
lastError: body.lastError,
```

- [ ] **Step 6: Update GraphQL resolver fields**

In `apps/api-gateway/src/workers/workers.resolver.ts`, add:

```ts
const WorkerRuntimeState = {
  IDLE: 'IDLE',
  BUSY: 'BUSY',
  UPGRADING: 'UPGRADING',
  ERROR: 'ERROR',
} as const;
type WorkerRuntimeState = (typeof WorkerRuntimeState)[keyof typeof WorkerRuntimeState];
registerEnumType(WorkerRuntimeState, { name: 'WorkerRuntimeState' });

const WorkerConnectivityStatus = {
  ONLINE: 'ONLINE',
  STALE: 'STALE',
  OFFLINE: 'OFFLINE',
} as const;
type WorkerConnectivityStatus =
  (typeof WorkerConnectivityStatus)[keyof typeof WorkerConnectivityStatus];
registerEnumType(WorkerConnectivityStatus, { name: 'WorkerConnectivityStatus' });
```

Add fields to `class Worker`:

```ts
@Field(() => WorkerRuntimeState)
runtimeState!: WorkerRuntimeState;

@Field({ nullable: true })
activeTaskId?: string | null;

@Field({ nullable: true })
uptimeSeconds?: number | null;

@Field({ nullable: true })
lastError?: string | null;

@Field(() => WorkerConnectivityStatus)
connectivityStatus!: WorkerConnectivityStatus;
```

- [ ] **Step 7: Run gateway tests to verify green**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- workers.service.spec.ts edges-connectivity.controller.spec.ts
```

Expected: PASS.

- [ ] **Step 8: Run api-gateway type-check**

Run:

```bash
pnpm --filter @luckyplans/api-gateway type-check
```

Expected: PASS.

- [ ] **Step 9: Commit gateway implementation**

```bash
git add apps/api-gateway/src/workers/workers.service.ts apps/api-gateway/src/workers/workers.service.spec.ts apps/api-gateway/src/workers/workers.resolver.ts apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts apps/api-gateway/src/edges-internal/edges-connectivity.controller.spec.ts
git commit -m "feat(api): expose edge runtime health"
```

## Task 4: Extend Edge-Agent Heartbeat Runtime State

**Files:**

- Modify: `apps/edge-agent/src/client.ts`
- Modify: `apps/edge-agent/src/client.spec.ts`
- Modify: `apps/edge-agent/src/runner.ts`
- Modify: `apps/edge-agent/src/runner.spec.ts`

- [ ] **Step 1: Add failing client payload test**

Append to `apps/edge-agent/src/client.spec.ts`:

```ts
it('sends runtime health fields in connectivity heartbeat', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({}),
  });
  vi.stubGlobal('fetch', fetchMock);
  const client = new EdgeApiClient('https://api.example.com', 'worker_1', 'wk_secret');

  await client.sendConnectivityHeartbeat({
    activeTask: true,
    currentVersion: '1.0.0',
    deviceNumber: 'edge-test-a1b2c3',
    runtimeState: 'BUSY',
    activeTaskId: 'task_123',
    uptimeSeconds: 12,
    lastError: 'previous error',
  });

  const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
  expect(body).toEqual(
    expect.objectContaining({
      runtimeState: 'BUSY',
      activeTaskId: 'task_123',
      uptimeSeconds: 12,
      lastError: 'previous error',
    }),
  );
});
```

- [ ] **Step 2: Add failing runner state tests**

Add tests to `apps/edge-agent/src/runner.spec.ts` using the existing test helpers and mock client shape:

```ts
it('reports IDLE runtime state when no task is leased', async () => {
  const client = createMockClient({
    lease: { success: true, task: null },
  });

  await runSinglePollExecution(client as never, {
    currentVersion: '1.0.0',
    deviceNumber: 'edge-test-a1b2c3',
    runtimeStartedAtMs: 1_000,
    now: () => 16_500,
  });

  expect(client.sendConnectivityHeartbeat).toHaveBeenCalledWith(
    expect.objectContaining({
      activeTask: false,
      runtimeState: 'IDLE',
      uptimeSeconds: 15,
      activeTaskId: undefined,
    }),
  );
});

it('reports BUSY runtime state and active task id when a task is leased', async () => {
  const client = createMockClient({
    lease: createLeaseTask({ taskId: 'task_123' }),
  });

  await runSinglePollExecution(client as never, {
    currentVersion: '1.0.0',
    deviceNumber: 'edge-test-a1b2c3',
    runtimeStartedAtMs: 1_000,
    now: () => 11_000,
  });

  expect(client.sendConnectivityHeartbeat).toHaveBeenCalledWith(
    expect.objectContaining({
      activeTask: true,
      runtimeState: 'BUSY',
      activeTaskId: 'task_123',
      uptimeSeconds: 10,
    }),
  );
});
```

If `createMockClient` or `createLeaseTask` do not exist exactly, add equivalent local helpers in `runner.spec.ts` using the existing mock style in that file.

- [ ] **Step 3: Run edge-agent tests to verify red**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- client.spec.ts runner.spec.ts
```

Expected: FAIL because heartbeat types and payloads do not include runtime health fields.

- [ ] **Step 4: Extend client heartbeat types and body**

In `apps/edge-agent/src/client.ts`, add:

```ts
export type RuntimeState = 'IDLE' | 'BUSY' | 'UPGRADING' | 'ERROR';
```

Extend `ConnectivityHeartbeatInput`:

```ts
runtimeState?: RuntimeState;
activeTaskId?: string;
uptimeSeconds?: number;
lastError?: string;
```

Add fields to the request body in `sendConnectivityHeartbeat`:

```ts
runtimeState: input.runtimeState,
activeTaskId: input.activeTaskId,
uptimeSeconds: input.uptimeSeconds,
lastError: input.lastError,
```

- [ ] **Step 5: Extend runner options and heartbeat payloads**

In `apps/edge-agent/src/runner.ts`, extend `RunnerOptions`:

```ts
runtimeStartedAtMs?: number;
now?: () => number;
```

Add helpers near `runSinglePollExecution`:

```ts
function getUptimeSeconds(options: RunnerOptions): number | undefined {
  if (options.runtimeStartedAtMs === undefined) {
    return undefined;
  }
  const now = options.now ?? Date.now;
  return Math.max(0, Math.floor((now() - options.runtimeStartedAtMs) / 1000));
}
```

Extend `safeSendConnectivityHeartbeat` payload type:

```ts
runtimeState?: 'IDLE' | 'BUSY' | 'UPGRADING' | 'ERROR';
activeTaskId?: string;
uptimeSeconds?: number;
lastError?: string;
```

When sending the normal connectivity heartbeat, include:

```ts
runtimeState: hasActiveTask ? 'BUSY' : 'IDLE',
activeTaskId: lease.task?.taskId,
uptimeSeconds: getUptimeSeconds(options),
```

When reporting upgrade status, include:

```ts
runtimeState: 'UPGRADING',
activeTaskId: lease.task?.taskId,
uptimeSeconds: getUptimeSeconds(options),
```

In the task execution `catch`, after `client.failTask(...)`, send:

```ts
await safeSendConnectivityHeartbeat({
  activeTask: false,
  currentVersion,
  deviceNumber: options.deviceNumber,
  platform: options.platform,
  arch: options.arch,
  runtimeState: 'ERROR',
  activeTaskId: lease.task.taskId,
  uptimeSeconds: getUptimeSeconds(options),
  lastError: message,
});
```

- [ ] **Step 6: Pass runtime start time from main**

In `apps/edge-agent/src/main.ts`, update `buildRunnerOptions` to accept an optional runtime start time if needed:

```ts
export function buildRunnerOptions(
  runtimeConfig: EdgeLocalConfig,
  platform: NodeJS.Platform,
  arch: string,
  runtimeStartedAtMs = Date.now(),
): RunnerOptions {
  return {
    currentVersion: runtimeConfig.currentVersion,
    deviceNumber: runtimeConfig.deviceNumber,
    platform,
    arch,
    runtimeStartedAtMs,
  };
}
```

Update existing `main.spec.ts` expected runner options to include `runtimeStartedAtMs` by passing a deterministic value in the test.

- [ ] **Step 7: Run edge-agent tests to verify green**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- client.spec.ts runner.spec.ts main.spec.ts daemon.spec.ts
```

Expected: PASS.

- [ ] **Step 8: Commit edge-agent implementation**

```bash
git add apps/edge-agent/src/client.ts apps/edge-agent/src/client.spec.ts apps/edge-agent/src/runner.ts apps/edge-agent/src/runner.spec.ts apps/edge-agent/src/main.ts apps/edge-agent/src/main.spec.ts
git commit -m "feat(edge-agent): report runtime health heartbeat"
```

## Task 5: Render Runtime Health In Edges UI

**Files:**

- Modify: `apps/web/src/app/(app)/edges/page.tsx`
- Modify: `apps/web/src/app/(app)/edges/page.test.tsx`

- [ ] **Step 1: Add failing UI rendering test**

Append to `apps/web/src/app/(app)/edges/page.test.tsx`:

```tsx
it('renders worker connectivity and runtime health details', () => {
  useQueryMock.mockReturnValue({
    data: {
      workers: [
        {
          id: 'worker-1',
          name: 'test Lab',
          platform: 'linux',
          version: '1.0.0',
          status: 'ACTIVE',
          hasActiveCredential: true,
          deviceNumber: 'edge-test-lab-a7k29f',
          lastSeenAt: '2026-06-01T12:00:00.000Z',
          connectivityStatus: 'STALE',
          runtimeState: 'BUSY',
          activeTaskId: 'task_123',
          uptimeSeconds: 125,
          lastError: 'previous gateway timeout',
          targetVersion: '1.0.1',
          upgradeStatus: 'UPGRADE_PENDING',
          upgradeMessage: null,
          createdAt: '2026-05-20T12:00:00.000Z',
          updatedAt: '2026-06-01T12:00:00.000Z',
        },
      ],
      edgeEnrollmentTokens: [],
    },
    loading: false,
    error: undefined,
    refetch: vi.fn(),
  });
  useMutationMock.mockReturnValue([vi.fn(), { loading: false }]);

  render(<EdgesPage />);

  expect(screen.getByText(/Connectivity Status: STALE/i)).toBeInTheDocument();
  expect(screen.getByText(/Runtime State: BUSY/i)).toBeInTheDocument();
  expect(screen.getByText(/Active Task: task_123/i)).toBeInTheDocument();
  expect(screen.getByText(/Uptime: 2m 5s/i)).toBeInTheDocument();
  expect(screen.getByText(/Last Error: previous gateway timeout/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run UI test to verify red**

Run:

```bash
pnpm --filter @luckyplans/web test -- page.test.tsx
```

Expected: FAIL because the query/type/rendering do not include the new fields.

- [ ] **Step 3: Extend GraphQL query**

In `apps/web/src/app/(app)/edges/page.tsx`, add fields to `WorkersQuery`:

```graphql
connectivityStatus
runtimeState
activeTaskId
uptimeSeconds
lastError
```

- [ ] **Step 4: Extend `Worker` type**

Add:

```ts
connectivityStatus: 'ONLINE' | 'STALE' | 'OFFLINE';
runtimeState: 'IDLE' | 'BUSY' | 'UPGRADING' | 'ERROR';
activeTaskId?: string | null;
uptimeSeconds?: number | null;
lastError?: string | null;
```

- [ ] **Step 5: Add uptime formatter**

Add near local helper logic:

```ts
function formatUptime(seconds?: number | null): string {
  if (seconds === null || seconds === undefined) {
    return 'N/A';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}
```

- [ ] **Step 6: Render health fields**

Inside each worker row details block, add:

```tsx
<p className="text-xs text-[#9ca3af]">
  Connectivity Status: {worker.connectivityStatus}
</p>
<p className="text-xs text-[#9ca3af]">Runtime State: {worker.runtimeState}</p>
<p className="text-xs text-[#9ca3af]">
  Active Task: {worker.activeTaskId ?? 'None'}
</p>
<p className="text-xs text-[#9ca3af]">Uptime: {formatUptime(worker.uptimeSeconds)}</p>
{worker.lastError ? (
  <p className="text-xs text-[#9ca3af]">Last Error: {worker.lastError}</p>
) : null}
```

- [ ] **Step 7: Update existing test fixtures**

For every worker fixture in `page.test.tsx`, add:

```ts
connectivityStatus: 'ONLINE',
runtimeState: 'IDLE',
activeTaskId: null,
uptimeSeconds: null,
lastError: null,
```

- [ ] **Step 8: Run UI tests to verify green**

Run:

```bash
pnpm --filter @luckyplans/web test -- page.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Commit UI implementation**

```bash
git add "apps/web/src/app/(app)/edges/page.tsx" "apps/web/src/app/(app)/edges/page.test.tsx"
git commit -m "feat(web): show edge runtime health"
```

## Task 6: Close EDGE-UPG-004 Issue Documentation

**Files:**

- Modify: `docs/issues/edge-upg-004-add-edge-runtime-health-snapshot-and-stale-worker-semantics.md`

- [ ] **Step 1: Add outcome section**

Append before `## Definition of Done`:

```md
## Outcome

Implemented edge runtime health snapshots on the existing Worker model:

- Added latest-known runtime health fields: `runtimeState`, `activeTaskId`, `uptimeSeconds`, and `lastError`.
- Extended edge connectivity heartbeat to report runtime health.
- Added gateway connectivity status computation with fixed thresholds: `ONLINE` within 60 seconds, `STALE` within 5 minutes, and `OFFLINE` after 5 minutes or when never seen.
- Exposed health fields through the workers GraphQL query.
- Updated the Edges UI to show connectivity status, runtime state, active task id, uptime, last error, version, target version, last seen, and upgrade status.

Verification notes:

- `pnpm --filter @luckyplans/api-gateway test -- workers.service.spec.ts edges-connectivity.controller.spec.ts` passed.
- `pnpm --filter @luckyplans/edge-agent test -- runner.spec.ts client.spec.ts daemon.spec.ts main.spec.ts` passed.
- `pnpm --filter @luckyplans/web test -- page.test.tsx` passed.
```

- [ ] **Step 2: Update Definition of Done**

Change the checklist to:

```md
- [x] Gateway tests pass for health updates.
- [x] Web tests pass for edge state display.
- [x] Docs updated where worker health semantics are described.
```

- [ ] **Step 3: Commit issue doc**

```bash
git add docs/issues/edge-upg-004-add-edge-runtime-health-snapshot-and-stale-worker-semantics.md
git commit -m "docs(edge): close runtime health issue"
```

## Task 7: Verification Gate

**Files:**

- No planned file changes.

- [ ] **Step 1: Run targeted gateway tests**

Run:

```bash
pnpm --filter @luckyplans/api-gateway test -- workers.service.spec.ts edges-connectivity.controller.spec.ts
```

Expected: PASS.

- [ ] **Step 2: Run targeted edge-agent tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- runner.spec.ts client.spec.ts daemon.spec.ts main.spec.ts
```

Expected: PASS.

- [ ] **Step 3: Run targeted web tests**

Run:

```bash
pnpm --filter @luckyplans/web test -- page.test.tsx
```

Expected: PASS.

- [ ] **Step 4: Run full repository gates**

Run:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm format:check
git diff --check
```

Expected: all PASS. If `pnpm build` rewrites `apps/web/next-env.d.ts`, run:

```bash
pnpm exec prettier --write apps/web/next-env.d.ts
pnpm format:check
```

Then report the generated-file change explicitly.

- [ ] **Step 5: Commit verification doc adjustments if needed**

If verification notes need updates after full gates:

```bash
git add docs/issues/edge-upg-004-add-edge-runtime-health-snapshot-and-stale-worker-semantics.md
git commit -m "docs(edge): record runtime health verification"
```

## Self-Review

Spec coverage:

- Runtime state reporting: Task 4.
- Optional active task, uptime, and last error fields: Tasks 2, 3, 4, and 5.
- Gateway stale/offline computation from `lastSeenAt`: Tasks 1 and 3.
- Edges UI fields: Task 5.
- No WebSocket sessions or separate session table: preserved by schema choices in Task 2.

Placeholder scan:

- The plan contains no intentionally incomplete steps.

Type consistency:

- Runtime state values are consistently `IDLE`, `BUSY`, `UPGRADING`, and `ERROR`.
- Connectivity status values are consistently `ONLINE`, `STALE`, and `OFFLINE`.
- Worker fields are consistently named `runtimeState`, `activeTaskId`, `uptimeSeconds`, and `lastError`.
