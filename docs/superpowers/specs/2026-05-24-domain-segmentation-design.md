# Domain Segmentation Design (app/api/admin + legacy v0)

Date: 2026-05-24  
Status: Approved for planning

## 1. Problem Statement

LuckyPlans production ingress is currently path-based on a single host (`luckyplans.xyz`). This couples frontend, API, and admin surfaces under one domain and increases operational/auth complexity.

We want explicit domain boundaries:

- `api.luckyplans.xyz` for API gateway traffic
- `app.luckyplans.xyz` for web app traffic
- `admin.luckyplans.xyz` for cluster-admin/ops surfaces (Keycloak, ArgoCD, Grafana)
- `v0.api.luckyplans.xyz` for a legacy app hosted outside this k3d cluster

## 2. Goals and Non-Goals

### Goals

- Move from path-based single-host ingress to host-based domain segmentation in production.
- Preserve current gateway-managed auth/session architecture.
- Keep local/k3d developer flow working without requiring public DNS.
- Keep GitOps compatibility with ArgoCD-managed prod sync.

### Non-Goals

- Replatforming legacy `v0.api` service into this cluster.
- Introducing new ingress controllers or service mesh.
- Broad refactors unrelated to ingress/domain routing.

## 3. Current State Summary (from repo)

- `infrastructure/helm/luckyplans/templates/ingress.yaml` defines one Ingress with a single optional host and path routing.
- `infrastructure/helm/luckyplans/values.prod.yaml` currently sets `ingress.host: luckyplans.xyz`.
- API and web are split by path (`/graphql`, `/auth`, `/uploads`, `/`), not by domain.
- Keycloak public issuer/JWKS in prod values currently reference `https://luckyplans.xyz/...`.
- ArgoCD prod ingress currently uses `hostname: luckyplans.xyz` with `path: /argocd`.

## 4. Proposed Architecture

### 4.1 Domain Mapping

- `app.luckyplans.xyz` -> `web` service
- `api.luckyplans.xyz` -> `api-gateway` service
- `admin.luckyplans.xyz` -> Keycloak + ArgoCD + Grafana via path routing on admin host
- `v0.api.luckyplans.xyz` -> external legacy host (DNS outside this repo-managed cluster)

### 4.2 Ingress Strategy

Recommended approach: keep a single Helm ingress template but support multi-host rules in values.

Rationale:

- Minimal change surface and safer rollout under existing chart/ArgoCD flow.
- Easy incremental migration from current host/path model.
- Can later split into multiple ingress templates if ownership boundaries require it.

### 4.3 TLS Strategy

Use HTTPS for all public hosts with cert-manager.

Preferred certificate approach:

- Separate TLS secrets per host (`app`, `api`, `admin`) to reduce blast radius.
- Keep cert-manager `ClusterIssuer` (`letsencrypt-prod`) unchanged.

## 5. Configuration Changes

### 5.1 Helm Values Model (luckyplans chart)

Add host map to values:

- `ingress.hosts.app`
- `ingress.hosts.api`
- `ingress.hosts.admin`

Keep existing local behavior backward compatible (empty hosts can still render host-agnostic routing for local).

### 5.2 Ingress Rules

Production intent:

- Host `app...`: route `/` to `web:3000`.
- Host `api...`: route API paths (or `/`) to `api-gateway:3001`.
- Host `admin...`: route Keycloak paths (`/realms`, `/resources`, `/admin`, `/js`) to `keycloak:80`.

Note: ArgoCD and Grafana ingress objects are chart-specific outside this template and must be updated separately to `admin` host.

### 5.3 Gateway/Auth Config

Update `infrastructure/helm/luckyplans/values.prod.yaml`:

- `config.corsOrigin: https://app.luckyplans.xyz`
- `config.keycloakIssuer: https://admin.luckyplans.xyz/realms/luckyplans`
- `config.keycloakJwksUri: https://admin.luckyplans.xyz/realms/luckyplans/protocol/openid-connect/certs`

Keep `config.keycloakAdminUrl: http://keycloak` for internal service-to-service calls unless a public callback requirement is introduced.

### 5.4 Keycloak Hostname

`templates/keycloak/deployment.yaml` currently derives `KC_HOSTNAME` from single ingress host.

Change behavior to derive from admin host so token issuer (`iss`) stays aligned with gateway verification config.

### 5.5 Web GraphQL Endpoint

`web.buildArgs.graphqlUrl` is baked at image build time.

For split domains, set prod build arg to absolute API endpoint:

- `https://api.luckyplans.xyz/graphql`

A web image rebuild is required before deployment for this to take effect.

### 5.6 ArgoCD and Observability Hostnames

- Update ArgoCD prod values (`infrastructure/argocd/values-prod.yaml`):
  - `hostname: admin.luckyplans.xyz`
  - keep path `/argocd` (or revise consistently if desired)
- Update Grafana ingress host (observability chart) to `admin.luckyplans.xyz`, with `/grafana` path or dedicated root policy.

## 6. DNS and External Routing

Required DNS records:

- `app.luckyplans.xyz` -> cluster ingress public IP
- `api.luckyplans.xyz` -> cluster ingress public IP
- `admin.luckyplans.xyz` -> cluster ingress public IP
- `v0.api.luckyplans.xyz` -> legacy host IP/CNAME (outside k3d)

`v0.api` is intentionally not routed by this Helm chart.

## 7. Rollout Plan

1. Add multi-host ingress/value support in luckyplans chart (backward compatible).
2. Update prod values for app/api/admin host mapping and gateway auth config.
3. Update ArgoCD and Grafana ingress host config to `admin` domain.
4. Rebuild/publish web image with absolute GraphQL URL (`api` domain).
5. Merge and let ArgoCD sync.
6. Cut DNS records.
7. Validate end-to-end flows.

## 8. Verification Plan

### 8.1 Required Repository Gates

- `pnpm lint`
- `pnpm type-check`
- `pnpm build`
- `pnpm format:check`

### 8.2 Runtime Smoke Verification

- `https://app.luckyplans.xyz` loads web app.
- `https://api.luckyplans.xyz/health` returns healthy response.
- GraphQL query works on `https://api.luckyplans.xyz/graphql`.
- Auth flow succeeds with Keycloak issuer under `https://admin.luckyplans.xyz/realms/luckyplans`.
- `https://admin.luckyplans.xyz/argocd` reachable.
- Grafana reachable on chosen `admin` path/route.

## 9. Risks and Mitigations

- Issuer mismatch risk: if `KC_HOSTNAME`, `KEYCLOAK_ISSUER`, and JWKS URL diverge, login fails.
  - Mitigation: deploy config changes atomically and validate token `iss`.
- DNS propagation risk during cutover.
  - Mitigation: lower TTL before migration and validate each host after propagation.
- Frontend stale endpoint risk if image is not rebuilt.
  - Mitigation: enforce rebuild when `web.buildArgs.graphqlUrl` changes.

## 10. Alternatives Considered

1. Single ingress with multi-host rules (selected)
- Pros: minimal churn, safer migration, simpler GitOps transition.
- Cons: one template carries multiple concerns.

2. Separate ingress template per host/surface
- Pros: cleaner ownership boundaries long-term.
- Cons: more chart complexity and migration overhead now.

3. Keep single host + redirects
- Pros: least immediate change.
- Cons: preserves coupling and domain ambiguity.

## 11. Acceptance Criteria

- Production routes `app`, `api`, and `admin` via dedicated hostnames.
- Keycloak issuer and gateway verification use `admin` hostname without auth regressions.
- Web frontend calls API through `api` hostname successfully.
- ArgoCD and Grafana are reachable on `admin` hostname.
- Legacy `v0.api` continues serving from external host and does not route through this cluster.
