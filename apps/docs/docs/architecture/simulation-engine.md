---
title: Simulation Engine
sidebar_label: Simulation Engine
---

# Simulation Engine

The current LuckyPlans backend treats simulation as a first-class product workflow.

It supports:

- simulation records
- simulation plans
- simulation bots
- leader selection records
- plan and bot cache models for faster detail views

## Goals

- evaluate leader behavior on historical data
- compare default-copy and reverse-copy style outcomes
- keep simulation reproducible enough for research workflows
- reuse domain concepts that operators already understand from live plans

## Simulation lifecycle

1. Create a simulation or simulation research record.
2. Define platform, time range, and selection filters.
3. Generate one or more simulation plans.
4. Attach simulation bots for selected leaders.
5. Replay relevant historical events over the selected range.
6. Compute aggregate follower and leader outputs.
7. Review details through simulation overview and per-plan views in the frontend.

## Determinism

The backend stores explicit simulation inputs and persists simulation state through records such as:

- `Simulation`
- `SimulationPlan`
- `SimulationBot`
- `SimulationPlanCache`
- `SimulationBotCache`

That structure is designed to reduce ambiguity about what was simulated, over which date window, and against which historical records.

Determinism here should be read as:

- same stored historical inputs
- same plan configuration
- same replay logic

not as a promise that every future market condition can be predicted.

## Key metrics

The current implementation exposes or derives metrics including:

- Net PnL
- Follower PnL
- Leader PnL
- Max Drawdown
- Trades
- Win Rate
- Profit Factor
- Cost

It also tracks research-oriented filters such as:

- selected leader count
- min and max trades
- min and max R²
- min and max slope
- max leverage
- standard collateral in USD

## Limitations

- simulations depend on historical data quality
- results do not guarantee future performance
- slippage, liquidity, fees, and timing assumptions must be reviewed carefully
- partial or delayed indexing can distort comparisons
- different venues and contract versions can produce different behavior even with similar top-line metrics
