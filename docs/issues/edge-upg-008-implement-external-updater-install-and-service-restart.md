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

- [ ] Tests cover staging, switch, failed install, and status reporting.
- [ ] Manual smoke checklist exists for Linux and Windows.
- [ ] Docs explain required privileges.
