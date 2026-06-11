# EDGE-UPG-003 - [Feature]: Convert edge-agent from single poll execution to managed daemon loop

GitHub title: `[Feature]: Convert edge-agent from single poll execution to managed daemon loop`

Depends on: `EDGE-UPG-002`

Labels: `type:feature`, `priority:high`, `area:edge-agent`

Related:

- `apps/edge-agent/src/main.ts`
- `apps/edge-agent/src/runner.ts`
- `apps/edge-agent/src/main.spec.ts`

## Motivation

An OS service needs a long-running runtime. The current entrypoint resolves config and runs a single poll execution.

## Proposal

Add a daemon runner that repeatedly sends connectivity heartbeats, polls tasks, executes work, and checks upgrade intent while preserving the existing task execution unit.

## Scope

- `apps/edge-agent/src/main.ts`
- `apps/edge-agent/src/runner.ts`
- New daemon/runtime module if useful.
- Edge-agent tests.

## Out of Scope

- Installing the daemon as a systemd or Windows service.
- Changing task scheduling semantics in the gateway.
- Adding WebSocket transport.

## Acceptance Criteria

- Edge-agent supports a long-running loop with configurable poll and heartbeat intervals.
- Loop avoids concurrent task execution.
- Loop defers upgrade while a task is active.
- Loop handles transient gateway failures with capped backoff and jitter.
- SIGINT/SIGTERM triggers graceful shutdown without starting new work.
- Existing single execution behavior remains testable as a smaller unit.

## Outcome

Implemented the edge-agent daemon loop:

- Added `runEdgeDaemon` with injected sleep, shutdown signal, poll interval, and capped failure backoff.
- Preserved `runSinglePollExecution` as the one-cycle task execution primitive.
- Wired `main.ts` to start the daemon and register SIGINT/SIGTERM shutdown handlers.
- Added an edge-agent package start script for running the built daemon locally.

Verification notes:

- `pnpm --filter @luckyplans/edge-agent test -- daemon.spec.ts main.spec.ts runner.spec.ts` passed.
- `pnpm --filter @luckyplans/edge-agent build` passed.

## Definition of Done

- [x] Tests cover idle loop, task loop, transient failure, active task gating, and shutdown.
- [x] No OS-specific service installer behavior is included.
- [x] Edge-agent package scripts support running the daemon locally.
