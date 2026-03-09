#!/usr/bin/env bash
# ============================================================
# install-argocd.sh — Install ArgoCD on the prod cluster
# ============================================================
# Usage:
#   ./infrastructure/scripts/install-argocd.sh --github-token ghp_xxx
#
# ArgoCD is only used for prod. Local dev uses direct Helm
# via `pnpm deploy:local`.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ARGOCD_DIR="$REPO_ROOT/infrastructure/argocd"

GITHUB_TOKEN=""

# ------------------------------------------------------------------
# Parse arguments
# ------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case $1 in
    --github-token)  GITHUB_TOKEN="$2";  shift 2 ;;
    -h|--help)
      echo "Usage: $0 --github-token <token>"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ -z "$GITHUB_TOKEN" ]]; then
  echo "Error: --github-token is required"
  exit 1
fi

echo "==> Installing ArgoCD for prod environment"

# ------------------------------------------------------------------
# 1. Add Helm repo
# ------------------------------------------------------------------
echo "==> Adding ArgoCD Helm repo..."
helm repo add argo https://argoproj.github.io/argo-helm 2>/dev/null || true
helm repo update argo

# ------------------------------------------------------------------
# 2. Build Helm values arguments
# ------------------------------------------------------------------
HELM_ARGS=(
  upgrade --install argocd argo/argo-cd
  --namespace argocd
  --create-namespace
  --wait
  --timeout 5m
  -f "$ARGOCD_DIR/values-base.yaml"
  -f "$ARGOCD_DIR/values-prod.yaml"
  --set "configs.credentialTemplates.github.password=$GITHUB_TOKEN"
)

# ------------------------------------------------------------------
# 3. Install / upgrade ArgoCD
# ------------------------------------------------------------------
echo "==> Running helm upgrade --install..."
helm "${HELM_ARGS[@]}"

# ------------------------------------------------------------------
# 4. Wait for ArgoCD components to be ready
# ------------------------------------------------------------------
echo "==> Waiting for ArgoCD components to be ready..."
kubectl -n argocd rollout status deployment/argocd-server --timeout=120s
kubectl -n argocd rollout status deployment/argocd-repo-server --timeout=120s
kubectl -n argocd rollout status statefulset/argocd-application-controller --timeout=120s

# ------------------------------------------------------------------
# 5. Print initial admin password
# ------------------------------------------------------------------
echo ""
echo "==> ArgoCD installed successfully!"
echo ""
ADMIN_PASS=$(kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath='{.data.password}' 2>/dev/null | base64 -d 2>/dev/null || echo "(already changed or not available)")
echo "    Admin username: admin"
echo "    Admin password: $ADMIN_PASS"
echo ""

# ------------------------------------------------------------------
# 6. Apply Traefik Middleware for HTTPS redirect
# ------------------------------------------------------------------
if [[ -f "$ARGOCD_DIR/middleware-redirect.yaml" ]]; then
  echo "==> Applying ArgoCD Traefik Middleware (HTTPS redirect)..."
  kubectl apply -f "$ARGOCD_DIR/middleware-redirect.yaml"
fi

# ------------------------------------------------------------------
# 7. Apply the ArgoCD Application manifest
# ------------------------------------------------------------------
APP_MANIFEST="$ARGOCD_DIR/apps/luckyplans-prod.yaml"
if [[ -f "$APP_MANIFEST" ]]; then
  echo "==> Applying Application manifest: $APP_MANIFEST"
  kubectl apply -f "$APP_MANIFEST"
  echo "    Application 'luckyplans-prod' created/updated."
else
  echo "WARNING: Application manifest not found: $APP_MANIFEST"
fi

# ------------------------------------------------------------------
# 8. Print access info
# ------------------------------------------------------------------
echo ""
echo "    ArgoCD UI: https://luckyplans.xyz/argocd"
echo ""
echo "Done."
