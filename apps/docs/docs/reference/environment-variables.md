---
title: Environment Variables
sidebar_label: Environment Variables
---

# Environment Variables

## Backend variables from the current `.env.sample`

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | None | PostgreSQL connection string used by Prisma |
| `JWT_SECRET` | Yes | None | JWT signing secret |
| `JWT_EXPIRES_IN` | Yes | None | JWT lifetime |
| `PORT` | Yes | None | API service HTTP port |
| `ENV` | Yes | None | Environment label |
| `SERVICE` | Yes | `API_SERVICE` in common local usage | Selects API, copy-trading, or leaderboard mode |
| `REDIS_PORT` | Yes | `6379` | Redis port |
| `REDIS_HOST` | Yes | `localhost` | Redis host |
| `BOT_HOOK_ADDRESS` | No | None | Integration setting for bot hook flow |
| `API_URL` | No | None | API URL used by surrounding flows |
| `BACKTEST_INTERNAL_SECRET` | No | None | Internal backtest-related secret |
| `OPTUNA_POSTGRES_URL` | No | None | Optimizer database URL |
| `DRPC_TOKENS` | No | None | RPC token list |
| `DRPC_PAID_TOKENS` | No | None | Paid RPC token list |
| `ALCHEMY_TOKENS` | No | None | Alchemy token list |
| `ALCHEMY_PAID_TOENS` | No | None | Paid Alchemy token list with current repo spelling |

## Frontend variables observed in source

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_LUCKY_PLAN_GRAPHQL_API` | Yes | None | GraphQL HTTP endpoint |
| `NEXT_PUBLIC_LUCKY_PLAN_GRAPHQL_WSS` | Yes | None | GraphQL websocket endpoint |
| `NEXT_PUBLIC_ADMIN_EMAIL` | No | None | mailto links for admin contact |
| `NEXT_PUBLIC_SECRET` | Unclear | None | used by frontend utility helpers |
| `NEXT_PUBLIC_SERVER_TIME_ZONE` | No | None | timezone helper |

<!-- TODO: replace the frontend section with a committed example file once the repo publishes one. -->
