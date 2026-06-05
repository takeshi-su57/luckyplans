Custom Edge Compute System Design Spec

Status: Historical temp design. The current milestone follows the ordered `EDGE-UPG-*` issue chain in `docs/issues/README.md` and the active architecture docs under `apps/web/content`. WebSocket sessions and generic task artifact transfer are deferred; edge orchestration currently uses authenticated internal REST polling and connectivity heartbeats.

1. Goal

Build a cloud-managed edge execution system where users install a lightweight TypeScript-based edge agent on their local machine. The edge agent runs permanently as an OS service, reports health to the cloud server, receives tasks through a secure outbound connection, executes CPU-intensive workloads locally, reports progress/results, and upgrades itself automatically when the server publishes a newer compatible version.

The system should not require Docker, containerd, Kubernetes, SSH access, port forwarding, or direct inbound access to the user’s machine.

2. Core Architecture
   +--------------------------------------------------+
   | Cloud Server |
   |--------------------------------------------------|
   | REST API |
   | Dashboard / Admin UI |
   | Auth / Edge Registry |
   | WebSocket Gateway |
   | Task Scheduler |
   | Task State DB |
   | Release Registry |
   | Update Decision Service |
   | Artifact Storage |
   | Monitoring / Logs |
   +-------------------------^------------------------+
   |
   | Edge-initiated TLS connection
   |
   +-------------------------v------------------------+
   | Edge Agent |
   |--------------------------------------------------|
   | Runs as OS service |
   | Maintains outbound WebSocket connection |
   | Sends heartbeat/status |
   | Checks for updates periodically |
   | Accepts/rejects task offers |
   | Executes tasks using child processes |
   | Uploads results/artifacts |
   | Auto-upgrades with rollback support |
   +-------------------------+------------------------+
   |
   v
   +--------------------------------------------------+
   | Local Machine |
   |--------------------------------------------------|
   | CPU / memory / disk |
   | Local task working directory |
   | Local SQLite or JSON state |
   | OS service manager |
   +--------------------------------------------------+
3. Main Design Principles
   3.1 Edge initiates all network connections

The cloud server must never directly call into the local user machine.

Correct model:

Edge -> Server: connect
Server -> Edge: send command over existing connection
Edge -> Server: send progress/result/status

Avoid:

Server -> Edge local IP: direct HTTP call
Server -> Edge SSH
Server -> Edge open port

This avoids NAT, firewall, VPN, and port-forwarding issues.

3.2 WebSocket for control, HTTP for artifacts

Use:

WebSocket over TLS:

- heartbeat
- status
- task offer
- task accept/reject
- progress
- logs
- cancel command
- update notification

HTTPS:

- update check
- artifact download
- task input download
- task result upload
- release package download

Large files should not be sent over WebSocket.

3.3 Edge owns local execution

The server can offer work, but the edge decides whether it can accept it.

Server offers task.
Edge accepts or rejects.
Only accepted tasks become running tasks.

The edge knows local truth better than the server:

CPU busy
Memory unavailable
Disk full
User paused agent
Machine shutting down
Dependency missing
Update in progress
3.4 Auto-upgrade is a privileged lifecycle operation

Software upgrade should not be modeled as a normal user task.

It belongs to the edge system lifecycle:

registration
heartbeat
status
task execution
upgrade check
upgrade install
rollback 4. Server-Side Architecture
4.1 Server components
Cloud Server
REST API
WebSocket Gateway
Edge Registry
Task Scheduler
Task State Manager
Release Registry
Update Decision Service
Artifact Storage Service
Monitoring / Metrics
Admin Dashboard
4.2 REST API

Responsible for:

edge registration
update check
task metadata APIs
artifact upload/download URL generation
admin dashboard APIs
release management
edge status query

Example endpoints:

POST /v1/edges/register
POST /v1/edges/update-check
POST /v1/tasks
GET /v1/tasks/:taskId
POST /v1/artifacts/upload-url
POST /v1/artifacts/download-url
POST /v1/releases
GET /v1/edges/:edgeId
4.3 WebSocket Gateway

Endpoint:

wss://api.example.com/v1/edge/connect

Responsibilities:

authenticate edge
maintain online session
receive heartbeat
send task offers
send cancel commands
send config/update notifications
receive progress events
receive task completion events
4.4 Edge Registry

Stores all known edge machines.

Example fields:

id
name
owner_id
current_version
platform
arch
install_type
channel
status
last_seen_at
last_update_check_at
capabilities
max_concurrent_tasks
created_at
updated_at

Possible statuses:

registered
online
idle
busy
draining
upgrading
restarting
offline
disabled
error
4.5 Task Scheduler

Responsible for selecting eligible edges.

Initial scheduler can be simple:

eligible edges =
online
not disabled
not upgrading
not draining
supports task type
has available capacity

Scoring:

score =
available_cpu_weight

- available_memory_weight

* running_task_penalty
* recent_failure_penalty

MVP scheduler may simply choose the least-busy eligible edge.

4.6 Artifact Storage

Use object storage or equivalent.

Artifacts include:

task input files
task output files
logs
diagnostic bundles
edge release packages
installers

The server should issue short-lived signed upload/download URLs.

5. Edge-Side Architecture
   5.1 Edge process structure
   edge-agent
   config manager
   auth manager
   websocket client
   heartbeat reporter
   update checker
   update manager
   task manager
   child process supervisor
   artifact client
   local state store
   log manager
   5.2 Suggested TypeScript project layout
   src/
   main.ts

config/
config.ts
configSchema.ts

auth/
identity.ts
tokenManager.ts

comms/
websocketClient.ts
protocol.ts
httpClient.ts

lifecycle/
lifecycleManager.ts
shutdownHandler.ts
serviceState.ts

heartbeat/
heartbeatReporter.ts
systemMetrics.ts

update/
updateChecker.ts
updateManager.ts
updateDownloader.ts
updateVerifier.ts
updateInstaller.ts
updateState.ts

tasks/
taskManager.ts
taskTypes.ts
taskLease.ts
taskHandlers.ts

runtime/
childProcessRunner.ts
processSupervisor.ts

artifacts/
artifactDownloader.ts
artifactUploader.ts

storage/
localState.ts
sqliteStore.ts

logging/
logger.ts
logStreamer.ts
5.3 Edge should run as OS service

Linux:

systemd service

macOS:

launchd daemon

Windows:

Windows Service

The edge should start automatically after reboot.

6. Edge Installation Layout

Recommended local layout:

/opt/your-edge/
current -> versions/1.2.0/
previous -> versions/1.1.3/

versions/
1.1.3/
edge-agent
edge-updater
package.json
1.2.0/
edge-agent
edge-updater
package.json

config/
edge.yaml

state/
edge.db
update-state.json

logs/
edge-agent.log
updater.log

work/
tasks/
downloads/
outputs/

The service should start:

/opt/your-edge/current/edge-agent

This makes upgrades and rollback easier because the updater can switch the current pointer.

On Windows, the layout can be similar, using directories instead of symlinks if necessary.

7. Communication Protocol
   7.1 Transport choice

Use:

Control channel:
WebSocket over TLS

Large data:
HTTPS upload/download

Update check:
HTTPS POST

Optional later:
NATS JetStream or gRPC streaming
7.2 Message envelope

All WebSocket messages should use a common envelope.

{
"id": "msg_123",
"type": "edge.heartbeat",
"edgeId": "edge_abc",
"timestamp": "2026-05-27T12:00:00Z",
"payload": {}
}

Recommended common fields:

id
type
edgeId
taskId, optional
requestId, optional
timestamp
payload
7.3 Edge hello

Sent after WebSocket connection.

{
"id": "msg_001",
"type": "edge.hello",
"edgeId": "edge_123",
"timestamp": "2026-05-27T12:00:00Z",
"payload": {
"agentVersion": "1.1.3",
"platform": "linux",
"arch": "x64",
"installType": "systemd",
"channel": "stable",
"capabilities": {
"cpuCores": 8,
"memoryGb": 32,
"maxConcurrentTasks": 2,
"taskTypes": ["diagnostic", "render", "simulation"],
"selfUpdate": true
}
}
}
7.4 Heartbeat
{
"id": "msg_002",
"type": "edge.heartbeat",
"edgeId": "edge_123",
"timestamp": "2026-05-27T12:00:10Z",
"payload": {
"status": "idle",
"cpuUsage": 0.31,
"memoryUsage": 0.54,
"diskFreeGb": 128,
"runningTasks": [],
"currentVersion": "1.1.3"
}
}

Suggested heartbeat interval:

every 10 seconds while connected

Offline detection:

mark stale after 30 seconds
mark offline after 60-120 seconds
7.5 Task offer
{
"id": "msg_100",
"type": "server.task.offer",
"edgeId": "edge_123",
"taskId": "task_abc",
"timestamp": "2026-05-27T12:01:00Z",
"payload": {
"leaseId": "lease_xyz",
"taskType": "diagnostic",
"priority": 5,
"timeoutSeconds": 3600,
"input": {
"artifactUrl": "https://storage.example.com/input/task_abc.json"
},
"params": {}
}
}
7.6 Task accepted
{
"id": "msg_101",
"type": "edge.task.accepted",
"edgeId": "edge_123",
"taskId": "task_abc",
"timestamp": "2026-05-27T12:01:02Z",
"payload": {
"leaseId": "lease_xyz"
}
}
7.7 Task rejected
{
"id": "msg_102",
"type": "edge.task.rejected",
"edgeId": "edge_123",
"taskId": "task_abc",
"timestamp": "2026-05-27T12:01:02Z",
"payload": {
"reason": "insufficient_memory"
}
}
7.8 Task progress
{
"id": "msg_103",
"type": "edge.task.progress",
"edgeId": "edge_123",
"taskId": "task_abc",
"timestamp": "2026-05-27T12:05:00Z",
"payload": {
"progress": 42,
"message": "Processed 4200 of 10000 items"
}
}
7.9 Task completed
{
"id": "msg_104",
"type": "edge.task.completed",
"edgeId": "edge_123",
"taskId": "task_abc",
"timestamp": "2026-05-27T12:30:00Z",
"payload": {
"leaseId": "lease_xyz",
"result": {
"artifactUrl": "https://storage.example.com/output/task_abc.json",
"exitCode": 0,
"durationMs": 1740000
}
}
}
7.10 Task failed
{
"id": "msg_105",
"type": "edge.task.failed",
"edgeId": "edge_123",
"taskId": "task_abc",
"timestamp": "2026-05-27T12:30:00Z",
"payload": {
"leaseId": "lease_xyz",
"errorCode": "PROCESS_EXITED_NON_ZERO",
"message": "Task process exited with code 1",
"retryable": true
}
} 8. Task Model

Tasks can remain abstract in the first version.

Use a generic task envelope:

{
"taskId": "task_123",
"taskType": "some_task_type",
"payloadSchema": "v1",
"payload": {}
}

The edge should have a handler registry:

const taskHandlers = {
diagnostic: diagnosticHandler,
render: renderHandler,
simulation: simulationHandler
};

Unknown task type:

reject task with reason unsupported_task_type
8.1 Task lifecycle
created
queued
offered
accepted
running
succeeded

Failure paths:

offered -> rejected
offered -> expired
running -> failed
running -> timed_out
running -> cancelled
running -> lost
lost -> queued
failed -> queued, if retryable
8.2 Task leases

Every assigned task should have a lease.

Server offers task with leaseId.
Edge accepts task.
Edge renews lease while task is running.
If lease expires, server can mark attempt as lost and requeue.

Lease renewal:

{
"id": "msg_200",
"type": "edge.task.leaseRenewed",
"edgeId": "edge_123",
"taskId": "task_abc",
"timestamp": "2026-05-27T12:10:00Z",
"payload": {
"leaseId": "lease_xyz",
"extendBySeconds": 60
}
}

Recommended lease rules:

lease duration: 60 seconds
renew every: 20 seconds
server marks lost after: lease expires + grace period
8.3 Task execution model without Docker

The edge agent should not execute CPU-heavy work inside the main process.

Use child processes:

edge-agent
-> child task process A
-> child task process B

Advantages:

main agent remains responsive
task crashes do not crash agent
timeouts are easier
stdout/stderr can be captured
process can be killed on cancellation

For Node/TypeScript tasks, use:

child_process.spawn

For CPU-heavy JavaScript code, worker_threads is possible, but child process isolation is usually safer.

9. Edge Lifecycle
   9.1 Edge states
   starting
   online
   idle
   busy
   draining
   upgrading
   restarting
   offline
   disabled
   error
   9.2 Normal startup
1. OS starts edge service.
1. Edge loads config.
1. Edge loads local state.
1. Edge checks unfinished task/update state.
1. Edge authenticates.
1. Edge opens WebSocket.
1. Edge sends hello.
1. Edge sends heartbeat.
1. Edge checks update.
1. Edge enters idle or busy state.
   9.3 Graceful shutdown

On SIGTERM / service stop:

1. Stop accepting new tasks.
2. Mark state as draining.
3. Notify server.
4. Let running tasks finish if within grace period.
5. Cancel or checkpoint tasks if needed.
6. Close WebSocket.
7. Exit.
   9.4 Reconnect behavior

If WebSocket disconnects:

1. Continue current task if safe.
2. Try reconnect with exponential backoff.
3. Keep local progress state.
4. When reconnected, send edge.hello.
5. Resync running task state.

Backoff:

1s, 2s, 5s, 10s, 30s, 60s max

Add jitter to avoid synchronized reconnect storms.

10. Auto-Upgrade Design

Auto-upgrade is a core lifecycle feature.

10.1 Update design goals

The updater must support:

periodic update checks
platform-specific releases
release channels
staged rollouts
mandatory updates
safe download
checksum verification
signature verification
drain mode
service restart
health confirmation
rollback
update attempt reporting
10.2 Update check interval

The edge should check:

on startup
every 5 minutes + jitter
when server sends update.checkNow over WebSocket

Use jitter:

5 minutes + random 0-60 seconds
10.3 Update check request

Endpoint:

POST /v1/edges/update-check

Request:

{
"edgeId": "edge_123",
"currentVersion": "1.1.3",
"platform": "linux",
"arch": "x64",
"installType": "systemd",
"channel": "stable",
"capabilities": {
"selfUpdate": true
}
}
10.4 Update check response: no update
{
"updateAvailable": false,
"currentVersion": "1.1.3"
}
10.5 Update check response: update available
{
"updateAvailable": true,
"targetVersion": "1.2.0",
"channel": "stable",
"mandatory": false,
"deadline": null,
"releaseId": "edge-agent-1.2.0-linux-x64",
"artifact": {
"url": "https://download.example.com/edge-agent/1.2.0/linux-x64.tar.gz",
"sha256": "abc123...",
"signatureUrl": "https://download.example.com/edge-agent/1.2.0/linux-x64.tar.gz.sig",
"sizeBytes": 42100000
},
"requirements": {
"minimumVersion": "1.0.0",
"requiresRestart": true
},
"rollout": {
"strategy": "stable",
"canRollback": true
}
}
10.6 Update should be decision-based, not version-only

Do not make the edge simply compare:

latestVersion > currentVersion

Instead, the server should decide:

Is this edge eligible for this update?

Decision depends on:

current version
platform
CPU architecture
install type
release channel
rollout percentage
mandatory version rules
edge group
owner/account
known bad versions
10.7 Release channels

Support:

internal
dev
beta
stable
pinned

Example rollout:

internal -> 100%
beta -> 25%
stable -> 5%
stable -> 25%
stable -> 100%
10.8 Staged rollout decision

Use deterministic rollout selection:

hash(edgeId + targetVersion) % 100 < rolloutPercent

This ensures the same edge keeps receiving the same decision for a given version.

10.9 Upgrade states
none
update_available
draining
downloading
downloaded
verifying
verified
installing
restarting
healthy
succeeded
failed
rolling_back
rolled_back
rollback_failed
10.10 Upgrade flow
[Edge running]
|
| startup or 5-min check
v
[Check update]
|
| no update
v
[Continue normal operation]

    |
    | update available
    v

[Enter draining mode]
|
| stop accepting new tasks
v
[Wait for running tasks or deadline]
|
v
[Download update]
|
v
[Verify checksum]
|
v
[Verify signature]
|
v
[Launch updater process]
|
v
[Agent exits]
|
v
[Updater installs new version]
|
v
[Updater restarts service]
|
v
[New agent starts]
|
v
[New agent reports healthy]
|
v
[Server marks update succeeded]
10.11 Mandatory update behavior

Normal update:

stop accepting new tasks
wait for current tasks to finish
upgrade afterward

Mandatory update:

stop accepting new tasks
wait until deadline if provided
cancel/checkpoint running tasks if needed
upgrade as soon as possible
10.12 Use separate updater process

Do not have the main agent overwrite itself.

Use:

edge-agent
edge-updater

Flow:

edge-agent downloads and verifies update
edge-agent launches edge-updater
edge-agent exits
edge-updater replaces version
edge-updater restarts service
10.13 Verification

Before installing:

verify HTTPS transport
verify SHA-256 checksum
verify release signature
verify package metadata
verify target platform/arch

The edge should ship with a trusted public signing key.

If verification fails:

do not install
report security error
retry only after server provides a new release decision
10.14 Rollback

Before upgrade:

remember previous version
store update attempt state locally

After upgrade:

new agent must report healthy within N seconds

Example:

health confirmation timeout: 60 seconds

If not healthy:

updater restores previous version
restarts service
reports rollback

Local update state:

{
"attemptId": "update_attempt_123",
"fromVersion": "1.1.3",
"toVersion": "1.2.0",
"state": "installing",
"startedAt": "2026-05-27T12:00:00Z",
"rollbackAvailable": true
} 11. Server Data Model
11.1 edges
id
owner_id
name
current_version
platform
arch
install_type
channel
status
capabilities_json
max_concurrent_tasks
last_seen_at
last_update_check_at
created_at
updated_at
11.2 edge_sessions
id
edge_id
connected_at
disconnected_at
remote_addr
agent_version
status
created_at
updated_at
11.3 tasks
id
owner_id
task_type
status
priority
payload_json
required_capabilities_json
timeout_seconds
max_attempts
created_at
updated_at
11.4 task_attempts
id
task_id
edge_id
lease_id
status
attempt_number
started_at
completed_at
lease_expires_at
error_code
error_message
result_json
created_at
updated_at
11.5 edge_releases
id
version
channel
platform
arch
install_type
artifact_url
sha256
signature_url
size_bytes
mandatory
minimum_version
rollout_percent
enabled
created_at
updated_at
11.6 edge_update_attempts
id
edge_id
release_id
from_version
to_version
status
error_code
error_message
started_at
completed_at
created_at
updated_at

Statuses:

available
started
draining
downloading
downloaded
verified
installing
succeeded
failed
rolling_back
rolled_back
rollback_failed 12. Security Design
12.1 Edge identity

Each edge should have:

edgeId
edgeSecret or private key
owner/account binding
channel assignment

On install:

installer receives enrollment token
edge registers with server
server returns durable edge credentials
edge stores credentials locally
12.2 Transport security

Use:

TLS for all network traffic
WSS for WebSocket
HTTPS for REST/artifacts
short-lived signed artifact URLs
12.3 Release security

Release packages must be:

checksum verified
signature verified
served over HTTPS
platform/arch validated
version validated

The edge must not install arbitrary URLs without verification.

12.4 Task security without containers

Since Docker/containerd is not used:

run edge under low-privilege OS user
run tasks as child processes
restrict working directory
enforce timeout
enforce concurrency limit
capture stdout/stderr
avoid arbitrary shell execution
use known task types instead of free-form commands
validate task payload

Avoid this:

{
"command": "bash -c 'anything from server'"
}

Prefer this:

{
"taskType": "render",
"params": {
"quality": "high"
}
} 13. Observability
13.1 Edge reports

Edge should report:

heartbeat
current version
CPU usage
memory usage
disk free
running tasks
update state
last error
task progress
task logs
13.2 Server dashboard

Dashboard should show:

edge list
online/offline status
current version
last seen time
task count
running task
update status
release rollout status
failure rate
13.3 Logs

Local logs:

edge-agent.log
updater.log
task logs

Server logs:

connection events
task lifecycle events
update attempt events
auth failures
release failures 14. MVP Scope
14.1 MVP server

Build:

edge registration
edge WebSocket connection
heartbeat tracking
basic task table
basic task offer
task accepted/rejected
task completed/failed
release registry
update-check endpoint
artifact URL support
simple admin view or CLI
14.2 MVP edge

Build:

OS service installation
config loading
edge authentication
WebSocket connection
heartbeat
update check every 5 minutes with jitter
download release package
verify checksum
external updater process
restart service
rollback on failed health check
basic diagnostic task handler
14.3 First task type

Use a simple diagnostic task first:

taskType: diagnostic

It can return:

hostname
platform
arch
CPU count
memory
disk
agent version
timestamp

This validates the full task lifecycle before real CPU-heavy tasks exist.

15. Recommended V1 Protocol Message Types
    edge.hello
    edge.heartbeat
    edge.status
    edge.error

server.task.offer
server.task.cancel

edge.task.accepted
edge.task.rejected
edge.task.started
edge.task.progress
edge.task.leaseRenewed
edge.task.completed
edge.task.failed

server.update.checkNow

edge.update.started
edge.update.draining
edge.update.downloading
edge.update.downloaded
edge.update.verified
edge.update.installing
edge.update.succeeded
edge.update.failed
edge.update.rolledBack 16. Recommended Final Design

Use this architecture:

Cloud:
REST API
WebSocket Gateway
PostgreSQL
Object Storage
Scheduler
Release Registry
Update Decision Service
Dashboard

Edge:
TypeScript/Node-based agent
Runs as systemd / launchd / Windows Service
Maintains outbound WebSocket
Uses HTTPS for update checks and artifacts
Runs tasks as child processes
Stores local state in SQLite or JSON
Has separate updater executable
Supports rollback

The key decisions are:

1. Edge-initiated communication only.
2. WebSocket for control messages.
3. HTTPS/object storage for files and release artifacts.
4. Server offers tasks; edge accepts or rejects.
5. Tasks are generic envelopes until task model matures.
6. Auto-upgrade is a first-class lifecycle operation.
7. Updates use server-side decisions, not only version comparison.
8. Release artifacts are checksum and signature verified.
9. Updater is separate from the main agent.
10. Rollback is supported from the beginning.

This gives you a practical production-ready foundation while keeping the task/result abstraction flexible enough to evolve later.
