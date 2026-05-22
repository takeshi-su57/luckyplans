# Backtest Edge Orchestration V1 - Issue Chain and TDD Execution Plan

> Execution unit: **one issue per scope**, each blocked by the previous issue.
> Delivery rule: **TDD is mandatory** in every scope.

## Issue Dependency Graph

1. `BE-001` Scope 0 Contract Freeze Refresh
Depends on: none

2. `BE-002` Scope 1 Worker Registry/UI Verification + Hardening
Depends on: `BE-001`

3. `BE-003` Scope 2 Worker Credential Security + Internal Worker Auth
Depends on: `BE-002`

4. `BE-004` Scope 3 Task Skeleton + Lease/Heartbeat (Mock Compute)
Depends on: `BE-003`

5. `BE-005` Scope 3.5 Upgrade Control Plane
Depends on: `BE-004`

6. `BE-006` Scope 4 Shared Runtime Import
Depends on: `BE-005`

7. `BE-007` Scope 5 Real Grid Execution on Edge
Depends on: `BE-006`

8. `BE-008` Scope 6 Real Optuna Execution on Edge
Depends on: `BE-007`

9. `BE-009` Scope 7 UX Hardening
Depends on: `BE-008`

10. `BE-010` Scope 8 Reliability + Ops Baseline
Depends on: `BE-009`

11. `BE-011` Global Verification Gate
Depends on: `BE-010`

---

## Issue Template (Use for every scope issue)

- **Title:** `[BE-XXX] <scope title>`
- **Depends on:** `<previous issue id>`
- **Goal:** one-sentence outcome
- **Files:** exact files to create/modify
- **TDD Checklist:**
  - [ ] Write failing tests first
  - [ ] Run tests and capture red state
  - [ ] Implement minimal code
  - [ ] Run scoped tests to green
  - [ ] Refactor safely (tests stay green)
  - [ ] Update docs/spec references if needed
- **Acceptance Criteria:** copied from V2 scope gate
- **Definition of Done:** tests green + lint/type-check/build/format for touched scope

---

## Issue Details

### BE-001 - Scope 0 Contract Freeze Refresh
**Depends on:** none
**Goal:** Lock V2 spec contracts and naming canon as authoritative.
**Files:**
- `docs/superpowers/specs/2026-05-15-backtest-edge-orchestration-design.md`

**TDD artifacts:** N/A (doc-only issue)

**Acceptance Criteria:**
- V1 contract sections (task machine, lease/API/credentials/security, upgrade contract) approved.
- Explicit note: no `service-core` dependency.

---

### BE-002 - Scope 1 Worker Registry/UI Verification + Hardening
**Depends on:** `BE-001`
**Goal:** Validate existing implementation and close quality gaps.
**Files:**
- `apps/api-gateway/src/workers/workers.service.ts`
- `apps/api-gateway/src/workers/workers.resolver.ts`
- `apps/api-gateway/src/workers/workers.resolver.spec.ts` (new)
- `apps/web/src/app/(app)/edges/page.tsx`
- `apps/web/src/app/(app)/edges/page.test.tsx` (new)

**TDD Plan:**
1. Add resolver tests for create/list/disable + unknown-id disable behavior.
2. Add UI tests for list rendering, create flow, disable flow, error state.
3. Run tests red.
4. Patch minimal service/UI handling.
5. Re-run to green.

**Acceptance Criteria:**
- User can register/list/disable workers from UI.
- Scope-1 behavior covered by automated tests.

---

### BE-003 - Scope 2 Worker Credential Security + Internal Worker Auth
**Depends on:** `BE-002`
**Goal:** Implement credential lifecycle and internal worker authentication.
**Files:**
- `packages/prisma/prisma/schema.prisma`
- `apps/api-gateway/src/workers/credentials.service.ts` (new)
- `apps/api-gateway/src/workers/credentials.resolver.ts` (new)
- `apps/api-gateway/src/edges-internal/worker-auth.service.ts` (new)
- `apps/api-gateway/src/edges-internal/worker-auth.guard.ts` (new)
- `apps/api-gateway/src/edges-internal/worker-auth.guard.spec.ts` (new)

**TDD Plan:**
1. Test credential verify success/failure/revoked/expired.
2. Test rotation overlap max-24h behavior.
3. Test auth guard pass/fail on internal endpoints.
4. Run red, implement minimum logic, run green.

**Acceptance Criteria:**
- Raw secret shown once, hash-only persistence.
- Revoked/expired credential rejected.
- Internal endpoints protected by worker auth.

---

### BE-004 - Scope 3 Task Skeleton + Lease/Heartbeat (Mock Compute)
**Depends on:** `BE-003`
**Goal:** Add orchestrator task state machine + lease mechanics with mock completion path.
**Files:**
- `packages/prisma/prisma/schema.prisma`
- `apps/api-gateway/src/backtest/backtest.module.ts` (new)
- `apps/api-gateway/src/backtest/backtest.service.ts` (new)
- `apps/api-gateway/src/backtest/backtest.service.spec.ts` (new)
- `apps/api-gateway/src/edges-internal/edges-tasks.controller.ts` (new)
- `apps/api-gateway/src/edges-internal/edges-tasks.e2e-spec.ts` (new)

**TDD Plan:**
1. Tests for allowed/forbidden transitions.
2. Tests for lease assignment, heartbeat extension, expiry requeue.
3. Tests for mock `next/heartbeat/complete/fail` flow.
4. Red -> minimal impl -> green.

**Acceptance Criteria:**
- `AWAIT -> ASSIGNED -> PROCESSING -> DONE` works.
- Lease expiry requeues per spec.

---

### BE-005 - Scope 3.5 Upgrade Control Plane
**Depends on:** `BE-004`
**Goal:** Add release metadata and targetVersion orchestration.
**Files:**
- `packages/prisma/prisma/schema.prisma`
- `apps/api-gateway/src/workers/releases.service.ts` (new)
- `apps/api-gateway/src/workers/releases.resolver.ts` (new)
- `apps/api-gateway/src/workers/releases.service.spec.ts` (new)
- `apps/web/src/app/(app)/edges/page.tsx`

**TDD Plan:**
1. Test release create/list and targetVersion assignment.
2. Test upgrade status ingestion lifecycle.
3. Test invalid checksum/signature rejection path.
4. Red -> minimum impl -> green.

**Acceptance Criteria:**
- User can set target version for selected workers.
- Upgrade status visible per worker.

---

### BE-006 - Scope 4 Shared Runtime Import
**Depends on:** `BE-005`
**Goal:** Port deterministic backtest runtime into shared module.
**Files:**
- `packages/shared/src/backtest-runtime/*` (new)
- `packages/shared/src/backtest-runtime/__tests__/*` (new)
- `packages/shared/src/index.ts`

**TDD Plan:**
1. Add deterministic fixture test.
2. Port runtime with path cleanup.
3. Re-run tests repeatedly for stability.

**Acceptance Criteria:**
- Same fixture input returns stable repeated metrics.

---

### BE-007 - Scope 5 Real Grid Execution on Edge
**Depends on:** `BE-006`
**Goal:** Execute real grid search on edge agent and ingest deduplicated results.
**Files:**
- `apps/edge-agent/src/*` (new)
- `apps/api-gateway/src/edges-internal/edges-tasks.controller.ts`
- `apps/api-gateway/src/backtest/backtest.service.ts`
- `apps/api-gateway/src/backtest/results-idempotency.spec.ts` (new)

**TDD Plan:**
1. Test duplicate `(taskId, configId)` ingestion dedupe.
2. Test end-to-end small grid task completion.
3. Red -> implement -> green.

**Acceptance Criteria:**
- Small grid task completes and ranked results persist.

---

### BE-008 - Scope 6 Real Optuna Execution on Edge
**Depends on:** `BE-007`
**Goal:** Add optuna execution with progress and resume safety.
**Files:**
- `apps/edge-agent/src/*`
- `apps/api-gateway/src/backtest/backtest.service.ts`
- `apps/api-gateway/src/backtest/optuna-resume.e2e-spec.ts` (new)

**TDD Plan:**
1. Test optuna completion with `bestConfigIds`.
2. Test restart/reconnect resume behavior.
3. Test cancel mid-run to `CANCELLED`.
4. Red -> implement -> green.

**Acceptance Criteria:**
- End-to-end optuna run works and survives reconnect.

---

### BE-009 - Scope 7 UX Hardening
**Depends on:** `BE-008`
**Goal:** Complete task/result UX lifecycle in web app.
**Files:**
- `apps/web/src/app/(app)/backtests/templates/page.tsx` (new)
- `apps/web/src/app/(app)/backtests/tasks/page.tsx` (new)
- `apps/web/src/app/(app)/backtests/results/page.tsx` (new)
- `apps/web/src/hooks/backtests/*` (new)
- `apps/web/src/app/(app)/backtests/*.test.tsx` (new)

**TDD Plan:**
1. UI tests for create/monitor/cancel/retry.
2. UI tests for sorting/filtering/top-candidate view.
3. Red -> implement -> green.

**Acceptance Criteria:**
- User can run full lifecycle from UI.

---

### BE-010 - Scope 8 Reliability + Ops Baseline
**Depends on:** `BE-009`
**Goal:** Add quarantine/retry limits/stale recovery/audit/metrics.
**Files:**
- `apps/api-gateway/src/backtest/backtest.service.ts`
- `apps/api-gateway/src/workers/*`
- `apps/api-gateway/src/observability/backtest.metrics.ts` (new)
- `apps/api-gateway/src/backtest/reliability.e2e-spec.ts` (new)

**TDD Plan:**
1. Test repeated worker failure -> quarantine.
2. Test stale task auto-requeue.
3. Test audit event emission for required events.
4. Red -> implement -> green.

**Acceptance Criteria:**
- System recovers without manual DB repair.

---

### BE-011 - Global Verification Gate
**Depends on:** `BE-010`
**Goal:** Enforce repo-wide completion checks before closeout.

**Commands (must pass):**
- `pnpm lint`
- `pnpm type-check`
- `pnpm build`
- `pnpm format:check`

**Acceptance Criteria:**
- All commands pass.
- Any docs/spec deltas synced.

---

## Delivery Policy

- No issue may start until dependency issue is closed.
- Every issue follows red -> green -> refactor.
- Every issue ends with scoped tests passing.
- Merge/PR checks enforce global verification at BE-011.
