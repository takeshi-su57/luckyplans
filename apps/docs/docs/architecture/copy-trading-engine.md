---
title: Copy-Trading Engine
sidebar_label: Copy-Trading Engine
---

# Copy-Trading Engine

LuckyPlans combines historical research with live copy-trading workflows. The live engine and the simulation engine share concepts, but they should not be treated as the same operational mode.

## Supported copy styles

### Default copy

Follower actions aim to mirror the leader's direction and timing as closely as the configured workflow allows.

### Reverse copy

Follower logic intentionally inverts the leader's direction. The current backend also uses reversed mode in simulation workflows.

### Filtered copy

Leader selection or automation setup can be filtered by research signals such as trade count, R², slope, leverage, or platform scope.

### Risk-capped copy

Follower strategy settings can constrain behavior through collateral, leverage, max open missions, or similar risk boundaries.

### Ratio-based copy

The model supports a `ratio` concept for scaling follower behavior relative to a leader.

### Collateral-based copy

Follower exposure can also be interpreted through collateral sizing rather than simple one-to-one mirroring.

## Why follower results differ from leader results

- different position sizing rules
- leverage caps
- collateral constraints
- slippage and execution timing
- venue-specific behavior
- contract version differences
- mission and task lifecycle differences
- reverse-copy mode

## Research signals used in the product

- Trend
- Slope
- R²
- Sample size
- Win rate
- PnL quality
- Drawdown
- Leverage
- Average collateral
- Position duration

## Copy-trading score caveat

Any copy-trading score or ranking should be treated as a research signal, not a guarantee. Good historical behavior can still fail under new market conditions, contract changes, or thin liquidity.
