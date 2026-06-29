---
title: Data Flow
sidebar_label: Data Flow
---

# Data Flow

The product flow is easiest to understand as a pipeline from raw venue data into research and execution surfaces.

```text
External platform data
-> indexer / adapter
-> normalized trader history
-> database
-> simulation plan generation
-> simulation engine
-> result metrics
-> dashboard / leaderboard / analysis views
```

## Step-by-step

1. Supported platform contracts are configured with platform, chain, address, version, and block-range metadata.
2. The leaderboard worker reads finalized event logs from those contracts.
3. Platform-specific parsers normalize venue logs into a common trade-history shape.
4. The backend stores those records in historical tables such as `PerpTradingEventLog` and snapshot tables such as `PnlSnapshotV2`.
5. The product UI queries leaderboard and trader-history data through GraphQL.
6. Manual and auto simulation workflows select leaders and date ranges from that historical dataset.
7. Simulation plans and simulation bots are generated and evaluated against historical events.
8. Aggregate outputs such as follower PnL, leader PnL, net PnL, cost, drawdown, and trade count are returned to the UI.

## Live copy-trading flow

Live plans follow a related but different path:

1. The copy-trading worker scans live contracts in block batches.
2. Observed chain actions are normalized into persistent `Action` records.
3. Those actions are routed into `Mission` and `Task` state.
4. Task execution drives follower-side behavior where allowed by the live workflow.

## Main failure points

- missing historical data
- platform API or contract-event changes
- contract version changes without correct block ranges
- chain reorgs or delayed indexing
- incomplete trader history
- invalid simulation configuration
- stale websocket sessions in the frontend
- Redis coordination outages between service modes

## Important boundary

Simulation is based on indexed historical inputs and internal replay logic. It is meant to help analyze risk and behavior, not to prove what will happen in live markets.
