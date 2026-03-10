# Functional Decomposition over Domain-Driven Services

**Date:** 2026-03-10
**Status:** accepted

## Context

As the system grows, we need a strategy for how to split functionality across microservices. The two main approaches are:

1. **Domain decomposition (DDD)** — one microservice per domain (service-orders, service-users, service-payments)
2. **Functional decomposition** — services split by what they do (service-core for CRUD, service-trading for trading logic)

## Decision

We chose functional decomposition. `service-core` handles generic CRUD operations for all domain entities. New microservices are only created when functionality has complex business logic that justifies isolation (e.g., trading engine).

Domain entity types and DTOs are defined in `packages/shared`, not in individual services.

## Consequences

- **Easier:** Adding new entities is simple — just extend service-core. No new deployable needed.
- **Easier:** Shared types mean no data duplication or mapping between services.
- **Harder:** service-core could become a monolith over time — must be disciplined about extracting complex logic.
- **Harder:** Cannot scale individual domains independently (all CRUD scales together).
