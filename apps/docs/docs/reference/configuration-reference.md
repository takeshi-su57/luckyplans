---
title: Configuration Reference
sidebar_label: Configuration Reference
---

# Configuration Reference

LuckyPlans configuration currently spans two implementation families:

- alpha product repos with local `.env` files
- beta monorepo with Helm values and shared runtime environment variables

## Platform config

Platform behavior is configured through:

- backend enums such as `Platform`
- platform adapter directories under `src/web3/platform`
- contract records in the database

## Chain config

Chain support is configured in the shared web3 layer. It determines RPC routing, contract reads, and which deployment ranges are valid.

## Contract config

The `Contract` model is the main source of truth for:

- chain ID
- address
- description
- status
- `fromBlock`
- `toBlock`
- platform
- version

## Simulation config

Simulation records currently include configurable inputs such as:

- platform
- direction
- selected leader count
- date range
- trade-count ranges
- R² ranges
- slope ranges
- leverage limits
- standard collateral

## Deployment config

The beta Helm chart includes configuration areas for:

- `config.*`
- `ingress.*`
- `apiGateway.*`
- `landing.*`
- `docs.*`
- `web.*`
- `redis.*`
- `postgresql.*`
- `keycloak.*`
- `minio.*`
- `sealedSecrets.*`

See the dedicated Helm values reference for a more concrete summary.
