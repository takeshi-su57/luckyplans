# Monorepo Foundation Setup Plan

## Context

Setting up a greenfield monorepo for LuckyPlans with Next.js frontend, NestJS backend microservices, GraphQL API gateway, Redis inter-service communication, and k3s local Kubernetes infrastructure. The repo is completely empty — everything is created from scratch.

**Stack**: Turborepo + pnpm | Next.js | NestJS | GraphQL | Redis | Docker | k3s

---

## Architecture Overview

```
                    ┌─────────────────────────────────────┐
                    │            Browser / Client          │
                    └──────────────┬──────────────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────────────┐
                    │     Next.js Frontend (apps/web)      │
                    │         Apollo Client (GraphQL)       │
                    └──────────────┬──────────────────────┘
                                   │ GraphQL Queries/Mutations
                                   ▼
                    ┌─────────────────────────────────────┐
                    │   API Gateway (apps/api-gateway)     │
                    │    NestJS + Apollo Server (GQL)       │
                    └───────┬─────────────┬───────────────┘
                            │             │
                   Redis    │             │   Redis
                   pub/sub  │             │   pub/sub
                            ▼             ▼
              ┌──────────────────┐  ┌──────────────────┐
              │  service-auth    │  │  service-core    │
              │  (NestJS µsvc)   │  │  (NestJS µsvc)   │
              └──────────────────┘  └──────────────────┘
```

---

## Phase 1: Root Monorepo Configuration

Create the foundational monorepo tooling and configuration files.

| File | Purpose |
|------|---------|
| `package.json` | Root package.json with workspace scripts (dev, build, lint, test, docker:build) |
| `pnpm-workspace.yaml` | Define workspace packages: `apps/*`, `packages/*` |
| `turbo.json` | Turborepo pipeline: build, dev, lint, test, type-check with proper dependencies |
| `.npmrc` | pnpm config (`shamefully-hoist=false`, `strict-peer-dependencies=false`) |
| `.gitignore` | Node modules, dist, .next, .env, k3s state, Docker artifacts |
| `.prettierrc` | Shared formatting rules |
| `.prettierignore` | Ignore dist, node_modules, .next, coverage |
| `tsconfig.base.json` | Base TypeScript config extended by all packages/apps |
| `.editorconfig` | Consistent editor settings |
| `.env.example` | Template for environment variables |

---

## Phase 2: Shared Packages

### `packages/config` — Shared ESLint + TypeScript configs
- `packages/config/package.json`
- `packages/config/eslint-preset.js` — Base ESLint config (TypeScript + Prettier)
- `packages/config/tsconfig.base.json` — Base TS config for libraries
- `packages/config/tsconfig.nextjs.json` — TS config preset for Next.js apps
- `packages/config/tsconfig.nestjs.json` — TS config preset for NestJS services

### `packages/shared` — Shared types and utilities
- `packages/shared/package.json`
- `packages/shared/tsconfig.json` — Extends config base
- `packages/shared/src/index.ts` — Barrel export
- `packages/shared/src/types/index.ts` — Shared TypeScript interfaces (User, ServiceResponse, etc.)
- `packages/shared/src/utils/index.ts` — Shared utility functions

### `packages/ui` — Shared React UI components
- `packages/ui/package.json`
- `packages/ui/tsconfig.json`
- `packages/ui/src/index.ts` — Barrel export
- `packages/ui/src/Button.tsx` — Example shared component

---

## Phase 3: Frontend App — `apps/web`

Next.js 14 app with App Router, configured for GraphQL communication with the API gateway.

- `apps/web/package.json` — Next.js + Apollo Client + shared packages as dependencies
- `apps/web/tsconfig.json` — Extends `packages/config/tsconfig.nextjs.json`
- `apps/web/.eslintrc.js`
- `apps/web/next.config.js` — Transpile packages, env config
- `apps/web/src/app/layout.tsx` — Root layout
- `apps/web/src/app/page.tsx` — Home page with basic GraphQL query demo
- `apps/web/src/lib/apollo-client.ts` — Apollo Client setup pointing to API gateway
- `apps/web/src/lib/apollo-provider.tsx` — Client-side Apollo Provider wrapper

---

## Phase 4: Backend Services

### `apps/api-gateway` — GraphQL Gateway (NestJS + Apollo)

The BFF layer. Exposes GraphQL to the frontend, communicates with microservices via Redis.

- `apps/api-gateway/package.json`
- `apps/api-gateway/tsconfig.json` — Extends NestJS preset
- `apps/api-gateway/tsconfig.build.json`
- `apps/api-gateway/.eslintrc.js`
- `apps/api-gateway/nest-cli.json`
- `apps/api-gateway/src/main.ts` — Bootstrap NestJS with GraphQL (Apollo Driver, code-first)
- `apps/api-gateway/src/app.module.ts` — Imports GraphQL module + feature modules
- `apps/api-gateway/src/health/health.module.ts` — Health check module
- `apps/api-gateway/src/health/health.resolver.ts` — GraphQL health query
- `apps/api-gateway/src/auth/auth.module.ts` — Proxies to service-auth via Redis ClientProxy
- `apps/api-gateway/src/auth/auth.resolver.ts` — GraphQL resolvers for auth operations
- `apps/api-gateway/src/core/core.module.ts` — Proxies to service-core via Redis ClientProxy
- `apps/api-gateway/src/core/core.resolver.ts` — GraphQL resolvers for core operations

**Key pattern**: Each feature module registers a `ClientsModule` with Redis transport (`Transport.REDIS`) targeting the corresponding microservice.

### `apps/service-auth` — Auth Microservice (NestJS Microservice)

Listens on Redis transport for auth-related message patterns.

- `apps/service-auth/package.json`
- `apps/service-auth/tsconfig.json`
- `apps/service-auth/tsconfig.build.json`
- `apps/service-auth/.eslintrc.js`
- `apps/service-auth/nest-cli.json`
- `apps/service-auth/src/main.ts` — Bootstrap as NestJS microservice with Redis transport
- `apps/service-auth/src/app.module.ts`
- `apps/service-auth/src/auth.controller.ts` — `@MessagePattern` handlers (e.g., `auth.validate`, `auth.login`)
- `apps/service-auth/src/auth.service.ts` — Auth business logic placeholder

### `apps/service-core` — Core Domain Microservice (NestJS Microservice)

Same pattern as service-auth, handles core domain operations.

- `apps/service-core/package.json`
- `apps/service-core/tsconfig.json`
- `apps/service-core/tsconfig.build.json`
- `apps/service-core/.eslintrc.js`
- `apps/service-core/nest-cli.json`
- `apps/service-core/src/main.ts` — Bootstrap as NestJS microservice with Redis transport
- `apps/service-core/src/app.module.ts`
- `apps/service-core/src/core.controller.ts` — `@MessagePattern` handlers (e.g., `core.getItems`)
- `apps/service-core/src/core.service.ts` — Core business logic placeholder

**Inter-service wiring**:
```
Frontend (Apollo) → GraphQL → api-gateway → Redis pub/sub → service-auth / service-core
```

---

## Phase 5: Containerization

Multi-stage Dockerfiles using `turbo prune` for optimal layer caching.

- `apps/web/Dockerfile` — Multi-stage: deps → build → runner (standalone Next.js)
- `apps/api-gateway/Dockerfile` — Multi-stage: deps → build → production (node:alpine)
- `apps/service-auth/Dockerfile` — Multi-stage: deps → build → production
- `apps/service-core/Dockerfile` — Multi-stage: deps → build → production
- `docker-compose.yml` — Root-level compose for local non-K8s development (all services + Redis)
- `docker-compose.override.yml` — Dev overrides (volume mounts, hot reload)

**Docker strategy**: Each Dockerfile uses `turbo prune --scope=<app> --docker` to create a minimal build context, then multi-stage build for small production images on `node:20-alpine`.

---

## Phase 6: Kubernetes / k3s Infrastructure

### Namespace & Base
- `infrastructure/k8s/namespace.yaml` — `luckyplans` namespace

### Redis
- `infrastructure/k8s/redis/deployment.yaml` — Redis single-node deployment
- `infrastructure/k8s/redis/service.yaml` — ClusterIP service on port 6379

### App Deployments + Services
- `infrastructure/k8s/web/deployment.yaml` — Next.js deployment (1 replica)
- `infrastructure/k8s/web/service.yaml` — ClusterIP service on port 3000
- `infrastructure/k8s/api-gateway/deployment.yaml` — API Gateway deployment
- `infrastructure/k8s/api-gateway/service.yaml` — ClusterIP on port 4000
- `infrastructure/k8s/service-auth/deployment.yaml` — Auth service deployment
- `infrastructure/k8s/service-core/deployment.yaml` — Core service deployment

### Configuration
- `infrastructure/k8s/configmap.yaml` — Shared env vars (REDIS_HOST, REDIS_PORT, API_GATEWAY_URL, etc.)

### Ingress
- `infrastructure/k8s/ingress.yaml` — Traefik ingress (k3s default): routes `/` → web, `/graphql` → api-gateway

### Deployment Scripts
- `infrastructure/scripts/deploy-local.sh` — Script to build images, load into k3s, apply manifests
- `infrastructure/scripts/teardown.sh` — Script to tear down k3s resources

---

## Phase 7: Documentation

- `README.md` — Comprehensive guide covering:
  - Project overview and architecture diagram
  - Prerequisites (Node 20, pnpm 9+, Docker, k3s)
  - Quick start (local dev without K8s)
  - K8s development (k3s setup, deploy, validate)
  - Project structure explanation
  - Adding new services guide
  - Environment variables reference

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| GraphQL approach | Code-first (NestJS decorators) | No schema files to maintain, types auto-generated |
| Redis transport | `@nestjs/microservices` Redis transport | Native NestJS support, simple `@MessagePattern` handlers |
| Next.js mode | App Router (v14+) | Modern approach, better for new projects |
| GraphQL client | Apollo Client | Mature, great caching, works with code-first |
| Docker base | `node:20-alpine` | Small images, LTS Node version |
| k3s ingress | Traefik (built-in) | Comes with k3s, no extra setup |
| Microservice ports | Auth: no HTTP (Redis only), Core: no HTTP (Redis only), Gateway: 4000 | Microservices not directly exposed, only via gateway |

---

## Verification Steps

After implementation, verify in this order:

1. **`pnpm install`** — All dependencies resolve, no workspace errors
2. **`pnpm build`** — Turborepo builds all packages and apps successfully
3. **`pnpm dev`** — All services start locally (requires Redis running)
4. **`docker-compose up`** — All containers build and start, services communicate
5. **GraphQL playground** — Visit `http://localhost:4000/graphql`, run health query
6. **Frontend** — Visit `http://localhost:3000`, verify it loads and talks to API
7. **k3s deploy** — Run deploy script, verify pods are running
8. **k3s ingress** — Access frontend and GraphQL via k3s ingress
9. **Inter-service** — Verify API gateway can reach auth and core services via Redis
