---
title: ADR 0003 Platform Adapter Architecture
sidebar_label: ADR 0003 Platform Adapter Architecture
---

# ADR 0003: Platform Adapter Architecture

## Status

Accepted

## Context

GNS, GMX, and AVNT do not emit identical logs or trading semantics. A single generic parser would make correctness harder to preserve.

## Decision

Keep platform-specific ABI, config, and parser logic in dedicated adapter directories under the shared web3 layer.

## Consequences

- platform logic stays easier to reason about
- new platforms can be added incrementally
- shared abstractions should be introduced only when duplication is genuinely stable

## Alternatives considered

- one giant cross-platform parser
- full microservice split by platform
- runtime-only mapping tables with minimal typed adapter code
