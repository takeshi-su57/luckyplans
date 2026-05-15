# Backtest Edge Orchestration Design

Date: 2026-05-15
Status: Approved (direction) - detailed spec
Owner: LuckyPlans

## 1. Goal

Bring back the alpha backtest capability into beta with an edge-compute architecture:
- Orchestration layer (beta backend) manages templates, tasks, assignment, status, retries, and results.
- Edge agents perform CPU-heavy strategy search (grid or Optuna) and backtest execution locally.
- Beta web UI allows template creation, task creation, live monitoring, and result exploration.

## 2. Scope

### In scope (Phase 1)
- Strategy template CRUD.
- Backtest task creation using a template.
- Search modes: `grid` and `optuna`.
- Explicit edge assignment (`task -> specific edge`) at creation time.
- Worker lease + heartbeat + cancellation + retry.
- Result persistence and top-candidate retrieval.
- Minimal UI to create templates/tasks and view task progress/results.

### Out of scope (Phase 1)
- Full validation pipeline (walk-forward, robustness steps) as first delivery requirement.
- Multi-tenant billing/rate limits.
- Public edge marketplace.

## 3. Architecture

### 3.1 Components
- `apps/web`:
  - Backtest pages for templates/tasks/results.
- `apps/api-gateway`:
  - GraphQL API for UI actions and queries.
  - Internal edge API (HTTP) for poll/heartbeat/report.
  - Session-based user auth for humans.
- `apps/service-core`:
  - Business logic and persistence operations via Redis message patterns.
- `Edge Agent` (new deployable client app):
  - Authenticates as a worker.
  - Polls for assigned work.
  - Executes search + backtests.
  - Reports progress and results.
- `packages/shared`:
  - Shared enums/types/message patterns for backtest domain.
- `packages/prisma`:
  - Backtest data models and migrations.

### 3.2 Responsibility split
- Orchestrator is source of truth for task state.
- Edge agent is stateless executor from orchestrator perspective.
- Backtest compute engine from alpha is reused in edge runtime, not in gateway request path.

## 4. Domain Model (Beta)

Adopt alpha-inspired models with worker-awareness:
- `StrategyTemplate`
  - `id, name, category, factoryConfig, isActive, createdAt, updatedAt`
- `BacktestTask`
  - `id, name, symbol, interval, startDate, endDate`
  - `searchStrategy (grid|optuna), optimizationParams, optimizationMetrics, trials`
  - `status (AWAIT, ASSIGNED, PROCESSING, DONE, FAILED, CANCELLED)`
  - `assignedWorkerId, leaseExpiresAt, lastHeartbeat`
  - `totalConfigs, processedConfigs, currentConfig, bestConfigIds`
  - `errorMessage, createdAt, startedAt, completedAt`
- `BacktestResult`
  - `id, taskId, configId, strategyConfig`
  - metrics (`pnl`, `winRate`, `drawdown`, `sharpe`, `profitFactor`, etc.)
  - `resultFolder, createdAt`
- `Worker`
  - `id, name, status, capabilities, trustLevel, version, lastSeenAt`
- `WorkerCredential`
  - `workerId, keyPrefix, keyHash, status, expiresAt, rotatedAt`

Notes:
- Keep required-new-column safety: introduce nullable/default-first migration, backfill, then tighten.
- Store only hashed credentials; never raw worker secrets.

## 5. Task Lifecycle

1. User creates template.
2. User creates task from template with search mode and target edge.
3. Task state: `AWAIT`.
4. Edge polls `/internal/edges/tasks/next`.
5. Orchestrator validates edge identity and assignment; returns leased task.
6. Task state: `ASSIGNED` -> `PROCESSING`.
7. Edge runs search (`grid` or `optuna`) and executes backtests.
8. Edge heartbeats every 10s with progress.
9. Edge posts results in batches + final completion payload (`bestConfigIds`).
10. Task state: `DONE` (or `FAILED`/`CANCELLED`).
11. If heartbeat timeout or lease expiry: orchestrator re-queues or fails by policy.

## 6. API Contracts

### 6.1 User-facing GraphQL (gateway)
- `createStrategyTemplate(input)`
- `updateStrategyTemplate(input)`
- `createBacktestTask(input)` including `assignedWorkerId`
- `cancelBacktestTask(taskId)`
- `retryBacktestTask(taskId)`
- Queries: `backtestTasks`, `backtestTask(id)`, `backtestResults(taskId, sort/paging)`
- Subscription: `backtestTaskUpdated`, `backtestResultCreated`

### 6.2 Internal edge API (gateway HTTP)
- `POST /internal/edges/auth/register` (bootstrap path, optional)
- `POST /internal/edges/tasks/next` (poll)
- `POST /internal/edges/tasks/:id/heartbeat`
- `POST /internal/edges/tasks/:id/results` (batch)
- `POST /internal/edges/tasks/:id/complete`
- `POST /internal/edges/tasks/:id/fail`

All internal endpoints require worker auth + authorization checks.

## 7. Security Design

- Separate auth domains:
  - User auth: existing gateway session (`session_id` cookie).
  - Edge auth: worker credentials (not user API keys).
- Worker credential model:
  - Prefix + hashed secret storage.
  - Rotation + revocation support.
  - Optional short-lived signed session token after initial auth.
- Optional network hardening:
  - Start with HTTPS + strict auth.
  - Add private network (WireGuard) in production hardening phase.
- Task integrity:
  - Include nonce and lease metadata.
  - Reject stale/expired updates.
- Abuse controls:
  - Heartbeat timeout handling.
  - Retry limits and quarantine worker status on repeated failures.
- Data minimization:
  - Send only required strategy config + date range + symbol.

## 8. Migration Plan from Alpha

### Phase A: Extract and package compute runtime
- Reuse alpha `src/backtest` engine, components, indicators, and worker execution logic.
- Refactor into beta-compatible module/package for edge runtime consumption.
- Remove direct coupling to alpha path assumptions.

### Phase B: Persistence + contracts
- Add Prisma models in `packages/prisma`.
- Add shared message patterns/types in `packages/shared`.
- Implement service-core backtest services/controllers.

### Phase C: Gateway + internal edge API
- Add GraphQL resolvers for templates/tasks/results.
- Add internal edge controller for poll/heartbeat/results/complete/fail.
- Add auth guard for worker credentials.

### Phase D: Edge agent app
- New edge executable/service:
  - Authenticate, poll, execute grid/optuna, heartbeat, report.
- Integrate alpha optimizer flow (Optuna) behind edge runtime.

### Phase E: UI
- Port minimal alpha backtest UI patterns into `apps/web`:
  - Template list/create/edit.
  - Task creation (choose template/search mode/assigned edge).
  - Task list with live progress.
  - Results table.

### Phase F: Reliability hardening
- Lease expiry/requeue policy.
- Idempotent result ingestion by `(taskId, configId)`.
- Resume support for interrupted optuna tasks.

## 9. Testing Strategy

- Unit:
  - task state transitions
  - lease/heartbeat timeout logic
  - worker auth validation
- Integration:
  - create task -> assigned edge poll -> processing -> done
  - cancel and retry flows
  - duplicate result submissions (idempotency)
- E2E:
  - UI template/task workflow with one local edge agent
- Non-functional:
  - long-running task stability
  - concurrent tasks across multiple edges

## 10. Risks and Mitigations

- Risk: edge compromise or incorrect results.
  - Mitigation: worker trust levels, optional duplicate verification for high-value tasks.
- Risk: orchestrator restart during long jobs.
  - Mitigation: DB-backed task state + lease model; edge reconnect logic.
- Risk: optuna/python dependency drift on edge.
  - Mitigation: containerized edge runtime versioning.

## 11. Delivery Slices

- Slice 1: Template CRUD + task CRUD + assignment + mock edge completion.
- Slice 2: Real edge agent with grid search execution.
- Slice 3: Optuna execution on edge + progress + resume handling.
- Slice 4: UI polish + operational metrics/alerts.

## 12. Acceptance Criteria (Phase 1)

- User can create a strategy template and a task with `grid` or `optuna` mode.
- User can assign task to a specific edge.
- Assigned edge can poll and execute task end-to-end.
- Orchestrator tracks progress via heartbeat and surfaces status in UI.
- Results and top configs are queryable in UI.
- Cancellation and retry work without data corruption.
- Worker credentials are hashed at rest and revocable.

## 13. V1 Contract Freeze (Authoritative)

This section is normative for implementation scopes. If any later section conflicts, this section wins.

### 13.1 Task State Machine

Allowed statuses:
- `AWAIT`
- `ASSIGNED`
- `PROCESSING`
- `DONE`
- `FAILED`
- `CANCELLED`

Allowed transitions only:
- `AWAIT -> ASSIGNED`
- `ASSIGNED -> PROCESSING`
- `ASSIGNED -> AWAIT` (lease expiry recovery)
- `PROCESSING -> DONE`
- `PROCESSING -> FAILED`
- `PROCESSING -> CANCELLED`
- `ASSIGNED -> CANCELLED`
- `AWAIT -> CANCELLED`
- `FAILED -> AWAIT` (retry)
- `CANCELLED -> AWAIT` (retry)

Forbidden transitions:
- Any transition from `DONE`
- `AWAIT -> PROCESSING` (must be leased first)
- `PROCESSING -> ASSIGNED`

### 13.2 Assignment and Lease Rules

- A task must have exactly one `assignedWorkerId` while in `ASSIGNED` or `PROCESSING`.
- A worker can only poll and lease tasks where `assignedWorkerId == worker.id`.
- Lease duration: 60 seconds.
- Heartbeat interval target: 10 seconds.
- Lease extension rule: each valid heartbeat extends `leaseExpiresAt = now + 60s`.
- Requeue rule: if `now > leaseExpiresAt` and task is `ASSIGNED` or `PROCESSING`, task moves to `AWAIT`, `currentConfig` is cleared, and assignment remains unchanged (sticky assignment for V1).
- Cancel rule: cancelled tasks cannot be leased.

### 13.3 Internal Edge API Contract (V1)

All endpoints require worker authentication.

1. `POST /internal/edges/tasks/next`
- Request body:
```json
{
  "workerId": "uuid"
}
```
- Success response (task available):
```json
{
  "success": true,
  "task": {
    "taskId": "uuid",
    "name": "string",
    "symbol": "BTCUSDT",
    "interval": "1m",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-06-01T00:00:00.000Z",
    "searchStrategy": "grid",
    "optimizationParams": {},
    "optimizationMetrics": ["sharpeRatio"],
    "trials": 200,
    "leaseExpiresAt": "2026-05-15T12:00:00.000Z"
  }
}
```
- Success response (no task):
```json
{
  "success": true,
  "task": null
}
```

2. `POST /internal/edges/tasks/:id/heartbeat`
- Request body:
```json
{
  "workerId": "uuid",
  "processedConfigs": 12,
  "totalConfigs": 100,
  "currentConfig": "config-uuid",
  "trialProgress": "sampling"
}
```
- Response:
```json
{
  "success": true,
  "status": "PROCESSING",
  "leaseExpiresAt": "2026-05-15T12:00:10.000Z",
  "cancelRequested": false
}
```

3. `POST /internal/edges/tasks/:id/results`
- Request body:
```json
{
  "workerId": "uuid",
  "results": [
    {
      "configId": "uuid",
      "strategyConfig": {},
      "metrics": {
        "totalTrades": 10,
        "winningTrades": 6,
        "losingTrades": 4,
        "winRate": 60,
        "totalPnlUsdt": 120.5,
        "totalPnlPercent": 12.05,
        "maxDrawdownUsdt": 50.2,
        "maxDrawdownPercent": 5.02,
        "sharpeRatio": 1.4,
        "profitFactor": 1.8
      },
      "resultFolder": "result/2026-05-15/task-id/config-id"
    }
  ]
}
```
- Response:
```json
{
  "success": true,
  "accepted": 1,
  "deduplicated": 0
}
```

4. `POST /internal/edges/tasks/:id/complete`
- Request body:
```json
{
  "workerId": "uuid",
  "bestConfigIds": ["uuid-1", "uuid-2"],
  "processedConfigs": 100,
  "totalConfigs": 100
}
```
- Response:
```json
{
  "success": true,
  "status": "DONE"
}
```

5. `POST /internal/edges/tasks/:id/fail`
- Request body:
```json
{
  "workerId": "uuid",
  "error": "message"
}
```
- Response:
```json
{
  "success": true,
  "status": "FAILED"
}
```

### 13.4 Idempotency Rules

- Result uniqueness key: `(taskId, configId)`.
- Duplicate result submissions must not create additional rows.
- `complete` endpoint must be idempotent when repeated by same worker for same task.
- If task is already terminal (`DONE|FAILED|CANCELLED`), `results/complete/fail` returns success with unchanged terminal status.

### 13.5 Worker Credential Contract

- Raw credential is shown once at creation:
  - format: `wk_live_<prefix>_<secret>`
- Stored fields:
  - `keyPrefix`
  - `keyHash` (HMAC-SHA256 with server pepper)
  - `status` (`ACTIVE|REVOKED|EXPIRED`)
  - `expiresAt`
- Verification:
  1. parse prefix
  2. find by prefix
  3. hash presented secret with server pepper
  4. constant-time compare
  5. enforce status/expiry
- Rotation:
  - create new credential
  - overlap window (both active) max 24h
  - auto-revoke old credential after overlap

### 13.6 V1 Security Baseline

- HTTPS required for all internal edge traffic.
- Worker endpoints reject user session auth; only worker credentials allowed.
- Every internal write endpoint checks `workerId` in payload matches authenticated worker identity.
- Audit log required for:
  - credential create/rotate/revoke
  - task lease granted
  - task terminal state change

### 13.7 Scope Coupling Rules

- Scope 1 must not implement task leasing or compute.
- Scope 2 must not implement search execution.
- Scope 3 may use mocked compute only.
- Real grid execution starts in Scope 5.
- Real optuna execution starts in Scope 6.

## 14. Implementation Scopes (Session-Based)

This section defines deliverable, testable, verifiable scopes designed for limited-token sessions.
Each scope depends on completion of the previous scope.

### Scope 0: Contract Freeze and Alignment

Depends on: none

Deliverables:
- Approve this spec as authoritative.
- Freeze V1 state machine, edge API payloads, and worker credential rules.
- Freeze out-of-scope list for Phase 1.

Required tests:
- Review checklist only (no code).

Verification gate:
- Human approval recorded for this document.

Stop condition:
- No code changes until this scope is approved.

### Scope 1: Edge Registry and Orchestration UI Foundation

Depends on: Scope 0

Deliverables:
- Add worker registry persistence and service CRUD.
- Add gateway GraphQL/API endpoints for worker registration/list/disable.
- Add minimal UI page for edge list/status and assignment readiness.

Required tests:
- Unit: worker service create/list/disable.
- Integration: endpoint behavior for create/list/disable.
- UI smoke: edge list renders and disable action updates status.

Verification gate:
- User can register an edge and see/update it in UI.

Stop condition:
- No task lease/poll/heartbeat behavior yet.

### Scope 2: Worker Credential Security

Depends on: Scope 1

Deliverables:
- Implement worker credential issue/verify/revoke/rotate.
- Hash-only storage for credentials with prefix lookup.
- Internal worker auth guard/middleware.

Required tests:
- Unit: hash verify, expiry, revoked credential rejection, rotation overlap.
- Integration: authorized internal request passes; revoked/expired fails.

Verification gate:
- Revoked credential cannot poll internal endpoints.

Stop condition:
- No task execution logic yet.

### Scope 3: Task Skeleton with Lease and Heartbeat (Mock Execution)

Depends on: Scope 2

Deliverables:
- Add backtest task persistence and status transitions.
- Implement internal endpoints: `tasks/next`, `heartbeat`, `complete`, `fail`.
- Implement lease timeout and requeue behavior.
- Use mocked result payloads only.

Required tests:
- Unit: state transition guardrails and lease expiry logic.
- Integration: `AWAIT -> ASSIGNED -> PROCESSING -> DONE`.
- Integration: heartbeat extends lease; expired lease requeues.

Verification gate:
- One worker can claim and complete a mocked task end-to-end.

Stop condition:
- No real backtest engine invoked.

### Scope 3.5: Edge Packaging, Distribution, and Upgrade Control Plane

Depends on: Scope 3

Deliverables:
- Publish edge release artifact contract (Windows/Linux binaries + checksums/signatures).
- Implement orchestration metadata model for edge releases and `targetVersion`.
- Add orchestration UI actions to trigger upgrade for selected edges.
- Add edge-side upgrade state reporting contract (without requiring real compute tasks).

Required tests:
- Integration: create release metadata and set target version for selected edges.
- Integration: edge reports upgrade lifecycle status (`UPGRADE_PENDING` ... `SUCCEEDED|FAILED`).
- Security test: invalid checksum/signature upgrade attempt must fail.

Verification gate:
- User can trigger upgrade intent from UI and observe per-edge upgrade status transitions.

Stop condition:
- Real backtest engine execution still out of scope.

### Scope 4: Shared Composable Backtest Runtime Import

Depends on: Scope 3.5

Deliverables:
- Port alpha composable backtest runtime into beta shared compute module.
- Ensure runtime callable in isolation from orchestration.
- Remove alpha-specific path assumptions.

Required tests:
- Unit/integration: deterministic run with fixed strategy config fixture.
- Build/type-check for shared module.

Verification gate:
- Same input produces stable output metrics in repeated runs.

Stop condition:
- Runtime integrated but not yet wired into real distributed task flow.

### Scope 5: Real Grid Search Execution on Edge

Depends on: Scope 4

Deliverables:
- Edge agent executes real grid search for leased task.
- Batch result reporting via `results` endpoint.
- Idempotent result ingest by `(taskId, configId)`.

Required tests:
- Unit: grid parameter expansion correctness.
- Integration: duplicate result submission deduplicates correctly.
- Integration: full task completion with persisted results.

Verification gate:
- User runs a small grid task and sees ranked results in UI/backend queries.

Stop condition:
- Optuna remains disabled.

### Scope 6: Real Optuna Execution on Edge

Depends on: Scope 5

Deliverables:
- Edge agent supports optuna trials with progress heartbeats.
- Completion reports `bestConfigIds`.
- Resume-safe behavior for interrupted runs.

Required tests:
- Integration: optuna task completes and stores best configs.
- Integration: edge restart/reconnect does not corrupt task state.
- Integration: cancel mid-run transitions cleanly to `CANCELLED`.

Verification gate:
- User can run optuna task end-to-end and inspect best configs.

Stop condition:
- Validation pipeline remains out of scope.

### Scope 7: Task and Result UX Hardening

Depends on: Scope 6

Deliverables:
- Task list/detail pages with live progress and terminal states.
- Cancel/retry actions in UI.
- Result table sorting/filtering and top-candidate view.

Required tests:
- UI integration: create, monitor, cancel, retry flows.
- GraphQL integration: task/result query pagination and sorting.

Verification gate:
- User can operate task lifecycle entirely from UI.

Stop condition:
- No advanced validation pipeline UI yet.

### Scope 8: Reliability and Operational Baseline

Depends on: Scope 7

Deliverables:
- Retry limits, worker quarantine policy, and stale-task recovery.
- Audit log coverage required by V1 security baseline.
- Basic observability metrics for workers/tasks.

Required tests:
- Integration: repeated worker failure triggers quarantine policy.
- Integration: stale processing task auto-requeues per lease rule.
- Ops smoke: metrics/log signals emitted on task lifecycle.

Verification gate:
- System recovers from worker drop without manual DB repair.

Stop condition:
- Scope complete when recovery and audit paths are validated.

### Execution Rule for All Scopes

- A scope is not complete unless all are true:
  - targeted unit/integration tests pass
  - `pnpm lint` passes
  - `pnpm type-check` passes
  - demo checklist for that scope is verified manually
- No next scope starts until previous scope verification gate is met.

## 15. Edge Distribution and Upgrade Contract

This section defines where users download edge binaries and how centralized upgrade is triggered from orchestration UI.

### 15.1 Distribution Channel

Versioned release artifacts must be published per edge version.

Preferred base URL pattern:
- `https://downloads.luckyplans.io/edge/v<version>/...`

Alternative:
- GitHub release assets under `edge-v<version>` tag.

Required published files per version:
- `lucky-edge-windows-x64-installer.exe`
- `lucky-edge-linux-x64.tar.gz`
- `SHA256SUMS`
- `SHA256SUMS.sig`
- `RELEASE_NOTES.md`

Recommended stable aliases:
- `/edge/latest/windows` -> redirects to latest Windows installer
- `/edge/latest/linux` -> redirects to latest Linux tarball

### 15.2 Installation Layout (Contract)

Windows (immutable binaries):
- `C:\Program Files\LuckyPlans Edge\`
  - `lucky-edge.exe`
  - `VERSION`

Windows (mutable runtime):
- `C:\ProgramData\LuckyPlans\edge\`
  - `config\edge.config.json`
  - `secrets\worker.key`
  - `state\edge-state.db`
  - `logs\edge.log`
  - `work\`
  - `results\`

Linux (immutable binaries):
- `/opt/luckyplans-edge/`
  - `lucky-edge`
  - `VERSION`

Linux (mutable runtime):
- `/var/lib/luckyplans-edge/`
  - `config/edge.config.json`
  - `secrets/worker.key`
  - `state/edge-state.db`
  - `work/`
  - `results/`

Linux logs:
- primary: `journald` via systemd
- optional: `/var/log/luckyplans-edge/edge.log`

### 15.3 Upgrade Model (Orchestrator-Triggered, Edge-Executed)

Upgrades are centrally initiated but locally executed by each edge agent.
Orchestrator never shells into edge hosts.

Flow:
1. Orchestrator stores release metadata (version, per-OS URL, checksum/signature, compatibility constraints).
2. User clicks upgrade action in orchestration UI for selected edges (or group).
3. Orchestrator sets `targetVersion` for selected edges.
4. Edge polls and sees `targetVersion > currentVersion`.
5. Edge waits for safe point (not running critical task unless forced policy).
6. Edge downloads artifact, validates checksum and signature.
7. Edge stages update, restarts service, reports new version and status.

### 15.4 Upgrade Safety Rules

- Artifact verification is mandatory:
  - verify SHA256 checksum
  - verify signature (`SHA256SUMS.sig`)
- Compatibility gate:
  - orchestrator enforces minimum edge version
  - edge enforces minimum orchestrator API version
- Rollout strategy:
  - canary first, then phased rollout
- Task-safety policy:
  - default: do not upgrade while task is processing
  - optional force mode with explicit user action
- Rollback support:
  - orchestrator can set previous stable `targetVersion`

### 15.5 Upgrade Status Model

Per edge upgrade status enum:
- `IDLE`
- `UPGRADE_PENDING`
- `DOWNLOADING`
- `VERIFYING`
- `RESTARTING`
- `SUCCEEDED`
- `FAILED`
- `ROLLED_BACK`

Required status payload fields:
- `edgeId`
- `fromVersion`
- `targetVersion`
- `status`
- `message`
- `updatedAt`

### 15.6 Scope Binding

- Distribution page and downloadable artifact links are required by Scope 1 UI foundation.
- Upgrade control plane (set `targetVersion`, monitor status) is required by Scope 3.5.
- In-place auto-upgrade execution on edge agent baseline is required by Scope 3.5 before compute scopes.

## 16. Scope 0 Completion Record

Scope: `Scope 0: Contract Freeze and Alignment`  
Date: `2026-05-15`

Verification checklist:
- [x] Architecture goal approved.
- [x] Phase-1 in-scope and out-of-scope boundaries defined.
- [x] V1 task state machine frozen.
- [x] Lease/heartbeat/assignment rules frozen.
- [x] Internal edge API payload contract frozen.
- [x] Worker credential security contract frozen.
- [x] Distribution and upgrade contract frozen.
- [x] Session-based scope ladder defined with dependencies.
- [x] Pre-compute platform prerequisite added (`Scope 3.5` before Scope 4).

Gate decision:
- Scope 0 is **APPROVED** and considered the authoritative baseline for subsequent scopes.
- Any future changes to contracts in Sections 13-15 require explicit approval before implementation updates.
