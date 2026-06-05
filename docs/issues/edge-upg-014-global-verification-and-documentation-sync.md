# EDGE-UPG-014 - [Chore]: Global verification and documentation sync

GitHub title: `[Chore]: Global verification and documentation sync`

Depends on: all implementation issues selected for the milestone

Labels: `type:chore`, `priority:high`, `area:quality`, `area:docs`

Related:

- `AGENTS.md`
- `apps/web/content`
- `docs/issues`

## Motivation

The edge lifecycle touches agent runtime, gateway contracts, Prisma data, web UI, docs, and deployment. The milestone should close only after full verification and documentation sync.

## Out of Scope

- New feature implementation.
- Expanding milestone scope.
- Skipping targeted tests for touched areas.

## Acceptance Criteria

- `pnpm lint` passes.
- `pnpm type-check` passes.
- `pnpm build` passes.
- `pnpm format:check` passes.
- Targeted edge-agent, api-gateway, and web tests for touched areas pass.
- `AGENTS.md`, skills, and docs are updated if architecture/security/workflow guidance changed.
- Temp specs are either superseded, archived, or updated to point at the accepted issue chain.

## Verification Output

Captured on 2026-06-05:

| Command | Result |
|---------|--------|
| `pnpm.cmd lint` | Pass: Turbo reported 7 successful tasks. |
| `pnpm.cmd type-check` | Pass: Turbo reported 7 successful tasks. |
| `pnpm.cmd build` | Pass: Turbo reported 5 successful tasks. |
| `pnpm.cmd format:check` | Pass: Prettier reported all matched files use code style. |
| `pnpm.cmd --filter @luckyplans/edge-agent test` | Pass: 16 test files, 106 tests passed, 1 skipped. |
| `pnpm.cmd --filter @luckyplans/api-gateway test` | Pass: 9 test files, 56 tests passed. |
| `pnpm.cmd --filter @luckyplans/web test` | Pass: 4 test files, 11 tests passed. |

Notes:

- PowerShell printed profile parse errors after commands, but each command above exited with code 0.
- `pnpm.cmd build` reused cached output for the web build in the final closeout run; the previous issue-013 run built the new docs route successfully.
- Next.js still warns that the `middleware` file convention is deprecated in favor of `proxy`.

## Documentation Sync

- Active architecture docs describe REST polling, connectivity heartbeat, task execution, edge upgrades, release publishing, observability, and runbooks.
- `docs/temp/2026-05-27-edge-architecture-phase-1-identity-session.md` now points to the WebSocket deferral ADR.
- `docs/temp/2026-05-27-edge-architecture-phase-2-tasks-leases.md` now points to the accepted REST polling issue chain and WebSocket deferral ADR.
- `docs/temp/2026-05-27-edge-architecture-phase-3-artifacts.md` now points to the task artifact transfer deferral ADR.
- `docs/temp/2026-05-27-edge-architecture-phase-4-updates-security-observability.md` now points to the accepted implementation issues and deferral ADRs.
- `docs/temp/new.md` is marked as a historical temp design.

## Deferred Work

- `DEFERRED-EDGE-TASK-ARTIFACT-TRANSFER`: add task artifact transfer only when task data outgrows REST JSON.
- `DEFERRED-EDGE-WEBSOCKET-SESSIONS`: add persistent WebSocket sessions only when low-latency command requirements justify them.

## Definition of Done

- [x] Verification output captured in the PR or final issue comment.
- [x] Docs reflect the implemented behavior.
- [x] Remaining deferred work has explicit follow-up issues.
