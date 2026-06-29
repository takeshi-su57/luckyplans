---
title: Core Concepts
sidebar_label: Core Concepts
---

# Core Concepts

## Plan

A plan is the main live-trading container in the current product. It groups follower automations, time windows, and lifecycle state such as `Created`, `Started`, `Stopped`, and `Finished`.

## Simulation

A simulation is a historical replay workflow that evaluates follower behavior against past leader actions. In the current backend, simulations are first-class records with platform, date range, progress state, and aggregate metrics.

## Leader

A leader is the trader address being researched or copied. Leader behavior is discovered from indexed historical perp trading events.

## Follower

A follower is the account or managed execution target used to mirror or transform a leader's behavior. Followers have their own balances, contract scope, and risk settings.

## Default Copy

Default copy means the follower attempts to mirror the leader's direction and actions as closely as the configured workflow allows.

## Reverse Copy

Reverse copy means the follower intentionally takes the opposite direction of the leader. The current simulation model explicitly supports reversed direction as a first-class mode.

## Drawdown

Drawdown is the decline from a prior equity or PnL peak. In simulation review it helps show pain, not just ending profit.

## Profit Factor

Profit factor compares gross gains to gross losses. It is a quality signal, not a guarantee of future performance.

## R²

R² is used as a research signal for trend fit or consistency. In LuckyPlans it appears in simulation selection ranges and should be read as one filter among many.

## Slope

Slope is used as a directional trend signal in leader research and simulation selection. A higher slope can indicate stronger historical trend growth, but it is still context-dependent.

## Platform

A platform is the perp venue or product family being indexed or simulated, such as `GNS`, `GMX`, or `AVNT`.

## Chain

A chain is the underlying network for a platform deployment, such as Polygon, Base, Arbitrum, Ethereum mainnet, or Avalanche.

## Contract Version

A contract version is the platform-specific on-chain contract definition that applies for a historical range. The backend tracks version alongside chain, address, platform, and block boundaries so event parsing stays correct over time.
