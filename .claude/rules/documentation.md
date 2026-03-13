# Documentation Rules

How to structure, maintain, and keep documentation in sync with the evolving system.

## Docs Location

All documentation lives in `apps/web/content/` — this is the single source of truth. It is served publicly at `luckyplans.xyz/docs` via Nextra v4. There is no separate `docs/` directory.

```
apps/web/content/
├── index.mdx                        ← Docs landing page (/docs)
├── _meta.ts                         ← Top-level sidebar order
├── architecture/
│   ├── _meta.ts
│   ├── overview.mdx                 ← Current system architecture (living doc)
│   ├── ci-cd-pipeline.mdx
│   ├── argocd.mdx
│   ├── helm-deployment.mdx
│   ├── tls-certificates.mdx
│   └── decisions/                   ← ADRs: why we chose X over Y (append-only)
│       ├── _meta.ts
│       └── yyyy-mm-dd-<name>.mdx
├── guides/
│   ├── _meta.ts
│   ├── developer.mdx                ← How to develop (setup, commands, workflows)
│   └── deployment.mdx               ← How to deploy (Docker, K8s, ArgoCD)
└── system/
    ├── _meta.ts
    ├── api.mdx                      ← API reference (GraphQL schema, message patterns)
    └── configuration.mdx            ← All env vars, Helm values, feature flags
```

## Document Audiences

| Path | Audience | Update frequency |
|------|----------|-----------------|
| `content/architecture/` | Developers, AI tools | When architecture changes |
| `content/architecture/decisions/` | Developers, AI tools | Append-only on significant decisions |
| `content/guides/` | Developers, operators | When workflows or tooling change |
| `content/system/` | Developers, operators | When APIs, config, or env vars change |

## Architecture Overview (`content/architecture/overview.mdx`)

This is the **living document** — the single source of truth for "what does the system look like right now."

Must contain:
- System architecture diagram (ASCII or mermaid)
- Service map (what each service does, how they communicate)
- Data flow (request lifecycle from frontend to microservice and back)
- Tech stack summary
- Current state and known limitations

Update rules:
- Update in the same PR that changes the architecture
- Keep it factual — describe what IS, not what's planned
- Link to ADRs for the reasoning behind decisions

## Architecture Decision Records (ADRs)

ADRs capture **why** architectural decisions were made. They are append-only — never deleted, only superseded. ADRs are fully public at `/docs/architecture/decisions/`.

### File naming

```
apps/web/content/architecture/decisions/yyyy-mm-dd-<name>.mdx
```

Examples:
```
2026-03-10-functional-decomposition.mdx
2026-03-10-redis-pub-sub-transport.mdx
2026-03-15-add-trading-service.mdx
```

### ADR template

```markdown
---
title: <Title>
description: <One-line summary>
---

# <Title>

**Date:** yyyy-mm-dd
**Status:** accepted | superseded by [link] | deprecated

## Context

What is the problem or situation that requires a decision?

## Decision

What did we decide and why?

## Consequences

What are the trade-offs? What becomes easier? What becomes harder?
```

### After creating an ADR

Add the new key to `apps/web/content/architecture/decisions/_meta.ts`:
```ts
export default {
  // existing entries...
  'yyyy-mm-dd-<name>': '<Human-Readable Title>',
};
```

### When to write an ADR

- Adding or removing a microservice
- Changing communication patterns (e.g., switching from REST to GraphQL)
- Adopting a new framework or major dependency
- Changing deployment strategy
- Any architectural decision that someone might question later

### When NOT to write an ADR

- Bug fixes
- Adding a new entity to an existing service
- Updating dependencies
- Minor refactors within existing patterns

## Deep Dive Docs (`content/architecture/<topic>.mdx`)

Detailed documentation for specific infrastructure or architectural topics.

Current topics:
- `argocd.mdx` — GitOps CD flow
- `ci-cd-pipeline.mdx` — GitHub Actions pipeline
- `helm-deployment.mdx` — Helm chart structure
- `tls-certificates.mdx` — TLS/cert-manager setup

Add new deep dives when:
- A topic is too detailed for the overview
- A topic requires step-by-step explanation
- Multiple team members need to understand a complex subsystem

## Guides (`content/guides/`)

Practical how-to documents:
- `developer.mdx` — setup, local dev, commands, adding features
- `deployment.mdx` — Docker builds, K8s deployment, ArgoCD
- `operations.mdx` — monitoring, debugging, runbooks (create when needed)

## System Reference (`content/system/`)

Technical reference for the running system:
- `api.mdx` — GraphQL queries/mutations, message patterns, response formats
- `configuration.mdx` — all env vars, Helm values, defaults, descriptions

## Sync Protocol

### When architecture changes

1. Update `apps/web/content/architecture/overview.mdx`
2. Write an ADR if the decision is significant (add to `decisions/_meta.ts`)
3. Update relevant deep dive doc if affected
4. Follow the sync protocol in `.claude/rules/ai-framework.md` for `.claude/` file updates

### When adding a new service or major feature

1. Write an ADR
2. Update `apps/web/content/architecture/overview.mdx`
3. Update `apps/web/content/guides/developer.mdx` if dev workflow changes
4. Update `apps/web/content/system/api.mdx` with new endpoints/patterns
5. Update `apps/web/content/system/configuration.mdx` with new env vars

### When changing deployment or infrastructure

1. Update relevant deep dive doc
2. Update `apps/web/content/guides/deployment.mdx`
3. Write an ADR if it's a significant change

### When auth or security patterns change

1. Update `apps/web/content/system/api.mdx` — auth endpoints reference
2. Update `apps/web/content/system/configuration.mdx` — env vars
3. Update `apps/web/content/guides/developer.mdx` — local auth setup/testing
4. Update `apps/web/content/architecture/overview.mdx` — auth flow in architecture diagram
5. Follow the sync protocol in `.claude/rules/ai-framework.md` for `.claude/` file updates

### When environment variables change

1. Update `apps/web/content/system/configuration.mdx` — add/remove from env var tables
2. Update `apps/web/content/guides/developer.mdx` — if it affects local setup

## Anti-Patterns

- Writing docs after the fact in a separate PR — update docs in the same PR as the code change
- Aspirational docs — don't document what you plan to build, document what exists
- Duplicating content across docs — link instead of copy
- Leaving stale docs — outdated docs are worse than no docs
- Creating a `docs/` directory at the repo root — all docs live in `apps/web/content/`
