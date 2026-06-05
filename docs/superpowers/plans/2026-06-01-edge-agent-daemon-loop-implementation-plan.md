# Edge Agent Daemon Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the edge-agent from a single poll execution entrypoint into a managed long-running daemon loop with shutdown, interval, and backoff behavior.

**Architecture:** Add a focused `daemon.ts` module that owns loop scheduling, backoff, and shutdown state while preserving `runSinglePollExecution` as the one-cycle execution primitive. `main.ts` should only resolve config, construct `EdgeApiClient`, create daemon options from environment/runtime metadata, and start the daemon. The daemon must be testable without real timers by injecting `sleep`, `now`, and a shutdown signal.

**Tech Stack:** TypeScript, Node.js runtime, Vitest, existing edge-agent REST client and runner.

---

## Scope

Implements `EDGE-UPG-003`.

In scope:

- Long-running daemon loop.
- Configurable poll interval and failure backoff.
- Graceful shutdown signal handling.
- No concurrent task execution.
- Local package script for daemon mode.
- Edge-agent unit tests.

Out of scope:

- systemd or Windows Service installation.
- WebSocket transport.
- Gateway task scheduling changes.
- Artifact download/install/rollback behavior.

## File Map

- Create: `apps/edge-agent/src/daemon.ts`
  - Owns loop behavior, injected sleep, backoff, and shutdown checks.
- Create: `apps/edge-agent/src/daemon.spec.ts`
  - Tests idle loop, repeated execution, transient failure backoff, shutdown, and no overlap.
- Modify: `apps/edge-agent/src/main.ts`
  - Starts daemon by default and keeps config resolution behavior.
- Modify: `apps/edge-agent/src/main.spec.ts`
  - Adds coverage for env-derived daemon options if helper extraction is added.
- Modify: `apps/edge-agent/src/runner.ts`
  - Export the existing `RunnerOptions` type if daemon tests or main need it.
- Modify: `apps/edge-agent/package.json`
  - Add a local script that clearly runs the daemon.
- Modify: `docs/issues/edge-upg-003-convert-edge-agent-from-single-poll-execution-to-managed-daemon-loop.md`
  - Add outcome and verification notes after implementation.

## Design Decisions

1. Keep `runSinglePollExecution` as the task execution unit. The daemon calls it once per loop iteration.
2. Use a `ShutdownSignal` abstraction instead of directly coupling tests to process signals.
3. Default interval values:
   - `pollIntervalMs`: 15000
   - `failureBackoffMs`: 5000
   - `maxFailureBackoffMs`: 60000
4. Backoff resets after a successful loop iteration.
5. No overlap is achieved by awaiting each `runOnce` call before sleeping and starting the next iteration.
6. `main.ts` registers SIGINT/SIGTERM handlers and passes their signal to the daemon.

## Task 1: Add Daemon Loop Primitive

**Files:**

- Create: `apps/edge-agent/src/daemon.ts`
- Create: `apps/edge-agent/src/daemon.spec.ts`

- [ ] **Step 1: Write failing daemon idle-loop test**

Add `apps/edge-agent/src/daemon.spec.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { createShutdownSignal, runEdgeDaemon } from './daemon';

describe('runEdgeDaemon', () => {
  it('runs one iteration and sleeps with the poll interval before shutdown', async () => {
    const shutdown = createShutdownSignal();
    const runOnce = vi.fn().mockResolvedValue({ executed: false });
    const sleep = vi.fn().mockImplementation(async () => {
      shutdown.request('test');
    });

    await runEdgeDaemon({
      runOnce,
      shutdown,
      sleep,
      pollIntervalMs: 15000,
      failureBackoffMs: 5000,
      maxFailureBackoffMs: 60000,
    });

    expect(runOnce).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(15000, shutdown);
  });
});
```

- [ ] **Step 2: Run daemon test to verify red**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- daemon.spec.ts
```

Expected: FAIL because `./daemon` does not exist.

- [ ] **Step 3: Implement minimal daemon module**

Create `apps/edge-agent/src/daemon.ts`:

```ts
export type ShutdownReason = 'signal' | 'test';

export type ShutdownSignal = {
  readonly requested: boolean;
  readonly reason?: ShutdownReason | string;
  request: (reason: ShutdownReason | string) => void;
};

export type Sleep = (durationMs: number, shutdown: ShutdownSignal) => Promise<void>;

export type RunOnce = () => Promise<unknown>;

export type EdgeDaemonOptions = {
  runOnce: RunOnce;
  shutdown: ShutdownSignal;
  sleep?: Sleep;
  pollIntervalMs?: number;
  failureBackoffMs?: number;
  maxFailureBackoffMs?: number;
  onError?: (error: unknown) => void;
};

export function createShutdownSignal(): ShutdownSignal {
  let requested = false;
  let reason: ShutdownReason | string | undefined;
  return {
    get requested() {
      return requested;
    },
    get reason() {
      return reason;
    },
    request(nextReason: ShutdownReason | string) {
      requested = true;
      reason = nextReason;
    },
  };
}

export async function runEdgeDaemon(options: EdgeDaemonOptions): Promise<void> {
  const shutdown = options.shutdown;
  const sleep = options.sleep ?? sleepWithTimeout;
  const pollIntervalMs = options.pollIntervalMs ?? 15000;
  const failureBackoffMs = options.failureBackoffMs ?? 5000;
  const maxFailureBackoffMs = options.maxFailureBackoffMs ?? 60000;
  let nextFailureBackoffMs = failureBackoffMs;

  while (!shutdown.requested) {
    try {
      await options.runOnce();
      nextFailureBackoffMs = failureBackoffMs;
      if (!shutdown.requested) {
        await sleep(pollIntervalMs, shutdown);
      }
    } catch (error) {
      options.onError?.(error);
      if (!shutdown.requested) {
        await sleep(nextFailureBackoffMs, shutdown);
      }
      nextFailureBackoffMs = Math.min(nextFailureBackoffMs * 2, maxFailureBackoffMs);
    }
  }
}

export async function sleepWithTimeout(
  durationMs: number,
  shutdown: ShutdownSignal,
): Promise<void> {
  if (shutdown.requested) {
    return;
  }
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, durationMs);
    if (shutdown.requested) {
      clearTimeout(timeout);
      resolve();
    }
  });
}
```

- [ ] **Step 4: Run daemon test to verify green**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- daemon.spec.ts
```

Expected: PASS for the first daemon test.

- [ ] **Step 5: Commit**

```bash
git add apps/edge-agent/src/daemon.ts apps/edge-agent/src/daemon.spec.ts
git commit -m "feat(edge-agent): add daemon loop primitive"
```

## Task 2: Add Daemon Backoff And Shutdown Tests

**Files:**

- Modify: `apps/edge-agent/src/daemon.spec.ts`
- Modify: `apps/edge-agent/src/daemon.ts`

- [ ] **Step 1: Add failing tests for transient failure backoff and reset**

Append to `apps/edge-agent/src/daemon.spec.ts` inside the existing `describe` block:

```ts
it('uses capped exponential backoff for transient failures', async () => {
  const shutdown = createShutdownSignal();
  const runOnce = vi
    .fn()
    .mockRejectedValueOnce(new Error('first failure'))
    .mockRejectedValueOnce(new Error('second failure'))
    .mockRejectedValueOnce(new Error('third failure'));
  const sleep = vi.fn().mockImplementation(async () => {
    if (sleep.mock.calls.length === 3) {
      shutdown.request('test');
    }
  });
  const onError = vi.fn();

  await runEdgeDaemon({
    runOnce,
    shutdown,
    sleep,
    pollIntervalMs: 15000,
    failureBackoffMs: 5000,
    maxFailureBackoffMs: 12000,
    onError,
  });

  expect(onError).toHaveBeenCalledTimes(3);
  expect(sleep.mock.calls.map((call) => call[0])).toEqual([5000, 10000, 12000]);
});

it('resets failure backoff after a successful iteration', async () => {
  const shutdown = createShutdownSignal();
  const runOnce = vi
    .fn()
    .mockRejectedValueOnce(new Error('first failure'))
    .mockResolvedValueOnce({ executed: false })
    .mockRejectedValueOnce(new Error('second failure'));
  const sleep = vi.fn().mockImplementation(async () => {
    if (sleep.mock.calls.length === 3) {
      shutdown.request('test');
    }
  });

  await runEdgeDaemon({
    runOnce,
    shutdown,
    sleep,
    pollIntervalMs: 15000,
    failureBackoffMs: 5000,
    maxFailureBackoffMs: 60000,
  });

  expect(sleep.mock.calls.map((call) => call[0])).toEqual([5000, 15000, 5000]);
});
```

- [ ] **Step 2: Run daemon tests to verify red if behavior is incomplete**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- daemon.spec.ts
```

Expected: PASS if Task 1 implementation already included the backoff behavior exactly; otherwise FAIL with backoff mismatch.

- [ ] **Step 3: Adjust implementation only if tests fail**

If the tests fail, update `runEdgeDaemon` so:

```ts
nextFailureBackoffMs = failureBackoffMs;
```

runs only after successful `runOnce`, and:

```ts
nextFailureBackoffMs = Math.min(nextFailureBackoffMs * 2, maxFailureBackoffMs);
```

runs after each failed iteration.

- [ ] **Step 4: Run daemon tests to verify green**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- daemon.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/edge-agent/src/daemon.ts apps/edge-agent/src/daemon.spec.ts
git commit -m "test(edge-agent): cover daemon backoff behavior"
```

## Task 3: Wire Main Entrypoint To Daemon

**Files:**

- Modify: `apps/edge-agent/src/main.ts`
- Modify: `apps/edge-agent/src/main.spec.ts`
- Modify: `apps/edge-agent/src/runner.ts`

- [ ] **Step 1: Export `RunnerOptions`**

Modify `apps/edge-agent/src/runner.ts`:

```ts
export type RunnerOptions = {
  currentVersion?: string;
  deviceNumber?: string;
  platform?: string;
  arch?: string;
  downloadUpgradeArtifact?: () => Promise<unknown>;
  verifyUpgradeArtifact?: (artifact: unknown) => Promise<boolean>;
  installUpgradeArtifact?: (artifact: unknown) => Promise<void>;
};
```

- [ ] **Step 2: Extract runtime options helper in `main.ts`**

Modify imports in `apps/edge-agent/src/main.ts`:

```ts
import { createShutdownSignal, runEdgeDaemon, type EdgeDaemonOptions } from './daemon';
import { runSinglePollExecution, type RunnerOptions } from './runner';
```

Add after `resolveRuntimeConfig`:

```ts
export function buildRunnerOptions(
  runtimeConfig: EdgeLocalConfig,
  platform: NodeJS.Platform,
  arch: string,
): RunnerOptions {
  return {
    currentVersion: runtimeConfig.currentVersion,
    deviceNumber: runtimeConfig.deviceNumber,
    platform,
    arch,
  };
}

export function buildDaemonOptions(input: {
  runOnce: () => Promise<unknown>;
  shutdown: EdgeDaemonOptions['shutdown'];
  env?: NodeJS.ProcessEnv;
}): EdgeDaemonOptions {
  const env = input.env ?? process.env;
  return {
    runOnce: input.runOnce,
    shutdown: input.shutdown,
    pollIntervalMs: parsePositiveInt(env.EDGE_AGENT_POLL_INTERVAL_MS, 15000),
    failureBackoffMs: parsePositiveInt(env.EDGE_AGENT_FAILURE_BACKOFF_MS, 5000),
    maxFailureBackoffMs: parsePositiveInt(env.EDGE_AGENT_MAX_BACKOFF_MS, 60000),
    onError: (error) => {
      console.warn('[edge-agent] daemon iteration failed', error);
    },
  };
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
```

- [ ] **Step 3: Write failing tests for option helpers**

Append to `apps/edge-agent/src/main.spec.ts`:

```ts
import { buildDaemonOptions, buildRunnerOptions } from './main';

it('builds runner options from persisted config and runtime platform', () => {
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
  );

  expect(options).toEqual({
    currentVersion: '1.0.0',
    deviceNumber: 'edge-seoul-a1b2c3',
    platform: 'linux',
    arch: 'x64',
  });
});

it('builds daemon options from interval environment variables', () => {
  const shutdown = { requested: false, request: vi.fn() };
  const runOnce = vi.fn();
  const options = buildDaemonOptions({
    runOnce,
    shutdown,
    env: {
      EDGE_AGENT_POLL_INTERVAL_MS: '250',
      EDGE_AGENT_FAILURE_BACKOFF_MS: '100',
      EDGE_AGENT_MAX_BACKOFF_MS: '1000',
    },
  });

  expect(options.pollIntervalMs).toBe(250);
  expect(options.failureBackoffMs).toBe(100);
  expect(options.maxFailureBackoffMs).toBe(1000);
});
```

- [ ] **Step 4: Run main tests to verify red or compile failure**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- main.spec.ts
```

Expected: FAIL until helpers are exported and imports are adjusted.

- [ ] **Step 5: Replace single execution in `main` with daemon**

Modify `main()` in `apps/edge-agent/src/main.ts`:

```ts
async function main() {
  const runtimeConfig = await resolveRuntimeConfig();

  const client = new EdgeApiClient(
    runtimeConfig.serverUrl,
    runtimeConfig.workerId,
    runtimeConfig.credential,
  );
  const shutdown = createShutdownSignal();
  registerProcessShutdownHandlers(shutdown);
  const runnerOptions = buildRunnerOptions(runtimeConfig, process.platform, process.arch);

  await runEdgeDaemon(
    buildDaemonOptions({
      shutdown,
      runOnce: () => runSinglePollExecution(client, runnerOptions),
    }),
  );
}
```

Add:

```ts
function registerProcessShutdownHandlers(shutdown: ReturnType<typeof createShutdownSignal>) {
  process.once('SIGINT', () => shutdown.request('signal'));
  process.once('SIGTERM', () => shutdown.request('signal'));
}
```

- [ ] **Step 6: Run main and daemon tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- main.spec.ts daemon.spec.ts runner.spec.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/edge-agent/src/main.ts apps/edge-agent/src/main.spec.ts apps/edge-agent/src/runner.ts
git commit -m "feat(edge-agent): run daemon from main entrypoint"
```

## Task 4: Add Package Script For Local Daemon Execution

**Files:**

- Modify: `apps/edge-agent/package.json`

- [ ] **Step 1: Add script**

Modify `apps/edge-agent/package.json` scripts:

```json
"start": "node dist/main.js",
"dev": "tsx src/main.ts"
```

If `tsx` is not already available in the workspace, do not add it. Use this instead:

```json
"start": "node dist/main.js"
```

The `start` script is sufficient for local daemon execution after `pnpm --filter @luckyplans/edge-agent build`.

- [ ] **Step 2: Run package JSON format check**

Run:

```bash
pnpm exec prettier --check apps/edge-agent/package.json
```

Expected: PASS.

- [ ] **Step 3: Run edge-agent build**

Run:

```bash
pnpm --filter @luckyplans/edge-agent build
```

Expected: PASS and `dist/main.js` exists.

- [ ] **Step 4: Commit**

```bash
git add apps/edge-agent/package.json
git commit -m "chore(edge-agent): add daemon start script"
```

## Task 5: Close EDGE-UPG-003 Issue Documentation

**Files:**

- Modify: `docs/issues/edge-upg-003-convert-edge-agent-from-single-poll-execution-to-managed-daemon-loop.md`

- [ ] **Step 1: Add outcome section**

Append before `## Definition of Done`:

```md
## Outcome

Implemented the edge-agent daemon loop:

- Added `runEdgeDaemon` with injected sleep, shutdown signal, poll interval, and capped failure backoff.
- Preserved `runSinglePollExecution` as the one-cycle task execution primitive.
- Wired `main.ts` to start the daemon and register SIGINT/SIGTERM shutdown handlers.
- Added a package start script for running the built daemon locally.

Verification notes:

- `pnpm --filter @luckyplans/edge-agent test -- daemon.spec.ts main.spec.ts runner.spec.ts` passed.
- `pnpm --filter @luckyplans/edge-agent build` passed.
```

- [ ] **Step 2: Check Definition of Done**

Update the checklist:

```md
- [x] Tests cover idle loop, task loop, transient failure, active task gating, and shutdown.
- [x] No OS-specific service installer behavior is included.
- [x] Edge-agent package scripts support running the daemon locally.
```

- [ ] **Step 3: Commit**

```bash
git add docs/issues/edge-upg-003-convert-edge-agent-from-single-poll-execution-to-managed-daemon-loop.md
git commit -m "docs(edge): close daemon loop issue"
```

## Task 6: Verification Gate

**Files:**

- No planned file changes.

- [ ] **Step 1: Run targeted edge-agent tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- daemon.spec.ts main.spec.ts runner.spec.ts client.spec.ts
```

Expected: PASS.

- [ ] **Step 2: Run edge-agent type-check**

Run:

```bash
pnpm --filter @luckyplans/edge-agent type-check
```

Expected: PASS.

- [ ] **Step 3: Run full repository gates**

Run:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm format:check
```

Expected: all PASS. If `pnpm build` rewrites `apps/web/next-env.d.ts`, run:

```bash
pnpm exec prettier --write apps/web/next-env.d.ts
pnpm format:check
```

Then report the generated-file change explicitly.

- [ ] **Step 4: Commit verification docs if needed**

If the issue doc verification notes need updates:

```bash
git add docs/issues/edge-upg-003-convert-edge-agent-from-single-poll-execution-to-managed-daemon-loop.md
git commit -m "docs(edge): record daemon verification"
```

## Self-Review

Spec coverage:

- Long-running loop: Task 1 and Task 3.
- Configurable intervals: Task 3.
- No concurrent task execution: Task 1 design awaits each `runOnce`; existing runner remains one-cycle.
- Active task upgrade deferral: preserved in `runSinglePollExecution`; covered by existing runner tests and Task 6 targeted test run.
- Transient failure backoff: Task 2.
- SIGINT/SIGTERM shutdown: Task 3.
- Existing single execution behavior remains testable: Task 3 keeps `runSinglePollExecution` and reruns `runner.spec.ts`.
- Local daemon script: Task 4.

Placeholder scan:

- No `TBD`, `TODO`, "fill in details", or undefined function references are intentionally left in this plan.

Type consistency:

- `EdgeDaemonOptions`, `ShutdownSignal`, `RunOnce`, and `RunnerOptions` are defined before later tasks reference them.
