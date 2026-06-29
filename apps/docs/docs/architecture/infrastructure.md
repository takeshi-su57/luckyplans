---
title: Infrastructure
sidebar_label: Infrastructure
---

# Infrastructure

LuckyPlans currently has two infrastructure stories that matter:

- the current product repos, where the backend ships with a local Docker Compose path
- the beta monorepo, which contains the newer Helm, ArgoCD, Keycloak, docs, web, and object-storage deployment work

## Local infrastructure in the current backend repo

The backend repo includes:

- `docker-compose.yml`
- Redis on port `6379`
- PostgreSQL on host port `5434`

That stack is the most concrete starting point for running the current product backend locally.

## Beta monorepo deployment assets

The beta monorepo includes Helm templates for:

- `api-gateway`
- `docs`
- `landing`
- `web`
- `redis`
- `postgresql`
- `keycloak`
- `minio`

It also includes:

- ArgoCD app manifests
- local deploy scripts for k3d and Helm
- TLS and ingress templates
- Sealed Secrets support
- Prisma migrate and smoke-test jobs

## Production hostnames in the current beta deploy config

- `luckyplans.xyz`
- `docs.luckyplans.xyz`
- `beta.luckyplans.xyz`
- `api.luckyplans.xyz`
- `admin.luckyplans.xyz`
- `v0.api.luckyplans.xyz`

## Practical caution

The infrastructure layer is ahead of some product-doc content, but not every beta-monorepo application surface is yet the source of truth for the current alpha product behavior. Treat deployment docs as beta-monorepo infrastructure guidance and product workflow docs as alpha-repo behavior guidance.
