---
title: Add New Chain
sidebar_label: Add New Chain
---

# Add New Chain

Adding a chain is usually smaller than adding a new platform, but it still affects contract metadata, RPC routing, and historical interpretation.

## Steps

1. Add chain support in the shared web3 layer.
2. Confirm the platform adapter supports the chain's event and contract behavior.
3. Add or update contract records for the chain-specific deployment.
4. Verify RPC provider coverage and rate-limit expectations.
5. Run indexing against the new chain's contract range.
6. Validate leaderboard and simulation output using real trader history on that chain.

## Watch-outs

- contract addresses differ across chains
- block ranges and deployment timing differ across chains
- the same platform version may still behave differently on another chain
- public RPC reliability can distort indexing behavior
