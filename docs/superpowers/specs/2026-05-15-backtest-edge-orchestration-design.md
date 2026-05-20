# Backtest Edge Orchestration Design (V2)

Date: 2026-05-20  
Status: Draft refresh (aligned to current beta repo)  
Owner: LuckyPlans

## 1. Purpose

Restore alpha backtesting capability in beta using edge execution while keeping orchestration centralized in the beta backend.

V2 keeps the same functional requirements as the 2026-05-15 spec, but updates architecture and scope layout to match the current codebase and service-decomposition rules.

## 2. Scope

### 2.1 In Scope (Phase 1)
- Strategy template CRUD.
- Backtest task creation from template.
- Search modes: `grid`, `optuna`.
- Explicit assignment at task creation (`assignedWorkerId`).
- Lease + heartbeat + cancellation + retry.
- Result persistence + top-candidate retrieval.
- Worker credential lifecycle (issue/verify/revoke/rotate).
- Edge distribution metadata and orchestrator-driven upgrade control plane.
- Minimal UI for templates, tasks, workers, status, and results.

### 2.2 Out of Scope (Phase 1)
- Full validation pipeline (walk-forward, robustness).
- Multi-tenant billing and rate limits.
- Public edge marketplace.

## 3. Architecture (Current-State Aligned)

### 3.1 Components
- `apps/web`
  - Backtest templates/tasks/results pages.
  - Worker registry and upgrade-control pages.
- `apps/api-gateway`
  - GraphQL API for user operations.
  - Internal edge HTTP API for poll/heartbeat/results/complete/fail.
  - Orchestration business logic in gateway modules/services for V1.
  - Session-based user auth for humans.
- `Edge Agent` (new deployable app)
  - Authenticates as worker.
  - Polls for assigned tasks.
  - Executes `grid`/`optuna` search and backtest runtime.
  - Sends heartbeats, results, terminal events, and upgrade status.
- `packages/shared`
  - Shared enums/types/message contracts for backtest and worker domains.
- `packages/prisma`
  - Data models and migrations.

### 3.2 Service-Decomposition Rule (Binding)
- V1 implementation default: extend `apps/api-gateway` modules.
- New microservice is allowed only with explicit justification using `docs/architecture/microservice-decision-matrix.md`:
  - CPU-heavy or long-running backend workload that must run server-side.
  - Independent scaling/SLO/deploy lifecycle needs.
  - Accepted platform overhead (Docker/Helm/ArgoCD/observability ownership).
- Edge compute itself does not require a backend microservice because execution is offloaded to edge agents.

### 3.3 Responsibility Split
- Orchestrator (gateway) is source of truth for task and worker state.
- Edge agent is a stateless executor from orchestrator perspective.
- Compute runtime executes only on edge agent, never in synchronous gateway request path.

## 4. Domain Model (V1)

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
  - metrics (`totalTrades, winningTrades, losingTrades, winRate, totalPnlUsdt, totalPnlPercent, maxDrawdownUsdt, maxDrawdownPercent, sharpeRatio, profitFactor, ...`)
  - `resultFolder, createdAt`
- `Worker`
  - `id, name, status (ACTIVE|DISABLED for current codebase; QUARANTINED extension in Scope 8), platform, version, lastSeenAt, targetVersion, upgradeStatus`
- `WorkerCredential`
  - `workerId, keyPrefix, keyHash, status, expiresAt, rotatedAt`

Migration safety:
- Required-column additions follow nullable/default-first, then backfill, then tighten.
- Raw credentials are never stored.

## 5. V1 Contract Freeze (Authoritative)

If any later section conflicts, this section wins.

### 5.1 Task State Machine
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

Forbidden:
- Any transition from `DONE`
- `AWAIT -> PROCESSING`
- `PROCESSING -> ASSIGNED`

### 5.2 Assignment and Lease Rules
- `assignedWorkerId` is required while task is `ASSIGNED` or `PROCESSING`.
- Worker can lease only tasks where `assignedWorkerId == worker.id`.
- Lease duration: 60s.
- Heartbeat target: every 10s.
- Valid heartbeat extends lease to `now + 60s`.
- If lease expires during `ASSIGNED` or `PROCESSING`:
  - task returns to `AWAIT`
  - `currentConfig` is cleared
  - assignment remains sticky (`assignedWorkerId` unchanged) for V1
- `CANCELLED` tasks are never leasable.

### 5.3 Internal Edge API Contract
All endpoints require worker authentication.

1. `POST /internal/edges/tasks/next`
- Request:
```json
{ "workerId": "worker-id-string" }
```
- Success (task):
```json
{
  "success": true,
  "task": {
    "taskId": "task-id-string",
    "name": "string",
    "symbol": "BTCUSDT",
    "interval": "1m",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-06-01T00:00:00.000Z",
    "searchStrategy": "grid",
    "optimizationParams": {},
    "optimizationMetrics": ["sharpeRatio"],
    "trials": 200,
    "leaseExpiresAt": "2026-05-20T12:00:00.000Z"
  }
}
```
- Success (no task):
```json
{ "success": true, "task": null }
```

2. `POST /internal/edges/tasks/:id/heartbeat`
- Request:
```json
{
  "workerId": "worker-id-string",
  "processedConfigs": 12,
  "totalConfigs": 100,
  "currentConfig": "config-id-string",
  "trialProgress": "sampling"
}
```
- Response:
```json
{
  "success": true,
  "status": "PROCESSING",
  "leaseExpiresAt": "2026-05-20T12:00:10.000Z",
  "cancelRequested": false
}
```

3. `POST /internal/edges/tasks/:id/results`
- Request:
```json
{
  "workerId": "worker-id-string",
  "results": [
    {
      "configId": "config-id-string",
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
      "resultFolder": "result/2026-05-20/task-id/config-id"
    }
  ]
}
```
- Response:
```json
{ "success": true, "accepted": 1, "deduplicated": 0 }
```

4. `POST /internal/edges/tasks/:id/complete`
- Request:
```json
{
  "workerId": "worker-id-string",
  "bestConfigIds": ["config-id-1", "config-id-2"],
  "processedConfigs": 100,
  "totalConfigs": 100
}
```
- Response:
```json
{ "success": true, "status": "DONE" }
```

5. `POST /internal/edges/tasks/:id/fail`
- Request:
```json
{ "workerId": "worker-id-string", "error": "message" }
```
- Response:
```json
{ "success": true, "status": "FAILED" }
```

### 5.4 Idempotency Rules
- Unique key: `(taskId, configId)` for results.
- Duplicate result submissions are deduplicated.
- `complete` is idempotent for repeated same-worker completion calls.
- If task is terminal (`DONE|FAILED|CANCELLED`), `results/complete/fail` returns success with unchanged terminal status.

### 5.5 Worker Credential Contract
- One-time shown raw format: `wk_live_<prefix>_<secret>`.
- Stored fields:
  - `keyPrefix`
  - `keyHash` (HMAC-SHA256 + server pepper)
  - `status` (`ACTIVE|REVOKED|EXPIRED`)
  - `expiresAt`
- Verify flow:
  1. parse prefix
  2. lookup credential by prefix
  3. hash presented secret with server pepper
  4. constant-time compare
  5. enforce status and expiry
- Rotation:
  - issue new credential
  - overlap window max 24h
  - auto-revoke old credential after overlap

### 5.6 Security Baseline
- HTTPS required for all internal edge traffic.
- Worker endpoints reject user session auth.
- Internal write endpoints must verify request `workerId` matches authenticated worker identity.
- Audit logs required for:
  - credential create/rotate/revoke
  - task lease granted
  - task terminal-state change

## 6. User-Facing GraphQL Surface

Mutations:
- `createStrategyTemplate(input)`
- `updateStrategyTemplate(input)`
- `createBacktestTask(input)` including `assignedWorkerId`
- `cancelBacktestTask(taskId)`
- `retryBacktestTask(taskId)`
- `createWorker(name, platform, version)`
- `disableWorker(id)`
- `issueWorkerCredential(id)`
- `revokeWorkerCredential(credentialId)`
- `rotateWorkerCredential(id)`
- `setWorkerTargetVersion(workerIds, targetVersion)`

Queries:
- `backtestTasks`
- `backtestTask(id)`
- `backtestResults(taskId, sort, paging)`
- `workers`
- `worker(id)`
- `edgeReleases`

Subscriptions:
- `backtestTaskUpdated`
- `backtestResultCreated`
- `workerStatusUpdated`
- `workerUpgradeStatusUpdated`

## 7. Edge Distribution and Upgrade Contract

### 7.1 Distribution Channel
Preferred pattern:
- `https://downloads.luckyplans.io/edge/v<version>/...`

Alternative:
- GitHub releases under `edge-v<version>` tag.

Required artifacts per version:
- `lucky-edge-windows-x64-installer.exe`
- `lucky-edge-linux-x64.tar.gz`
- `SHA256SUMS`
- `SHA256SUMS.sig`
- `RELEASE_NOTES.md`

Stable aliases (recommended):
- `/edge/latest/windows`
- `/edge/latest/linux`

### 7.2 Installation Layout
Windows immutable:
- `C:\Program Files\LuckyPlans Edge\`

Windows mutable:
- `C:\ProgramData\LuckyPlans\edge\config\edge.config.json`
- `C:\ProgramData\LuckyPlans\edge\secrets\worker.key`
- `C:\ProgramData\LuckyPlans\edge\state\edge-state.db`
- `C:\ProgramData\LuckyPlans\edge\logs\edge.log`
- `C:\ProgramData\LuckyPlans\edge\work\`
- `C:\ProgramData\LuckyPlans\edge\results\`

Linux immutable:
- `/opt/luckyplans-edge/`

Linux mutable:
- `/var/lib/luckyplans-edge/config/edge.config.json`
- `/var/lib/luckyplans-edge/secrets/worker.key`
- `/var/lib/luckyplans-edge/state/edge-state.db`
- `/var/lib/luckyplans-edge/work/`
- `/var/lib/luckyplans-edge/results/`

Linux logs:
- primary `journald`
- optional `/var/log/luckyplans-edge/edge.log`

### 7.3 Upgrade Flow
1. Orchestrator stores release metadata (version, URLs, checksum/signature, compatibility).
2. User triggers upgrade in UI for selected workers.
3. Orchestrator sets `targetVersion`.
4. Edge polls and detects `targetVersion > currentVersion`.
5. Edge waits safe point (unless forced policy).
6. Edge downloads + verifies artifact.
7. Edge stages, restarts, reports status + version.

### 7.4 Upgrade Safety Rules
- Must verify SHA256 checksum.
- Must verify `SHA256SUMS.sig` signature.
- Compatibility gate:
  - orchestrator enforces minimum edge version
  - edge enforces minimum orchestrator API version
- Rollout strategy: canary then phased.
- Default policy: no in-flight-task upgrade.
- Force mode requires explicit user action.
- Rollback supported by resetting prior stable `targetVersion`.

### 7.5 Upgrade Status Model
Enum:
- `IDLE`
- `UPGRADE_PENDING`
- `DOWNLOADING`
- `VERIFYING`
- `RESTARTING`
- `SUCCEEDED`
- `FAILED`
- `ROLLED_BACK`

Status payload:
- `edgeId`
- `fromVersion`
- `targetVersion`
- `status`
- `message`
- `updatedAt`

## 8. Implementation Roadmap (Session Scopes)

### Scope 0: Contract Freeze Refresh
Depends on: none

Deliverables:
- Confirm V2 sections 5 and 7 as authoritative contract.
- Confirm no `service-core` dependency exists in this initiative.

Gate:
- Human approval recorded.

### Scope 1: Worker Registry + UI Foundation
Depends on: Scope 0

Deliverables:
- Worker registry persistence + CRUD in gateway modules.
- Gateway GraphQL for register/list/disable workers.
- Minimal web UI: worker list/status/assignment readiness.
- Distribution page with downloadable artifact links.

Tests:
- Unit: worker service create/list/disable.
- Integration: worker GraphQL behavior.
- UI smoke: list renders, disable updates.

Stop condition:
- No lease/poll/heartbeat yet.

### Scope 2: Credential Security + Worker Auth Guard
Depends on: Scope 1

Deliverables:
- Credential issue/verify/revoke/rotate.
- Hash-only storage + prefix lookup.
- Internal worker auth guard/middleware.

Tests:
- Unit: verify, expiry, revoked, overlap rotation.
- Integration: authorized internal call passes; revoked/expired fails.

Stop condition:
- No task execution logic yet.

### Scope 3: Task Skeleton + Lease/Heartbeat (Mock Compute)
Depends on: Scope 2

Deliverables:
- Backtest task persistence + transition guardrails.
- Internal endpoints: `tasks/next`, `heartbeat`, `complete`, `fail`.
- Lease timeout + requeue logic.
- Mock completion path only.

Tests:
- Unit: state transitions, lease expiry.
- Integration: `AWAIT -> ASSIGNED -> PROCESSING -> DONE`.
- Integration: heartbeat extends lease; expired lease requeues.

Stop condition:
- No real compute runtime execution.

### Scope 3.5: Upgrade Control Plane
Depends on: Scope 3

Deliverables:
- Release metadata model and APIs.
- UI actions to set `targetVersion` for selected workers.
- Edge upgrade status ingest/report contract.

Tests:
- Integration: create release + set target version.
- Integration: status lifecycle ingestion.
- Security: invalid checksum/signature attempt fails.

Stop condition:
- Real compute still out of scope.

### Scope 4: Shared Backtest Runtime Import
Depends on: Scope 3.5

Deliverables:
- Port alpha composable runtime into beta shared compute module.
- Remove alpha path assumptions.
- Runtime callable in isolation.

Tests:
- Unit/integration deterministic fixture runs.
- Build/type-check pass for shared module.

Stop condition:
- Runtime not yet wired to distributed execution.

### Scope 5: Real Grid Execution on Edge
Depends on: Scope 4

Deliverables:
- Edge executes real grid search on leased tasks.
- Batch result reporting.
- Idempotent ingestion by `(taskId, configId)`.

Tests:
- Unit: grid expansion correctness.
- Integration: duplicate result dedupe.
- Integration: end-to-end task completion persists ranked results.

Stop condition:
- Optuna still disabled.

### Scope 6: Real Optuna Execution on Edge
Depends on: Scope 5

Deliverables:
- Optuna trials + progress heartbeat.
- Completion includes `bestConfigIds`.
- Resume-safe interrupted run behavior.

Tests:
- Integration: end-to-end optuna completion.
- Integration: edge restart/reconnect stability.
- Integration: cancel mid-run to `CANCELLED`.

Stop condition:
- Validation pipeline still out of scope.

### Scope 7: UX Hardening
Depends on: Scope 6

Deliverables:
- Task list/detail live progress.
- Cancel/retry actions.
- Result sorting/filtering and top candidates.

Tests:
- UI integration: create/monitor/cancel/retry.
- GraphQL integration: task/result paging/sorting.

### Scope 8: Reliability + Ops Baseline
Depends on: Scope 7

Deliverables:
- Retry limits + worker quarantine policy.
- Stale task recovery.
- Audit log coverage.
- Basic task/worker metrics.

Tests:
- Integration: repeated worker failures trigger quarantine.
- Integration: stale processing task auto-requeues.
- Ops smoke: lifecycle metrics/logs emitted.

## 9. Testing and Verification Rules

A scope is complete only when all are true:
- Targeted unit/integration tests pass.
- `pnpm lint` passes.
- `pnpm type-check` passes.
- `pnpm build` passes.
- `pnpm format:check` passes.
- Scope demo checklist is manually verified.

## 10. Risks and Mitigations

- Edge compromise or incorrect output.
  - Mitigation: trust levels, quarantine, optional duplicate verification path.
- Orchestrator restart during long jobs.
  - Mitigation: DB-backed state, lease model, edge reconnect behavior.
- Dependency drift in edge runtime.
  - Mitigation: versioned/containerized edge runtime and upgrade controls.

## 11. Acceptance Criteria (Phase 1)

- User can create strategy templates and tasks with `grid` or `optuna`.
- User can assign tasks to specific workers.
- Assigned worker can poll, execute, and report end-to-end.
- Orchestrator tracks progress via heartbeat and shows status in UI.
- Results/top configs are queryable in UI/API.
- Cancel and retry operate without data corruption.
- Worker credentials are hashed-at-rest and revocable.
- Upgrade target version can be set from UI and per-worker status is visible.

## 12. Change-Control Rule

Sections 5 and 7 are contract-frozen for V1. Any changes require explicit approval before implementation updates.




## Appendix A: Naming Canon (Binding for New Backtest/Edge Modules)

Use this appendix when adding new schema, resolver, DTO, or API fields for this initiative.

### A.1 Case and Format Rules
- Type and model names: `PascalCase` (example: `BacktestTask`, `WorkerCredential`).
- Field names: `camelCase` (example: `assignedWorkerId`, `leaseExpiresAt`).
- Enum values: `UPPER_SNAKE_CASE` (example: `PROCESSING`, `UPGRADE_PENDING`).
- Database table names via Prisma `@@map`: `snake_case` plural (example: `backtest_tasks`, `worker_credentials`).
- Internal HTTP paths: lowercase kebab-style segments where applicable (example: `/internal/edges/tasks/next`).

### A.2 Identifier Rules
- Primary IDs are string IDs generated by Prisma defaults (current codebase pattern: `cuid`).
- Foreign key naming pattern: `<entity>NameId` (example: `taskId`, `workerId`, `assignedWorkerId`).
- API examples should use generic string placeholders (`worker-id-string`, `task-id-string`) instead of UUID-only assumptions.

### A.3 Time and Lifecycle Fields
- Standard timestamps: `createdAt`, `updatedAt`.
- Runtime timestamps: `startedAt`, `completedAt`, `lastHeartbeat`, `lastSeenAt`, `leaseExpiresAt`.
- Expiry/revocation fields: `expiresAt`, `rotatedAt`.

### A.4 Worker Naming Canon
- GraphQL query: `workers`.
- GraphQL mutations (current baseline): `createWorker`, `disableWorker`.
- Worker status baseline: `ACTIVE | DISABLED`.
- Planned extension status (Scope 8): `QUARANTINED`.
- Version-management fields: `version` (current), `targetVersion` (orchestrator intent).

### A.5 Backtest Naming Canon
- Task state field: `status`.
- Assignment field: `assignedWorkerId`.
- Progress fields: `processedConfigs`, `totalConfigs`, `currentConfig`.
- Search config fields: `searchStrategy`, `optimizationParams`, `optimizationMetrics`, `trials`.
- Terminal fields: `errorMessage`, `bestConfigIds`.

### A.6 Credential Naming Canon
- Persisted fields: `keyPrefix`, `keyHash`, `status`, `expiresAt`, `rotatedAt`.
- Raw credential format (shown once): `wk_live_<prefix>_<secret>`.
- Never store raw secrets in DB or logs.

### A.7 GraphQL vs Internal API Boundary
- GraphQL is the user-facing contract for UI and operator actions.
- Internal edge API is worker-facing and always requires worker auth.
- Internal write payloads include `workerId` and must match authenticated worker identity.

### A.8 Reserved Terms (Do Not Reintroduce)
- Do not reintroduce `service-core` references in this initiative unless a new explicit architecture decision is approved.
- Keep “edge”, “worker”, and “orchestrator” terminology consistent:
  - `worker` = registered edge runtime identity
  - `edge agent` = deployed executable/service running on user-managed machine
  - `orchestrator` = backend coordination logic in `apps/api-gateway` for V1

## Appendix B: BE-001 Completion Record (Scope 0 Refresh)

Issue: `BE-001`  
Date: `2026-05-20`

Verification checklist:
- [x] Reconfirmed Section 5 (`V1 Contract Freeze`) as authoritative.
- [x] Reconfirmed Section 7 (`Edge Distribution and Upgrade Contract`) as authoritative.
- [x] Reconfirmed Appendix A (`Naming Canon`) as binding for new modules in this initiative.
- [x] Reconfirmed this initiative has no `service-core` dependency and defaults to `apps/api-gateway` extension.

Gate decision:
- `BE-001` is complete.
- Contract and naming changes now require explicit approval before implementation updates.
