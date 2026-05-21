# Edge Lifecycle Design (Windows/Linux Install, Registration, Connectivity, Auto-Upgrade)

Date: 2026-05-21
Status: Approved for planning

## 1. Objective

Deliver an edge runtime lifecycle that supports:

1. Installable edge runtime on Windows and Linux.
2. Versioned install artifacts published on GitHub Releases.
3. First-run onboarding that collects server URL and token.
4. Platform registration flow that binds a unique human-readable device number.
5. Continuous connectivity reporting and task orchestration.
6. Server-driven upgrade orchestration with automatic idle-time upgrades.

## 2. Scope

In scope:

1. Edge onboarding and local config persistence.
2. Unique device identity generation and server-side uniqueness enforcement.
3. Connectivity heartbeat contract and last-seen tracking.
4. Release metadata registration and upgrade campaign control plane.
5. Edge upgrade execution (download, verify, install, restart) while idle.
6. Testing and phased rollout strategy.

Out of scope for this phase:

1. Non-idle forced interruption upgrades.
2. Supervisor-daemon architecture with full rollback runtime manager.
3. Realtime push channels (WebSocket/SSE) for upgrade triggers.

## 3. Architecture

### 3.1 Edge Runtime (CLI executable)

Responsibilities:

1. Run first-time interactive setup wizard.
2. Persist local configuration.
3. Run periodic heartbeat and task polling loop.
4. Detect target-version drift and execute upgrade when idle.

### 3.2 Edge Control API (API Gateway extension)

Responsibilities:

1. Authenticate edge credentials.
2. Register edges and validate device identity uniqueness.
3. Accept heartbeat/connectivity updates and update worker presence.
4. Return upgrade intent in heartbeat responses.

### 3.3 Release Registry and Upgrade Orchestrator

Responsibilities:

1. Store edge release metadata by semantic version.
2. Support per-worker target version assignment.
3. Support phased campaign rollouts.
4. Track upgrade lifecycle statuses.

### 3.4 Ops UI (edge management page)

Responsibilities:

1. Show edge registry and connectivity.
2. Show current and target version.
3. Trigger release targeting/campaign operations.

## 4. Device Identity and Registration

### 4.1 Canonical Device Number

Format:

`edge-<slugified-human-name>-<shortid>`

Example:

`edge-seoul-lab-a7k29f`

Rules:

1. `shortid` length: 6 to 8 chars.
2. Character set: lowercase alphanumeric.
3. Device number is unique globally.

### 4.2 First-Run Setup Flow

1. Prompt for edge display name.
2. Prompt for server URL.
3. Prompt for token.
4. Generate canonical device number.
5. Submit registration payload (`deviceNumber`, `displayName`, `platform`, `arch`, `edgeVersion`).
6. On uniqueness conflict, regenerate `shortid` and retry registration.
7. Persist resolved binding (`workerId`, `deviceNumber`, `credential`).

### 4.3 Local Config

Persist:

1. `serverUrl`
2. `deviceNumber`
3. `workerId`
4. `credential`
5. `currentVersion`

Security rules:

1. Never print raw credentials after setup.
2. Mask secrets in logs.

## 5. Connectivity, Task Loop, and Upgrade Behavior

### 5.1 Connectivity Heartbeat

Interval target: 15 to 30 seconds.

Edge sends:

1. `workerId`
2. `deviceNumber`
3. `currentVersion`
4. runtime health snapshot
5. task activity flag

Server actions:

1. Update `lastSeenAt`.
2. Update connectivity status snapshot.
3. Return task/upgrade intent metadata.

### 5.2 Task Orchestration

Current internal task flow remains in use:

1. lease next task
2. periodic task heartbeat
3. stream partial/final results
4. complete or fail

### 5.3 Idle-Only Upgrade Policy

Policy selected:

1. Upgrade must run only when no active task is in progress.
2. If upgrade intent is present during active processing, defer until idle.

### 5.4 Upgrade Execution Flow

1. Detect `targetVersion != currentVersion` from heartbeat response.
2. Fetch OS-specific artifact URL.
3. Download artifact.
4. Verify checksum.
5. Verify signature.
6. Install upgrade.
7. Restart runtime.
8. Report status transitions:
   - `DOWNLOADING`
   - `VERIFYING`
   - `RESTARTING`
   - `SUCCEEDED` or `FAILED`

Failure policy:

1. On failure, keep current version.
2. Report failure reason to server.
3. Apply capped retries with exponential backoff and jitter.

## 6. Release and Distribution

### 6.1 GitHub Release Assets

Per version (example `v1.2.3`):

1. `lucky-edge-windows-x64-installer.exe`
2. `lucky-edge-linux-x64.tar.gz`
3. `checksums.txt`
4. `checksums.txt.sig`

### 6.2 Publishing Flow

1. CI builds Windows/Linux artifacts.
2. CI computes checksums.
3. CI signs checksum manifest.
4. CI publishes GitHub Release with assets.
5. Admin registers release metadata into platform registry.
6. Upgrade campaigns assign target versions to selected edges.

### 6.3 Security Constraints

1. Release URLs must be HTTPS.
2. Checksum verification required before install.
3. Signature verification required before install.
4. Signing public key pinned in server configuration.

## 7. Data and API Considerations

### 7.1 Worker Model Extensions (already partially present)

Required operational fields:

1. `name` / `displayName`
2. `deviceNumber` (unique)
3. `platform`, `arch`
4. `version`
5. `lastSeenAt`
6. `targetVersion`
7. `upgradeStatus`
8. `upgradeMessage`

### 7.2 Control Plane Contracts

Required contracts:

1. Register edge endpoint/mutation.
2. Connectivity heartbeat endpoint (separate from task heartbeat semantics).
3. Upgrade metadata lookup in heartbeat response.
4. Upgrade status reporting endpoint/mutation.

## 8. Testing Strategy

### 8.1 Unit Tests

1. Device number generation and slug/shortid rules.
2. Collision handling and regeneration loop.
3. Idle-only upgrade eligibility.
4. Checksum/signature verification behavior.

### 8.2 Integration Tests

1. Registration + credential activation.
2. Heartbeat updates worker presence (`lastSeenAt`).
3. Target version assignment and status transitions.

### 8.3 E2E Smoke

1. Install on one Windows machine and one Linux machine.
2. Complete interactive setup.
3. Register and connect to server.
4. Trigger upgrade from server.
5. Verify automatic idle upgrade behavior.

## 9. Rollout Strategy

1. Phase 1: internal canary edges.
2. Phase 2: limited fleet percentage.
3. Phase 3: full rollout.

Success criteria:

1. Edge appears in server registry with stable connectivity updates.
2. Upgrade campaign changes `targetVersion` and edges converge automatically.
3. No upgrade during active task processing.

## 10. Chosen Approach

Chosen implementation approach: MVP CLI + polling-driven upgrade orchestration.

Rationale:

1. Aligns with current codebase direction (existing worker/release orchestration components).
2. Delivers user-required lifecycle with lowest implementation risk.
3. Leaves room for future push-notification and supervisor-runtime hardening.
