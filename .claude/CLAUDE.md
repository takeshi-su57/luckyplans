# LuckyPlans — Project Context

LuckyPlans is a TypeScript monorepo (Turborepo + pnpm) containing a Next.js frontend, NestJS GraphQL API gateway, and NestJS microservices communicating over Redis pub/sub.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, Apollo Client |
| API Gateway | NestJS 11 + Apollo Server (code-first GraphQL) |
| Microservices | NestJS 11 Microservices (Redis transport) |
| Language | TypeScript 5.7 (strict mode) |
| Monorepo | Turborepo 2.8 + pnpm 9.15 workspaces |
| Linting | ESLint 10 (flat config) + Prettier |
| Containers | Docker multi-stage builds (Alpine) |
| Deployment | ArgoCD + Helm on Kubernetes (k3s) |

## Repository Layout

```
apps/web/                  → Next.js frontend (App Router, Apollo Client)
apps/api-gateway/          → GraphQL gateway (resolvers forward to microservices via ClientProxy)
apps/service-auth/         → Auth microservice (Redis transport, AuthMessagePattern)
apps/service-core/         → Core domain microservice (Redis transport, CoreMessagePattern)
packages/shared/           → Shared types (ServiceResponse<T>, message pattern enums) and utils (getEnvVar, getRedisConfig, generateId)
packages/config/           → Shared ESLint preset (eslint-preset.mjs) and TypeScript configs
infrastructure/            → Helm charts, K8s manifests, ArgoCD config, deployment scripts
docs/architecture/         → Living architecture overview, ADRs (decisions/), and design docs
docs/system/               → API reference (api.md) and configuration reference (configuration.md)
docs/guides/               → Developer guide (developer.md) and deployment guide (deployment.md)
```

## Architecture Patterns

**Functional decomposition** — Services are split by functionality, not domain. `service-core` handles generic CRUD for all entities. `service-auth` handles authentication. New services are only created for distinct complex logic (e.g., trading engine). Domain entities and types live in `packages/shared`.

**Adding a new entity** — Define type in `packages/shared`, add message patterns to `CoreMessagePattern`, extend `service-core` controller/service, add gateway resolver. Do NOT create a new microservice for it.

**Microservice structure** — 4-file pattern: `main.ts`, `app.module.ts`, `<name>.controller.ts` (thin), `<name>.service.ts` (all logic). Canonical example: `apps/service-core/src/`.

**API Gateway** — Only service exposed to frontend. Resolvers inject `ClientProxy`, forward via `firstValueFrom(client.send(Pattern, payload))`. Code-first GraphQL. Canonical example: `apps/api-gateway/src/core/core.resolver.ts`.

**Inter-service communication** — Redis pub/sub. Message patterns as enums in `packages/shared/src/types/index.ts`.

**Service responses** — `ServiceResponse<T>` from `@luckyplans/shared` (fields: `success`, `data?`, `error?`, `message?`).

**Environment config** — Always use `getEnvVar()` from `@luckyplans/shared`. Never use raw `process.env`.

## Key Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all services with hot reload
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages
pnpm type-check       # TypeScript type checking
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm clean            # Clean build artifacts
pnpm --filter @luckyplans/<name> dev   # Run single package
pnpm --filter @luckyplans/web codegen # Generate GraphQL types from schema
```

## CI Pipeline

CI (`.github/workflows/ci.yml`) runs on push to main and PRs:
1. Lint → Type-check → Test → Build (Turbo with `--filter=...[origin/main]` on PRs)
2. Trivy security scan (dependencies + Dockerfiles/IaC) — CRITICAL/HIGH severity
3. Helm chart linting + kubeconform K8s manifest validation
4. SARIF results uploaded to GitHub Security tab

## Conventions

- **Commits:** Conventional commits format — `type(scope): description`
- **ESLint rules:** No `console.log` (warn/error ok), no explicit `any` (warning), unused vars with `_` prefix allowed
- **File naming:** kebab-case for files, PascalCase for classes
- **Imports:** Use `@luckyplans/shared` for cross-package types; `@luckyplans/config` for configs
- **Prettier:** Semicolons, single quotes, trailing commas, 100 char width, 2-space indent

## Rules (Detailed Guidance)

- `.claude/rules/architecture.md` — Module structure, service layer, gateway, shared package, anti-patterns
- `.claude/rules/testing.md` — Testing strategy, conventions, mocking patterns, coverage targets
- `.claude/rules/security.md` — Env vars, CI security, Docker, auth, input validation
- `.claude/rules/git-commit.md` — Conventional commit format, types, examples
- `.claude/rules/pull-request.md` — PR title format, description template, size guidelines
- `.claude/rules/gh-issue.md` — Issue title format, templates for bugs/features/chores
- `.claude/rules/ai-framework.md` — How to maintain this framework: sync protocol, skill/rule design, evolution guidelines
- `.claude/rules/documentation.md` — Docs folder structure, ADR conventions, sync protocol for docs
- `.claude/rules/frontend.md` — Apollo Client, GraphQL Codegen (`client-preset` + inline `graphql()`), hooks, component patterns, anti-patterns

## Known Gaps

- No tests exist yet (CI test step is a no-op)
- No database — services use in-memory storage as placeholder
- Auth service uses mock tokens — not production-ready
