---
title: Run with Docker
sidebar_label: Run with Docker
---

# Run with Docker

## Current working Docker path

The current product backend ships with a real `docker-compose.yml` in `../alpha/be`.

It starts:

- Redis
- PostgreSQL

## Start local services

From `../alpha/be`:

```powershell
docker compose up -d
```

## What it provides

- Redis on `6379`
- PostgreSQL on `5434`

The backend then connects through the values placed in `.env`.

## What Docker does not currently provide

- a unified docker-compose stack for the split frontend and backend together
- a published docs-only Compose path for the Docusaurus portal
- a documented one-command production-like stack for the alpha repos

## Beta monorepo alternative

The beta monorepo contains local deploy automation through Helm and k3d rather than Docker Compose:

- `pnpm deploy:local`
- `pnpm deploy:status`
- `pnpm deploy:teardown`

Those commands are about the beta infrastructure stack, not the simplest path for running the current alpha product locally.
