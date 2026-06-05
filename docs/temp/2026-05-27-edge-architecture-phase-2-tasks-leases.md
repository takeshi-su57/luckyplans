# Edge Architecture Phase 2 Spec: Tasks + Leases (C+D)

Status: Historical temp design. Current task orchestration uses authenticated internal REST polling, task heartbeats, JSON result ingestion, and lease recovery through the accepted `EDGE-UPG-*` issue chain. WebSocket task offers remain deferred by `apps/web/content/architecture/decisions/2026-06-05-defer-edge-websocket-sessions.mdx`.

## Goal
Enable server-driven task offers with edge-side accept/reject and execution, including lease renewal, loss detection, and retryable task attempts.

## Scope
- Task offer/accept/reject protocol over WebSocket
- Diagnostic task handler as first task type
- Child-process-based task execution
- Task progress/completion/failure events
- Lease issue/renew/expiry handling
- Lost attempt and retry/requeue behavior

## Out of Scope
- Artifact upload/download URL flow (Phase 3)
- Auto-upgrade lifecycle (Phase 4)

## Server Requirements
### Scheduler (MVP)
Eligible edge conditions:
- online
- not disabled
- not upgrading
- not draining
- supports task type
- has available capacity

Selection strategy:
- Least-busy eligible edge (MVP)

### Task/Attempt Model
- `tasks`: task definition and top-level status
- `task_attempts`: per-edge execution attempt
  - includes `lease_id`, `lease_expires_at`, `attempt_number`, failure metadata, and result metadata

### Lease Policy
- Lease duration: 60s
- Renewal cadence target: every 20s while running
- If lease expires (+ grace), mark attempt as `lost`
- Lost attempts may be requeued according to retry policy

## Edge Requirements
- Decide accept/reject based on local capacity and state
- Execute accepted tasks in child processes (not main process)
- Emit lifecycle events:
  - `edge.task.started`
  - `edge.task.progress`
  - `edge.task.completed`
  - `edge.task.failed`
  - `edge.task.leaseRenewed`
- Reject unsupported task types with `unsupported_task_type`
- Enforce per-task timeout and process cancellation rules

## Protocol (Phase 2)
### Server -> Edge
- `server.task.offer`
- `server.task.cancel`

### Edge -> Server
- `edge.task.accepted`
- `edge.task.rejected`
- `edge.task.started`
- `edge.task.progress`
- `edge.task.leaseRenewed`
- `edge.task.completed`
- `edge.task.failed`

## Diagnostic Task (First Task Type)
- `taskType: diagnostic`
- Returns host diagnostics:
  - hostname
  - platform
  - arch
  - cpu count
  - memory
  - disk
  - agent version
  - timestamp

## Acceptance Criteria
- Server can offer task and edge can accept or reject deterministically
- Accepted diagnostic task runs in child process and reports progress/results
- Lease renewals keep running attempts alive
- Expired leases transition attempts to `lost`
- Retryable lost/failed attempts can be requeued

## Risks
- Over-aggressive lease timeout can cause false `lost`
- Missing cancellation enforcement can leak child processes

