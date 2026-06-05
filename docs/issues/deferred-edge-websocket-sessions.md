# DEFERRED-EDGE-WEBSOCKET-SESSIONS - [Feature]: Add persistent edge WebSocket sessions when low-latency commands are required

GitHub title: `[Feature]: Add persistent edge WebSocket sessions when low-latency commands are required`

Depends on: `EDGE-UPG-013`

Labels: `type:feature`, `priority:deferred`, `area:architecture`, `area:api-gateway`, `area:edge-agent`

Related:

- `apps/web/content/architecture/decisions/2026-06-05-defer-edge-websocket-sessions.mdx`
- `docs/temp/2026-05-27-edge-architecture-phase-1-identity-session.md`
- `docs/temp/2026-05-27-edge-architecture-phase-2-tasks-leases.md`

## Motivation

The current milestone uses authenticated internal REST polling and connectivity heartbeats for edge liveness, task leasing, task progress, results, completion, failure, and upgrade status. Persistent WebSocket sessions are deferred until low-latency bidirectional command requirements justify the operational complexity.

## Trigger Conditions

Start this work only when one or more conditions from the ADR becomes true:

- Operators need low-latency server-pushed commands such as cancel, pause, resume, or update-now.
- Polling load becomes material at the expected number of always-online edge workers.
- The product needs live log streaming or interactive task control.
- Gateway operators need durable connect/disconnect session records beyond heartbeat-derived liveness.

## Proposal

Design and implement an outbound edge WebSocket control channel with explicit protocol, authentication, reconnection behavior, persistence, and rollout compatibility.

## Acceptance Criteria

- WebSocket protocol envelopes, command types, and acknowledgement/error behavior are specified.
- Worker credential authentication and authorization are implemented without exposing browser tokens.
- Reconnect/backoff behavior prevents reconnect storms during gateway outages.
- `edge_sessions` or equivalent persistence captures connect/disconnect lifecycle only when needed.
- Existing REST polling workers remain compatible during rollout.
- Observability covers connection lifecycle, command delivery, reconnect behavior, and auth failures.

## Out of Scope

- Sending large binary payloads over WebSocket.
- Replacing current REST polling before a trigger condition is met.
