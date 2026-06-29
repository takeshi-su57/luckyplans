---
title: Database Design
sidebar_label: Database Design
---

# Database Design

LuckyPlans uses PostgreSQL through Prisma. The current implementation is broad, but the table below captures the main concepts without dumping the full schema.

## Conceptual model

| Model | Purpose |
| --- | --- |
| Platform | Enum grouping supported perp venues such as `GNS`, `GMX`, and `AVNT` |
| Chain | Represented through chain IDs on contracts and web3 configuration |
| Contract | Historical and active venue contract metadata, including address, chain, version, platform, status, and block range |
| Trader | Represented primarily by on-chain addresses seen in historical records and leader selection |
| Position | Trade-history and simulated position concepts appear through event logs, task flow, and simulation detail outputs |
| Simulation | Top-level research run with platform, date range, filters, progress, and aggregate metrics |
| Simulation Plan | A narrower simulation slice with its own cursor, summary metrics, and attached simulation bots |
| Simulation Result | Expressed through simulation aggregate fields, per-plan summaries, bot caches, and trade-position detail payloads |
| User | Product user or operator record with permissions and follower management settings |

## Important current Prisma models

The real backend schema includes models such as:

- `Contract`
- `User`
- `Follower`
- `Strategy`
- `Plan`
- `Bot`
- `Mission`
- `Task`
- `Action`
- `PerpTradingEventLog`
- `PnlSnapshotV2`
- `Simulation`
- `SimulationPlan`
- `SimulationBot`
- `SimulationLeaderSelection`
- `Log`

## Notes

- `Contract` is one of the most important models because it binds platform, chain, version, and block range together.
- `Plan`, `Bot`, `Mission`, `Task`, and `Action` form the main live workflow chain.
- simulation detail pages are accelerated through cache-oriented models such as `SimulationPlanCache` and `SimulationBotCache`.

For the full source of truth, inspect the backend Prisma schema in `../alpha/be/prisma/schema.prisma`.
