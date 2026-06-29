---
title: Database Models
sidebar_label: Database Models
---

# Database Models

## Main workflow models

| Model | Role |
| --- | --- |
| `Plan` | Top-level live execution container |
| `Bot` | Leader-follower automation unit |
| `Mission` | Mid-level lifecycle grouping for trading intents |
| `Task` | Concrete execution-oriented work item |
| `Action` | Observed or system-originated action record |
| `FollowerAction` | Task and action join model |

## Historical and research models

| Model | Role |
| --- | --- |
| `PerpTradingEventLog` | normalized historical trading event log |
| `PnlSnapshotV2` | date-based leaderboard snapshot record |
| `Simulation` | top-level simulation aggregate |
| `SimulationPlan` | per-plan simulation slice |
| `SimulationBot` | per-leader simulation participant |
| `SimulationLeaderSelection` | selected leaders for a simulation |

## Configuration and actor models

| Model | Role |
| --- | --- |
| `Contract` | platform, chain, version, and block-range metadata |
| `Follower` | managed follower identity |
| `User` | operator-level user record |
| `Strategy` | configurable strategy and risk settings |
| `Log` | operational or product log record |

For exact field definitions, use `../alpha/be/prisma/schema.prisma`.
