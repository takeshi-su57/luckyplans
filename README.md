# LuckyPlans

Monorepo for the LuckyPlans application — frontend, API gateway, and backend microservices.

## Architecture

```
Browser → Next.js (Apollo Client)
              │
              │ GraphQL
              ▼
         API Gateway (NestJS + Apollo Server)
              │
              │ Redis pub/sub
              ├──────────────────┐
              ▼                  ▼
        service-auth       service-core
        (NestJS µsvc)      (NestJS µsvc)
```

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Frontend         | Next.js 16 (App Router)             |
| GraphQL Client   | Apollo Client                       |
| API Gateway      | NestJS + Apollo Server (code-first) |
| Microservices    | NestJS Microservices                |
| Inter-service    | Redis transport (pub/sub)           |
| Monorepo         | Turborepo + pnpm workspaces         |
| Containerization | Docker (multi-stage builds)         |
| Deployment       | ArgoCD + Helm on Kubernetes         |

## AI Engineering

This project uses an AI-assisted development framework with documented rules to ensure consistent code quality. See [AI_ENGINEERING.md](AI_ENGINEERING.md) for details. AI tool context and rules are in the `.claude/` directory.

## Project Structure

```
luckyplans/
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── api-gateway/         # GraphQL gateway (NestJS)
│   ├── service-auth/        # Auth microservice (NestJS)
│   └── service-core/        # Core domain microservice (NestJS)
├── packages/
│   ├── config/              # Shared ESLint + TypeScript configs
│   └── shared/              # Shared types and utilities
├── infrastructure/
│   ├── helm/                # Helm charts for Kubernetes deployment
│   ├── argocd/              # ArgoCD application configs
│   └── scripts/             # Setup, deploy, and teardown scripts
├── apps/web/content/        # Public docs source (MDX) — served at /docs
├── .claude/                 # AI tool context and rules
├── turbo.json               # Turborepo configuration
└── pnpm-workspace.yaml      # pnpm workspace definition
```

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0 (`corepack enable && corepack prepare pnpm@9.15.4 --activate`)
- **Docker** (for containerized builds and deployment)
- **k3d** (for local Kubernetes — [install](https://k3d.io))

## Quick Start

```bash
# First time — install deps, create .env, build shared packages:
pnpm setup

# Start all services with hot reload:
pnpm dev
```

- **Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:4000/graphql

## Kubernetes Deployment

```bash
pnpm deploy:local     # Build images → create cluster → deploy via Helm + ArgoCD
pnpm deploy:status    # Check deployment status
pnpm deploy:teardown  # Destroy the cluster
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

| Variable                  | Default                         | Description                   |
| ------------------------- | ------------------------------- | ----------------------------- |
| `REDIS_HOST`              | `localhost`                     | Redis hostname                |
| `REDIS_PORT`              | `6379`                          | Redis port                    |
| `API_GATEWAY_PORT`        | `4000`                          | API Gateway listen port       |
| `NEXT_PUBLIC_GRAPHQL_URL` | `http://localhost:4000/graphql` | GraphQL endpoint for frontend |
| `CORS_ORIGIN`             | `http://localhost:3000`         | Allowed CORS origin           |
| `NODE_ENV`                | `development`                   | Node environment              |

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
| `pnpm deploy:local`    | Build + deploy to local Kubernetes   |
| `pnpm deploy:status`   | Check deployment status              |
| `pnpm deploy:teardown` | Destroy local Kubernetes cluster     |

See [apps/web/content/guides/developer.mdx](apps/web/content/guides/developer.mdx) for the full development guide.
