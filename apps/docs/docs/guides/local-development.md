---
title: Local Development
sidebar_label: Local Development
---

# Local Development

## Repository structure

Current practical split:

- `../alpha/fe`: active product frontend
- `../alpha/be`: active product backend
- `beta/apps/docs`: public docs portal
- `beta/infrastructure`: newer deployment assets and local k3d workflows

## Common backend commands

From `../alpha/be`:

```powershell
npm run build
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

Useful Prisma commands already implied by the repo:

```powershell
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

## Common frontend commands

From `../alpha/fe`:

```powershell
npm run dev
npm run build
npm run lint
npm run generate
```

## Common docs commands

From this repo root:

```powershell
pnpm --filter @luckyplans/docs dev
pnpm --filter @luckyplans/docs build
pnpm --filter @luckyplans/docs lint
pnpm --filter @luckyplans/docs type-check
```

## Testing

- backend has Jest and e2e scripts
- docs app has lint, type-check, build, and vitest support
- frontend currently exposes lint and GraphQL code generation in package scripts

## Troubleshooting

- if backend workers cannot connect, verify Redis is up on `6379`
- if Prisma cannot connect, verify Postgres from `docker compose` is reachable on host port `5434`
- if the frontend renders but data is empty, verify GraphQL HTTP and websocket env variables
- if leaderboards look incomplete, confirm the leaderboard worker is running and the relevant contracts are active
