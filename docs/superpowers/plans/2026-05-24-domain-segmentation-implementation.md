# Domain Segmentation (app/api/admin + legacy v0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move production routing from single-host path-based ingress to host-based domains (`app`, `api`, `admin`) while preserving auth/session behavior and keeping legacy `v0.api` on an external backend that is fronted by cluster ingress.

**Architecture:** Keep the existing single luckyplans Helm chart, but evolve it to render multi-host ingress rules and per-host TLS entries. Update prod values for new public hostnames, align Keycloak issuer/hostname with `admin` host, and update ArgoCD/Grafana ingress hostnames. Keep local defaults backward compatible.

**Tech Stack:** Helm templates, Kubernetes Ingress (Traefik), cert-manager, ArgoCD Helm values, Next.js build args

---

## File Structure

- Modify: `infrastructure/helm/luckyplans/values.yaml`
- Modify: `infrastructure/helm/luckyplans/values.prod.yaml`
- Modify: `infrastructure/helm/luckyplans/templates/ingress.yaml`
- Modify: `infrastructure/helm/luckyplans/templates/keycloak/deployment.yaml`
- Modify: `infrastructure/argocd/values-prod.yaml`
- Modify: `infrastructure/helm/observability/values.prod.yaml`
- Modify: `apps/web/content/architecture/helm-deployment.mdx`
- Modify: `apps/web/content/architecture/tls-certificates.mdx`

### Task 1: Add Multi-Host Ingress Value Model (Backward Compatible)

**Files:**
- Modify: `infrastructure/helm/luckyplans/values.yaml`
- Modify: `infrastructure/helm/luckyplans/values.prod.yaml`

- [ ] **Step 1: Add new host map fields to base values**

```yaml
# values.yaml (under ingress:)
ingress:
  enabled: true
  className: traefik
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web
  host: '' # deprecated compatibility key (keep for now)
  hosts:
    app: ''
    api: ''
    admin: ''
  tls:
    enabled: false
    secretName: '' # deprecated compatibility key (keep for now)
    secrets:
      app: ''
      api: ''
      admin: ''
```

- [ ] **Step 2: Add prod host and TLS values**

```yaml
# values.prod.yaml (under ingress:)
ingress:
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web,websecure
    traefik.ingress.kubernetes.io/router.tls: 'true'
    traefik.ingress.kubernetes.io/router.middlewares: luckyplans-redirect-https@kubernetescrd,luckyplans-hsts-header@kubernetescrd
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    app: app.luckyplans.xyz
    api: api.luckyplans.xyz
    admin: admin.luckyplans.xyz
  tls:
    enabled: true
    secrets:
      app: app-luckyplans-tls
      api: api-luckyplans-tls
      admin: admin-luckyplans-tls
```

- [ ] **Step 3: Validate YAML shape locally**

Run: `helm lint infrastructure/helm/luckyplans -f infrastructure/helm/luckyplans/values.yaml -f infrastructure/helm/luckyplans/values.prod.yaml`  
Expected: `0 chart(s) failed`

- [ ] **Step 4: Commit**

```bash
git add infrastructure/helm/luckyplans/values.yaml infrastructure/helm/luckyplans/values.prod.yaml
git commit -m "chore(infra): add multi-host ingress values for app api admin"
```

### Task 2: Render Multi-Host Ingress Rules and TLS

**Files:**
- Modify: `infrastructure/helm/luckyplans/templates/ingress.yaml`

- [ ] **Step 1: Write failing template assertion (dry-run)**

Run: `helm template luckyplans infrastructure/helm/luckyplans -f infrastructure/helm/luckyplans/values.yaml -f infrastructure/helm/luckyplans/values.prod.yaml | rg "host: (app|api|admin)\\.luckyplans\\.xyz"`  
Expected: no matches before template change

- [ ] **Step 2: Implement multi-host ingress template**

```yaml
# ingress.yaml pattern to implement:
spec:
  tls:
    - hosts: [{{ .Values.ingress.hosts.app | quote }}]
      secretName: {{ .Values.ingress.tls.secrets.app | quote }}
    - hosts: [{{ .Values.ingress.hosts.api | quote }}]
      secretName: {{ .Values.ingress.tls.secrets.api | quote }}
    - hosts: [{{ .Values.ingress.hosts.admin | quote }}]
      secretName: {{ .Values.ingress.tls.secrets.admin | quote }}
  rules:
    - host: {{ .Values.ingress.hosts.app | quote }}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend: { service: { name: web, port: { number: 3000 } } }
    - host: {{ .Values.ingress.hosts.api | quote }}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend: { service: { name: api-gateway, port: { number: 3001 } } }
    - host: {{ .Values.ingress.hosts.admin | quote }}
      http:
        paths:
          - path: /realms
            pathType: Prefix
            backend: { service: { name: keycloak, port: { number: 80 } } }
          - path: /resources
            pathType: Prefix
            backend: { service: { name: keycloak, port: { number: 80 } } }
          - path: /admin
            pathType: Prefix
            backend: { service: { name: keycloak, port: { number: 80 } } }
          - path: /js
            pathType: Prefix
            backend: { service: { name: keycloak, port: { number: 80 } } }
```

- [ ] **Step 3: Preserve local compatibility**

```yaml
# Keep fallback branch:
# if ingress.hosts.* are empty, render current host/path rule behavior using ingress.host
# and ingress.tls.secretName.
```

- [ ] **Step 4: Re-run template validation**

Run: `helm template luckyplans infrastructure/helm/luckyplans -f infrastructure/helm/luckyplans/values.yaml -f infrastructure/helm/luckyplans/values.prod.yaml | rg "host: (app|api|admin)\\.luckyplans\\.xyz"`  
Expected: 3 matches

- [ ] **Step 5: Commit**

```bash
git add infrastructure/helm/luckyplans/templates/ingress.yaml
git commit -m "feat(infra): route app api admin traffic by host in ingress"
```

### Task 3: Align Gateway/Auth/Public Host Settings

**Files:**
- Modify: `infrastructure/helm/luckyplans/values.prod.yaml`
- Modify: `infrastructure/helm/luckyplans/templates/keycloak/deployment.yaml`

- [ ] **Step 1: Set auth/cors/graphql production endpoints**

```yaml
# values.prod.yaml
config:
  corsOrigin: 'https://app.luckyplans.xyz'
  keycloakIssuer: 'https://admin.luckyplans.xyz/realms/luckyplans'
  keycloakJwksUri: 'https://admin.luckyplans.xyz/realms/luckyplans/protocol/openid-connect/certs'
web:
  buildArgs:
    graphqlUrl: 'https://api.luckyplans.xyz/graphql'
```

- [ ] **Step 2: Set KC_HOSTNAME from admin host**

```yaml
# keycloak/deployment.yaml
{{- if .Values.ingress.hosts.admin }}
- name: KC_HOSTNAME
  value: {{ printf "https://%s" .Values.ingress.hosts.admin | quote }}
{{- else if .Values.ingress.host }}
- name: KC_HOSTNAME
  value: {{ printf "https://%s" .Values.ingress.host | quote }}
{{- else }}
- name: KC_HOSTNAME_STRICT
  value: "false"
{{- end }}
```

- [ ] **Step 3: Validate rendered key env values**

Run: `helm template luckyplans infrastructure/helm/luckyplans -f infrastructure/helm/luckyplans/values.yaml -f infrastructure/helm/luckyplans/values.prod.yaml | rg "KC_HOSTNAME|KEYCLOAK_ISSUER|KEYCLOAK_JWKS_URI|graphqlUrl"`  
Expected: `admin.luckyplans.xyz` and `api.luckyplans.xyz/graphql` present

- [ ] **Step 4: Commit**

```bash
git add infrastructure/helm/luckyplans/values.prod.yaml infrastructure/helm/luckyplans/templates/keycloak/deployment.yaml
git commit -m "feat(auth): align keycloak issuer and web graphql url with split domains"
```

### Task 4: Move Admin Tooling Hosts (ArgoCD and Grafana)

**Files:**
- Modify: `infrastructure/argocd/values-prod.yaml`
- Modify: `infrastructure/helm/observability/values.prod.yaml`

- [ ] **Step 1: Update ArgoCD ingress hostname/TLS hosts**

```yaml
# infrastructure/argocd/values-prod.yaml
server:
  ingress:
    hostname: admin.luckyplans.xyz
    path: /argocd
    extraTls:
      - secretName: argocd-prod-tls
        hosts:
          - admin.luckyplans.xyz
```

- [ ] **Step 2: Update Grafana ingress host**

```yaml
# infrastructure/helm/observability/values.prod.yaml
grafana:
  ingress:
    enabled: true
    host: admin.luckyplans.xyz
```

- [ ] **Step 3: Render observability chart and verify host**

Run: `helm template observability infrastructure/helm/observability -f infrastructure/helm/observability/values.yaml -f infrastructure/helm/observability/values.prod.yaml | rg "host: admin\\.luckyplans\\.xyz"`  
Expected: match in grafana ingress

- [ ] **Step 4: Commit**

```bash
git add infrastructure/argocd/values-prod.yaml infrastructure/helm/observability/values.prod.yaml
git commit -m "chore(infra): move argocd and grafana under admin domain"
```

### Task 5: Update Architecture Docs for New Domain Model

**Files:**
- Modify: `apps/web/content/architecture/helm-deployment.mdx`
- Modify: `apps/web/content/architecture/tls-certificates.mdx`

- [ ] **Step 1: Update host/domain tables and examples**

```mdx
Replace `luckyplans.xyz` single-host references with:
- app.luckyplans.xyz (web)
- api.luckyplans.xyz (api)
- admin.luckyplans.xyz (keycloak/argocd/grafana)
- v0.api.luckyplans.xyz (legacy external backend; routed via cluster ingress)
```

- [ ] **Step 2: Update TLS doc DNS requirements**

```mdx
Add A record requirements for app/api/admin hostnames and note that v0.api uses an external backend through cluster ingress.
```

- [ ] **Step 3: Verify docs build checks via repo gates**

Run: `pnpm lint && pnpm type-check && pnpm build && pnpm format:check`  
Expected: all commands pass

- [ ] **Step 4: Commit**

```bash
git add apps/web/content/architecture/helm-deployment.mdx apps/web/content/architecture/tls-certificates.mdx
git commit -m "docs(architecture): document app api admin domain split"
```

### Task 6: Final Verification and Release Readiness

**Files:**
- Modify: none (verification only)

- [ ] **Step 1: Render luckyplans chart with prod values**

Run: `helm template luckyplans infrastructure/helm/luckyplans -f infrastructure/helm/luckyplans/values.yaml -f infrastructure/helm/luckyplans/values.prod.yaml > /tmp/luckyplans-rendered.yaml`  
Expected: render succeeds

- [ ] **Step 2: Assert key hostnames in rendered output**

Run: `rg "app\\.luckyplans\\.xyz|api\\.luckyplans\\.xyz|admin\\.luckyplans\\.xyz" /tmp/luckyplans-rendered.yaml`  
Expected: all three hostnames present in ingress/tls/env sections

- [ ] **Step 3: Run required repo validation suite**

Run: `pnpm lint && pnpm type-check && pnpm build && pnpm format:check`  
Expected: all pass

- [ ] **Step 4: Prepare DNS/runtime cutover checklist**

```md
- Point app/api/admin DNS A records to ingress public IP
- Point v0.api DNS to the same ingress IP (legacy backend is reached via ingress -> ExternalName service)
- Validate https://app.luckyplans.xyz
- Validate https://api.luckyplans.xyz/health and /graphql
- Validate login flow with issuer https://admin.luckyplans.xyz/realms/luckyplans
- Validate https://admin.luckyplans.xyz/argocd
- Validate https://admin.luckyplans.xyz/grafana
```

- [ ] **Step 5: Commit final verification artifacts (if any)**

```bash
# Usually no file changes; if checklist is saved in docs, commit it.
git status
```

## Self-Review

- Spec coverage: all approved requirements are mapped to tasks (routing, TLS, auth alignment, ArgoCD/Grafana host migration, docs, validation, legacy v0 external handling).
- Placeholder scan: no TODO/TBD placeholders included.
- Type consistency: ingress keys are consistent across tasks (`ingress.hosts.app|api|admin`, `ingress.tls.secrets.*`).
