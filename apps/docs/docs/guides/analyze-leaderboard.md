---
title: Analyze Leaderboard
sidebar_label: Analyze Leaderboard
---

# Analyze Leaderboard

The current frontend exposes leaderboard flows at:

- `/leaderboards`
- `/leaderboards/analyze`

## What to review

- platform selector
- date picker or historical window
- filtering options
- expert or leader labels
- PnL behavior
- activity level
- leverage profile
- duration profile
- consistency over time

## Practical workflow

1. Start with the platform you care about.
2. Narrow to the historical range relevant to your research.
3. Compare leaders with enough sample size to matter.
4. Inspect trade-position details, not just top-line PnL.
5. Watch for unstable leverage, very short histories, or sudden regime shifts.
6. Run deeper simulations before treating a leaderboard result as meaningful.

## When to run a deeper simulation

- when a leader looks strong on headline PnL but weak on drawdown
- when sample size is small
- when platform behavior changed across contract versions
- when reverse-copy behavior may outperform default-copy behavior
