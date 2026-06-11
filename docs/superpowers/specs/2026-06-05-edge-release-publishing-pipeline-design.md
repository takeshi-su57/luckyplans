# Edge Release Publishing Pipeline Design

## Goal

Add a repeatable release producer for edge-agent upgrade artifacts so CI and operators can create versioned Linux and Windows packages with checksums, signatures, and gateway-compatible metadata.

## Scope

This change covers packaging and release metadata production only. It does not change edge runtime behavior, install/update execution, storage backends, or the gateway release schema.

## Architecture

The release pipeline is split into a local Node.js CLI and a GitHub Actions workflow.

- `apps/edge-agent/scripts/build-release.mjs` owns artifact naming, packaging, checksum generation, manifest generation, and Ed25519 signing.
- `apps/edge-agent/package.json` exposes a `release:build` command so the same producer runs locally and in CI.
- `.github/workflows/edge-agent-release.yml` builds Linux and Windows x64 service artifacts and uploads the produced files as workflow artifacts, with optional GitHub Release publishing for tag-based runs.
- `apps/web/content/guides/deployment.mdx` documents required secrets, local build steps, CI steps, and release registration.

## Artifact Contract

Artifacts use this stable name format:

```text
luckyplans-edge-agent-v<version>-<platform>-<arch>-<installType>.<extension>
```

The initial supported artifacts are:

- `luckyplans-edge-agent-v<version>-linux-x64-service.tar.gz`
- `luckyplans-edge-agent-v<version>-win32-x64-service.zip`

The manifest includes one artifact record per platform with:

- `version`
- `platform`
- `arch`
- `installType`
- `url`
- `checksum`
- `signature`
- `signatureAlgorithm`
- `signingKeyId`
- `sizeBytes`

These names and fields match the existing `EdgeReleaseArtifact` metadata shape from `EDGE-UPG-006`.

## Signing

The script signs each artifact checksum with an Ed25519 private key supplied by `EDGE_RELEASE_SIGNING_PRIVATE_KEY`. The key is never hardcoded. The gateway already verifies registered release signatures against `EDGE_RELEASE_SIGNING_PUBLIC_KEY`, so the produced signature payload remains the checksum string.

The workflow requires these secrets:

- `EDGE_RELEASE_SIGNING_PRIVATE_KEY`
- `EDGE_RELEASE_SIGNING_KEY_ID`

`EDGE_RELEASE_SIGNING_KEY_ID` is optional locally but required in CI to make key rotation auditable.

## Error Handling

The release script fails before packaging when:

- the version is not semver-compatible
- the signing private key is missing
- the repository build output is missing
- the artifact base URL is missing

The script removes any existing output directory for the requested version before writing new release files.

## Testing

Add Vitest coverage for the release CLI helper functions:

- valid artifact names for Linux and Windows x64 service packages
- invalid versions are rejected
- checksums are 64-character hex SHA-256 values
- Ed25519 signatures verify against the matching public key
- manifest metadata maps to gateway release artifact fields

The workflow YAML is validated indirectly by lint/format and by the script tests. The local release command is documented for operator dry runs.
