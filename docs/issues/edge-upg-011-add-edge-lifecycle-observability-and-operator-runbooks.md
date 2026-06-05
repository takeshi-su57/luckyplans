# EDGE-UPG-011 - [Feature]: Add edge lifecycle observability and operator runbooks

GitHub title: `[Feature]: Add edge lifecycle observability and operator runbooks`

Depends on: `EDGE-UPG-004`, `EDGE-UPG-008`

Labels: `type:feature`, `priority:medium`, `area:observability`, `area:docs`, `area:web`

Related:

- `apps/web/content/guides/observability.mdx`
- `apps/web/content/guides/developer.mdx`
- `apps/api-gateway/src/workers/releases.service.ts`

## Motivation

Operators need to diagnose stale workers, failed upgrades, bad release metadata, and service restart issues without reading raw database rows.

## Proposal

Expose lifecycle metrics/log events and document runbooks for common failure modes.

## Out of Scope

- Changing upgrade mechanics.
- Adding a new observability stack.
- Logging secrets or full PII payloads.

## Acceptance Criteria

- Gateway records upgrade status transitions without sensitive payloads.
- Edge-agent logs service start, heartbeat failures, upgrade states, and shutdown.
- Docs cover stale worker, target version stuck, verification failure, service restart failure, and rollback.
- Existing observability docs link to edge lifecycle troubleshooting.

## Definition of Done

- [x] Docs updated.
- [x] Tests or snapshots cover UI/doc-visible behavior where applicable.
- [x] Sensitive logging reviewed.
