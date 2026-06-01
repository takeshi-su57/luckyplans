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

## Definition of Done

- [ ] Verification output captured in the PR or final issue comment.
- [ ] Docs reflect the implemented behavior.
- [ ] Remaining deferred work has explicit follow-up issues.
