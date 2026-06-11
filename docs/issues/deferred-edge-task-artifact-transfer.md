# DEFERRED-EDGE-TASK-ARTIFACT-TRANSFER - [Feature]: Add task artifact transfer when task data outgrows REST JSON

GitHub title: `[Feature]: Add task artifact transfer when task data outgrows REST JSON`

Depends on: `EDGE-UPG-012`

Labels: `type:feature`, `priority:deferred`, `area:architecture`, `area:api-gateway`, `area:edge-agent`

Related:

- `apps/web/content/architecture/decisions/2026-06-05-defer-task-artifact-transfer.mdx`
- `docs/issues/edge-upg-012-decide-whether-artifact-transfer-is-needed-for-task-payloads-results.md`
- `docs/issues/edge-upg-001-current-state-audit.md`

## Motivation

The current milestone keeps task payloads, heartbeats, result ingestion, and completion on authenticated internal REST JSON endpoints. This remains correct until task inputs, outputs, logs, or retention needs exceed the current structured payload contract.

## Trigger Conditions

Start this work only when one or more conditions from the ADR becomes true:

- Task inputs need large files or binary data that should not be embedded in JSON.
- Result outputs or logs need durable file retention beyond structured result rows.
- Payload or result sizes regularly exceed practical gateway/request limits.
- Operators need independent artifact retention, replay, or download permissions.

## Proposal

Design and implement task artifact transfer with scoped upload/download URLs and task result references.

## Acceptance Criteria

- Upload URL issuance is defined and implemented with authorization and size/type constraints.
- Download URL issuance is defined and implemented with authorization and expiry.
- Task payload/result schemas can reference artifact IDs or keys without exposing broad object-storage URLs.
- Retention policy and cleanup behavior are documented.
- Result ingestion accepts structured result references without replacing current JSON result rows prematurely.
- Observability covers artifact transfer failures and expired URL failures.

## Out of Scope

- Release package download and verification, which already belongs to the edge upgrade flow.
- Replacing current REST JSON task execution before a trigger condition is met.
