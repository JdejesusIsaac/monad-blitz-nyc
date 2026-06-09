#!/usr/bin/env bash
# VPS deployment helper for AllowMe + local OWS fork.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ALLOWME="${ROOT}/allowme"

info() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }

info "1. Install Node 20+ and Rust (optional, for OWS bindings build)"
info "2. Prepare OWS vault directory"
bash "${ALLOWME}/scripts/setup-ows.sh"

info "3. Install AllowMe dependencies"
cd "$ALLOWME"
npm install
npm run ows:build || info "ows:build skipped if Rust unavailable — use prebuilt .node on VPS"

info "4. Configure environment (paths only, no signing secrets)"
if [[ ! -f .env ]]; then
  cp .env.example .env
  info "Edit allowme/.env — set OWS_VAULT_PATH if not using /secure/.ows"
fi

info "5. Seed database"
npm run seed

info "6. Build and start"
npm run build
info "Start with: npm run start (port 3000)"
info "Demo flow:"
info "  POST /api/treasury/setup  — writes $OWS_VAULT_PATH/reward-agent.token"
info "  GET  /api/treasury        — balance + history"
info "  POST /api/verify          — quiz pass → reward"
