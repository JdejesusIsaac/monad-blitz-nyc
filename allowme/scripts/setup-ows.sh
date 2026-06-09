#!/usr/bin/env bash
# Prepare OWS vault + local fork on VPS. Treasury credentials via POST /api/treasury/setup.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OWS_REPO="${ROOT}/ows-monad/ows"
ALLOWME_DIR="${ROOT}/allowme"
VAULT_PATH="${OWS_VAULT_PATH:-/secure/.ows}"
POLICY_FILE="${ALLOWME_DIR}/policies/monad-testnet-limits.json"

info() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
err()  { printf '\033[1;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

[[ -d "$OWS_REPO" ]] || err "OWS fork not found at $OWS_REPO"

info "Building OWS CLI + Node bindings from local fork..."
cd "$OWS_REPO"
if [[ -x "./ows/install.sh" ]]; then
  OWS_INSTALL_DIR="${OWS_INSTALL_DIR:-$HOME/.local/bin}" ./ows/install.sh || true
fi

if command -v cargo >/dev/null 2>&1; then
  cd "$OWS_REPO/bindings/node"
  npm install
  npm run build
else
  info "Rust not found — ensure prebuilt OWS binaries exist in bindings/node"
fi

info "Configuring OWS vault at $VAULT_PATH"
mkdir -p "$VAULT_PATH/policies" "$VAULT_PATH/wallets" "$VAULT_PATH/keys"

cat > "$VAULT_PATH/config.json" <<EOF
{
  "vault_path": "$VAULT_PATH",
  "rpc": {
    "eip155:10143": "https://testnet-rpc.monad.xyz"
  }
}
EOF

info "Copying Monad testnet policy into vault"
cp "$POLICY_FILE" "$VAULT_PATH/policies/monad-testnet-limits.json"

info "Done. Start AllowMe and run: curl -X POST http://localhost:3000/api/treasury/setup"
info "Agent token will be written to: $VAULT_PATH/reward-agent.token"
