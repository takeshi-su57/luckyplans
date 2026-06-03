# EDGE-UPG-008 - [Feature]: Implement external updater install and service restart

GitHub title: `[Feature]: Implement external updater install and service restart`

Depends on: `EDGE-UPG-005`, `EDGE-UPG-007`

Labels: `type:feature`, `priority:high`, `area:edge-agent`, `area:ops`

Related:

- `apps/edge-agent/src/upgrade.ts`
- `docs/issues/edge-upg-005-add-os-service-install-and-uninstall-commands-for-edge-agent.md`
- `docs/issues/edge-upg-007-implement-upgrade-download-and-verification-on-edge-agent.md`

## Motivation

Upgrading an OS service is a privileged lifecycle operation. The running agent should not casually overwrite itself without a controlled updater boundary.

## Proposal

Add an external updater flow that receives a verified artifact, stages it, switches the active version, and restarts the OS service.

## Out of Scope

- Building release artifacts in CI.
- Rollback after a failed boot.
- Web UI for upgrade operations.

## Acceptance Criteria

- Running agent delegates install/restart to an updater boundary.
- Updater stages the new version before switching the active version.
- Updater restarts the service through systemd or Windows Service manager.
- Edge reports `RESTARTING` before handoff.
- On next successful boot, edge reports `SUCCEEDED` with the new version.
- If install fails before switch, the previous version remains active.

## Definition of Done

- [x] Tests cover staging, switch, failed install, and status reporting.
- [x] Manual smoke checklist exists for Linux and Windows.
- [x] Docs explain required privileges.

## Implementation Notes

Implemented a focused edge-agent updater boundary:

- Verified artifacts are staged into a versioned release directory.
- The active version marker is switched only after staging succeeds.
- Service restart is delegated through the existing OS service manager abstraction.
- The running agent reports `RESTARTING` before handoff and leaves `SUCCEEDED` confirmation to the next successful boot.
- Failed staging leaves the previous active marker untouched.

## Verification Notes

- Test coverage lives in `apps/edge-agent/src/upgrade-installer.spec.ts`, `apps/edge-agent/src/upgrade.spec.ts`, `apps/edge-agent/src/runner.spec.ts`, `apps/edge-agent/src/main.spec.ts`, and `apps/edge-agent/src/service-manager.spec.ts`.
- Manual Linux and Windows smoke coverage plus privilege guidance live in `apps/web/content/guides/developer.mdx` under `Edge Agent Upgrade Install Smoke Checklist`.
- Targeted verification passed:
  - `pnpm --filter @luckyplans/edge-agent test -- upgrade-installer.spec.ts upgrade.spec.ts runner.spec.ts main.spec.ts service-manager.spec.ts` - 5 files, 42 tests passed.
  - `pnpm --filter @luckyplans/edge-agent lint`
  - `pnpm --filter @luckyplans/edge-agent type-check`
  - `pnpm --filter @luckyplans/edge-agent build`
  - `pnpm format:check`
  - `git diff --check`
