#!/bin/bash
set -e

# ---------------------------------------------------------------------------
# Generate and seal all production secrets for LuckyPlans.
# Outputs a YAML block ready to paste into values.prod.yaml.
#
# Prerequisites: kubeseal, openssl, kubectl (with access to the prod cluster)
#
# Usage:
#   ./seal-secrets.sh                              # Generate all secrets randomly
#   ./seal-secrets.sh --seal-only KEY=VALUE ...    # Seal specific values (no random generation)
#
# Examples:
#   # First-time setup — generate everything:
#   ./seal-secrets.sh
#
#   # Re-seal only KEYCLOAK_CLIENT_SECRET with a specific value:
#   ./seal-secrets.sh --seal-only KEYCLOAK_CLIENT_SECRET=my-secret-from-keycloak
#
#   # Re-seal multiple specific values:
#   ./seal-secrets.sh --seal-only \
#     KEYCLOAK_CLIENT_SECRET=abc123 \
#     KEYCLOAK_ADMIN_PASSWORD=xyz789
# ---------------------------------------------------------------------------

NAMESPACE="luckyplans"
SECRET_NAME="luckyplans-secrets"
CONTROLLER_NAME="sealed-secrets-controller"
CONTROLLER_NAMESPACE="kube-system"

# Parse arguments
SEAL_ONLY=false
declare -A SPECIFIC_VALUES

for arg in "$@"; do
  case "$arg" in
    --seal-only)
      SEAL_ONLY=true
      ;;
    *=*)
      if $SEAL_ONLY; then
        key="${arg%%=*}"
        val="${arg#*=}"
        SPECIFIC_VALUES["$key"]="$val"
      fi
      ;;
    -h|--help)
      head -25 "$0" | tail -22
      exit 0
      ;;
  esac
done

# Check prerequisites
for cmd in kubeseal openssl; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "Error: $cmd is required but not installed."
    exit 1
  }
done

# Verify kubeseal can reach the controller
kubeseal --controller-name="$CONTROLLER_NAME" \
  --controller-namespace="$CONTROLLER_NAMESPACE" \
  --fetch-cert > /dev/null 2>&1 || {
    echo "Error: Cannot reach sealed-secrets-controller."
    echo "Ensure you are connected to the prod cluster and the controller is installed."
    echo "Run: ./infrastructure/scripts/install-sealed-secrets.sh"
    exit 1
  }

echo "=== LuckyPlans — Seal Secrets ==="
echo ""
echo "Cluster: $(kubectl config current-context)"
echo "Namespace: $NAMESPACE"
echo "Secret name: $SECRET_NAME"
echo ""

# Generate a cryptographically secure random value
generate_secret() {
  local bytes="${1:-48}"
  openssl rand -base64 "$bytes"
}

# Seal a single value using kubeseal --raw
seal_value() {
  local value="$1"
  echo -n "$value" | kubeseal --raw \
    --controller-name="$CONTROLLER_NAME" \
    --controller-namespace="$CONTROLLER_NAMESPACE" \
    --namespace "$NAMESPACE" \
    --name "$SECRET_NAME"
}

# ---------------------------------------------------------------------------
# Mode: --seal-only (seal specific provided values)
# ---------------------------------------------------------------------------
if $SEAL_ONLY; then
  if [[ ${#SPECIFIC_VALUES[@]} -eq 0 ]]; then
    echo "Error: --seal-only requires at least one KEY=VALUE argument."
    echo "Example: ./seal-secrets.sh --seal-only KEYCLOAK_CLIENT_SECRET=my-secret"
    exit 1
  fi

  echo "Sealing ${#SPECIFIC_VALUES[@]} specific value(s)..."
  echo ""

  for key in "${!SPECIFIC_VALUES[@]}"; do
    val="${SPECIFIC_VALUES[$key]}"
    sealed=$(seal_value "$val")
    echo "    $key: \"$sealed\""
  done

  echo ""
  echo "Paste the line(s) above into values.prod.yaml under sealedSecrets.encryptedData."
  echo "Commit and push — ArgoCD will auto-sync."
  exit 0
fi

# ---------------------------------------------------------------------------
# Mode: default (generate all secrets randomly and seal them)
# ---------------------------------------------------------------------------
echo "Generating all secret values..."
echo ""

JWT_SECRET_VAL=$(generate_secret 48)
SESSION_SECRET_VAL=$(generate_secret 48)
KEYCLOAK_CLIENT_SECRET_VAL=$(generate_secret 24)
POSTGRES_PASSWORD_VAL=$(generate_secret 24)
KEYCLOAK_ADMIN_PASSWORD_VAL=$(generate_secret 24)

echo "Sealing secrets against the cluster..."
echo "(This encrypts each value with the controller's public key)"
echo ""

JWT_SECRET_SEALED=$(seal_value "$JWT_SECRET_VAL")
SESSION_SECRET_SEALED=$(seal_value "$SESSION_SECRET_VAL")
KEYCLOAK_CLIENT_SECRET_SEALED=$(seal_value "$KEYCLOAK_CLIENT_SECRET_VAL")
POSTGRES_PASSWORD_SEALED=$(seal_value "$POSTGRES_PASSWORD_VAL")
KEYCLOAK_ADMIN_PASSWORD_SEALED=$(seal_value "$KEYCLOAK_ADMIN_PASSWORD_VAL")

echo "=== Done! ==="
echo ""
echo "Paste the following into values.prod.yaml under sealedSecrets:"
echo ""
echo "sealedSecrets:"
echo "  enabled: true"
echo "  encryptedData:"
echo "    JWT_SECRET: \"$JWT_SECRET_SEALED\""
echo "    SESSION_SECRET: \"$SESSION_SECRET_SEALED\""
echo "    KEYCLOAK_CLIENT_SECRET: \"$KEYCLOAK_CLIENT_SECRET_SEALED\""
echo "    POSTGRES_PASSWORD: \"$POSTGRES_PASSWORD_SEALED\""
echo "    KEYCLOAK_ADMIN_PASSWORD: \"$KEYCLOAK_ADMIN_PASSWORD_SEALED\""
echo ""
echo "============================================================"
echo "PLAIN-TEXT VALUES (for one-time Keycloak configuration)"
echo "DO NOT commit these — copy them now, they won't be shown again."
echo "============================================================"
echo ""
echo "KEYCLOAK_CLIENT_SECRET:   $KEYCLOAK_CLIENT_SECRET_VAL"
echo "KEYCLOAK_ADMIN_PASSWORD:  $KEYCLOAK_ADMIN_PASSWORD_VAL"
echo "POSTGRES_PASSWORD:        $POSTGRES_PASSWORD_VAL"
echo ""
echo "============================================================"
echo ""
echo "NEXT STEPS:"
echo ""
echo "  1. Paste the sealedSecrets block into values.prod.yaml"
echo "  2. Commit and push — ArgoCD deploys Keycloak with KEYCLOAK_ADMIN_PASSWORD"
echo "  3. Log into Keycloak Admin: https://luckyplans.xyz/admin"
echo "     Username: admin"
echo "     Password: (the KEYCLOAK_ADMIN_PASSWORD printed above)"
echo "  4. Go to: luckyplans realm > Clients > luckyplans-frontend > Credentials"
echo "  5. Click 'Regenerate' and paste the KEYCLOAK_CLIENT_SECRET value above"
echo "     (or set it to the value printed above — both sides must match)"
echo "  6. Done! The gateway and Keycloak now share the same client secret."
echo ""
echo "  To re-seal a single secret later (e.g., after rotating in Keycloak):"
echo "    ./seal-secrets.sh --seal-only KEYCLOAK_CLIENT_SECRET=<new-value>"
