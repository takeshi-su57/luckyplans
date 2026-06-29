---
title: Create a Simulation
sidebar_label: Create a Simulation
---

# Create a Simulation

The current frontend includes real simulation routes for:

- `/simulations`
- `/simulations/create`
- `/simulations/create-plan`
- `/simulations/auto/[simulationId]`
- `/simulations/[simulationPlanId]`
- `/simulations/research/[researchId]`

## Typical workflow

1. Open the simulations area.
2. Choose auto simulation or manual plan creation.
3. Select a platform.
4. Select leader configuration.
5. Generate plans or create simulation bots.
6. Run the simulation.
7. Review aggregate metrics.
8. Compare charts, plans, and per-bot summaries.

## Auto simulation inputs reflected in the backend

- platform
- date range
- direction
- selected leader count
- minimum and maximum trades
- minimum and maximum R²
- minimum and maximum slope
- maximum leverage
- standard collateral in USD

## Review carefully

- follower PnL vs leader PnL
- total net PnL
- drawdown
- trade count
- cost
- distribution of outcomes across simulation plans and bots

## Important caution

Simulation is a research mode. It should inform decisions, not replace judgment about liquidity, slippage, fee structure, or live operational risk.
