# EDGE-UPG-012 - [Chore]: Decide whether artifact transfer is needed for task payloads/results

GitHub title: `[Chore]: Decide whether artifact transfer is needed for task payloads/results`

Depends on: `EDGE-UPG-003`

Labels: `type:chore`, `priority:low`, `area:architecture`, `area:edge-agent`, `area:api-gateway`

Related:

- `apps/api-gateway/src/edges-internal/edges-tasks.controller.ts`
- `apps/api-gateway/src/backtest/backtest.service.ts`
- `apps/edge-agent/src/runner.ts`

## Motivation

The temp specs assume generic artifact upload/download endpoints. Current task execution sends payloads and results through internal REST endpoints.

## Proposal

Document the concrete task-data requirements and decide whether to keep REST JSON, add object storage artifacts, or introduce a hybrid.

## Out of Scope

- Implementing upload/download URL endpoints.
- Changing current task result ingestion.
- Adding object storage dependencies.

## Acceptance Criteria

- Current payload/result sizes and expected growth are documented.
- Decision records whether artifact transfer is required for the next milestone.
- If required, follow-up issues define upload URL, download URL, authorization, retention, and result references.
- If not required, temp artifact specs are marked deferred.

## Definition of Done

- [x] Decision doc committed: `apps/web/content/architecture/decisions/2026-06-05-defer-task-artifact-transfer.mdx`.
- [x] No artifact implementation included.
