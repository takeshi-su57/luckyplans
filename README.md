# LuckyPlans

Monorepo for LuckyPlans: the web product, landing page, docs app, API gateway, edge agent, shared packages, and deployment infrastructure.

## Architecture

```text
Browser -> Next.js (port 3000, rewrites /auth/* + /graphql)
            |
            | GraphQL + REST auth
            v
       API Gateway (NestJS, port 3001)
            |
            +-- Redis transport and sessions
            +-- PostgreSQL via Prisma
            +-- Keycloak for identity
            +-- MinIO for object storage
```

Authentication is gateway-managed. The browser only receives an opaque HttpOnly `session_id` cookie; it never handles access or refresh tokens directly.

## Tech Stack

| Layer             | Technology                                      |
| ----------------- | ----------------------------------------------- |
| Frontend          | Next.js 16 + React 19                           |
| GraphQL Client    | Apollo Client                                   |
| API Gateway       | NestJS + Apollo Server (code-first)             |
| Runtime Messaging | Redis transport                                 |
| Auth              | Keycloak                                        |
| Database          | PostgreSQL 17 + Prisma                          |
| Object Storage    | MinIO                                           |
| Monorepo          | Turborepo + pnpm workspaces                     |
| Observability     | OpenTelemetry, Prometheus, Grafana, Loki, Tempo |
| Deployment        | Docker + Helm + ArgoCD + k3s/k3d                |

## Repo Layout

```text
luckyplans/
|-- apps/
|   |-- api-gateway/
|   |-- docs/
|   |-- edge-agent/
|   |-- landing/
|   `-- web/
|-- packages/
|   |-- config/
|   |-- prisma/
|   `-- shared/
|-- infrastructure/
|   |-- argocd/
|   |-- helm/
|   |-- keycloak/
|   `-- scripts/
|-- docker-compose.yml
|-- AGENTS.md
|-- turbo.json
`-- pnpm-workspace.yaml
```

## Prerequisites

- Node.js `>=20.0.0`
- pnpm via Corepack: `corepack enable && corepack prepare pnpm@11.5.3 --activate`
- Docker
- k3d for local Kubernetes testing

## Local Development

```bash
pnpm setup
docker compose up -d
pnpm dev
```

Local Docker Compose intentionally starts only the day-to-day backing services:

- Redis
- PostgreSQL for Keycloak
- PostgreSQL for the app
- Keycloak
- MinIO

Common local URLs:

- Landing SPA: http://localhost:5173
- Product app: http://localhost:3000/login
- API Gateway GraphQL: http://localhost:3001/graphql
- Docs app during `pnpm dev`: http://localhost:3002
- Keycloak admin: http://localhost:8080
- MinIO console: http://localhost:9001

Observability components are managed under `infrastructure/` for Helm/k3d and CI/CD flows instead of always running in the root compose file.

## Local Deployment

```bash
pnpm deploy:local
```

Targeted rebuilds:

```bash
./infrastructure/scripts/deploy-local.sh web
./infrastructure/scripts/deploy-local.sh landing
./infrastructure/scripts/deploy-local.sh prisma-migrate
./infrastructure/scripts/deploy-local.sh --helm-only
```

## Reference Docs

- Developer guide: [apps/docs/docs/guides/developer.mdx](apps/docs/docs/guides/developer.mdx)
- Deployment guide: [apps/docs/docs/guides/deployment.mdx](apps/docs/docs/guides/deployment.mdx)
- Repository workflow and architecture rules: [AGENTS.md](AGENTS.md)
