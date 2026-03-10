# TLS Certificates — cert-manager + Let's Encrypt

## Overview

TLS termination happens at the **Traefik ingress controller**. Certificates are
automatically provisioned and renewed by **cert-manager** using **Let's Encrypt**
ACME HTTP-01 challenges.

## Architecture

```
Browser (HTTPS :443)
  │
  ▼
Traefik (reads TLS cert from K8s Secret)
  │  ← cert-manager creates & renews the Secret automatically
  │
  ▼  (plain HTTP internally)
Pods (api-gateway :3001, web :3000)
```

## How It Works

1. Helm deploys an `Ingress` resource with the annotation
   `cert-manager.io/cluster-issuer: letsencrypt-prod`
2. cert-manager detects the annotation and creates a `Certificate` resource
3. cert-manager requests a certificate from Let's Encrypt via ACME HTTP-01:
   - Let's Encrypt sends a challenge token
   - cert-manager creates a temporary Ingress to serve the token at
     `http://<domain>/.well-known/acme-challenge/<token>`
   - Let's Encrypt verifies ownership and issues the certificate
4. cert-manager stores the certificate in the Kubernetes Secret
   referenced by `ingress.tls.secretName`
5. Traefik picks up the Secret and serves HTTPS
6. cert-manager **auto-renews** ~30 days before expiry (certs last 90 days)

## HTTP to HTTPS Redirect

By default, the Ingress only listens on the `websecure` entrypoint (port 443).
HTTP requests on port 80 are not redirected — they either hit the ACME challenge
solver or return a 404.

To enable automatic HTTP → HTTPS redirect, the Helm chart includes a Traefik
`Middleware` resource (`redirect-https`) that is conditionally deployed when
`ingress.tls.enabled: true`. The Ingress annotations reference both `web` and
`websecure` entrypoints and apply the redirect middleware:

```yaml
ingress:
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web,websecure
    traefik.ingress.kubernetes.io/router.middlewares: luckyplans-redirect-https@kubernetescrd,luckyplans-hsts-header@kubernetescrd
```

If you prefer to handle the redirect at the Traefik level (global redirect for
all Ingresses), configure it in the Traefik static configuration instead. See
[Traefik documentation](https://doc.traefik.io/traefik/routing/entrypoints/#redirection)
for global redirect configuration.

## Configuration

### Base values (`values.yaml`)

```yaml
certManager:
  enabled: false # Disabled for local k3d
  email: ''
  issuer: letsencrypt-prod
```

### Production environment (`values.prod.yaml`)

```yaml
ingress:
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web,websecure
    traefik.ingress.kubernetes.io/router.tls: 'true'
    traefik.ingress.kubernetes.io/router.middlewares: luckyplans-redirect-https@kubernetescrd
    cert-manager.io/cluster-issuer: letsencrypt-prod
  host: 'luckyplans.xyz'
  tls:
    enabled: true
    secretName: luckyplans-tls

certManager:
  enabled: true
  email: 'takeshisuz57@gmail.com'
  issuer: letsencrypt-prod
```

> **Warning:** The `certManager.email` is used by Let's Encrypt to send expiry
> notifications and account recovery. Use a team/ops distribution list
> (e.g. `ops@luckyplans.xyz`) rather than a personal email address to ensure
> continuity if team members change.

## Helm Template

The `ClusterIssuer` is defined in `templates/cluster-issuer.yaml` and is
conditionally rendered when `certManager.enabled: true`. It uses the
`certManager.issuer` value as the resource name and automatically selects
the correct ACME server URL: if the issuer name contains "staging", the
Let's Encrypt staging server is used; otherwise, the production server is
used. This means setting `certManager.issuer: letsencrypt-staging` in your
values file is all that is needed to switch to the staging environment for
testing.

## Prerequisites

cert-manager must be installed **before** deploying the Helm chart.
See [how-to-deploy.md — Install cert-manager](../guides/how-to-deploy.md#install-cert-manager)
for the pinned version and installation commands.

## DNS Requirements

For HTTP-01 challenges to succeed, the domain must resolve to the cluster's
public IP **before** deploying with TLS enabled:

| Record | Name | Value              |
| ------ | ---- | ------------------ |
| A      | `@`  | `<your-server-ip>` |

Port **80** must be reachable from the internet (Let's Encrypt verifies via HTTP).

## Verification

```bash
# 1. Check ClusterIssuer is ready
kubectl get clusterissuer letsencrypt-prod

# 2. Check certificate status
kubectl -n luckyplans get certificate

# 3. Check certificate details
kubectl -n luckyplans describe certificate luckyplans-tls

# 4. Check cert-manager logs if something fails
kubectl -n cert-manager logs deploy/cert-manager --tail=50

# 5. Test HTTPS
curl -v https://luckyplans.xyz
```

## Troubleshooting

| Symptom                            | Likely Cause                   | Fix                                                          |
| ---------------------------------- | ------------------------------ | ------------------------------------------------------------ |
| Certificate stuck at `Issuing`     | DNS not pointing to cluster IP | Verify A records with `dig <domain>`                         |
| HTTP-01 challenge fails            | Port 80 blocked by firewall    | Open port 80 on VPS firewall                                 |
| `ClusterIssuer not found`          | cert-manager not installed     | Install cert-manager (see Prerequisites)                     |
| Certificate issued but Traefik 404 | Entrypoint misconfigured       | Ensure annotation uses `websecure`                           |
| Rate limit exceeded                | Too many cert requests         | Wait 1 hour, or use `letsencrypt-staging` issuer for testing |

## Let's Encrypt Rate Limits

- **50 certificates per registered domain per week**
- **5 duplicate certificates per week**
- Staging server has much higher limits (for testing)
- To use staging: set `certManager.issuer: letsencrypt-staging` in values
  (the ClusterIssuer template automatically uses the staging ACME server)

## HSTS (HTTP Strict Transport Security)

HSTS headers are **deployed by default** when TLS is enabled (`ingress.tls.enabled: true`).
The `hsts-header` Traefik middleware is defined in `templates/middleware-redirect.yaml`
and chained with the HTTPS redirect middleware in the ingress annotations.

Default settings (conservative for safety):

| Setting                | Value | Description                                |
| ---------------------- | ----- | ------------------------------------------ |
| `stsSeconds`           | 300   | Browser remembers HTTPS-only for 5 minutes |
| `stsIncludeSubdomains` | true  | Applies to all subdomains                  |
| `stsPreload`           | false | Not submitted to preload list              |

For production, increase `stsSeconds` to `31536000` (1 year) in
`templates/middleware-redirect.yaml` after verifying TLS works correctly.

> **Warning:** Only enable `stsPreload` if you intend to submit your domain to the
> [HSTS preload list](https://hstspreload.org/). Once preloaded, removing HTTPS
> is very difficult.

---

## Backup & Disaster Recovery

### Why backups matter

If you destroy and recreate a cluster, cert-manager will re-request certificates
from Let's Encrypt. This can hit [rate limits](#lets-encrypt-rate-limits) —
especially the 5 duplicate certificates per week limit. Backing up the ACME
account key and issued certificates avoids this.

> **Security:** Backup files contain private keys and TLS certificates. Store
> them in an encrypted location (e.g., a password manager, encrypted S3 bucket,
> or `gpg`-encrypted files). Never commit them to version control or leave them
> on shared filesystems unencrypted.

### Backup the ACME account key

cert-manager stores the ACME account private key in a Secret in the
`cert-manager` namespace:

```bash
# Find the account key secret (named after the ClusterIssuer)
kubectl -n cert-manager get secrets | grep letsencrypt

# Back it up
kubectl -n cert-manager get secret letsencrypt-prod -o yaml > acme-account-key-backup.yaml
```

### Backup issued certificates

```bash
# Back up the TLS secrets
kubectl -n luckyplans get secret luckyplans-tls -o yaml > luckyplans-tls-backup.yaml
```

### Restore after cluster recreation

1. Install cert-manager on the new cluster
2. Apply the ACME account key backup: `kubectl apply -f acme-account-key-backup.yaml`
3. Apply the TLS certificate backups: `kubectl apply -f luckyplans-tls-backup.yaml`
4. Deploy the Helm chart — cert-manager will reuse the existing secrets and
   only request new certificates when they approach expiry

### Automating backups

The manual backup steps above are easy to forget. Consider automating with a
Kubernetes CronJob that periodically exports the TLS secrets:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: tls-backup
  namespace: luckyplans
spec:
  schedule: '0 2 * * 0' # Weekly at 2am Sunday
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: tls-backup-sa
          containers:
            - name: backup
              image: bitnami/kubectl:latest
              command:
                - /bin/sh
                - -c
                - |
                  kubectl -n luckyplans get secret luckyplans-tls -o yaml > /backup/luckyplans-tls.yaml
                  kubectl -n cert-manager get secret letsencrypt-prod -o yaml > /backup/acme-account-key.yaml
              volumeMounts:
                - name: backup-vol
                  mountPath: /backup
          volumes:
            - name: backup-vol
              persistentVolumeClaim:
                claimName: tls-backup-pvc
          restartPolicy: OnFailure
```

Adjust the volume target to match your backup storage (PVC, NFS, S3 via sidecar, etc.).
The service account needs `get` access to secrets in both `luckyplans` and `cert-manager`
namespaces.

### Testing on new clusters

When setting up a new cluster, use the **staging issuer** first to validate the
ACME flow without consuming production rate limits:

```yaml
certManager:
  issuer: letsencrypt-staging
```

Switch to `letsencrypt-prod` once the staging certificate is issued successfully.

## Files

| File                                                                | Purpose                                      |
| ------------------------------------------------------------------- | -------------------------------------------- |
| `infrastructure/helm/luckyplans/values.yaml`                        | Base cert-manager config (disabled)          |
| `infrastructure/helm/luckyplans/values.prod.yaml`                   | Prod TLS + cert-manager config               |
| `infrastructure/helm/luckyplans/templates/cluster-issuer.yaml`      | ClusterIssuer template                       |
| `infrastructure/helm/luckyplans/templates/ingress.yaml`             | Ingress with TLS + annotation passthrough    |
| `infrastructure/helm/luckyplans/templates/middleware-redirect.yaml` | HTTP→HTTPS redirect middleware (Traefik CRD) |
