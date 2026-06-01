# EDGE-UPG-005 - [Feature]: Add OS service install and uninstall commands for edge-agent

GitHub title: `[Feature]: Add OS service install and uninstall commands for edge-agent`

Depends on: `EDGE-UPG-003`

Labels: `type:feature`, `priority:high`, `area:edge-agent`, `area:ops`

Related:

- `apps/edge-agent/package.json`
- `apps/edge-agent/src/main.ts`
- `apps/web/content/guides/developer.mdx`

## Motivation

The product goal requires the edge-agent to run permanently as an OS service.

## Proposal

Add install/uninstall/status commands or scripts for Linux systemd and Windows Service. These commands wrap the daemon runtime from `EDGE-UPG-003`.

## Out of Scope

- Performing automatic upgrades.
- Changing release metadata.
- Deleting local credentials during uninstall by default.

## Acceptance Criteria

- Linux install creates a systemd unit that starts edge-agent daemon on boot.
- Windows install creates a Windows Service that starts edge-agent daemon on boot.
- Uninstall removes the service without deleting credentials by default.
- Status command reports whether the service is installed/running.
- Install flow fails clearly when config is missing or invalid.
- Service logs do not print worker credentials or enrollment tokens.

## Definition of Done

- [ ] Unit tests cover command generation and validation.
- [ ] Manual smoke checklist exists for Windows and Linux.
- [ ] Docs include install, status, restart, and uninstall commands.
