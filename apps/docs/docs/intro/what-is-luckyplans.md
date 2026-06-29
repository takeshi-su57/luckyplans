---
title: What is LuckyPlans?
sidebar_label: What is LuckyPlans?
---

# What is LuckyPlans?

LuckyPlans is a research and operations platform for perpetual DEX trading workflows.

Today, the real product combines:

- perpetual DEX analytics
- copy-trading research
- deterministic backtesting and walk-forward simulation
- trader discovery and historical trade analysis
- multi-platform and multi-chain research

It is designed to help operators move from raw trader history to structured evaluation:

- inspect leader performance on supported perp venues
- compare leaders by platform and date range
- create live plans for follower execution
- create manual and auto simulation plans
- compare follower and leader outcomes before live action

## Who it is for

- trading operators researching leaders and follower configurations
- protocol or platform teams validating trading behavior on specific venues
- contributors extending platform adapters, chains, and contract metadata
- reviewers who need to understand how simulations, historical indexing, and live execution differ

## What it helps with

- ranking leaders by historical behavior
- investigating positions and realized PnL history
- testing default-copy and reverse-copy ideas
- selecting leader candidates from quantitative filters such as trade count, R², slope, and leverage
- comparing simulated follower outcomes against leader results

## What it is not

LuckyPlans is not a promise engine, not a magic trading bot, and not a guarantee of execution quality across all venues.

It is also not the same thing as:

- guaranteed live profitability
- financial advice
- a replacement for due diligence on liquidity, fees, slippage, or market structure
- a proof that a historical leader will perform the same way in the future

> LuckyPlans is not financial advice. LuckyPlans does not guarantee trading profit. LuckyPlans is a research and simulation system.

## Current implementation note

The current product implementation referenced by this documentation lives in the split repos `lucky-plan-fe` and `lucky-plan-be`, mirrored locally under `../alpha/fe` and `../alpha/be`.
