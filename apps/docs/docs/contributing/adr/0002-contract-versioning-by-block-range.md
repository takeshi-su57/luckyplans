---
title: ADR 0002 Contract Versioning by Block Range
sidebar_label: ADR 0002 Contract Versioning by Block Range
---

# ADR 0002: Contract Versioning by Block Range

## Status

Accepted

## Context

Perp venues evolve over time. A platform can change addresses, event shapes, or logic across versions, and historical parsing must remain correct.

## Decision

Track contract applicability through platform, chain ID, address, version, `fromBlock`, and optional `toBlock`.

## Consequences

- historical parsing stays tied to the right contract version
- indexing and simulation can replay the correct historical range
- maintainers must manage block boundaries carefully

## Alternatives considered

- one active contract per platform with no history awareness
- version-only metadata without explicit block ranges
- parser selection inferred from timestamps alone
