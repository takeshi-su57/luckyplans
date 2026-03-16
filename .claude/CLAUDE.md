# LuckyPlans — Project Context

**Project name:** LuckyPlans
**GitHub repo:** https://github.com/takeshi-su57/luckyplans
> The working directory name (`platform-clients`) does NOT reflect the project name. Always use the name and repo URL above — never derive them from the folder name.

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
| Observability | Prometheus, Grafana, Loki, Tempo, OTel Collector |
| Logging | Pino (structured JSON) via nestjs-pino |
| Secrets | Bitnami Sealed Secrets (prod), plain values (dev) |

## Repository Layout

```
apps/web/                  → Next.js frontend (App Router, Apollo Client, cookie-based auth)
apps/api-gateway/          → GraphQL gateway + auth controller (ROPC login, Admin API registration, session management)
apps/service-core/         → Core domain microservice (Redis transport, CoreMessagePattern)
packages/shared/           → Shared types (ServiceResponse<T>, message pattern enums) and utils (getEnvVar, getRedisConfig, generateId)
packages/config/           → Shared ESLint preset (eslint-preset.mjs) and TypeScript configs
infrastructure/            → Helm charts (luckyplans + observability), K8s manifests, ArgoCD config, Keycloak realm, deploy scripts
infrastructure/otel/       → Local dev observability configs (OTel Collector, Prometheus, Loki, Tempo, Grafana)
apps/web/content/          → Public docs source (MDX): architecture, ADRs, guides, system reference — served at /docs
docker-compose.yml         → Local dev infrastructure: Redis, PostgreSQL, Keycloak + observability stack
```

## Architecture Patterns

**Functional decomposition** — Services are split by functionality, not domain. `service-core` handles generic CRUD for all entities. Authentication is handled directly by the API gateway (not a separate microservice). New services are only created for distinct complex logic (e.g., trading engine). Domain entities and types live in `packages/shared`.

**Adding a new entity** — Define type in `packages/shared`, add message patterns to `CoreMessagePattern`, extend `service-core` controller/service, add gateway resolver. Do NOT create a new microservice for it.

**Microservice structure** — 4-file pattern: `main.ts`, `app.module.ts`, `<name>.controller.ts` (thin), `<name>.service.ts` (all logic). Canonical example: `apps/service-core/src/`.

**API Gateway** — Only service exposed to frontend. Handles auth (REST controller + session guard) and GraphQL (resolvers forward to microservices via `ClientProxy`). Code-first GraphQL.

**Authentication** — Gateway-managed sessions via Keycloak. Browser gets an opaque `session_id` HttpOnly cookie — no tokens exposed to the client. `POST /auth/login` (ROPC), `POST /auth/register` (Admin API + auto-login), `POST /auth/logout`. Custom login/register pages in Next.js under `(public)` route group. Sessions stored in Redis. `SessionGuard` protects GraphQL resolvers. See `.claude/rules/security.md`.

**Local development infrastructure** — `docker-compose.yml` provides Redis, PostgreSQL, Keycloak, and the observability stack (OTel Collector, Prometheus, Grafana, Loki, Tempo). Grafana at `localhost:3002`. Next.js runs on port 3000 with `rewrites` in `next.config.ts` proxying `/auth/*` and `/graphql` to the gateway (port 3001).

**Observability** — NestJS services are instrumented with OpenTelemetry SDK (auto-instrumentation for HTTP, Express, ioredis, GraphQL). Structured logging via Pino (`nestjs-pino`) with JSON output and trace context correlation (`traceId`, `spanId`). Telemetry flows: NestJS → OTel Collector → Prometheus (metrics) / Loki (logs) / Tempo (traces) → Grafana. Observability infra lives in `infrastructure/helm/observability/` (`monitoring` namespace). Redis trace propagation via custom `injectTraceContext()` / `TraceContextExtractor` in `packages/shared/src/telemetry/`.

**Inter-service communication** — Redis pub/sub. Message patterns as enums in `packages/shared/src/types/index.ts`.

**Service responses** — `ServiceResponse<T>` from `@luckyplans/shared` (fields: `success`, `data?`, `error?`, `message?`).

**Environment config** — Always use `getEnvVar()` from `@luckyplans/shared`. Never use raw `process.env`.

**Secrets management** — Production uses Bitnami Sealed Secrets (encrypted in git, decrypted by in-cluster controller). Local dev uses plain defaults in `values.yaml`. Helm chart conditionally renders `SealedSecret` (prod) or plain `Secret` (dev) based on `sealedSecrets.enabled`. See `.claude/rules/security.md`.

## Key Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all services with hot reload (loads root .env via dotenv-cli)
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages
pnpm type-check       # TypeScript type checking
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm clean            # Clean build artifacts
pnpm --filter @luckyplans/<name> dev   # Run single package
pnpm --filter @luckyplans/web codegen # Generate GraphQL types from schema
pnpm deploy:local                     # Full deploy to local k3d cluster
./infrastructure/scripts/deploy-local.sh web          # Rebuild + redeploy one service
./infrastructure/scripts/deploy-local.sh --helm-only  # Helm upgrade only (config changes)
```

## CI Pipeline

CI (`.github/workflows/ci.yml`) runs on push to main and PRs:
1. Lint → Type-check → Test → Build (Turbo with `--filter=...[origin/main]` on PRs)
2. Trivy security scan (dependencies + Dockerfiles/IaC) — CRITICAL/HIGH severity
3. Helm chart linting + kubeconform K8s manifest validation
4. SARIF results uploaded to GitHub Security tab
5. AI PR review (opt-in, manual trigger) — Claude reviews changed files against `.claude/rules/`, posts informational comments (does not block merge)

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
