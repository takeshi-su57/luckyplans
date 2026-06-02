# EDGE-UPG-006 - [Feature]: Harden release metadata resolution for platform-specific upgrades

GitHub title: `[Feature]: Harden release metadata resolution for platform-specific upgrades`

Depends on: `EDGE-UPG-002`

Labels: `type:feature`, `priority:high`, `area:api-gateway`, `area:workers`

Related:

- `apps/api-gateway/src/workers/releases.service.ts`
- `apps/api-gateway/src/workers/releases.resolver.ts`
- `packages/prisma/prisma/schema.prisma`

## Motivation

Upgrade execution needs deterministic platform/arch/install-type resolution before the agent can safely download anything.

## Proposal

Make release lookup return the correct artifact metadata for the requesting edge. Keep release management in the API gateway workers module.

## Out of Scope

- Building release artifacts in CI.
- Downloading or verifying artifacts on the edge.
- Creating a separate release service.

## Acceptance Criteria

- Release metadata lookup considers version, platform, arch, and install type where supported.
- Gateway does not return an incompatible artifact to an edge.
- Release response includes HTTPS URL, checksum, signature metadata, signing key id, and size when available.
- Missing or incompatible release metadata returns no upgrade artifact and a clear upgrade message.
- Tests cover Linux, Windows, missing release, unsupported arch, and checksum/signature presence.

## Outcome

Implemented platform-specific release metadata resolution:

- Added artifact-level release metadata for platform, arch, install type, URL, checksum, signature, signing key id, and size.
- Preserved existing release records and backfilled default Linux/Windows service artifacts.
- Routed edge connectivity upgrade lookup through `ReleasesService`.
- Returned no artifact plus a clear message when no compatible artifact exists.
- Kept release management in the API gateway workers module.

Verification notes:

- `pnpm --filter @luckyplans/api-gateway test -- releases.service.spec.ts edges-connectivity.controller.spec.ts` passed.
- `pnpm --filter @luckyplans/api-gateway type-check` passed.
- Full repository gates passed: `pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm format:check`, and `git diff --check`.

## Definition of Done

- [x] Release service tests pass.
- [x] Connectivity controller tests pass.
- [x] No new microservice is introduced.
