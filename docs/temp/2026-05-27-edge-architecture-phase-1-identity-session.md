# Edge Architecture Phase 1 Spec: Identity + Session (A+B)

Status: WebSocket sessions are deferred for the next milestone by `apps/web/content/architecture/decisions/2026-06-05-defer-edge-websocket-sessions.mdx`. Current edge liveness uses authenticated internal REST connectivity heartbeats.

## Goal
Establish secure edge identity, registration, and persistent outbound control connectivity so each edge can be tracked as online/offline with reliable heartbeat semantics.

## Scope
- Edge enrollment and registration
- Durable edge credentials
- Edge registry baseline data model
- WebSocket connection/auth/session lifecycle
- `edge.hello` and `edge.heartbeat` protocol
- Reconnect/backoff behavior
- Online/stale/offline state transitions

## Out of Scope
- Task offers/execution/leases
- Artifact upload/download
- Update/upgrade lifecycle

## Server Requirements
### REST
- `POST /v1/edges/register`
  - Input: enrollment token, display metadata, platform/arch/installType/channel/capabilities
  - Behavior: verify enrollment token, create or upsert edge identity, return durable edge credentials

### WebSocket
- `wss://<api>/v1/edge/connect`
  - Edge authenticates with durable credential
  - Server creates edge session record
  - Server marks edge `online` on successful hello

### Registry and Session Data
- `edges` table baseline:
  - `id`, `owner_id`, `name`, `current_version`, `platform`, `arch`, `install_type`, `channel`, `status`, `capabilities_json`, `max_concurrent_tasks`, `last_seen_at`, `created_at`, `updated_at`
- `edge_sessions` table baseline:
  - `id`, `edge_id`, `connected_at`, `disconnected_at`, `remote_addr`, `agent_version`, `status`, `created_at`, `updated_at`

### Presence Rules
- Heartbeat interval target: 10s
- Stale threshold: 30s without heartbeat
- Offline threshold: 60-120s without heartbeat
- Transition model:
  - connect -> online
  - no heartbeat > stale threshold -> stale
  - no heartbeat > offline threshold -> offline

## Edge Requirements
- Run as long-lived service process
- Register once using enrollment token, persist durable credential locally
- Open outbound WSS connection only (no inbound ports)
- Send `edge.hello` immediately after connect
- Send `edge.heartbeat` every 10s while connected
- Reconnect with exponential backoff + jitter: `1s, 2s, 5s, 10s, 30s, 60s (max)`

## Protocol (Phase 1)
### Envelope
```json
{
  "id": "msg_123",
  "type": "edge.heartbeat",
  "edgeId": "edge_abc",
  "timestamp": "2026-05-27T12:00:00Z",
  "payload": {}
}
```

### `edge.hello`
Includes:
- `agentVersion`
- `platform`
- `arch`
- `installType`
- `channel`
- `capabilities` (cpu/memory/task types/selfUpdate flag)

### `edge.heartbeat`
Includes:
- `status`
- `cpuUsage`
- `memoryUsage`
- `diskFreeGb`
- `runningTasks` (empty in this phase)
- `currentVersion`

## Acceptance Criteria
- Edge can register and receive durable credentials
- Edge can authenticate to WebSocket endpoint
- Server tracks session connect/disconnect and last seen
- Presence transitions (online/stale/offline) occur according to thresholds
- Edge reconnect behavior is stable and bounded with jitter

## Risks
- Heartbeat storms during outages without jitter
- Credential leakage if local storage permissions are weak

