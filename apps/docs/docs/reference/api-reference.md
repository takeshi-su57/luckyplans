---
title: API Reference
sidebar_label: API Reference
---

# API Reference

The current product API is GraphQL-first and exposed by the backend `API_SERVICE`.

## Main characteristics

- NestJS GraphQL server
- decorator-driven schema generation
- Apollo-compatible frontend usage
- websocket subscriptions for live UI updates
- Prisma-backed persistence

## Main product areas covered by the API

- auth and user management
- contracts and adaption status
- plans, bots, missions, and tasks
- followers and strategy settings
- trade histories and leaderboards
- simulations and simulation research
- logs and operational state

## Current source of truth

- backend schema output: `../alpha/be/src/schema.gql`
- frontend mirror: `../alpha/fe/schema.graphql`

For the most useful surface summary, see the GraphQL reference page in this docs section.
