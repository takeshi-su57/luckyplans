# LuckyPlans

Monorepo for the LuckyPlans application — frontend, API gateway, and backend microservices.

## Architecture

```
Browser → Next.js (port 3000, rewrites /auth/* + /graphql)
              │
              │ GraphQL + REST auth
              ▼
         API Gateway (NestJS, port 3001)
              │
              ├── Redis pub/sub ──── service-core (NestJS µsvc)
              ├── Redis (sessions)
              └── Keycloak (OIDC / ROPC)
```

Authentication is gateway-managed: the browser only sees an opaque `session_id` HttpOnly cookie. Login uses ROPC grant, registration uses the Keycloak Admin API. Custom login/register pages live in the Next.js app.

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Frontend         | Next.js 16 (App Router)             |
| GraphQL Client   | Apollo Client                       |
| API Gateway      | NestJS + Apollo Server (code-first) |
| Microservices    | NestJS Microservices                |
| Inter-service    | Redis transport (pub/sub)           |
| Auth             | Keycloak (ROPC + Admin API)         |
| Database         | PostgreSQL 17 + Prisma ORM          |
| Monorepo         | Turborepo + pnpm workspaces         |
| Containerization | Docker (multi-stage builds)         |
| Observability    | Prometheus, Grafana, Loki, Tempo, OTel Collector |
| Logging          | Pino (structured JSON) via nestjs-pino |
| Deployment       | ArgoCD + Helm on Kubernetes         |

## AI Engineering

This project uses an AI-assisted development framework with documented rules to ensure consistent code quality. See [AI_ENGINEERING.md](AI_ENGINEERING.md) for details. AI tool context and rules are in the `.claude/` directory.

## Project Structure

```
luckyplans/
├── apps/
│   ├── web/                 # Next.js frontend (custom login/register, portfolio at /u/[userId])
│   ├── api-gateway/         # GraphQL gateway + auth controller (NestJS)
│   └── service-core/        # Core domain microservice (NestJS, Redis transport)
├── packages/
│   ├── config/              # Shared ESLint + TypeScript configs
│   ├── prisma/              # Prisma ORM: schema (Profile, Project, Skill, Experience), migrations, generated client
│   └── shared/              # Shared types and utilities
├── infrastructure/
│   ├── helm/                # Helm charts (luckyplans + observability)
│   ├── keycloak/            # Keycloak realm config (realm-export.json)
│   ├── argocd/              # ArgoCD application configs
│   └── scripts/             # Deploy scripts (deploy-local.sh with targeted deploy)
├── apps/web/content/        # Public docs source (MDX) — served at /docs
├── docker-compose.yml       # Local dev infrastructure (Redis, Keycloak, observability stack)
├── .claude/                 # AI tool context and rules
├── turbo.json               # Turborepo configuration
└── pnpm-workspace.yaml      # pnpm workspace definition
```

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0 (`corepack enable && corepack prepare pnpm@9.15.4 --activate`)
- **Docker** (for containerized builds and local Keycloak/Redis)
- **k3d** (for local Kubernetes — [install](https://k3d.io))

## Quick Start

```bash
# First time — install deps, create .env, build shared packages:
pnpm setup

# Start local infrastructure (Redis + Keycloak):
docker compose up -d

# Start all services with hot reload:
pnpm dev
```

- **Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3001/graphql
- **Keycloak Admin**: http://localhost:8080 (admin / admin)

## Kubernetes Deployment

```bash
# Full deploy — build all images, create cluster, Helm install:
pnpm deploy:local

# Rebuild and redeploy a single service:
./infrastructure/scripts/deploy-local.sh web

# Rebuild multiple services:
./infrastructure/scripts/deploy-local.sh api-gateway web

# Helm upgrade only (config/secret changes, no image builds):
./infrastructure/scripts/deploy-local.sh --helm-only
```

After deployment: http://localhost (frontend), http://localhost/graphql (API)

See [apps/web/content/guides/deployment.mdx](apps/web/content/guides/deployment.mdx) for detailed deployment instructions.

## Adding a New Microservice

1. Create a new directory under `apps/`:

   ```
   apps/service-<name>/
   ```

2. Copy the structure from `service-core` as a template

3. Update `package.json` with the new service name (`@luckyplans/service-<name>`)

4. Define message patterns in `packages/shared/src/types/index.ts`

5. Register the service client in `apps/api-gateway` with a new module

6. Add Docker and Helm manifests:
   - `apps/service-<name>/Dockerfile`
   - `infrastructure/helm/luckyplans/templates/service-<name>/deployment.yaml`

## Environment Variables

| Variable                  | Default                                   | Description                          |
| ------------------------- | ----------------------------------------- | ------------------------------------ |
| `REDIS_HOST`              | `localhost`                               | Redis hostname                       |
| `REDIS_PORT`              | `6379`                                    | Redis port                           |
| `API_GATEWAY_PORT`        | `3001`                                    | API Gateway listen port              |
| `CORS_ORIGIN`             | `http://localhost:3000`                   | Allowed CORS origin                  |
| `API_GATEWAY_URL`         | `http://localhost:3001`                   | Gateway URL (used by Next.js rewrites) |
| `KEYCLOAK_ISSUER`         | `http://localhost:8080/realms/luckyplans` | Keycloak realm issuer URL            |
| `KEYCLOAK_CLIENT_ID`      | `luckyplans-frontend`                     | Keycloak OIDC client ID              |
| `KEYCLOAK_CLIENT_SECRET`  | —                                         | Keycloak client secret (confidential) |
| `KEYCLOAK_ADMIN_URL`      | `http://localhost:8080`                   | Keycloak base URL for Admin API      |
| `SESSION_SECRET`          | —                                         | Secret for session signing           |
| `SESSION_TTL_SECONDS`     | `36000`                                   | Session TTL (default 10 hours)       |
| `DATABASE_URL`            | —                                         | PostgreSQL connection string (Prisma) |
| `MINIO_ENDPOINT`          | `localhost`                               | MinIO server hostname                |
| `MINIO_PORT`              | `9000`                                    | MinIO API port                       |
| `MINIO_ACCESS_KEY`        | `minioadmin`                              | MinIO access key                     |
| `MINIO_SECRET_KEY`        | `minioadmin`                              | MinIO secret key                     |
| `MINIO_BUCKET`            | `luckyplans-uploads`                      | MinIO bucket name                    |
| `MINIO_USE_SSL`           | `false`                                   | Use SSL for MinIO connection         |
| `NODE_ENV`                | `development`                             | Node environment                     |

## Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `pnpm setup`           | First-time project setup             |
| `pnpm dev`             | Start all services with hot reload   |
| `pnpm build`           | Build all packages and apps          |
| `pnpm lint`            | Lint all packages and apps           |
| `pnpm test`            | Run tests across all packages        |
| `pnpm type-check`      | Type-check all packages and apps     |
| `pnpm format`          | Format all files with Prettier       |
| `pnpm format:check`    | Check formatting without writing     |
| `pnpm clean`           | Clean all build artifacts            |
| `pnpm deploy:local`    | Full deploy to local Kubernetes      |
| `pnpm deploy:status`   | Check deployment status              |
| `pnpm deploy:teardown` | Destroy local Kubernetes cluster     |

See [apps/web/content/guides/developer.mdx](apps/web/content/guides/developer.mdx) for the full development guide.
