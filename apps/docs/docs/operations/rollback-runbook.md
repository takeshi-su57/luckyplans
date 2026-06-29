---
title: Rollback Runbook
sidebar_label: Rollback Runbook
---

# Rollback Runbook

## Goal

Return the deployment to a previously working release after a bad rollout.

## When to use

- bad image build
- broken docs or web release
- API gateway regression
- invalid config or secret change

## Prerequisites

- access to Helm release history
- known-good image tag or Helm revision

## Steps

1. Inspect current release state.
2. Check Helm history for the target release.
3. Identify the last known-good revision or pinned image tags.
4. Roll back through Helm or restore the last known-good values and tags.
5. Re-check rollout status and logs.

## Verification

- app pages load
- GraphQL responds
- Keycloak-backed login works if relevant
- no crash loops on rolled-back deployments

## Troubleshooting

- if rollback does not recover behavior, inspect migration compatibility
- if frontend still looks broken, confirm CDN or browser cache and baked build args are not masking the change
