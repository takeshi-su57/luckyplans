---
title: Add New Contract Version
sidebar_label: Add New Contract Version
---

# Add New Contract Version

The current backend uses contract metadata to decide which parser and range should be applied to historical logs.

## Required fields

- Platform
- Chain ID
- Contract address
- Version label
- Start block
- End block if deprecated
- Description

## Rules

- if `endBlock` is empty, the contract is considered active
- if deprecated, set `endBlock` to the last valid block
- version, address, chain, and platform must remain internally consistent
- do not overlap active historical ranges without a deliberate migration strategy

## Why this matters

Bad version boundaries can break:

- event parsing
- leaderboard continuity
- historical PnL interpretation
- simulation replay accuracy

## Current schema note

The backend `Contract` model already includes:

- `chainId`
- `address`
- `platform`
- `version`
- `fromBlock`
- `toBlock`
- `status`
