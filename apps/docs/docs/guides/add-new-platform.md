---
title: Add New Platform
sidebar_label: Add New Platform
---

# Add New Platform

Use this workflow when adding support for a new perp venue to the current backend.

## Practical steps

1. Add or extend platform config under `../alpha/be/src/web3/platform`.
2. Add chain support for the venue's deployment targets.
3. Add contract metadata with platform, chain ID, address, version, status, `fromBlock`, and optional `toBlock`.
4. Implement parser logic for the platform's trading events.
5. Normalize event output into the shapes expected by leaderboard and task workflows.
6. Add tests for parser behavior and transformation logic where possible.
7. Verify leaderboard output for the platform.
8. Verify simulation compatibility against indexed history from that platform.

## What to update

- Prisma seed or contract-management path
- platform adapter code
- parser or ABI files
- any frontend platform enum or selector handling
- docs and operational runbooks

## Definition of done

- historical indexing succeeds
- contract adaption status is visible
- leaderboard queries return useful data
- `getPerpTradePositions` works for the new platform
- simulation creation and detail views can use the new platform

<!-- TODO: add a fully worked example once a fourth platform is introduced in production code. -->
