# [Chore]: Setup Monorepo Foundation (Frontend + Backend Microservices)

**Labels:** `enhancement`, `priority:high`

## Description

Establish a scalable monorepo foundation that supports frontend application(s), backend services, microservice architecture, and shared packages.

This is the **parent issue** that tracks the full platform infrastructure setup. It is broken into focused sub-issues to keep work manageable and independently deliverable.

## Sub-Issues

| #   | Issue                                                                       | Status  |
| --- | --------------------------------------------------------------------------- | ------- |
| 1   | [Chore]: Microservice Architecture on Monorepo + Local Dev/Deploy (k3s & Helm) | Pending |
| 2   | [Chore]: Implement CI with GitHub Actions + Verify Dev/Prod Deployment      | Pending |
| 3   | [Chore]: Implement CD with ArgoCD                                           | Pending |

## Motivation

- Centralized code management across frontend and backend
- Shared types and utilities between services
- Cleaner dependency management via pnpm workspaces
- Scalable microservice development with independent deployability
- Production-like local environment via Kubernetes (k3s)
- Solid CI/CD pipeline structure for long-term team collaboration

## Proposed Structure

```
/apps
  /web              (Next.js frontend)
  /api-gateway      (GraphQL gateway / BFF)
  /service-auth     (Auth microservice)
  /service-core     (Core domain service)

/packages
  /ui               (Shared UI components)
  /config           (Shared configs: eslint, tsconfig)
  /shared           (Shared types and utilities)

/infrastructure
  /k8s              (Kubernetes manifests)
  /helm             (Helm charts per service)
  /argocd           (ArgoCD application manifests)

/docs
  /best-practices   (Team conventions)
```

## Scope

### In Scope

- Monorepo tooling setup (Turborepo + pnpm workspaces)
- Workspace and shared TypeScript configuration
- Docker setup for all services
- k3s local cluster with Helm charts
- Ingress and inter-service connectivity
- CI pipeline via GitHub Actions
- CD pipeline via ArgoCD
- Documentation (README, setup guides)

### Out of Scope

- Business logic or feature implementation
- Observability stack (Prometheus, Grafana — separate issue)
- Production cloud provisioning (Terraform, etc.)

## Technical Considerations

- Use consistent Node/TypeScript versions across all workspaces
- Enforce shared linting and formatting rules
- Avoid tight coupling between services
- Ensure services are independently deployable
- Use environment-based configuration — no hardcoded service URLs
- k3s/Helm manifests should be production-aligned where possible

## Acceptance Criteria

- [ ] All sub-issues completed and merged
- [ ] Monorepo structure operational with shared packages
- [ ] Frontend and backend apps boot independently
- [ ] Docker images build successfully for all services
- [ ] Local k3s cluster runs with Helm-managed deployments
- [ ] CI pipeline validates builds, tests, and linting on PRs
- [ ] CD pipeline deploys automatically via ArgoCD
- [ ] Clean documentation covers setup and workflow

## Definition of Done

- All three sub-issues are closed
- End-to-end local development workflow documented and validated
- CI/CD pipelines operational
- Code reviewed and merged to main
