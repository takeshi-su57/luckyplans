# Environment Variable Configuration

## Context

Environment variables were originally duplicated as hardcoded literals across Dockerfiles and
docker-compose files. This document describes the single-source-of-truth approach: all configurable
values live in `.env` and flow through the stack via Docker Compose substitution and Dockerfile `ARG`s.

**Key rule**: change a port or URL once in `.env` — everything else picks it up automatically.

---

## Variable Sources

```
.env  (root — single source of truth for dev + compose)
  │
  ├─── docker-compose.yml         ${VAR} substitution  →  runtime env for containers
  │         │
  │         └─── build.args       →  Dockerfile ARGs    →  Next.js build-time bundle
  │
  └─── local dev (pnpm dev)       Next.js / NestJS read process.env directly
```

---

## `.env` Variables

| Variable | Example Value | Used By |
|---|---|---|
| `API_GATEWAY_PORT` | `3001` | api-gateway container port, docker-compose port mapping |
| `API_GATEWAY_URL` | `http://localhost:3001` | local dev tooling / scripts |
| `NEXT_PUBLIC_GRAPHQL_URL` | `http://localhost:3001/graphql` | local dev fallback in source code |
| `WEB_PORT` | `3000` | reference (frontend always 3000) |
| `REDIS_HOST` | `localhost` | local dev only — **not** used in Docker |
| `REDIS_PORT` | `6379` | Redis port |
| `NODE_ENV` | `development` | local dev only |

---

## What Stays Hardcoded (by design)

| Value | Location | Reason |
|---|---|---|
| `REDIS_HOST=redis` | `docker-compose.yml` | Docker network service name — differs from `.env`'s `localhost` |
| `NODE_ENV=production` | `docker-compose.yml` | Docker images are always production builds |
| `CORS_ORIGIN=http://localhost:3000` | `docker-compose.override.yml` | Dev-specific; not configurable via `.env` |

---

## NEXT_PUBLIC_* — Build-Time Variables

`NEXT_PUBLIC_*` variables are **baked into the Next.js bundle at build time**, not read at runtime.
This means passing them only via `environment:` in docker-compose has no effect on the built app.

The correct flow requires `ARG` in the Dockerfile builder stage:

```
docker-compose.yml
  build.args:
    NEXT_PUBLIC_GRAPHQL_URL: http://api-gateway:${API_GATEWAY_PORT}/graphql
          │
          ▼
apps/web/Dockerfile  (builder stage)
  ARG NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql   ← default for standalone builds
  ENV NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
          │
          ▼
Next.js build  →  variable baked into bundle
```

### URL differences by context

| Context | `NEXT_PUBLIC_GRAPHQL_URL` |
|---|---|
| Local dev (`pnpm dev`) | `http://localhost:3001/graphql` (from `.env`) |
| Docker Compose production | `http://api-gateway:3001/graphql` (Docker service name) |
| Docker Compose dev override | `http://localhost:3001/graphql` (browser-accessible) |

---

## Docker Compose Substitution

Docker Compose automatically reads the root `.env` file for `${VAR}` substitution.
No extra config is needed — just use `${VAR_NAME}` in `docker-compose.yml`.

```yaml
# docker-compose.yml
api-gateway:
  ports:
    - "${API_GATEWAY_PORT}:${API_GATEWAY_PORT}"
  environment:
    - API_GATEWAY_PORT=${API_GATEWAY_PORT}

web:
  build:
    args:
      NEXT_PUBLIC_GRAPHQL_URL: http://api-gateway:${API_GATEWAY_PORT}/graphql
  environment:
    - NEXT_PUBLIC_GRAPHQL_URL=http://api-gateway:${API_GATEWAY_PORT}/graphql
```

---

## Changing the Gateway Port

To change the API Gateway port, edit **one line** in `.env`:

```env
API_GATEWAY_PORT=3001   ← change this
```

This propagates to:
- `docker-compose.yml` port mappings and environment
- `docker-compose.override.yml` port mappings
- Next.js build via `build.args`
- `infrastructure/scripts/` URLs (reference `.env` indirectly via echo strings)

The Dockerfiles contain a matching `ENV` default (`ENV API_GATEWAY_PORT=3001`) which acts as a
fallback for running containers directly without docker-compose. Update this manually if the
default port changes permanently.
