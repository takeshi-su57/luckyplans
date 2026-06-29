---
title: Service Map
sidebar_label: Service Map
---

# Service Map

This map reflects the real implementation in the current frontend and backend repositories, plus the current deployment assets in the beta monorepo.

## Web App

| Field | Details |
| --- | --- |
| Purpose | Primary product UI for plans, followers, leaderboards, logs, settings, and simulations |
| Responsibilities | Apollo GraphQL queries and mutations, GraphQL subscriptions, wallet-aware UI, simulation workflows, leaderboard analysis |
| Inputs | User actions, GraphQL responses, subscription events, configured GraphQL HTTP and WSS endpoints |
| Outputs | UI state changes, GraphQL operations, local notifications |
| Dependencies | Next.js, Apollo Client, HeroUI, RainbowKit, Wagmi |
| Failure cases | GraphQL endpoint mismatch, expired auth token, websocket disconnects, incomplete env config |

## Docs App

| Field | Details |
| --- | --- |
| Purpose | Public-facing documentation site |
| Responsibilities | Product docs, architecture docs, runbooks, contribution guidance |
| Inputs | Markdown and MDX content in `apps/docs/docs` |
| Outputs | Static Docusaurus site |
| Dependencies | Docusaurus, Nginx container in Helm deploy path |
| Failure cases | Broken links, outdated content, build regressions |

## API Gateway

| Field | Details |
| --- | --- |
| Purpose | GraphQL API and the main user-facing backend surface |
| Responsibilities | Expose product workflows, coordinate Redis-connected workers, read and write Prisma models, publish subscription events |
| Inputs | GraphQL queries, mutations, subscriptions, Redis events |
| Outputs | GraphQL responses, subscription payloads, Redis commands and events |
| Dependencies | NestJS, Prisma, PostgreSQL, Redis |
| Failure cases | DB connectivity issues, schema drift, invalid env setup, downstream worker unavailability |

## Simulation Service

| Field | Details |
| --- | --- |
| Purpose | Create and evaluate manual and auto simulations |
| Responsibilities | Create simulations, generate simulation plans, select leaders, maintain simulation bot caches, calculate aggregate metrics |
| Inputs | Simulation config, indexed historical logs, leader selection criteria |
| Outputs | Simulation records, plan details, bot summaries, aggregate PnL and drawdown metrics |
| Dependencies | Prisma models such as `Simulation`, `SimulationPlan`, `SimulationBot`, `SimulationLeaderSelection`, `PerpTradingEventLog` |
| Failure cases | Missing history, invalid selection ranges, stale cache state, unsupported contract history |

## Leaderboard Service

| Field | Details |
| --- | --- |
| Purpose | Historical trade indexing and leaderboard support |
| Responsibilities | Normalize finalized on-chain logs, compute PnL snapshots, provide historical source data for ranking and simulation |
| Inputs | Contract metadata, blockchain event logs, platform parsers |
| Outputs | `PerpTradingEventLog`, `PnlSnapshotV2`, initialization flags, contract adaption state |
| Dependencies | Redis transport, Prisma, EVM RPC providers, adapter code under `src/web3/platform` |
| Failure cases | RPC failures, parser drift, contract metadata errors, delayed indexing |

## Platform / Contract Service

| Field | Details |
| --- | --- |
| Purpose | Track which contract and parser should be used for each venue and historical window |
| Responsibilities | Manage platform, chain, version, status, `fromBlock`, and optional `toBlock` metadata |
| Inputs | Seed data, migrations, admin actions, contract-adaption triggers |
| Outputs | Active and historical contract definitions used by workers and simulation logic |
| Dependencies | Prisma `Contract` model, platform adapters |
| Failure cases | Wrong block boundaries, incorrect version tagging, missing chain coverage |

## Indexer / Adapter Layer

| Field | Details |
| --- | --- |
| Purpose | Turn venue-specific logs into normalized trading events |
| Responsibilities | ABI management, parser logic, platform-specific transforms, contract-scoped log reads |
| Inputs | RPC logs, contract metadata, parser version rules |
| Outputs | Normalized actions, trade history rows, leaderboard data |
| Dependencies | `src/web3/platform/gns`, `gmx`, `avnt`, and shared chain utilities |
| Failure cases | ABI drift, event shape changes, incorrect chain configuration, log replay gaps |

## Database

| Field | Details |
| --- | --- |
| Purpose | Source of truth for product state and historical analytics |
| Responsibilities | Persist plans, bots, missions, tasks, users, contracts, logs, simulations, and indexed history |
| Inputs | Prisma writes from API and worker services |
| Outputs | Durable records queried by GraphQL and workers |
| Dependencies | PostgreSQL, Prisma |
| Failure cases | schema mismatch, migration mistakes, backfill problems |

## Cache / Queue

Redis is present today as the NestJS microservice transport and coordination channel.

| Field | Details |
| --- | --- |
| Purpose | Process coordination, control messages, and event fan-out |
| Responsibilities | Process status events, worker control, internal message patterns |
| Inputs | API service emits and worker handlers |
| Outputs | internal event delivery between service modes |
| Dependencies | NestJS microservices over Redis |
| Failure cases | Redis outage, lost connectivity, stuck worker coordination |
