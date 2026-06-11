# EDGE-UPG-002 - [Feature]: Stabilize edge connectivity heartbeat contract

GitHub title: `[Feature]: Stabilize edge connectivity heartbeat contract`

Depends on: `EDGE-UPG-001`

Labels: `type:feature`, `priority:high`, `area:api-gateway`, `area:edge-agent`

Related:

- `apps/edge-agent/src/client.ts`
- `apps/edge-agent/src/runner.ts`
- `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`

## Motivation

The gateway connectivity endpoint and the edge client must agree on a single heartbeat payload before daemon/service work builds on it.

## Proposal

Make the edge-agent heartbeat request and gateway connectivity controller share one explicit request/response shape. The response remains the source for upgrade intent.

## Scope

- `apps/edge-agent/src/client.ts`
- `apps/edge-agent/src/runner.ts`
- `apps/edge-agent/src/main.ts`
- `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`
- Related edge-agent and api-gateway tests.

## Out of Scope

- Replacing polling with WebSocket sessions.
- Adding OS service install behavior.
- Implementing upgrade artifact download or install.

## Acceptance Criteria

- Heartbeat includes `workerId`, `deviceNumber`, `currentVersion`, `platform`, `arch`, and `activeTask`.
- Gateway verifies authenticated worker identity and device binding.
- Gateway updates `lastSeenAt`, `version`, `platform`, and `arch`.
- Gateway returns `targetVersion`, release metadata when available, `upgradeStatus`, and `upgradeMessage`.
- Tests cover successful heartbeat, missing device number, mismatched binding, and no-release response.

## Outcome

Implemented the heartbeat contract stabilization:

- Edge-agent connectivity heartbeats now include `deviceNumber`, `platform`, and `arch` when runner metadata is provided.
- Edge-agent startup passes persisted `deviceNumber`, current version, platform, and arch into `runSinglePollExecution`.
- Gateway rejects missing `deviceNumber` before worker lookup.
- Gateway persists upgrade status/reason from connectivity heartbeats via `WorkersService.markConnectivity`.
- Gateway response reflects the status/message reported in the current heartbeat.

Verification notes:

- Targeted edge-agent tests pass: `pnpm --filter @luckyplans/edge-agent test -- client.spec.ts runner.spec.ts`
- Targeted api-gateway tests pass: `pnpm --filter @luckyplans/api-gateway test -- edges-connectivity.controller.spec.ts workers.service.spec.ts`
- `pnpm lint` passed.
- `pnpm type-check` passed.
- `pnpm build` passed.
- `pnpm format:check` passed.

## Definition of Done

- [x] Targeted edge-agent tests pass.
- [x] Targeted api-gateway connectivity tests pass.
- [x] Standard repo verification passes before final closeout.
