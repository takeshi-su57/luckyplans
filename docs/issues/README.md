# Upgradable Edge Runtime Issues

Date: 2026-06-01
Status: Draft issue chain

These files split the upgradable edge runtime work into one GitHub-style issue per file. The sequence evolves the current polling/REST edge-agent and API gateway implementation before adding OS service installation, updater handoff, rollback, and observability.

WebSocket sessions, generic artifact transfer, and a separate microservice remain deferred until a concrete need is documented.

## Import Notes

- Use each file's `GitHub title` line as the issue title.
- Apply the listed `Labels` manually or through the GitHub CLI.
- Keep dependencies in the issue body until real GitHub issue numbers exist, then replace `EDGE-UPG-*` references with issue links.
- Do not start an implementation issue until its dependency issues are closed or explicitly waived.

## Ordered Issues

- [EDGE-UPG-001 - [Chore]: Audit current edge lifecycle contracts against temp specs](edge-upg-001-audit-current-edge-lifecycle-contracts-against-temp-specs.md)
- [EDGE-UPG-002 - [Feature]: Stabilize edge connectivity heartbeat contract](edge-upg-002-stabilize-edge-connectivity-heartbeat-contract.md)
- [EDGE-UPG-003 - [Feature]: Convert edge-agent from single poll execution to managed daemon loop](edge-upg-003-convert-edge-agent-from-single-poll-execution-to-managed-daemon-loop.md)
- [EDGE-UPG-004 - [Feature]: Add edge runtime health snapshot and stale-worker semantics](edge-upg-004-add-edge-runtime-health-snapshot-and-stale-worker-semantics.md)
- [EDGE-UPG-005 - [Feature]: Add OS service install and uninstall commands for edge-agent](edge-upg-005-add-os-service-install-and-uninstall-commands-for-edge-agent.md)
- [EDGE-UPG-006 - [Feature]: Harden release metadata resolution for platform-specific upgrades](edge-upg-006-harden-release-metadata-resolution-for-platform-specific-upgrades.md)
- [EDGE-UPG-007 - [Feature]: Implement upgrade download and verification on edge-agent](edge-upg-007-implement-upgrade-download-and-verification-on-edge-agent.md)
- [EDGE-UPG-008 - [Feature]: Implement external updater install and service restart](edge-upg-008-implement-external-updater-install-and-service-restart.md)
- [EDGE-UPG-009 - [Feature]: Add rollback and failed-boot recovery for edge upgrades](edge-upg-009-add-rollback-and-failed-boot-recovery-for-edge-upgrades.md)
- [EDGE-UPG-010 - [Feature]: Add edge release publishing pipeline](edge-upg-010-add-edge-release-publishing-pipeline.md)
- [EDGE-UPG-011 - [Feature]: Add edge lifecycle observability and operator runbooks](edge-upg-011-add-edge-lifecycle-observability-and-operator-runbooks.md)
- [EDGE-UPG-012 - [Chore]: Decide whether artifact transfer is needed for task payloads/results](edge-upg-012-decide-whether-artifact-transfer-is-needed-for-task-payloads-results.md)
- [EDGE-UPG-013 - [Chore]: Decide whether WebSocket sessions are needed](edge-upg-013-decide-whether-websocket-sessions-are-needed.md)
- [EDGE-UPG-014 - [Chore]: Global verification and documentation sync](edge-upg-014-global-verification-and-documentation-sync.md)
- [EDGE-UPG-015 - [Bug]: Fix post-milestone edge upgrade correctness gaps](edge-upg-015-post-milestone-edge-upgrade-correctness-hardening.md)

## Supporting Audit Docs

- [Current edge lifecycle state audit](edge-upg-001-current-state-audit.md) supports `EDGE-UPG-001`; it is not a separate importable issue.

## Deferred Follow-Up Issues

These are not part of the current milestone. Start them only when their trigger conditions are met in the linked architecture decision records.

- [DEFERRED-EDGE-TASK-ARTIFACT-TRANSFER - [Feature]: Add task artifact transfer when task data outgrows REST JSON](deferred-edge-task-artifact-transfer.md)
- [DEFERRED-EDGE-WEBSOCKET-SESSIONS - [Feature]: Add persistent edge WebSocket sessions when low-latency commands are required](deferred-edge-websocket-sessions.md)

## Current Codebase Baseline

- `apps/edge-agent` already has onboarding, local config, polling task execution, connectivity heartbeat, and a basic idle-only upgrade state machine.
- `apps/api-gateway/src/edges-internal` already owns edge registration, connectivity, worker auth, and task endpoints.
- `apps/api-gateway/src/workers` already owns worker registry, credentials, releases, target version assignment, and upgrade status.
- `packages/prisma` already includes worker identity, credentials, enrollment tokens, edge releases, task leases, and upgrade fields.
