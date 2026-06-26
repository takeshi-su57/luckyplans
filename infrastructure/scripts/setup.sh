#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "=== LuckyPlans Project Setup ==="
echo ""

# Check Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is required. Install from https://nodejs.org (>= 20.0.0)"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "Error: Node.js >= 20 required. Current: $(node -v)"
  exit 1
fi
echo "[OK] Node.js $(node -v)"

# Check pnpm
PACKAGE_MANAGER=$(node -p "require('$ROOT_DIR/package.json').packageManager")
PNPM_VERSION="${PACKAGE_MANAGER#pnpm@}"

if command -v corepack >/dev/null 2>&1; then
  echo "Activating pnpm $PNPM_VERSION via Corepack..."
  corepack enable
  corepack prepare "pnpm@$PNPM_VERSION" --activate >/dev/null
elif ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found. Installing pnpm $PNPM_VERSION globally..."
  npm install -g "pnpm@$PNPM_VERSION"
elif [ "$(pnpm -v)" != "$PNPM_VERSION" ]; then
  echo "[WARN] pnpm $(pnpm -v) detected, but this repo expects pnpm $PNPM_VERSION."
  echo "       Install the expected version or enable Corepack for best results."
fi
echo "[OK] pnpm $(pnpm -v)"

# Check Docker
if command -v docker >/dev/null 2>&1; then
  echo "[OK] Docker $(docker -v | awk '{print $3}' | tr -d ',')"
else
  echo "[WARN] Docker not installed. Required for image builds and k3d."
fi

# Check k3d
if command -v k3d >/dev/null 2>&1; then
  echo "[OK] k3d $(k3d version | head -1)"
else
  echo "[WARN] k3d not installed. Install from https://k3d.io"
fi

# Check Helm
if command -v helm >/dev/null 2>&1; then
  echo "[OK] Helm $(helm version --short)"
else
  echo "[WARN] Helm not installed. Install from https://helm.sh"
fi

cd "$ROOT_DIR"

# Install dependencies
echo ""
echo "--- Installing dependencies ---"
pnpm install

# Setup environment
if [ ! -f .env ]; then
  echo ""
  echo "--- Creating .env from .env.example ---"
  cp .env.example .env
  echo ".env created. Edit it if you need custom values."
else
  echo ""
  echo "[OK] .env already exists"
fi

# Build shared packages
echo ""
echo "--- Building shared packages ---"
pnpm --filter @luckyplans/shared build

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  pnpm deploy:local     Build images and deploy to local k3d cluster via Helm"
echo "  pnpm deploy:status    Show cluster and release status"
echo "  pnpm deploy:teardown  Tear down local cluster"
