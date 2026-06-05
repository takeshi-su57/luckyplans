# Edge Architecture Phase 3 Spec: Artifact Transfer (E)

Status: Deferred for the next milestone by `apps/web/content/architecture/decisions/2026-06-05-defer-task-artifact-transfer.mdx`.

## Goal
Move large task inputs/outputs/log bundles through HTTPS object storage URLs, keeping WebSocket for control-plane messages only.

## Scope
- Signed upload/download URL issuance APIs
- Edge-side artifact download/upload client behavior
- Task payload/result references that point to artifact locations

## Out of Scope
- Task offer/lease logic (Phase 2)
- Upgrade/release artifact decision and rollout (Phase 4)

## Server Requirements
### REST Endpoints
- `POST /v1/artifacts/upload-url`
  - Returns short-lived signed URL and metadata constraints
- `POST /v1/artifacts/download-url`
  - Returns short-lived signed URL for allowed artifact access

### Policies
- Signed URLs are short-lived
- Scope URL permissions to exact object path and operation
- Enforce size/type constraints where possible

## Edge Requirements
- Download task input artifacts via HTTPS before execution
- Upload task output/log artifacts via HTTPS after/during execution
- Report artifact references in task completion/failure payloads
- Retry transient transfer failures with bounded backoff

## Protocol Integration
- WebSocket should carry metadata only:
  - artifact references/keys/URLs (prefer opaque IDs or keys)
  - transfer status
- WebSocket must not carry large binary payloads

## Acceptance Criteria
- Large files are never sent over WebSocket
- Edge can download inputs and upload outputs using signed URLs
- Task result payload can reference uploaded artifacts
- Expired/invalid signed URLs fail safely and are observable

## Risks
- URL expiry too short for large uploads
- Overly broad URL scopes create security exposure

