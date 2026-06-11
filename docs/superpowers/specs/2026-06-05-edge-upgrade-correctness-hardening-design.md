# Edge Upgrade Correctness Hardening Design

Date: 2026-06-05

Status: Draft implementation spec

Related issue: `docs/issues/edge-upg-015-post-milestone-edge-upgrade-correctness-hardening.md`

## Summary

This spec closes post-milestone correctness gaps found after reviewing the `EDGE-UPG-001` through `EDGE-UPG-014` issue chain and the original temporary edge architecture intent. The goal is not to expand the edge architecture. The goal is to make the accepted REST-polling upgrade architecture operationally coherent.

## Current Architecture

- Edge agents report runtime and upgrade state to `POST /internal/edges/connectivity`.
- `EdgesConnectivityController` validates the authenticated worker identity, updates worker presence, and returns target release metadata.
- `WorkersService.markConnectivity` persists worker-level runtime health and upgrade state.
- `ReleasesService.reportWorkerUpgradeStatus` updates worker upgrade state and active `UpgradeCampaignWorker` phase rows, but it is currently reached through a GraphQL mutation instead of the edge heartbeat path.
- `ReleasesService.createRelease` stores an `EdgeRelease` and backfills `EdgeReleaseArtifact` rows for Windows and Linux.
- The release builder creates a manifest with one metadata record per artifact.
- Edge-agent daemon shutdown uses a simple mutable `ShutdownSignal`.

## Requirements

### Campaign Status Propagation

When an edge-agent heartbeat includes an upgrade status, the gateway must keep worker and campaign state consistent.

- `SUCCEEDED` heartbeat status must mark active campaign worker rows as `SUCCEEDED`.
- `FAILED` heartbeat status must mark active campaign worker rows as `FAILED`.
- `ROLLED_BACK` heartbeat status must mark active campaign worker rows as `ROLLED_BACK` when the campaign worker is still active.
- Non-terminal statuses must keep active campaign worker rows `IN_PROGRESS`.
- The update must be idempotent for repeated heartbeats.
- The controller should not duplicate status-mapping rules; release/campaign logic should remain in `ReleasesService`.

### Platform-Specific Release Artifact Registration

Release registration must support the manifest produced by `apps/edge-agent/scripts/build-release.mjs`.

- A new GraphQL input type must accept an artifact list with `platform`, `arch`, `installType`, `url`, `checksum`, `signature`, `signatureAlgorithm`, `signingKeyId`, and `sizeBytes`.
- `createEdgeRelease` must preserve its current legacy arguments for existing callers.
- The service must validate and verify each artifact checksum/signature pair when a public signing key is configured.
- The service must reject duplicate artifact target tuples for the same release.
- The service must still populate legacy top-level release fields from the first Windows and Linux service artifacts for compatibility.
- Edge upgrade metadata resolution must continue to read from `EdgeReleaseArtifact`.

### Interruptible Daemon Sleep

Shutdown requests must wake the daemon during sleep.

- `ShutdownSignal` must expose a way to subscribe to shutdown requests.
- `sleepWithTimeout` must resolve promptly when shutdown is requested.
- Listener cleanup must happen after timeout or shutdown to avoid retaining callbacks across loop iterations.
- Existing injected `sleep` tests must continue to work.

### Web GraphQL Synchronization

The edges page and generated GraphQL artifacts must describe the same worker fields.

- Generated `WorkersQuery` must include `connectivityStatus`, `runtimeState`, `activeTaskId`, `uptimeSeconds`, and `lastError`.
- The project should either migrate the page query into the codegen-discovered pattern or update codegen inputs so the existing query is generated.
- `pnpm --filter @luckyplans/web codegen` must be part of verification.

### Documentation Cleanup

The removed temporary planning folder must not be referenced as active local source material.

- Issue files may refer to the historical temp specs in prose, but direct file links to deleted temporary planning files should be removed or replaced with active issue/spec/ADR references.
- `EDGE-UPG-014` must be updated so it does not claim deleted files point to ADRs.
- `EDGE-UPG-010` DoD must be marked only after artifact registration expectations are true.

### Worker Quarantine Policy

The implementation must match an explicit policy.

- Preferred policy: quarantine after three consecutive task failures.
- A successful task completion resets `consecutiveFailures` to `0`.
- A first or second failure increments `consecutiveFailures` but leaves the worker active.
- A third consecutive failure sets `status` to `QUARANTINED` and `quarantinedAt` to the current time.

## Non-Requirements

- No WebSocket sessions.
- No generic task artifact transfer.
- No new microservice.
- No new major dependencies.
- No browser token handling.
- No restoration of deleted temp docs.

## Risks

- Changing `createEdgeRelease` can break existing operator scripts if legacy arguments are removed; preserve them.
- Campaign rows and worker rows can diverge if heartbeat updates and GraphQL status reports use separate mapping code; centralize mapping in `ReleasesService`.
- Generated GraphQL files can become noisy; keep codegen output scoped to actual operation changes.
- Quarantine threshold changes may alter operational behavior; document the policy in observability/developer docs.

## Verification Strategy

- API gateway unit tests for heartbeat-driven campaign status updates.
- API gateway unit tests for artifact-list release registration and legacy fallback registration.
- Edge-agent unit tests for real `sleepWithTimeout` shutdown interruption.
- Web codegen plus web tests.
- Repository-level lint, type-check, build, and format checks.
