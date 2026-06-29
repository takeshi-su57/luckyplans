---
title: Reindexing Runbook
sidebar_label: Reindexing Runbook
---

# Reindexing Runbook

## Goal

Rebuild historical index state after parser changes, contract updates, or data gaps.

## When to use

- platform parser changed
- contract version boundaries were corrected
- historical gaps or duplicates were detected
- leaderboard output looks inconsistent

## Prerequisites

- understand the affected platform, chain, and contract range
- know whether you are touching live or historical contracts

## Steps

1. Confirm the target contract metadata is correct.
2. Confirm the relevant leaderboard worker is available.
3. Use contract-adaption status tooling to inspect current state.
4. Trigger adaption or replay for the target contract range.
5. Re-check historical records and leaderboard outputs.

## Verification

- `PerpTradingEventLog` rows appear complete for the intended range
- leaderboards return sane ordering
- `getPerpTradePositions` results match expected trade history
- simulations on the same period behave consistently

## Troubleshooting

- check RPC rate limits
- check parser version correctness
- check `fromBlock` and `toBlock`
- check for chain-specific event differences
