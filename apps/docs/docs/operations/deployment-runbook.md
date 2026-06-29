---
title: Deployment Runbook
sidebar_label: Deployment Runbook
---

# Deployment Runbook

## Goal

Safely deploy the beta monorepo application stack or a targeted subset of services.

## When to use

- new docs or web release
- API gateway image update
- local k3d validation
- production-like Helm rollout preparation

## Prerequisites

- Docker
- kubectl
- k3d
- helm
- correct secrets strategy

## Steps

1. Verify local tooling with the repo setup script if needed.
2. Confirm the services you intend to deploy.
3. Run `pnpm deploy:local` for a full local stack, or use the targeted deploy path from `infrastructure/scripts/deploy-local.sh`.
4. Watch rollout status for affected deployments.
5. Validate ingress reachability and service logs.

## Verification

- `pnpm deploy:status`
- `kubectl -n luckyplans rollout status deployment/<service>`
- `kubectl -n luckyplans logs -f deployment/<service>`

## Troubleshooting

- if rollout stalls, inspect image tags and pull settings
- if ingress fails, inspect hostnames and Traefik annotations
- if login fails, inspect Keycloak issuer and client-secret config
