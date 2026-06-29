---
title: Security Model
sidebar_label: Security Model
---

# Security Model

LuckyPlans mixes public docs, private product workflows, on-chain analysis, and execution-adjacent behavior. That means security has to be explained in terms of boundaries, not slogans.

## Trust boundaries

- public readers can access landing and docs
- product users interact with separate frontend and backend surfaces
- backend workers interact with Redis, PostgreSQL, and RPC providers
- platform contracts and chains are external systems and cannot be assumed stable

## User safety

- research and simulation should be read as decision support, not financial advice
- copy-trading and follower execution can produce different outcomes from leader history
- users should treat official-link verification as part of basic operational hygiene

## Official communication

Official domains and repositories are listed in the security section of this docs site. Users should distrust unsolicited support requests, wallet prompts, and clone repositories that are not on the official list.

## Secrets handling

Current repos show several patterns:

- backend local setup uses `.env.sample`
- beta infrastructure uses Kubernetes Secrets and Sealed Secrets
- production-like Helm config expects sealed values for sensitive settings

Secrets should never be committed in plaintext outside explicitly local-only development defaults.

## Simulation vs live execution boundary

This is one of the most important product boundaries:

- simulation is for replay and evaluation
- live execution is for actual task and mission flow
- historical success in simulation does not guarantee safe or profitable live behavior

## Future improvements

- signed announcements
- security checklist
- public disclosure policy
- release verification

Some of these are partially documented today and some still need a more formal workflow.
