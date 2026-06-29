---
title: Error Codes
sidebar_label: Error Codes
---

# Error Codes

LuckyPlans does not currently publish a formal cross-service error-code catalog in the product repos.

## What exists today

- GraphQL errors from resolver and service failures
- process-state and validation failures
- contract-adaption and indexing failures
- simulation lookup failures such as missing plans or simulations

## Common practical classes

| Class | Meaning |
| --- | --- |
| Not found | Requested plan, simulation, bot, or contract does not exist |
| Validation error | Input shape or state transition is invalid |
| Infrastructure error | Redis, Postgres, RPC, or websocket connectivity issue |
| Adaption error | contract indexing or platform parsing could not proceed |
| Simulation error | historical data or plan generation could not be completed safely |

<!-- TODO: promote repeated backend error strings into a stable published catalog if API consumers outside the first-party frontend need stronger contracts. -->
