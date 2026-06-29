---
title: Coding Standards
sidebar_label: Coding Standards
---

# Coding Standards

## Backend

- keep business logic in services
- keep GraphQL resolver layers thin
- keep platform-specific logic under platform adapter directories
- respect Prisma as the persistence contract
- prefer explicit state transitions for plans, missions, tasks, and simulations

## Frontend

- keep GraphQL operations aligned with the published schema
- preserve role-based and workflow-based UI boundaries
- document env requirements instead of hiding them in source-only knowledge

## Docs

- prefer current-state wording over roadmap language
- use TODO comments when exact implementation detail is unknown
- avoid hype or certainty claims
