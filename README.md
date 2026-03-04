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

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| GraphQL Client | Apollo Client |
| API Gateway | NestJS + Apollo Server (code-first) |
| Microservices | NestJS Microservices |
| Inter-service | Redis transport (pub/sub) |
| Monorepo | Turborepo + pnpm workspaces |
| Containerization | Docker (multi-stage builds) |
| Local K8s | k3s via k3d |

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
│   ├── shared/              # Shared types and utilities
│   └── ui/                  # Shared React UI components
├── infrastructure/
│   ├── k8s/                 # Kubernetes manifests
│   └── scripts/             # Deployment scripts
├── docs/
│   └── architecture/        # Architecture documentation
├── docker-compose.yml       # Local development with Docker
├── turbo.json               # Turborepo configuration
└── pnpm-workspace.yaml      # pnpm workspace definition
```

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0 (`corepack enable && corepack prepare pnpm@9.15.4 --activate`)
- **Docker** (for containerized development)
- **k3d** (for local Kubernetes — [install](https://k3d.io))

## Quick Start

```bash
# First time — install deps, create .env, build shared packages:
pnpm setup

# Start everything (Redis + all services with hot reload):
pnpm dev:start
```

- **Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:4000/graphql

## Docker Compose

```bash
pnpm docker:up       # Build and start all containers
pnpm docker:down     # Stop everything
```

## Kubernetes (k3s)

```bash
pnpm deploy:k3s      # Build images → create cluster → deploy
pnpm deploy:teardown  # Destroy the cluster
```

After deployment: http://localhost (frontend), http://localhost/graphql (API)

## Check Status

```bash
pnpm status           # Shows dev, docker, and k3s service status
```

See [docs/guides/how-to-develop.md](docs/guides/how-to-develop.md) and [docs/guides/how-to-deploy.md](docs/guides/how-to-deploy.md) for detailed guides.

## Adding a New Microservice

1. Create a new directory under `apps/`:
   ```
   apps/service-<name>/
   ```

2. Copy the structure from `service-core` as a template

3. Update `package.json` with the new service name (`@luckyplans/service-<name>`)

4. Define message patterns in `packages/shared/src/types/index.ts`

5. Register the service client in `apps/api-gateway` with a new module

6. Add Docker and K8s manifests:
   - `apps/service-<name>/Dockerfile`
   - `infrastructure/k8s/service-<name>/deployment.yaml`

7. Add to `docker-compose.yml`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_HOST` | `localhost` | Redis hostname |
| `REDIS_PORT` | `6379` | Redis port |
| `API_GATEWAY_PORT` | `4000` | API Gateway listen port |
| `NEXT_PUBLIC_GRAPHQL_URL` | `http://localhost:4000/graphql` | GraphQL endpoint for frontend |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `NODE_ENV` | `development` | Node environment |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm setup` | First-time project setup |
| `pnpm dev:start` | Start Redis + all services (hot reload) |
| `pnpm dev:stop` | Stop the Redis container |
| `pnpm dev` | Start services only (assumes Redis running) |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages and apps |
| `pnpm type-check` | Type-check all packages and apps |
| `pnpm format` | Format all files with Prettier |
| `pnpm clean` | Clean all build artifacts |
| `pnpm docker:up` | Build and start via docker-compose |
| `pnpm docker:down` | Stop docker-compose services |
| `pnpm deploy:k3s` | Build + deploy to local k3s |
| `pnpm deploy:teardown` | Destroy k3s cluster |
| `pnpm status` | Check status of all services |
