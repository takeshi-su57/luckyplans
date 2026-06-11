# EDGE-UPG-015 - [Bug]: Fix post-milestone edge upgrade correctness gaps

GitHub title: `[Bug]: Fix post-milestone edge upgrade correctness gaps`

Depends on: `EDGE-UPG-014`

Labels: `type:bug`, `priority:high`, `area:api-gateway`, `area:edge-agent`, `area:web`, `area:docs`

Related:

- `docs/superpowers/specs/2026-06-05-edge-upgrade-correctness-hardening-design.md`
- `docs/superpowers/plans/2026-06-05-edge-upgrade-correctness-hardening-implementation-plan.md`
- `docs/issues/edge-upg-014-global-verification-and-documentation-sync.md`
- `apps/api-gateway/src/edges-internal/edges-connectivity.controller.ts`
- `apps/api-gateway/src/workers/releases.service.ts`
- `apps/api-gateway/src/workers/releases.resolver.ts`
- `apps/edge-agent/src/daemon.ts`
- `apps/web/src/generated`

## Motivation

The `EDGE-UPG-001` through `EDGE-UPG-014` milestone established the REST-polling edge runtime, upgrade metadata, installer handoff, rollback recovery, release publishing, observability, and documentation baseline. A follow-up audit found several correctness gaps where implemented surfaces can drift from the milestone intent:

- real edge-agent heartbeat upgrade states update the worker row but do not advance upgrade campaign worker rows;
- the release publishing pipeline creates per-platform artifact checksums and signatures, while the gateway registration mutation stores one checksum/signature pair on both platform artifacts;
- edge-agent daemon shutdown requests do not interrupt the current sleep interval or failure backoff;
- generated web GraphQL artifacts are stale relative to the edges page runtime-health query;
- docs still reference deleted temporary planning files after the temp folder was intentionally removed;
- the publishing issue DoD is stale;
- worker quarantine currently happens after any failed task despite the design language describing repeated failures.

## Problem Statement

The milestone can appear complete while upgrade rollout operations still fail in production-like flows. Campaigns may not progress from real agent reports, one platform may receive invalid release verification metadata, service shutdown may wait for the full polling interval, generated web types may hide health-field drift, and documentation may point to removed historical temp specs.

## Proposal

Implement a small hardening pass that connects existing surfaces instead of expanding architecture:

1. Route final edge upgrade heartbeat statuses through the same campaign-worker status update path used by `reportWorkerUpgradeStatus`.
2. Add gateway support for registering platform-specific artifact metadata from release manifests while preserving the legacy mutation shape for compatibility.
3. Make edge-agent daemon sleep interruptible when `ShutdownSignal.request()` is called.
4. Regenerate or align web GraphQL artifacts with the edges page runtime-health query.
5. Replace stale temporary planning file references with current issue, ADR, and spec references.
6. Mark `EDGE-UPG-010` DoD according to actual state after artifact registration is fixed.
7. Decide and document the intended worker quarantine threshold, then make implementation and tests match it.

## Out of Scope

- Reintroducing WebSocket sessions.
- Reintroducing generic task artifact transfer.
- Creating a separate edge microservice.
- Restoring removed temporary planning files.
- Changing the gateway-managed auth/session model.
- Adding browser-side token handling.

## Acceptance Criteria

- Connectivity heartbeat statuses `SUCCEEDED`, `FAILED`, and `ROLLED_BACK` update active upgrade campaign worker rows consistently with `reportWorkerUpgradeStatus`.
- Upgrade campaign advancement uses real edge-agent status reports without requiring an operator-only GraphQL status mutation.
- Release registration can persist distinct checksums, signatures, algorithms, signing key IDs, and sizes for Windows and Linux artifacts.
- Legacy `createEdgeRelease(version, windowsUrl, linuxUrl, checksum, signature, notes)` callers still work.
- Edge-agent daemon shutdown exits promptly during poll sleeps and failure backoff sleeps.
- Web generated GraphQL artifacts include the runtime-health fields used by the edges page, or the page is migrated to the generated operation.
- Deleted temporary planning files are no longer referenced as active local files.
- `EDGE-UPG-010` DoD reflects the fixed release registration behavior.
- Worker quarantine behavior matches an explicit threshold or documented immediate-quarantine policy.

## Verification

- `pnpm --filter @luckyplans/api-gateway test`
- `pnpm --filter @luckyplans/edge-agent test`
- `pnpm --filter @luckyplans/web codegen`
- `pnpm --filter @luckyplans/web test`
- `pnpm lint`
- `pnpm type-check`
- `pnpm build`
- `pnpm format:check`

## Verification Output

Captured on 2026-06-05:

| Command | Result |
| --- | --- |
| `pnpm.cmd --filter @luckyplans/api-gateway test` | Pass: 9 test files, 61 tests passed. |
| `pnpm.cmd --filter @luckyplans/edge-agent test` | Pass: 16 test files, 107 tests passed, 1 skipped. |
| `pnpm.cmd --filter @luckyplans/web codegen` | Pass: generated `apps/web/src/generated` from `apps/api-gateway/schema.graphql`. |
| `pnpm.cmd --filter @luckyplans/web test` | Pass: 4 test files, 11 tests passed. |
| `pnpm.cmd lint` | Pass: Turbo reported 7 successful tasks. |
| `pnpm.cmd type-check` | Pass: Turbo reported 7 successful tasks. |
| `pnpm.cmd build` | Pass: Turbo reported 5 successful tasks. |
| `pnpm.cmd format:check` | Pass: Prettier reported all matched files use code style. |

Notes:

- PowerShell printed profile parse errors after commands, but each command above exited with code 0.
- Direct sandboxed `pnpm.cmd` commands failed with `unable to open database file`; verification was rerun outside the sandbox.
- Next.js still warns that the `middleware` file convention is deprecated in favor of `proxy`.

## Definition of Done

- [x] Campaign status propagation has regression coverage.
- [x] Platform-specific release artifact registration has regression coverage.
- [x] Interruptible daemon shutdown has regression coverage.
- [x] Web GraphQL generation is synchronized.
- [x] Stale temp-doc references are removed or repointed.
- [x] Quarantine behavior is explicitly specified and tested.
- [x] Full repository verification output is captured.
