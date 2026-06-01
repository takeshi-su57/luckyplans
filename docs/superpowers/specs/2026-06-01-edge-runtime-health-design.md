# Edge Runtime Health Design

## Summary

`EDGE-UPG-004` adds a small runtime health snapshot to the existing edge connectivity heartbeat and worker display. The goal is to make an OS-level edge-agent understandable as a long-running process without introducing a separate edge session model.

The implementation keeps the existing Worker record as the control-plane source of truth. The edge-agent reports its current runtime state during the connectivity heartbeat. The API gateway persists the latest snapshot and computes connectivity status from `lastSeenAt` using fixed thresholds.

## Goals

- Report whether an edge runtime is idle, busy, upgrading, or in error.
- Include optional runtime details: active task id, uptime seconds, and last error summary.
- Compute stale/offline status from `lastSeenAt`.
- Show health fields in the Edges UI alongside current version, target version, last seen, and upgrade status.
- Preserve the current REST heartbeat and GraphQL workers query shape with additive fields.

## Non-Goals

- No `edge_sessions` table.
- No WebSocket or push transport.
- No task scheduler behavior changes.
- No upgrade artifact download, install, rollback, or OS service installer behavior.
- No gateway environment variables for health thresholds in this issue.

## Runtime States

The edge-agent reports one runtime state per connectivity heartbeat:

- `IDLE`: daemon is running and no task is active.
- `BUSY`: daemon is running and a task is active.
- `UPGRADING`: daemon is processing an upgrade lifecycle step.
- `ERROR`: daemon is alive but the latest loop or task produced an error summary.

`BUSY` includes `activeTaskId` when a task is leased. `ERROR` includes `lastError` when available. `UPGRADING` can be reported with the existing upgrade status fields such as `DOWNLOADING`, `VERIFYING`, or `RESTARTING`.

## Connectivity Status

The API gateway computes connectivity from `lastSeenAt` when returning workers:

- `ONLINE`: `lastSeenAt` is less than or equal to 60 seconds old.
- `STALE`: `lastSeenAt` is older than 60 seconds and less than or equal to 5 minutes old.
- `OFFLINE`: `lastSeenAt` is older than 5 minutes, or the worker has never been seen.

The thresholds are fixed in gateway code for this issue:

- stale threshold: 60 seconds.
- offline threshold: 5 minutes.

This keeps the first health implementation predictable and avoids introducing configuration before operators have real tuning data.

## Data Model

Additive Worker fields:

- `runtimeState`: enum, defaults to `IDLE`.
- `activeTaskId`: nullable string.
- `uptimeSeconds`: nullable integer.
- `lastError`: nullable string.

The fields live on `Worker` because `EDGE-UPG-004` only needs the latest known runtime snapshot. Historical session tracking can be revisited later if operators need runtime history, reconnect analysis, or per-process identity.

## API Gateway

The existing `/internal/edges/connectivity` endpoint accepts additive heartbeat fields:

- `runtimeState`
- `activeTaskId`
- `uptimeSeconds`
- `lastError`

The endpoint continues to validate `workerId` against the authenticated worker credential and `deviceNumber` against the bound worker. On success, `WorkersService.markConnectivity` updates:

- `lastSeenAt`
- version/platform/arch
- upgrade status/message
- runtime health fields

The GraphQL `Worker` object exposes:

- `runtimeState`
- `activeTaskId`
- `uptimeSeconds`
- `lastError`
- `connectivityStatus`

`connectivityStatus` is computed in `WorkersService.getWorkers()` so UI consumers do not duplicate threshold logic.

## Edge Agent

`runSinglePollExecution` remains the single-cycle task primitive. It should report:

- `IDLE` when no task is leased.
- `BUSY` with `activeTaskId` when a task is leased.
- `UPGRADING` when reporting upgrade lifecycle states.
- `ERROR` with `lastError` when the cycle fails before normal task failure handling or the daemon loop reports a transient iteration error.

The daemon provides uptime from process start time. This can be injected for tests by adding a small runtime metadata option rather than reading clocks directly throughout the runner.

## Edges UI

The Edges page keeps the current list-based management interface and adds health fields to each worker row:

- connectivity status
- runtime state
- active task id when present
- uptime when present
- last error when present
- last seen, current version, target version, and upgrade status

The UI should stay text-forward and operational. No charting or historical timeline is needed for this issue.

## Error Handling

- Heartbeat validation remains strict for worker identity and device binding.
- Invalid or missing optional runtime health fields are ignored or normalized by the gateway service rather than causing a full heartbeat failure.
- `lastError` should be a short summary, not a stack trace or payload dump.
- Credentials, enrollment tokens, and sensitive payloads must not be logged or displayed.

## Testing

Gateway tests:

- Connectivity heartbeat persists runtime health fields.
- Worker list computes `ONLINE`, `STALE`, and `OFFLINE` from `lastSeenAt`.
- Missing optional runtime fields do not break existing heartbeat behavior.

Edge-agent tests:

- Connectivity heartbeat sends `IDLE` when no task is leased.
- Connectivity heartbeat sends `BUSY` and `activeTaskId` when a task is leased.
- Upgrade lifecycle reports `UPGRADING` with existing upgrade status.
- Error paths report `ERROR` with a short error summary when appropriate.

Web tests:

- Edges page renders connectivity status.
- Edges page renders runtime state, active task id, uptime, and last error when supplied.

Verification:

- `pnpm --filter @luckyplans/api-gateway test -- workers.service.spec.ts edges-connectivity.controller.spec.ts`
- `pnpm --filter @luckyplans/edge-agent test -- runner.spec.ts client.spec.ts daemon.spec.ts`
- `pnpm --filter @luckyplans/web test -- page.test.tsx`
- `pnpm lint`
- `pnpm type-check`
- `pnpm build`
- `pnpm format:check`

## Open Decisions

None. This spec intentionally chooses fixed gateway thresholds: 60 seconds for `STALE` and 5 minutes for `OFFLINE`.

## Implementation Order

1. Add gateway contract and persistence tests.
2. Add Prisma fields and generated client updates.
3. Update gateway controller, service, and GraphQL worker type.
4. Update edge-agent heartbeat payload and runner state reporting.
5. Update Edges UI query, types, rendering, and tests.
6. Update `EDGE-UPG-004` issue outcome and run verification.
