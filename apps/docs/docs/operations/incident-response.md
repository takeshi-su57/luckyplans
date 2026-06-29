---
title: Incident Response
sidebar_label: Incident Response
---

# Incident Response

## Goal

Contain user-facing or operator-facing failures quickly and document what happened.

## When to use

- production outage
- bad deploy
- auth failure
- incorrect historical data
- simulation or copy-trading workflow malfunction

## Prerequisites

- access to logs
- access to deployment state
- access to contract and platform metadata when data quality is involved

## Steps

1. Identify the affected surface: docs, web, API, worker, or historical data.
2. Stop further blast radius if needed.
3. Check current release and infrastructure health.
4. Inspect logs and the most recent related change.
5. Roll back or reconfigure if that is the fastest safe recovery path.
6. Document what failed, what was impacted, and what follow-up is required.

## Verification

- affected user path is restored
- no repeated crash loops
- follow-up reindex or migration work is scheduled if data correctness was impacted

## Troubleshooting

- separate availability problems from data-correctness problems
- treat simulation and live-execution incidents differently
