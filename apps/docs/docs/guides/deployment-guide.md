---
title: Deployment Guide
sidebar_label: Deployment Guide
---

# Deployment Guide

This guide documents the deploy path that is actually present in the beta monorepo today.

## Supported deployment shape

- Helm chart at `infrastructure/helm/luckyplans`
- ArgoCD application manifests in `infrastructure/argocd`
- local cluster deploy script in `infrastructure/scripts/deploy-local.sh`

## Deployed surfaces

- landing
- docs
- web
- api-gateway
- redis
- postgresql
- keycloak
- minio

## Pre-deployment checklist

- verify required CLIs: Docker, kubectl, k3d, helm
- confirm image tags and registry settings
- confirm ingress hostnames and TLS settings
- confirm secrets strategy: local plain Secret vs production Sealed Secrets
- confirm Keycloak issuer and JWKS URLs match the target hostname setup

## Local deploy

From the beta repo root:

```powershell
pnpm deploy:local
```

Targeted service deploys are supported by the underlying script, including `docs`, `web`, and `api-gateway`.

## Production-style deploy inputs

The repo includes:

- `values.yaml`
- `values.prod.yaml`
- ArgoCD app manifests

The production values file currently defines hostnames such as:

- `luckyplans.xyz`
- `docs.luckyplans.xyz`
- `beta.luckyplans.xyz`
- `api.luckyplans.xyz`
- `admin.luckyplans.xyz`

## Post-deployment verification

- verify ingress routes resolve
- verify docs and landing pages load
- verify API health and GraphQL reachability
- verify Keycloak issuer and login flows
- verify smoke test or follow-up logs when enabled

<!-- TODO: document the exact current production rollout command sequence used by maintainers after image tags are pinned. -->
