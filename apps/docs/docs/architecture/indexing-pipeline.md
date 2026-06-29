---
title: Indexing Pipeline
sidebar_label: Indexing Pipeline
---

# Indexing Pipeline

The indexing pipeline is what turns raw platform logs into researchable history.

## What it does

- reads platform-specific contract logs
- applies venue-specific parsers
- normalizes output into shared historical records
- stores results for leaderboards, history views, and simulations

## Core parts

### Platform adapters

The backend keeps adapter code under `src/web3/platform`, with real implementations for:

- `gns`
- `gmx`
- `avnt`

There is also shared chain utility code and chainlink-related support in the broader web3 layer.

### Raw data collection

Workers use configured contracts and block cursors to fetch logs from supported RPC providers.

### Normalization

Event logs are translated into a stable internal shape such as:

- address
- contract ID
- platform
- block
- log index
- event JSON
- USD PnL
- event date

### Position open and close parsing

Platform-specific parsers detect trading lifecycle events such as opens, closes, leverage updates, size changes, realized PnL, and liquidation-related outcomes.

### Chain ID handling

Contract definitions are chain-scoped, so the same platform may behave differently across chains.

### Contract version handling

Version is tracked directly on the `Contract` model alongside address, chain, platform, and block boundaries.

### Historical range handling

`fromBlock` and optional `toBlock` determine which contract configuration is active for a given historical period.

> LuckyPlans tracks contract address, chain ID, start block, and optional end block to know which contract version applies to a historical range.

## Why this matters for research

Without correct contract-range and parser selection, historical PnL, leaderboards, and simulation results can become misleading very quickly.
