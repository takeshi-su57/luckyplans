---
title: Quickstart
sidebar_label: Quickstart
---

# Quickstart

This quickstart is based on the current working product implementation in the split repositories:

- frontend: `../alpha/fe`
- backend: `../alpha/be`

The docs portal itself lives in this `beta` monorepo under `apps/docs`.

## Prerequisites

- Node.js 20+
- npm for the current alpha repos
- pnpm 11+ for the beta monorepo docs portal
- Docker Desktop or Docker Engine

## Clone the repositories

GitHub sources:

- `https://github.com/takeshi-su57/lucky-plan-fe`
- `https://github.com/takeshi-su57/lucky-plan-be`
- `https://github.com/takeshi-su57/luckyplans` for the beta docs and infrastructure monorepo

## Backend setup

From `../alpha/be`:

```powershell
npm install
docker compose up -d
Copy-Item .env.sample .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

Run the API service:

```powershell
$env:SERVICE="API_SERVICE"; npm run start:dev
```

Optional worker processes:

```powershell
$env:SERVICE="COPY_TRADING_SERVICE"; npm run start:dev
$env:SERVICE="LEADERBOARD_SERVICE"; npm run start:dev
```

## Frontend setup

From `../alpha/fe`:

```powershell
npm install
npm run dev
```

The frontend uses GraphQL HTTP and WSS environment variables in `app/providers.tsx`.

<!-- TODO: publish a clean frontend env sample or example file in the product repo so this guide can show exact copy-ready values. -->

## Docs portal setup

From this repo root:

```powershell
pnpm --filter @luckyplans/docs dev
```

## Verify

- frontend should load on `http://localhost:3500`
- docs should load on `http://localhost:3002`
- backend API should listen on the port configured in `../alpha/be/.env`

<!-- TODO: add an explicit health-check or GraphQL introspection probe once the public product bootstrap is standardized. -->
