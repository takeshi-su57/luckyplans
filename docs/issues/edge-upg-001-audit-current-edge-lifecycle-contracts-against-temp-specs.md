# EDGE-UPG-001 - [Chore]: Audit current edge lifecycle contracts against temp specs

GitHub title: `[Chore]: Audit current edge lifecycle contracts against temp specs`

Depends on: none

Labels: `type:chore`, `priority:high`, `area:edge-agent`, `area:api-gateway`, `area:docs`

Related:

- `docs/issues/edge-upg-001-current-state-audit.md`
- `docs/temp/*`
- `docs/superpowers/specs/2026-05-21-edge-lifecycle-design.md`
- `docs/superpowers/plans/2026-05-21-edge-lifecycle-mvp-implementation-plan.md`

## Motivation

The temp specs introduce session tables, WebSocket protocol, artifact endpoints, and updater behavior without reconciling them with the existing edge-agent and gateway contracts.

## Proposal

Create a current-state audit that maps each desired capability to existing files, existing DB fields, and the next issue that should own the gap.

## Scope

- Review `docs/temp/*`.
- Review `docs/superpowers/specs/2026-05-21-edge-lifecycle-design.md`.
- Review `apps/edge-agent/src/*`.
- Review `apps/api-gateway/src/edges-internal/*`.
- Review `apps/api-gateway/src/workers/*`.
- Review `packages/prisma/prisma/schema.prisma`.

## Out of Scope

- Changing implementation code.
- Creating WebSocket, artifact, updater, or service-install code.
- Replacing the existing gateway-owned edge control plane.

## Acceptance Criteria

- A doc identifies current support for registration, credentials, connectivity, task leasing, release registry, and upgrade status.
- Each temp-spec-only concept is marked as `keep`, `defer`, or `drop`.
- WebSocket sessions are explicitly deferred unless a concrete blocking problem is documented.
- Artifact endpoints are explicitly deferred unless a task payload/result size requirement is documented.
- The next issue chain is referenced as the implementation path.

## Outcome

Audit output: `docs/issues/edge-upg-001-current-state-audit.md`

Summary:

- Keep the existing polling/REST API gateway edge control plane.
- Keep current worker-owned identity, credential, task lease, release, campaign, and upgrade status models.
- Fix the current edge connectivity heartbeat contract mismatch in `EDGE-UPG-002`.
- Defer WebSocket sessions to `EDGE-UPG-013`.
- Defer generic task artifact transfer to `EDGE-UPG-012`.
- Drop new edge microservice scope for this milestone.

## Definition of Done

- [x] Audit doc written.
- [x] No implementation changes included.
- [x] Follow-up issues updated or confirmed if the audit finds a missing dependency.
