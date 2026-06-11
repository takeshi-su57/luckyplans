# Edge Lifecycle Observability Runbooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add safe edge lifecycle log events and operator runbooks for EDGE-UPG-011.

**Architecture:** Keep observability close to existing state transitions. The gateway logs upgrade status writes from `ReleasesService`, while the edge-agent emits dependency-free lifecycle events through a tiny local logger helper.

**Tech Stack:** TypeScript, NestJS `Logger`, Vitest, Next.js MDX content.

---

## File Structure

- Modify: `apps/api-gateway/src/workers/releases.service.ts` for safe gateway lifecycle logs.
- Modify: `apps/api-gateway/src/workers/releases.service.spec.ts` for gateway log behavior tests.
- Create: `apps/edge-agent/src/logger.ts` for dependency-free edge lifecycle logging.
- Modify: `apps/edge-agent/src/daemon.ts` to log daemon start and stop.
- Modify: `apps/edge-agent/src/runner.ts` to log heartbeat failures and upgrade reports.
- Modify: `apps/edge-agent/src/main.ts` to log startup, shutdown signals, daemon iteration failures, and fatal errors.
- Modify: `apps/edge-agent/src/daemon.spec.ts`, `apps/edge-agent/src/runner.spec.ts`, and `apps/edge-agent/src/main.spec.ts` for edge-agent log behavior.
- Modify: `apps/web/content/guides/observability.mdx` for edge lifecycle queries and troubleshooting links.
- Modify: `apps/web/content/guides/developer.mdx` for operator runbooks and smoke-check references.
- Modify: `docs/issues/edge-upg-011-add-edge-lifecycle-observability-and-operator-runbooks.md` to mark completed criteria.

### Task 1: Gateway Lifecycle Logs

**Files:**
- Modify: `apps/api-gateway/src/workers/releases.service.spec.ts`
- Modify: `apps/api-gateway/src/workers/releases.service.ts`

- [ ] **Step 1: Write failing tests**

Add tests that spy on the NestJS logger prototype and assert safe messages for `setWorkerTargetVersion()` and `reportWorkerUpgradeStatus()`.

- [ ] **Step 2: Verify red**

Run: `pnpm.cmd --filter @luckyplans/api-gateway test -- releases.service.spec.ts`

Expected: FAIL because `ReleasesService` does not log lifecycle transitions yet.

- [ ] **Step 3: Implement gateway logs**

Add `private readonly logger = new Logger(ReleasesService.name);` and log `edge.upgrade.target_assigned` plus `edge.upgrade.status_transition` with worker ids/status and message presence only.

- [ ] **Step 4: Verify green**

Run: `pnpm.cmd --filter @luckyplans/api-gateway test -- releases.service.spec.ts`

Expected: PASS.

### Task 2: Edge-Agent Lifecycle Logger

**Files:**
- Create: `apps/edge-agent/src/logger.ts`
- Modify: `apps/edge-agent/src/daemon.ts`
- Modify: `apps/edge-agent/src/runner.ts`
- Modify: `apps/edge-agent/src/main.ts`
- Modify: `apps/edge-agent/src/daemon.spec.ts`
- Modify: `apps/edge-agent/src/runner.spec.ts`
- Modify: `apps/edge-agent/src/main.spec.ts`

- [ ] **Step 1: Write failing tests**

Add tests for injected logger calls on daemon start/stop, heartbeat failure, upgrade status reporting, and shutdown signal logging.

- [ ] **Step 2: Verify red**

Run: `pnpm.cmd --filter @luckyplans/edge-agent test -- daemon.spec.ts runner.spec.ts main.spec.ts`

Expected: FAIL because the logger helper and hooks do not exist yet.

- [ ] **Step 3: Implement edge logger**

Create a minimal `EdgeAgentLogger` type and `edgeAgentLogger` implementation that logs event names plus safe metadata. Thread optional logger dependencies through daemon and runner options.

- [ ] **Step 4: Verify green**

Run: `pnpm.cmd --filter @luckyplans/edge-agent test -- daemon.spec.ts runner.spec.ts main.spec.ts`

Expected: PASS.

### Task 3: Operator Docs

**Files:**
- Modify: `apps/web/content/guides/observability.mdx`
- Modify: `apps/web/content/guides/developer.mdx`
- Modify: `docs/issues/edge-upg-011-add-edge-lifecycle-observability-and-operator-runbooks.md`

- [ ] **Step 1: Update observability guide**

Add edge lifecycle LogQL queries and link from the existing edge observability section to troubleshooting runbooks.

- [ ] **Step 2: Update developer guide runbooks**

Document stale worker, target version stuck, verification failure, service restart failure, and rollback checks.

- [ ] **Step 3: Update issue checklist**

Mark EDGE-UPG-011 definition-of-done items that are satisfied by this implementation.

### Task 4: Verification

**Files:**
- Verify all touched code and docs.

- [ ] **Step 1: Run focused tests**

Run:

```powershell
pnpm.cmd --filter @luckyplans/api-gateway test -- releases.service.spec.ts workers.service.spec.ts
pnpm.cmd --filter @luckyplans/edge-agent test -- daemon.spec.ts runner.spec.ts main.spec.ts
```

- [ ] **Step 2: Run required repo checks**

Run:

```powershell
pnpm.cmd lint
pnpm.cmd type-check
pnpm.cmd build
pnpm.cmd format:check
```

---

## Self-Review

- Spec coverage: gateway logs, edge-agent logs, docs/runbooks, docs linking, and sensitive logging review are covered.
- Placeholder scan: no open placeholders remain.
- Type consistency: `EdgeAgentLogger`, `ReleasesService`, and existing test filenames match current repo paths.

