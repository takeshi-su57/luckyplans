# Edge Agent OS Service Design

## Summary

`EDGE-UPG-005` adds native OS service management commands for the edge-agent. The goal is to make the daemon from `EDGE-UPG-003` run permanently on Windows and Linux machines while preserving the existing config and credential model.

The implementation adds a small edge-agent service-management module and CLI entrypoint. The module validates local edge config, renders native service definitions/commands, and executes platform service managers only when the operator explicitly runs install/status/restart/uninstall commands.

## Goals

- Install the built edge-agent daemon as a Linux systemd service.
- Install the built edge-agent daemon as a Windows Service.
- Provide status, restart, and uninstall commands for both platforms.
- Validate config before install so a service is not installed with missing or invalid runtime config.
- Keep uninstall non-destructive: remove the OS service but do not delete local credentials/config by default.
- Avoid logging or printing worker credentials, enrollment tokens, or full sensitive config.
- Add docs and manual smoke checklists for Linux and Windows.

## Non-Goals

- No automatic upgrade, rollback, or external updater behavior.
- No release metadata changes.
- No credential deletion during uninstall.
- No macOS launchd support.
- No container/Kubernetes service installation.
- No new major dependencies or service-wrapper libraries.

## CLI Shape

Add an edge-agent service CLI that can be run after build:

```bash
node apps/edge-agent/dist/service-cli.js install
node apps/edge-agent/dist/service-cli.js status
node apps/edge-agent/dist/service-cli.js restart
node apps/edge-agent/dist/service-cli.js uninstall
```

Package scripts should wrap these commands:

```bash
pnpm --filter @luckyplans/edge-agent service:install
pnpm --filter @luckyplans/edge-agent service:status
pnpm --filter @luckyplans/edge-agent service:restart
pnpm --filter @luckyplans/edge-agent service:uninstall
```

The CLI intentionally stays separate from `src/main.ts` so daemon startup remains focused on runtime behavior.

## Shared Service Model

Service name:

- Internal name: `luckyplans-edge-agent`
- Display name: `LuckyPlans Edge Agent`

Daemon command:

```bash
node <edge-agent-dist>/main.js
```

The service CLI resolves paths from the built package location by default. It can accept explicit options in later issues if packaging layout changes, but this issue should keep the command surface minimal.

Before install, the CLI calls the existing edge config loader. A missing or invalid config fails the install with a clear message that does not include the credential value. Environment-only runtime configuration is not accepted for service install in this issue because OS service environment persistence differs by platform and is easy to misconfigure.

## Linux Systemd Behavior

Install creates `/etc/systemd/system/luckyplans-edge-agent.service`.

Unit contents:

```ini
[Unit]
Description=LuckyPlans Edge Agent
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=<edge-agent-package-dir>
ExecStart=<node-path> <edge-agent-dist>/main.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Install command flow:

1. Validate local edge config.
2. Render the unit file.
3. Write the unit to `/etc/systemd/system/luckyplans-edge-agent.service`.
4. Run `systemctl daemon-reload`.
5. Run `systemctl enable luckyplans-edge-agent`.
6. Run `systemctl start luckyplans-edge-agent`.

Status command:

```bash
systemctl status luckyplans-edge-agent --no-pager
```

Restart command:

```bash
systemctl restart luckyplans-edge-agent
```

Uninstall command:

1. Run `systemctl stop luckyplans-edge-agent`.
2. Run `systemctl disable luckyplans-edge-agent`.
3. Remove `/etc/systemd/system/luckyplans-edge-agent.service`.
4. Run `systemctl daemon-reload`.

The CLI should surface permission failures clearly, for example: "Linux service install requires privileges to write systemd unit files and run systemctl."

## Windows Service Behavior

Windows uses native `sc.exe`; no `node-windows` or wrapper dependency is introduced.

Install command flow:

1. Validate local edge config.
2. Run `sc.exe create luckyplans-edge-agent binPath= "<node-path> <edge-agent-dist>\\main.js" start= auto DisplayName= "LuckyPlans Edge Agent"`.
3. Run `sc.exe description luckyplans-edge-agent "Runs the LuckyPlans edge-agent daemon."`.
4. Run `sc.exe start luckyplans-edge-agent`.

Status command:

```powershell
sc.exe query luckyplans-edge-agent
```

Restart command:

```powershell
sc.exe stop luckyplans-edge-agent
sc.exe start luckyplans-edge-agent
```

Uninstall command:

```powershell
sc.exe stop luckyplans-edge-agent
sc.exe delete luckyplans-edge-agent
```

The CLI should tolerate "not running" during restart/uninstall stop operations, but it should fail clearly if service creation or deletion fails. It should mention that Windows commands require an elevated shell.

## Security And Logging

The service CLI may print:

- service name
- config path
- server URL
- worker id
- device number
- command success/failure summary

The service CLI must not print:

- worker credential
- enrollment token
- authorization headers
- full config JSON

Error messages from config validation should mention missing/invalid config paths without dumping file contents.

## Testing

Unit tests should cover:

- Linux systemd unit rendering.
- Windows `sc.exe` command generation.
- Platform dispatch for install/status/restart/uninstall.
- Config validation failure blocks install.
- Secret redaction prevents credential values from appearing in CLI output/errors.
- Uninstall command generation does not delete config or credential files.

The tests should inject command execution and filesystem dependencies. They should not call real `systemctl`, `sc.exe`, or privileged filesystem paths.

## Documentation

Update the developer guide with:

- Build prerequisite: `pnpm --filter @luckyplans/edge-agent build`.
- First-run onboarding/config requirement.
- Linux install/status/restart/uninstall commands.
- Windows install/status/restart/uninstall commands.
- Manual Linux smoke checklist.
- Manual Windows smoke checklist.
- Note that uninstall leaves config and credentials in place.
- Note that elevated privileges are required for OS service installation/removal.

## Manual Smoke Checklist

Linux:

1. Build edge-agent.
2. Run onboarding once or provide a valid config file.
3. Run service install with privileges.
4. Confirm `systemctl status luckyplans-edge-agent` reports running.
5. Confirm Edges UI receives heartbeats.
6. Restart service.
7. Uninstall service.
8. Confirm local config remains.

Windows:

1. Build edge-agent.
2. Run onboarding once or provide a valid config file.
3. Run service install from an elevated PowerShell session.
4. Confirm `sc.exe query luckyplans-edge-agent` reports running.
5. Confirm Edges UI receives heartbeats.
6. Restart service.
7. Uninstall service.
8. Confirm local config remains.

## Implementation Order

1. Add service command generation tests.
2. Implement service command rendering and redaction helpers.
3. Add config validation and platform dispatch tests.
4. Implement install/status/restart/uninstall orchestration with injected dependencies.
5. Add service CLI entrypoint and package scripts.
6. Update docs and `EDGE-UPG-005` issue.
7. Run verification.
