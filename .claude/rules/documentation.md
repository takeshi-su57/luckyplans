# Documentation Rules

How to structure, maintain, and keep documentation in sync with the evolving system.

## Docs Folder Structure

```
docs/
├── architecture/
│   ├── overview.md              ← Current system architecture (living doc, always up to date)
│   ├── decisions/               ← ADRs: why we chose X over Y (append-only)
│   │   └── yyyy-mm-dd-<name>.md
│   └── <topic>.md               ← Deep dives on specific infrastructure/patterns
├── guides/
│   ├── developer.md             ← How to develop (setup, commands, workflows)
│   ├── deployment.md            ← How to deploy (Docker, K8s, ArgoCD)
│   └── operations.md            ← How to operate (monitoring, troubleshooting)
└── system/
    ├── api.md                   ← API reference (GraphQL schema, message patterns)
    └── configuration.md         ← All env vars, Helm values, feature flags
```

## Document Audiences

| Folder | Audience | Update frequency |
|--------|----------|-----------------|
| `docs/architecture/` | Developers, AI tools | When architecture changes |
| `docs/architecture/decisions/` | Developers, AI tools | Append-only on significant decisions |
| `docs/guides/` | Developers, operators | When workflows or tooling change |
| `docs/system/` | Developers, operators | When APIs, config, or env vars change |

## Architecture Overview (`docs/architecture/overview.md`)

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

ADRs capture **why** architectural decisions were made. They are append-only — never deleted, only superseded.

### File naming

```
docs/architecture/decisions/yyyy-mm-dd-<name>.md
```

Examples:
```
2026-03-10-functional-decomposition.md
2026-03-10-redis-pub-sub-transport.md
2026-03-15-add-trading-service.md
```

### ADR template

```markdown
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

## Deep Dive Docs (`docs/architecture/<topic>.md`)

Detailed documentation for specific infrastructure or architectural topics.

Current topics:
- `argocd.md` — GitOps CD flow
- `ci-cd-pipeline.md` — GitHub Actions pipeline
- `helm-deployment.md` — Helm chart structure
- `tls-certificates.md` — TLS/cert-manager setup

Add new deep dives when:
- A topic is too detailed for the overview
- A topic requires step-by-step explanation
- Multiple team members need to understand a complex subsystem

## Guides (`docs/guides/`)

Practical how-to documents:
- `developer.md` — setup, local dev, commands, adding features
- `deployment.md` — Docker builds, K8s deployment, ArgoCD
- `operations.md` — monitoring, debugging, runbooks (create when needed)

## System Reference (`docs/system/`)

Technical reference for the running system:
- `api.md` — GraphQL queries/mutations, message patterns, response formats
- `configuration.md` — all env vars, Helm values, defaults, descriptions

## Sync Protocol

### When architecture changes

1. Update `docs/architecture/overview.md`
2. Write an ADR if the decision is significant
3. Update relevant deep dive doc if affected
4. Follow the sync protocol in `.claude/rules/ai-framework.md` for `.claude/` files

### When adding a new service or major feature

1. Write an ADR
2. Update `docs/architecture/overview.md`
3. Update `docs/guides/developer.md` if dev workflow changes
4. Update `docs/system/api.md` with new endpoints/patterns
5. Update `docs/system/configuration.md` with new env vars

### When changing deployment or infrastructure

1. Update relevant deep dive doc
2. Update `docs/guides/deployment.md`
3. Write an ADR if it's a significant change

## Anti-Patterns

- Writing docs after the fact in a separate PR — update docs in the same PR as the code change
- Aspirational docs — don't document what you plan to build, document what exists
- Duplicating content across docs — link instead of copy
- Leaving stale docs — outdated docs are worse than no docs
