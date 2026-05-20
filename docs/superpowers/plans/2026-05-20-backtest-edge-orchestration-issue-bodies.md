# Backtest Edge Orchestration - GitHub Issue Bodies

## [BE-001] Scope 0 Contract Freeze Refresh

Depends on: none

### Goal
Lock the V2 spec contracts and naming canon as authoritative for implementation.

### Files
- `docs/superpowers/specs/2026-05-15-backtest-edge-orchestration-design.md`

### Tasks
- [ ] Reconfirm Sections 5 and 7 as authoritative contract blocks.
- [ ] Confirm Appendix A naming canon is final for V1.
- [ ] Confirm no `service-core` dependency in this initiative.

### Acceptance Criteria
- V1 contracts are approved and frozen.
- Explicit approval recorded for this scope.

### Definition of Done
- [ ] Spec review complete
- [ ] Approval comment recorded

---

## [BE-002] Scope 1 Worker Registry/UI Verification + Hardening

Depends on: BE-001

### Goal
Validate existing Scope 1 implementation and close quality gaps using TDD.

### Files
- `apps/api-gateway/src/workers/workers.service.ts`
- `apps/api-gateway/src/workers/workers.resolver.ts`
- `apps/api-gateway/src/workers/workers.resolver.spec.ts` (new)
- `apps/web/src/app/(app)/edges/page.tsx`
- `apps/web/src/app/(app)/edges/page.test.tsx` (new)

### TDD Checklist
- [ ] Write failing resolver tests for create/list/disable and unknown id disable.
- [ ] Write failing UI tests for list/create/disable/error states.
- [ ] Run tests and capture red state.
- [ ] Implement minimal fixes.
- [ ] Re-run tests to green.
- [ ] Refactor safely with tests green.

### Acceptance Criteria
- User can register/list/disable workers from UI.
- Scope 1 behavior covered by tests.

### Definition of Done
- [ ] Scoped tests pass
- [ ] Lint/type-check/build/format pass for touched work

---

## [BE-003] Scope 2 Worker Credential Security + Internal Worker Auth

Depends on: BE-002

### Goal
Implement worker credential lifecycle and internal worker authentication.

### Files
- `packages/prisma/prisma/schema.prisma`
- `apps/api-gateway/src/workers/credentials.service.ts` (new)
- `apps/api-gateway/src/workers/credentials.resolver.ts` (new)
- `apps/api-gateway/src/edges-internal/worker-auth.service.ts` (new)
- `apps/api-gateway/src/edges-internal/worker-auth.guard.ts` (new)
- `apps/api-gateway/src/edges-internal/worker-auth.guard.spec.ts` (new)

### TDD Checklist
- [ ] Add failing tests for verify/revoked/expired/rotation-overlap.
- [ ] Add failing guard tests for authorized/unauthorized calls.
- [ ] Run tests red.
- [ ] Implement minimal credential + guard logic.
- [ ] Run tests green.
- [ ] Refactor with tests green.

### Acceptance Criteria
- Hash-only credential storage.
- Revoked/expired credentials rejected.
- Internal endpoints protected by worker auth.

### Definition of Done
- [ ] Scoped tests pass
- [ ] Lint/type-check/build/format pass for touched work

---

## [BE-004] Scope 3 Task Skeleton + Lease/Heartbeat (Mock Compute)

Depends on: BE-003

### Goal
Implement task state machine and lease lifecycle with mock completion.

### Files
- `packages/prisma/prisma/schema.prisma`
- `apps/api-gateway/src/backtest/backtest.module.ts` (new)
- `apps/api-gateway/src/backtest/backtest.service.ts` (new)
- `apps/api-gateway/src/backtest/backtest.service.spec.ts` (new)
- `apps/api-gateway/src/edges-internal/edges-tasks.controller.ts` (new)
- `apps/api-gateway/src/edges-internal/edges-tasks.e2e-spec.ts` (new)

### TDD Checklist
- [ ] Write failing tests for allowed/forbidden transitions.
- [ ] Write failing tests for lease assign/heartbeat/expiry requeue.
- [ ] Write failing endpoint tests for next/heartbeat/complete/fail.
- [ ] Run tests red.
- [ ] Implement minimal orchestration + endpoint logic.
- [ ] Run tests green.

### Acceptance Criteria
- `AWAIT -> ASSIGNED -> PROCESSING -> DONE` works.
- Lease expiry requeues per contract.

### Definition of Done
- [ ] Scoped tests pass
- [ ] Lint/type-check/build/format pass for touched work

---

## [BE-005] Scope 3.5 Upgrade Control Plane

Depends on: BE-004

### Goal
Add release metadata and targetVersion orchestration controls.

### Files
- `packages/prisma/prisma/schema.prisma`
- `apps/api-gateway/src/workers/releases.service.ts` (new)
- `apps/api-gateway/src/workers/releases.resolver.ts` (new)
- `apps/api-gateway/src/workers/releases.service.spec.ts` (new)
- `apps/web/src/app/(app)/edges/page.tsx`

### TDD Checklist
- [ ] Write failing tests for release create/list.
- [ ] Write failing tests for targetVersion set flow.
- [ ] Write failing tests for upgrade status transitions.
- [ ] Run tests red.
- [ ] Implement minimal API + UI changes.
- [ ] Run tests green.

### Acceptance Criteria
- Target version can be set for selected workers.
- Upgrade status visible per worker.

### Definition of Done
- [ ] Scoped tests pass
- [ ] Lint/type-check/build/format pass for touched work

---

## [BE-006] Scope 4 Shared Runtime Import

Depends on: BE-005

### Goal
Port deterministic backtest runtime into shared module.

### Files
- `packages/shared/src/backtest-runtime/*` (new)
- `packages/shared/src/backtest-runtime/__tests__/*` (new)
- `packages/shared/src/index.ts`

### TDD Checklist
- [ ] Write failing deterministic fixture test.
- [ ] Run test red.
- [ ] Port runtime with path cleanup.
- [ ] Run test green (repeatability check).
- [ ] Refactor with tests green.

### Acceptance Criteria
- Repeated identical inputs produce stable outputs.

### Definition of Done
- [ ] Scoped tests pass
- [ ] Lint/type-check/build/format pass for touched work

---

## [BE-007] Scope 5 Real Grid Execution on Edge

Depends on: BE-006

### Goal
Enable real grid execution on edge and deduplicated result ingestion.

### Files
- `apps/edge-agent/src/*` (new)
- `apps/api-gateway/src/edges-internal/edges-tasks.controller.ts`
- `apps/api-gateway/src/backtest/backtest.service.ts`
- `apps/api-gateway/src/backtest/results-idempotency.spec.ts` (new)

### TDD Checklist
- [ ] Write failing dedupe tests for `(taskId, configId)`.
- [ ] Write failing integration test for small grid task run.
- [ ] Run tests red.
- [ ] Implement minimal agent execution + results reporting.
- [ ] Run tests green.

### Acceptance Criteria
- Small grid task completes and results are ranked/queryable.

### Definition of Done
- [ ] Scoped tests pass
- [ ] Lint/type-check/build/format pass for touched work

---

## [BE-008] Scope 6 Real Optuna Execution on Edge

Depends on: BE-007

### Goal
Enable optuna execution with progress and resume-safe behavior.

### Files
- `apps/edge-agent/src/*`
- `apps/api-gateway/src/backtest/backtest.service.ts`
- `apps/api-gateway/src/backtest/optuna-resume.e2e-spec.ts` (new)

### TDD Checklist
- [ ] Write failing tests for optuna completion + bestConfigIds.
- [ ] Write failing tests for restart/reconnect resume.
- [ ] Write failing tests for cancel to `CANCELLED`.
- [ ] Run tests red.
- [ ] Implement minimal optuna flow.
- [ ] Run tests green.

### Acceptance Criteria
- End-to-end optuna run succeeds and resume behavior is safe.

### Definition of Done
- [ ] Scoped tests pass
- [ ] Lint/type-check/build/format pass for touched work

---

## [BE-009] Scope 7 UX Hardening

Depends on: BE-008

### Goal
Deliver complete template/task/result lifecycle UX.

### Files
- `apps/web/src/app/(app)/backtests/templates/page.tsx` (new)
- `apps/web/src/app/(app)/backtests/tasks/page.tsx` (new)
- `apps/web/src/app/(app)/backtests/results/page.tsx` (new)
- `apps/web/src/hooks/backtests/*` (new)
- `apps/web/src/app/(app)/backtests/*.test.tsx` (new)

### TDD Checklist
- [ ] Write failing UI tests for create/monitor/cancel/retry.
- [ ] Write failing UI tests for result sorting/filtering/top-candidate.
- [ ] Run tests red.
- [ ] Implement minimal UI + hooks.
- [ ] Run tests green.

### Acceptance Criteria
- Full task lifecycle operable from UI.

### Definition of Done
- [ ] Scoped tests pass
- [ ] Lint/type-check/build/format pass for touched work

---

## [BE-010] Scope 8 Reliability + Ops Baseline

Depends on: BE-009

### Goal
Add retry limits, quarantine, stale-task recovery, audit logs, and metrics.

### Files
- `apps/api-gateway/src/backtest/backtest.service.ts`
- `apps/api-gateway/src/workers/*`
- `apps/api-gateway/src/observability/backtest.metrics.ts` (new)
- `apps/api-gateway/src/backtest/reliability.e2e-spec.ts` (new)

### TDD Checklist
- [ ] Write failing tests for repeated failures -> quarantine.
- [ ] Write failing tests for stale task auto-requeue.
- [ ] Write failing tests for required audit events.
- [ ] Run tests red.
- [ ] Implement minimal reliability + ops logic.
- [ ] Run tests green.

### Acceptance Criteria
- Worker drop/recovery path works without manual DB repair.

### Definition of Done
- [ ] Scoped tests pass
- [ ] Lint/type-check/build/format pass for touched work

---

## [BE-011] Global Verification Gate

Depends on: BE-010

### Goal
Run full repository verification before final closeout.

### Checklist
- [ ] `pnpm lint`
- [ ] `pnpm type-check`
- [ ] `pnpm build`
- [ ] `pnpm format:check`
- [ ] Update docs if any behavior/contracts changed.

### Acceptance Criteria
- All commands pass.
- Docs/specs updated where needed.

### Definition of Done
- [ ] Final verification output captured in PR/issue comment

