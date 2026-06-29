---
title: Helm Values
sidebar_label: Helm Values
---

# Helm Values

The beta monorepo Helm chart lives at `infrastructure/helm/luckyplans`.

## High-value sections

| Key | Purpose |
| --- | --- |
| `config.*` | shared runtime config such as Redis, API gateway, Keycloak, session, and MinIO settings |
| `image.*` | registry and pull-policy configuration |
| `sealedSecrets.*` | production secret handling through Sealed Secrets |
| `secrets.*` | local-only plain Secret defaults |
| `ingress.*` | hostnames, TLS, and Traefik annotations |
| `legacyV0.*` | legacy proxy routing |
| `apiGateway.*` | API gateway image, probes, and resources |
| `prismaMigrate.*` | migration job image |
| `landing.*` | landing app image and build args |
| `docs.*` | docs image and build args |
| `web.*` | web image and build args |
| `postgresql.*` | database image, storage, and resources |
| `redis.*` | Redis runtime settings |
| `keycloak.*` | Keycloak deployment settings |
| `minio.*` | object-storage deployment settings |

## Build-arg caveat

Some frontend-facing URLs are baked into static or Next.js builds through Helm-connected image build args, so changing Helm values alone may not update behavior unless the image is rebuilt.

Examples in the current chart include:

- `landing.buildArgs.appUrl`
- `landing.buildArgs.docsUrl`
- `docs.buildArgs.appUrl`
- `web.buildArgs.graphqlUrl`
- `web.buildArgs.docsUrl`
