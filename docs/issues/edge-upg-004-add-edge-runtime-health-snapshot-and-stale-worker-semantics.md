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

## Definition of Done

- [ ] Gateway tests pass for health updates.
- [ ] Web tests pass for edge state display.
- [ ] Docs updated where worker health semantics are described.
