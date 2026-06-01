# EDGE-UPG-010 - [Feature]: Add edge release publishing pipeline

GitHub title: `[Feature]: Add edge release publishing pipeline`

Depends on: `EDGE-UPG-006`

Labels: `type:feature`, `priority:medium`, `area:ci`, `area:edge-agent`, `area:ops`

Related:

- `apps/edge-agent/package.json`
- `.github/workflows`
- `apps/web/content/guides/deployment.mdx`

## Motivation

The upgrade control plane depends on trustworthy release artifacts. Manual release metadata entry is error-prone unless CI produces a predictable artifact set.

## Proposal

Add CI/build support for versioned edge-agent artifacts, checksums, signatures, and release metadata suitable for registration in the gateway.

## Out of Scope

- Changing edge runtime behavior.
- Installing artifacts on edge hosts.
- Hardcoding release signing secrets.

## Acceptance Criteria

- CI can build Linux and Windows edge-agent artifacts.
- CI produces checksums and detached signature or signed manifest.
- Artifact names include version, platform, and arch.
- Release metadata can be registered into the existing `EdgeRelease` flow.
- Release docs identify required secrets without hardcoding secrets.

## Definition of Done

- [ ] CI job or documented local release command exists.
- [ ] Generated artifact naming matches gateway release metadata expectations.
- [ ] Docs include release creation and registration steps.
