# EDGE-UPG-001 Current-State Audit

Date: 2026-06-01
Status: Draft audit

## Purpose

This audit compares the `docs/temp/*` edge architecture drafts against the current LuckyPlans implementation. The goal is to keep the valid product direction while preventing the temp specs from bypassing existing API gateway, worker, release, task lease, and edge-agent work.

No implementation changes are included in this audit.

## Reviewed Inputs

- `docs/temp/new.md`
- `docs/temp/2026-05-27-edge-architecture-phase-1-identity-session.md`
- `docs/temp/2026-05-27-edge-architecture-phase-2-tasks-leases.md`
- `docs/temp/2026-05-27-edge-architecture-phase-3-artifacts.md`
- `docs/temp/2026-05-27-edge-architecture-phase-4-updates-security-observability.md`
- `docs/superpowers/specs/2026-05-21-edge-lifecycle-design.md`
- `docs/superpowers/plans/2026-05-21-edge-lifecycle-mvp-implementation-plan.md`
- `apps/edge-agent/src/*`
- `apps/api-gateway/src/edges-internal/*`
- `apps/api-gateway/src/workers/*`
- `apps/api-gateway/src/backtest/*`
- `packages/prisma/prisma/schema.prisma`

## Executive Summary

The current codebase already implements the foundation that the temp specs treat as future work: edge registration, durable credentials, worker auth, REST task leasing, task heartbeats, connectivity heartbeat, release metadata, target-version orchestration, upgrade campaigns, and a basic idle-only edge upgrade state machine.

The main correction is architectural: continue evolving the existing polling/REST API gateway control plane. Do not replace it with WebSocket sessions, `/v1/*` edge APIs, generic artifact endpoints, or a separate service until a concrete requirement justifies that change.

The next implementation path should remain the ordered `EDGE-UPG-*` issue chain in `docs/issues/README.md`.

## Capability Map

| Capability | Current support | Evidence | Audit decision | Follow-up |
| --- | --- | --- | --- | --- |
| Edge registration | Supported | `EdgesRegistrationController` exposes `POST /internal/edges/register`; `WorkersService.upsertWorkerByDeviceNumber`; `CredentialsService.issueCredential`; `EdgeEnrollmentToken` model | Keep | Harden only if audit follow-up finds token lifecycle gaps |
| Durable edge credentials | Supported | `WorkerCredential` model stores hash/prefix/status/expiry; `WorkerAuthGuard` protects internal task/connectivity endpoints | Keep | Continue using gateway-owned credential lifecycle |
| Local edge config | Supported | `apps/edge-agent/src/config.ts` persists `serverUrl`, `workerId`, `deviceNumber`, `credential`, `currentVersion` | Keep | Review secret handling during OS service work |
| Connectivity heartbeat | Partially supported | `EdgesConnectivityController` updates worker presence and returns release intent; `EdgeApiClient.sendConnectivityHeartbeat` exists | Keep, fix mismatch | `EDGE-UPG-002` |
| Runtime health snapshot | Minimal | Worker has `lastSeenAt`, `version`, `upgradeStatus`, `upgradeMessage`; no explicit runtime state or uptime | Keep, extend | `EDGE-UPG-004` |
| Task leasing and task heartbeat | Supported via REST polling | `EdgesTasksController`; `BacktestService.leaseNextTask`; `BacktestService.heartbeat`; `leaseExpiresAt`; `BacktestLeaseRecoveryService` | Keep | Avoid WebSocket task offers for now |
| Result ingestion | Supported for current backtest result shape | `EdgesTasksController.results`; `BacktestService.ingestResults`; edge runner sends results as JSON | Keep | Revisit artifacts only if payload size requires it |
| Generic artifact transfer | Not implemented | No `/v1/artifacts/upload-url` or `/v1/artifacts/download-url` in current gateway; current result flow is JSON | Defer | `EDGE-UPG-012` |
| Release registry | Supported | `EdgeRelease` model; `ReleasesService.createRelease`; `ReleasesResolver` | Keep | `EDGE-UPG-006`, `EDGE-UPG-010` |
| Target version orchestration | Supported | `Worker.targetVersion`; `ReleasesService.setWorkerTargetVersion`; upgrade campaign models | Keep | `EDGE-UPG-006` |
| Release signature check on server metadata | Supported | `ReleasesService.createRelease` verifies checksum/signature metadata using `EDGE_RELEASE_SIGNING_PUBLIC_KEY` | Keep | Edge-side verification still needed in `EDGE-UPG-007` |
| Edge upgrade state machine | Partially supported | `apps/edge-agent/src/upgrade.ts` models status transitions and handler injection | Keep, extend | `EDGE-UPG-007`, `EDGE-UPG-008` |
| Real download/checksum/signature verification on edge | Not implemented | `maybeUpgrade` accepts injected `download`, `verify`, and `install` handlers; no production handlers are wired | Keep, implement later | `EDGE-UPG-007` |
| External updater and OS service restart | Not implemented | No systemd/Windows Service installer or updater boundary in edge-agent | Keep, implement later | `EDGE-UPG-005`, `EDGE-UPG-008` |
| Rollback/failed boot recovery | Partially represented server-side, not implemented edge-side | `WorkerUpgradeStatus.ROLLED_BACK`; `ReleasesService.rollbackUpgradeCampaign`; no local failed-boot recovery | Keep, implement later | `EDGE-UPG-009` |
| Observability/runbooks | Partially documented | Existing docs mention edge lifecycle states; no dedicated operator runbook from this issue chain | Keep, extend | `EDGE-UPG-011` |
| WebSocket sessions | Not implemented | No WebSocket gateway or `edge_sessions` model; approved lifecycle design explicitly chose polling-driven orchestration and excluded realtime push | Defer | `EDGE-UPG-013` |
| `/v1/*` public edge endpoints | Not current architecture | Existing endpoints are internal gateway routes under `/internal/edges/*` | Drop for this milestone | Keep gateway internal routes unless API versioning is separately required |
| New edge microservice | Not justified | AGENTS guidance defaults to extending gateway unless independent scaling/lifecycle is required | Drop | Keep edge control plane in API gateway |
| macOS launchd service | Not in approved lifecycle scope | Existing design targets Windows/Linux | Defer | Add a separate platform issue if macOS becomes required |

## Current Implementation Notes

### Registration And Identity

The temp specs are directionally correct on enrollment-token registration and durable credentials. The current implementation already has this path:

- Edge-agent onboarding calls `EdgeApiClient.registerEdge`.
- Gateway registers through `POST /internal/edges/register`.
- Registration verifies an enrollment token through `EnrollmentTokensService`.
- Workers are upserted by `deviceNumber`.
- Credentials are issued and persisted locally by the edge-agent.

Decision: keep this existing route and terminology. Do not introduce a parallel `/v1/edges/register` endpoint for this milestone.

### Connectivity And Presence

The current architecture uses REST heartbeat rather than WebSocket presence. That aligns with the approved lifecycle design and with the current gateway implementation.

There is a concrete contract gap:

- `EdgesConnectivityController` expects `workerId`, `deviceNumber`, `currentVersion`, `platform`, and `arch`.
- `EdgeApiClient.sendConnectivityHeartbeat` currently sends `workerId`, `currentVersion`, `activeTask`, `upgradeStatus`, and `reason`.
- The controller currently ignores `activeTask`, `upgradeStatus`, and `reason`.

Decision: keep REST heartbeat, fix the payload/response contract in `EDGE-UPG-002`, then add richer runtime health in `EDGE-UPG-004`.

### Task Leases

The temp specs describe WebSocket task offers, accept/reject, lease renewal, and lost task recovery. The current implementation already supports a REST polling version:

- Edge polls `POST /internal/edges/tasks/next`.
- Gateway leases work through `BacktestService.leaseNextTask`.
- Task heartbeat updates progress and extends lease.
- Expired leases are covered by `BacktestLeaseRecoveryService`.
- Task result, complete, and fail endpoints exist.

Decision: keep REST polling for the current milestone. Do not introduce WebSocket task offers until `EDGE-UPG-013` proves a need.

### Artifact Transfer

The temp specs propose generic task input/output artifact URLs. The current task flow sends task payloads and results through JSON REST endpoints. Release packages are a separate kind of artifact and should not be bundled with generic task artifact scope.

Decision: defer task artifact transfer to `EDGE-UPG-012`. Keep release package download in the upgrade issue chain.

### Releases And Upgrades

The current gateway already has release metadata, target-version assignment, upgrade campaigns, and upgrade status fields. It does not yet have fully platform-specific artifact resolution, because `EdgeRelease` currently stores `windowsUrl` and `linuxUrl` without arch/install-type granularity or size metadata.

The current edge-agent upgrade module is a state machine with injected handlers. That is useful scaffolding, but production download, checksum/signature verification, external updater handoff, service restart, and failed-boot rollback are still missing.

Decision: keep the current release registry and upgrade campaign model. Implement the remaining production upgrade steps through `EDGE-UPG-006` to `EDGE-UPG-010`.

### OS Service Runtime

The temp specs correctly identify that an upgradable edge needs an OS service model. The current edge-agent entrypoint still runs `runSinglePollExecution`, which makes it unsuitable as a long-running service without a daemon loop.

Decision: implement the daemon loop before service installation. That order is captured by `EDGE-UPG-003` before `EDGE-UPG-005`.

## Keep / Defer / Drop Decisions

### Keep

- Gateway-owned edge registration and durable worker credentials.
- Internal REST endpoints under `/internal/edges/*`.
- Polling-based task leasing and heartbeat.
- Worker `lastSeenAt`, `targetVersion`, `upgradeStatus`, and `upgradeMessage` as the core control-plane state.
- Existing release registry and campaign orchestration.
- Idle-only upgrade policy.
- OS service installation for Windows and Linux.
- External updater boundary.
- Edge-side release checksum/signature verification.
- Rollback and operator observability as follow-up work.

### Defer

- WebSocket session lifecycle and `edge_sessions` persistence.
- WebSocket task offer/accept/reject protocol.
- Generic task artifact upload/download URL APIs.
- Object storage-backed task input/result transfer.
- Runtime health snapshot beyond current `lastSeenAt` and status fields.
- Release channel semantics beyond current `targetVersion`.
- macOS `launchd` support.

### Drop For This Milestone

- Replacing the existing API gateway edge control plane with a new microservice.
- Replacing `/internal/edges/*` with `/v1/edges/*` without a separate API versioning decision.
- Modeling software upgrade as a normal user task.
- Sending large payloads over WebSocket.
- Duplicating worker identity in a parallel edge registry when `Worker` already owns device identity.

## Follow-Up Issue Alignment

- `EDGE-UPG-002`: fix the current connectivity heartbeat request/response mismatch.
- `EDGE-UPG-003`: add the daemon loop required before OS service installation.
- `EDGE-UPG-004`: add runtime health and stale/offline semantics without WebSocket sessions.
- `EDGE-UPG-005`: add Windows/Linux service install/uninstall/status commands.
- `EDGE-UPG-006`: harden platform/arch/install-type release metadata resolution.
- `EDGE-UPG-007`: implement edge-side release download and verification.
- `EDGE-UPG-008`: implement external updater install and service restart.
- `EDGE-UPG-009`: implement rollback and failed-boot recovery.
- `EDGE-UPG-010`: add release publishing pipeline.
- `EDGE-UPG-011`: add observability and runbooks.
- `EDGE-UPG-012`: decide whether task artifact transfer is needed.
- `EDGE-UPG-013`: decide whether WebSocket sessions are needed.
- `EDGE-UPG-014`: run milestone verification and documentation sync.

## Acceptance Criteria Check

- Current support for registration, credentials, connectivity, task leasing, release registry, and upgrade status is documented above.
- Temp-spec-only concepts are classified as `keep`, `defer`, or `drop`.
- WebSocket sessions are deferred unless `EDGE-UPG-013` documents a concrete need.
- Artifact endpoints are deferred unless `EDGE-UPG-012` documents concrete task payload/result requirements.
- The next implementation path is the `EDGE-UPG-*` issue chain.
