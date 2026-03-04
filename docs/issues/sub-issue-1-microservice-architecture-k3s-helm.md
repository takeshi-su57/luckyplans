# [Chore]: Microservice Architecture on Monorepo + Local Dev/Deploy (k3s & Helm)

**Parent Issue:** [Chore]: Setup Monorepo Foundation (Frontend + Backend Microservices)
**Labels:** `enhancement`, `priority:high`

## Description

Define and implement the microservice architecture within the monorepo. Set up containerization for all services and establish a fully working local development environment with local Kubernetes deployment powered by k3s and Helm.

## Motivation

- Establish a clean, maintainable monorepo structure before any business logic is added
- Ensure each service is independently buildable, testable, and deployable
- Provide a production-like local environment so developers can validate integration early
- Helm charts give repeatable, parameterized deployments across environments

## Proposed Solution

### 1. Monorepo Setup

- Initialize monorepo with **Turborepo** + **pnpm workspaces**
- Configure shared `tsconfig.base.json`, ESLint, and Prettier
- Set up workspace dependency resolution

#### Directory Structure

```
/apps
  /web              (Next.js frontend)
  /api-gateway      (GraphQL gateway / BFF)
  /service-auth     (Auth microservice)
  /service-core     (Core domain service)

/packages
  /ui               (Shared UI components)
  /config           (Shared configs: eslint, tsconfig)
  /shared           (Shared types and utilities)

/infrastructure
  /helm
    /charts
      /web
      /api-gateway
      /service-auth
      /service-core
    /values
      /local.yaml
      /dev.yaml
      /prod.yaml
  /k8s
    /namespace.yaml
    /ingress.yaml
```

### 2. Backend Microservices Structure

- Each service isolated with its own:
  - `package.json`
  - `tsconfig.json` (extends base)
  - `Dockerfile`
  - Entry point and build scripts
- Internal service communication via REST (HTTP) initially
- GraphQL gateway aggregates backend services for the frontend
- Shared types and utilities consumed from `packages/shared`

### 3. Containerization

For each app/service:

- Multi-stage `Dockerfile` (build → production)
- `.dockerignore` per service
- Environment variable injection via `ENV` / runtime config
- Images tagged with git SHA for traceability

### 4. k3s Local Kubernetes Infrastructure

#### Cluster Setup

- Install and configure **k3s** for local development
- Namespace strategy: `local`, `dev`, `prod`
- Traefik ingress controller (bundled with k3s)

#### Helm Charts

Per-service Helm chart including:

- `Deployment` with resource limits and health checks
- `Service` (ClusterIP)
- `ConfigMap` for non-sensitive config
- `Secret` for sensitive config
- `Ingress` rules

Shared values files:

| File          | Purpose                              |
| ------------- | ------------------------------------ |
| `local.yaml`  | Local k3s development overrides      |
| `dev.yaml`    | Dev environment overrides            |
| `prod.yaml`   | Production environment overrides     |

#### Networking

- Ingress routes:
  - `/` → `web`
  - `/api` → `api-gateway`
- Internal service DNS: `<service>.<namespace>.svc.cluster.local`
- No hardcoded service URLs — use environment variables

### 5. Development Workflow

| Mode         | How                                                    |
| ------------ | ------------------------------------------------------ |
| Local (fast) | `pnpm dev` — runs services directly with hot reload    |
| Docker       | `docker compose up` — builds and runs all containers   |
| k3s (full)   | `helm install` — deploys to local k3s cluster          |

- Hot reload supported for frontend (`next dev`)
- Backend services support `--watch` mode for local dev
- Clear startup instructions in `README.md`

## Scope

### In Scope

- Monorepo tooling (Turborepo, pnpm workspaces)
- Shared TypeScript, ESLint, Prettier configuration
- App scaffolding (web, api-gateway, service-auth, service-core)
- Shared packages (ui, config, shared)
- Dockerfile per service (multi-stage)
- Docker Compose for local container orchestration
- k3s installation and local cluster setup
- Helm charts for all services
- Ingress configuration
- Inter-service connectivity validation
- `README.md` with setup and development guide

### Out of Scope

- Business logic implementation
- CI/CD pipeline setup (see Sub-Issue #2 and #3)
- Production cloud deployment
- Observability stack (Prometheus, Grafana)
- Secret management tooling (Vault, Sealed Secrets)

## Technical Considerations

- Pin Node.js version via `.nvmrc` or `packageManager` field
- Use `turbo.json` for build pipeline orchestration and caching
- Each service must build independently (`turbo run build --filter=service-auth`)
- Docker images should be minimal (Alpine-based or distroless)
- Helm chart templates must be lintable (`helm lint`)
- k3s manifests should be portable to production-grade clusters (EKS, GKE)
- Avoid tight coupling — services communicate only via defined APIs

## Acceptance Criteria

- [ ] Monorepo initialized with Turborepo + pnpm workspaces
- [ ] Shared `tsconfig`, ESLint, and Prettier configs applied across all workspaces
- [ ] Frontend (`web`) boots and renders successfully
- [ ] Backend services (`api-gateway`, `service-auth`, `service-core`) boot independently
- [ ] Shared packages importable from any app/service
- [ ] Docker images build successfully for all services
- [ ] `docker compose up` starts all services locally
- [ ] k3s cluster runs locally
- [ ] Helm charts install without errors
- [ ] All services deploy to k3s and reach `Running` state
- [ ] Services communicate internally (e.g., `api-gateway` → `service-auth`)
- [ ] Ingress routes frontend and API correctly
- [ ] `README.md` documents setup, development, and deployment steps
- [ ] No runtime errors

## Definition of Done

- Monorepo foundation operational with shared packages
- All services independently buildable and deployable
- Local k3s cluster running with Helm-managed deployments
- Frontend accessible via ingress
- Documentation completed and reviewed
- Code reviewed and merged
