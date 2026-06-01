# EDGE-UPG-013 - [Chore]: Decide whether WebSocket sessions are needed

GitHub title: `[Chore]: Decide whether WebSocket sessions are needed`

Depends on: `EDGE-UPG-003`, `EDGE-UPG-004`

Labels: `type:chore`, `priority:low`, `area:architecture`, `area:api-gateway`, `area:edge-agent`

Related:

- `apps/api-gateway/src/edges-internal`
- `apps/edge-agent/src/client.ts`
- `docs/temp/2026-05-27-edge-architecture-phase-1-identity-session.md`

## Motivation

The temp specs propose WebSocket sessions, but the current architecture is polling/REST. WebSocket adds operational complexity and should be justified by latency, scale, or bidirectional command requirements.

## Proposal

Evaluate polling after daemon stabilization and decide whether WebSocket sessions are needed.

## Out of Scope

- Implementing WebSocket transport.
- Creating `edge_sessions` persistence.
- Replacing current internal REST endpoints.

## Acceptance Criteria

- Polling latency, gateway load, and operator needs are reviewed.
- Decision records whether WebSocket is needed now, later, or not at all.
- If needed, follow-up issues define protocol, auth, reconnection, session persistence, and rollout plan.
- If not needed, temp session specs are marked deferred.

## Definition of Done

- [ ] Decision doc committed.
- [ ] No WebSocket implementation included.
