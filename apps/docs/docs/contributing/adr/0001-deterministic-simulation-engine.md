---
title: ADR 0001 Deterministic Simulation Engine
sidebar_label: ADR 0001 Deterministic Simulation Engine
---

# ADR 0001: Deterministic Simulation Engine

## Status

Accepted

## Context

LuckyPlans needs simulation behavior that is explainable, reviewable, and tied to stored historical inputs rather than opaque one-off calculations.

## Decision

Model simulations as first-class persisted records with explicit plans, bot-level detail, cached summaries, and historical input dependence.

## Consequences

- simulation runs become easier to inspect
- plan and bot results can be revisited later
- schema and cache complexity increase
- users may over-trust output if docs do not clearly explain limitations

## Alternatives considered

- stateless simulation results computed only in memory
- spreadsheet-only or export-only research workflow
- a completely separate simulation stack with no shared domain concepts
