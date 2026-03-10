# System Architecture Overview

Last updated: 2026-03-10

## Architecture Diagram

```
Browser
  │
  │ HTTP
  ▼
Next.js Frontend (apps/web)
  │
  │ GraphQL (Apollo Client)
  ▼
API Gateway (apps/api-gateway)          ← Only service exposed to frontend
  │           NestJS + Apollo Server
  │           Code-first GraphQL
  │
  │ Redis pub/sub (message patterns)
  ├────────────────────┐
  ▼                    ▼
service-auth         service-core       ← NestJS microservices
(authentication)     (CRUD for all
                      domain entities)
```

## Service Map

| Service | Purpose | Communication |
|---------|---------|---------------|
| `apps/web` | Next.js frontend, App Router, Apollo Client | GraphQL → API gateway |
| `apps/api-gateway` | GraphQL API, forwards to microservices | GraphQL in, Redis out |
| `apps/service-auth` | Authentication (login, register, token validation) | Redis transport |
| `apps/service-core` | Generic CRUD for all domain entities | Redis transport |

## Architectural Decisions

Services are split by **functionality**, not by domain (see [ADR: Functional Decomposition](decisions/2026-03-10-functional-decomposition.md)):
- `service-core` handles CRUD for all entities (items, orders, etc.)
- New microservices are only created for complex business logic (e.g., trading engine)
- Domain types live in `packages/shared`, not in individual services

## Data Flow (Request Lifecycle)

1. **Frontend** sends GraphQL query/mutation via Apollo Client
2. **API Gateway** resolver receives the request
3. Resolver sends a Redis message via `ClientProxy.send(MessagePattern, payload)`
4. **Microservice** controller receives the message via `@MessagePattern`
5. Controller delegates to service class for business logic
6. Service returns result → controller → Redis → gateway resolver → GraphQL response → frontend

## Shared Packages

| Package | Purpose |
|---------|---------|
| `packages/shared` | Entity interfaces, DTOs, message pattern enums, `ServiceResponse<T>`, utility functions (`getEnvVar`, `getRedisConfig`, `generateId`) |
| `packages/config` | Shared ESLint preset, TypeScript configs for NestJS and Next.js |

## Infrastructure

- **Build:** Turborepo for monorepo orchestration, pnpm workspaces
- **Containers:** Multi-stage Docker builds (Alpine, non-root, turbo prune)
- **CI/CD:** GitHub Actions → Docker build → ArgoCD sync
- **Deployment:** Helm charts on Kubernetes (k3s locally, any K8s in production)
- **Inter-service:** Redis (pub/sub transport for NestJS microservices)

See deep dives:
- [CI/CD Pipeline](ci-cd-pipeline.md)
- [ArgoCD](argocd.md)
- [Helm Deployment](helm-deployment.md)
- [TLS Certificates](tls-certificates.md)

## Current State and Known Limitations

- **No database** — services use in-memory storage as placeholder
- **No real auth** — service-auth uses mock tokens
- **No tests** — CI test step exists but is a no-op
- **No message persistence** — Redis pub/sub drops messages if a service is down
