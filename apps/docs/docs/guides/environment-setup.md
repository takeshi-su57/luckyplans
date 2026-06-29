---
title: Environment Setup
sidebar_label: Environment Setup
---

# Environment Setup

## Backend environment

The current backend provides `.env.sample` with at least these variables:

| Variable | Meaning |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | API auth signing secret |
| `JWT_EXPIRES_IN` | token lifetime |
| `PORT` | API HTTP port |
| `ENV` | environment label |
| `SERVICE` | `API_SERVICE`, `COPY_TRADING_SERVICE`, or `LEADERBOARD_SERVICE` |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `BOT_HOOK_ADDRESS` | integration setting |
| `API_URL` | backend-facing URL setting |
| `BACKTEST_INTERNAL_SECRET` | internal backtest-related secret |
| `OPTUNA_POSTGRES_URL` | optimizer-related database URL |
| `DRPC_TOKENS` | RPC provider tokens |
| `DRPC_PAID_TOKENS` | paid RPC provider tokens |
| `ALCHEMY_TOKENS` | Alchemy tokens |
| `ALCHEMY_PAID_TOENS` | paid Alchemy token list, note the current spelling |

## Frontend environment

The current frontend code references at least:

| Variable | Meaning |
| --- | --- |
| `NEXT_PUBLIC_LUCKY_PLAN_GRAPHQL_API` | GraphQL HTTP endpoint |
| `NEXT_PUBLIC_LUCKY_PLAN_GRAPHQL_WSS` | GraphQL websocket endpoint |
| `NEXT_PUBLIC_ADMIN_EMAIL` | support/admin contact mailto links |
| `NEXT_PUBLIC_SECRET` | frontend utility secret usage present in current code |
| `NEXT_PUBLIC_SERVER_TIME_ZONE` | timezone helper |

<!-- TODO: publish a frontend `.env.example` so operators do not need to infer these from source. -->

## Beta monorepo environment

The beta monorepo root scripts run through `dotenv -e .env`, and `turbo.json` lists shared variables for:

- API gateway URLs and ports
- docs and web URLs
- Keycloak issuer and admin settings
- session secrets
- database settings
- MinIO settings
- OpenTelemetry settings

## Safety rules

- do not commit real secrets
- use sample files or sealed secrets for documented examples
- keep public docs focused on variable purpose, not private values
