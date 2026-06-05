# Edge Lifecycle Observability Runbooks Design

Date: 2026-06-05
Issue: EDGE-UPG-011

## Goal

Operators can diagnose stale workers, stuck target versions, verification failures, service restart failures, and rollback events without inspecting raw database rows or sensitive payloads.

## Scope

This change adds lightweight lifecycle logging in the existing gateway and edge-agent paths, then documents the operator runbooks in the public developer/observability docs. It does not change upgrade mechanics, introduce a new metrics pipeline, or add dashboards.

## Architecture

The API gateway remains the source of persisted worker lifecycle state. `ReleasesService` logs safe upgrade target assignments and status transitions at the point where it already writes `targetVersion`, `upgradeStatus`, and `upgradeMessage`.

The edge-agent continues to emit process logs to stdout/stderr for service managers to collect. A tiny local logger wrapper gives daemon startup, shutdown, heartbeat failures, upgrade states, and fatal errors consistent event names without adding dependencies.

The docs use current Grafana/Loki workflows and edge smoke-check sections. The observability guide links directly to edge lifecycle troubleshooting so operators can move from symptoms to concrete checks.

## Safety

Logs may include worker ids, device numbers, platform/arch, versions, lifecycle status, runtime state, and sanitized short reasons already reported to the gateway. Logs must not include worker credentials, registration tokens, artifact signatures, private keys, full release payloads, or raw exception objects that may contain secrets.

## Testing

Code-visible behavior is covered with focused unit tests:

- Gateway tests verify lifecycle log calls for target assignments and status transitions.
- Edge-agent tests verify logger hooks for daemon start/stop, heartbeat failure, and upgrade status reporting.
- Existing docs have no dedicated snapshot harness, so docs are verified by format/type/build checks and manual content review.

