# Microservice Decision Matrix

This document is the canonical guide for deciding when to:
- extend existing services (`api-gateway` module or `service-core`), or
- create a new microservice (`service-<name>`).

## Core Principle

Default to existing services. Create a new microservice only when workload or operations justify independent deployment and scaling.

## Fast Decision Flow

1. Is this plain CRUD or standard orchestration?
- Yes: extend `service-core` (and gateway module if needed).
- No: continue.

2. Does this feature include CPU-heavy work, cron/scheduled jobs, long-running/background processing, or independent scaling/SLO needs?
- Yes: candidate for new microservice.
- No: extend existing services.

3. Does the team accept platform overhead (Docker, Helm, ArgoCD, CI/CD, observability ownership)?
- Yes: create new microservice.
- No: keep in existing services.

## Decision Matrix

| Criterion | Extend Existing Service | Create New Microservice |
|---|---|---|
| Workload type | CRUD, lightweight request/response | CPU-heavy, long-running, worker-style |
| Scheduling | No cron requirement | Cron/scheduled lifecycle required |
| Scaling | Same profile as current services | Needs independent scaling/HPA profile |
| Reliability/SLO | Shares same SLO | Needs isolated SLO/deploy cadence |
| Operational ownership | No new ops surface | Team accepts full service lifecycle |
| Domain split motivation | Naming/organization only | Functional/performance isolation |

## Required Justification For New Service

A proposal for `service-<name>` must include:
1. Performance reason (CPU-bound, latency shielding, or throughput isolation).
2. Runtime pattern reason (cron/background/long-running jobs).
3. Scaling reason (why independent replicas/resources are required).
4. Operational plan (Docker, Helm values, ArgoCD app path, CI updates, observability).

If any section is missing, do not create a new microservice yet.

## Mapping To Skills

- Use `create-gateway-module` for gateway module creation.
- Use `scaffold-submodule` for adding entity/features to `service-core`.
- Use `scaffold-microservice` only after this matrix indicates a new service is justified.
