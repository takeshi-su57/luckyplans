# Edge Architecture Phase 4 Spec: Updates + Security + Observability (F+G+H)

Status: Superseded for the current milestone by the accepted `EDGE-UPG-*` issue chain and live docs under `apps/web/content`. Release artifacts, service installation, rollback, release publishing, observability, and runbooks are implemented through `EDGE-UPG-005` to `EDGE-UPG-011`; generic task artifacts and WebSocket sessions remain deferred by the 2026-06-05 architecture decisions.

## Goal
Deliver production-grade edge lifecycle management with decision-based updates, safe install/rollback, hardened execution security, and actionable observability.

## Scope
- Update decision endpoint and rollout rules
- Edge upgrade state machine and external updater flow
- Rollback safety model
- Security hardening for task execution and release trust
- Metrics/logging/dashboard visibility for operations

## Out of Scope
- Core registration/session (Phase 1)
- Core task/lease flow (Phase 2)
- Artifact transfer contracts (Phase 3)

## Server Requirements
### Update Decision API
- `POST /v1/edges/update-check`
- Response must be policy-driven (not version-compare only), considering:
  - currentVersion
  - platform
  - arch
  - installType
  - channel
  - rolloutPercent
  - mandatory update rules
  - known bad version rules

### Deterministic Rollout
- Use stable bucket selection:
  - `hash(edgeId + targetVersion) % 100 < rolloutPercent`

### Release Registry Data
- release identity, channel, platform/arch/install type
- artifact URL(s), checksum, signature URL, size
- mandatory/minimum version/rollout and enabled state

### Update Attempt Tracking
- Track update lifecycle status and failure metadata per edge

## Edge Requirements
### Update Check Cadence
- On startup
- Every 5 minutes + jitter (0-60s)
- On server `update.checkNow` signal

### Upgrade State Machine
- `none -> update_available -> draining -> downloading -> verifying -> installing -> restarting -> healthy -> succeeded`
- Failure/rollback branches:
  - `failed`, `rolling_back`, `rolled_back`, `rollback_failed`

### External Updater Model
- Main agent must not overwrite itself
- Flow:
  - agent downloads and verifies
  - agent launches updater
  - agent exits
  - updater swaps version and restarts service

### Verification Requirements
- HTTPS transport validation
- SHA-256 checksum verification
- Signature verification against trusted key
- Platform/arch compatibility checks

### Rollback Requirements
- Persist update attempt state locally
- Keep previous version pointer
- Require post-restart healthy confirmation within timeout (example: 60s)
- Auto-rollback to previous version on failed health confirmation

## Security Requirements
- Edge runs under low-privilege OS user
- Task execution via constrained child processes
- Restricted working directory
- Timeout and concurrency limits enforced
- No arbitrary shell command execution from server payload
- Strict task payload validation by known task types

## Observability Requirements
### Edge Telemetry
- heartbeat/status/version
- resource usage
- running task count and progress
- update state and errors

### Server Visibility
- connection/session events
- task lifecycle events
- update lifecycle events
- auth/security failures

### Dashboard Expectations
- edge online/offline status
- version distribution
- task throughput/failure rate
- update rollout progress and rollback counts

## Acceptance Criteria
- Update decisions are policy-driven and deterministic per rollout rules
- Edge can safely perform externalized upgrade with verification gates
- Rollback restores previous version on unhealthy restart
- Security controls prevent arbitrary remote command execution
- Operators can observe edge/task/update health in logs/metrics/dashboard

## Risks
- False rollback from overly strict health timeouts
- Signature key rotation failures causing blocked updates

