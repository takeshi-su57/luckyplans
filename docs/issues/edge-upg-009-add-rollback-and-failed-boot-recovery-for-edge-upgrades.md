# EDGE-UPG-009 - [Feature]: Add rollback and failed-boot recovery for edge upgrades

GitHub title: `[Feature]: Add rollback and failed-boot recovery for edge upgrades`

Depends on: `EDGE-UPG-008`

Labels: `type:feature`, `priority:medium`, `area:edge-agent`, `area:api-gateway`, `area:ops`

Related:

- `apps/edge-agent/src/upgrade.ts`
- `apps/api-gateway/src/workers/releases.service.ts`
- `apps/web/src/app/(app)/edges/page.tsx`

## Motivation

Automatic upgrades need a recovery path. Without rollback, a bad release can strand an edge host until manual repair.

## Proposal

Track previous version state locally, detect failed boot or failed post-upgrade heartbeat, and roll back to the last known-good version.

## Out of Scope

- Forced upgrades during active tasks.
- Multi-version release channels beyond the current target-version model.
- Replacing the service manager integration.

## Acceptance Criteria

- Edge records previous active version before switching.
- Edge marks new version healthy only after successful daemon startup and heartbeat.
- Failed startup or failed health confirmation triggers rollback.
- Gateway receives `FAILED` or `ROLLED_BACK` status with safe reason.
- Rollback does not retry indefinitely for the same failed release decision.

## Definition of Done

- [ ] Tests cover healthy upgrade, failed boot rollback, failed heartbeat rollback, and retry suppression.
- [ ] Manual recovery docs exist.
- [ ] Edges UI can distinguish failed upgrade from rolled back upgrade.
