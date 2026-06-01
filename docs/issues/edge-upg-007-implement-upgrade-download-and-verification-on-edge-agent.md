# EDGE-UPG-007 - [Feature]: Implement upgrade download and verification on edge-agent

GitHub title: `[Feature]: Implement upgrade download and verification on edge-agent`

Depends on: `EDGE-UPG-006`

Labels: `type:feature`, `priority:high`, `area:edge-agent`, `area:security`

Related:

- `apps/edge-agent/src/upgrade.ts`
- `apps/edge-agent/src/upgrade.spec.ts`
- `apps/edge-agent/src/client.ts`

## Motivation

The current upgrade module models the state machine but does not yet establish production-grade artifact download, checksum verification, signature verification, and failure reporting.

## Proposal

Implement the artifact verification portion of the upgrade flow while leaving privileged install/restart behavior to the next issue.

## Out of Scope

- Installing the verified artifact.
- Restarting the OS service.
- Rollback or failed-boot recovery.

## Acceptance Criteria

- Edge downloads release artifact only from HTTPS URLs.
- Edge verifies checksum before install is attempted.
- Edge verifies signature using configured or pinned trust material.
- Edge reports `DOWNLOADING`, `VERIFYING`, and `FAILED` states with safe failure reasons.
- Failed download or verification leaves the current version untouched.
- Logs never include credentials, enrollment tokens, or full signed URLs with sensitive query strings.

## Definition of Done

- [ ] Tests cover successful download/verify, checksum mismatch, signature mismatch, non-HTTPS URL rejection, and network failure.
- [ ] Upgrade install/restart is still stubbed or injected.
- [ ] Security-sensitive logs are reviewed.
