#!/bin/bash
set -e

# ---------------------------------------------------------------------------
# Install Bitnami Sealed Secrets controller on the current cluster.
# Run once per cluster. The controller manages its own key pair.
#
# Prerequisites: helm, kubectl
# Usage: ./install-sealed-secrets.sh
# ---------------------------------------------------------------------------

NAMESPACE="kube-system"
RELEASE_NAME="sealed-secrets"
CONTROLLER_NAME="sealed-secrets-controller"

echo "=== Installing Bitnami Sealed Secrets ==="
echo ""

# Check prerequisites
for cmd in helm kubectl; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "Error: $cmd is required but not installed."
    exit 1
  }
done

# Add the Helm repo
echo "--- Adding sealed-secrets Helm repo ---"
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets 2>/dev/null || true
helm repo update

# Install or upgrade the controller
echo ""
echo "--- Installing sealed-secrets-controller ---"
helm upgrade --install "$RELEASE_NAME" sealed-secrets/sealed-secrets \
  --namespace "$NAMESPACE" \
  --set fullnameOverride="$CONTROLLER_NAME" \
  --wait

echo ""
echo "--- Verifying installation ---"
kubectl -n "$NAMESPACE" rollout status deployment/"$CONTROLLER_NAME" --timeout=120s

# Backup the signing key (CRITICAL — if lost, all sealed secrets become undecryptable)
BACKUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/.sealed-secrets-backup"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/sealed-secrets-key-$(date +%Y%m%d-%H%M%S).yaml"

echo ""
echo "--- Backing up signing key ---"
kubectl -n "$NAMESPACE" get secret -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > "$BACKUP_FILE"
echo "Key backed up to: $BACKUP_FILE"
echo ""
echo "WARNING: Store this backup securely (offline, encrypted)."
echo "         If this key is lost, all sealed secrets must be re-created."
echo "         The backup directory (.sealed-secrets-backup/) is gitignored."

# Fetch the public key for kubeseal
echo ""
echo "--- Fetching public key ---"
PUB_KEY_FILE="$BACKUP_DIR/sealed-secrets-pub.pem"
kubeseal --controller-name="$CONTROLLER_NAME" \
  --controller-namespace="$NAMESPACE" \
  --fetch-cert > "$PUB_KEY_FILE" 2>/dev/null || {
    echo "Note: kubeseal not found. Install it to seal secrets:"
    echo "  brew install kubeseal  (macOS)"
    echo "  https://github.com/bitnami-labs/sealed-secrets/releases (Linux/Windows)"
    echo ""
    echo "Controller is installed and running. You can fetch the cert later with:"
    echo "  kubeseal --controller-name=$CONTROLLER_NAME --controller-namespace=$NAMESPACE --fetch-cert"
    exit 0
  }

echo "Public key saved to: $PUB_KEY_FILE"

echo ""
echo "=== Sealed Secrets installation complete ==="
echo ""
echo "Next steps:"
echo "  1. Run ./infrastructure/scripts/seal-secrets.sh to generate and seal prod secrets"
echo "  2. Paste the output into values.prod.yaml under sealedSecrets.encryptedData"
echo "  3. Commit and push — ArgoCD will sync the SealedSecret"
