# EDGE-UPG-004 - [Feature]: Add edge runtime health snapshot and stale-worker semantics

GitHub title: `[Feature]: Add edge runtime health snapshot and stale-worker semantics`

Depends on: `EDGE-UPG-003`

Labels: `type:feature`, `priority:medium`, `area:api-gateway`, `area:edge-agent`, `area:web`

Related:

- `apps/edge-agent/src/client.ts`
- `apps/api-gateway/src/workers/workers.service.ts`
- `apps/web/src/app/(app)/edges/page.tsx`

## Motivation

For an OS-level service, `lastSeenAt` alone is not enough to understand whether the runtime is healthy, idle, busy, upgrading, or repeatedly failing.

## Proposal

Extend the heartbeat payload and worker display to include a small runtime health snapshot. Keep this on the existing worker/control-plane model unless the audit proves a separate session table is necessary.

## Out of Scope

- Adding a separate `edge_sessions` table without a documented need.
- Introducing push transport.
- Building upgrade rollback behavior.

## Acceptance Criteria

- Heartbeat can report `state` such as `IDLE`, `BUSY`, `UPGRADING`, or `ERROR`.
- Heartbeat can report optional `activeTaskId`, `uptimeSeconds`, and last error summary.
- Gateway computes stale/offline status from `lastSeenAt` without introducing WebSocket sessions.
- Edges UI shows current version, target version, last seen, runtime state, and upgrade status.
- Tests cover stale worker calculation and UI rendering.

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
- `pnpm --filter @luckyplans/prisma build` passed.
- Prisma `db:migrate:dev` could not be run locally because Postgres was not reachable on `localhost:5434`; migration SQL was reviewed as safe additive SQL.

## Definition of Done

- [x] Gateway tests pass for health updates.
- [x] Web tests pass for edge state display.
- [x] Docs updated where worker health semantics are described.
