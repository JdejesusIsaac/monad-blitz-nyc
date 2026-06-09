# AllowMe for Institutions — Progress

Last updated: 2026-06-09

## Overview

AI-managed learning treasuries powered by the local OWS fork and Monad testnet USDC settlement. The app provisions an OWS treasury wallet, enforces policy-gated agent signing, and pays learners on-chain when they pass a quiz.

---

## Completed

### Core infrastructure

- [x] Next.js 16 + TypeScript + Tailwind app scaffold
- [x] SQLite database with Drizzle ORM (institutions, treasury, programs, enrollments, completions, payouts)
- [x] OWS integration via local fork (`../ows-monad/ows/bindings/node`)
- [x] Lazy OWS loader with webpack externals + `__non_webpack_require__` for dev
- [x] In-repo viem adapter (`lib/ows/viem-account.ts`)
- [x] Monad testnet config (chain `10143`, USDC `0x534b2f3A21130d7a60830c2Df862319e593943A3`)
- [x] `postinstall` script to ensure OWS native bindings are present

### Credential handling (demo-ready)

- [x] Vault-local agent token file (`$OWS_VAULT_PATH/reward-agent.token`, chmod 600)
- [x] Env guard rejecting `OWS_AGENT_KEY` and `OWS_OWNER_PASSPHRASE` in `.env`
- [x] Non-interactive `POST /api/treasury/setup` — auto-generates owner passphrase, creates wallet + policy + API key, writes token to vault
- [x] Setup API returns metadata only (no raw token in response body)
- [x] Treasury DB schema extended with `agentKeyId` / `agentKeyName`

### Policy & rewards

- [x] App-level policy engine (treasury funded, daily cap, duplicate payout prevention)
- [x] OWS policy file (`policies/monad-testnet-limits.json`)
- [x] Reward orchestration: verify → evaluate → OWS sign → persist payout
- [x] Idempotent payout handling for duplicate submissions

### API routes

| Route | Status |
|-------|--------|
| `GET /api/treasury` | Done |
| `POST /api/treasury/setup` | Done |
| `POST /api/rewards/execute` | Done |
| `POST /api/verify` | Done |
| `GET/POST /api/programs` | Done |

### Scripts & docs

- [x] `scripts/setup-ows.sh` — vault prep (no secrets in env)
- [x] `scripts/deploy-vps.sh` — VPS deployment guide
- [x] `scripts/seed-demo.ts` — NYPL AI Ethics Program seed
- [x] `.env.example` and `README.md` updated for vault-file credential model
- [x] Dev script uses `next dev --webpack` (required for OWS native module)

### Tests & build

- [x] 18 unit tests passing (policy, config/env guard, rewards, USDC, quiz grading)
- [x] Production build passes (`npm run build --webpack`)

### Local verification

- [x] Treasury setup succeeded locally (`POST /api/treasury/setup` → HTTP 200)
- [x] Treasury address: `0x132DA5683D9fF1c1b6ACD6d6b09fD3A98aD01354`
- [x] Agent token written to `.ows-vault/reward-agent.token`
- [x] OWS vault contains wallet, policy, and key metadata

---

## Remaining / not yet verified

### Demo flow (end-to-end)

- [ ] Fund treasury with MON ([faucet](https://faucet.monad.xyz)) and testnet USDC
- [ ] Run `npm run seed` for NYPL AI Ethics Program
- [ ] Execute full reward flow: `POST /api/verify` with `score: 92` → on-chain USDC transfer
- [ ] Confirm tx on [testnet.monadvision.com](https://testnet.monadvision.com)

### Deployment

- [ ] VPS deployment with `scripts/deploy-vps.sh`
- [ ] Set `OWS_VAULT_PATH=/secure/.ows` on VPS (local dev uses `./.ows-vault`)
- [ ] Live demo on Monad testnet

### Optional enhancements

- [ ] Health check via `listApiKeys` to verify agent key exists and is not expired
- [ ] Dashboard UI for treasury balance and payout history (API exists; UI is minimal)
- [ ] `.env.example` note distinguishing local (`./.ows-vault`) vs VPS (`/secure/.ows`) vault paths

---

## Architecture

```
POST /api/treasury/setup
  → generate owner passphrase (in memory)
  → createWallet + createPolicy + createApiKey (OWS)
  → write reward-agent.token to vault
  → persist treasury metadata in SQLite

POST /api/verify
  → gradeQuiz → evaluateReward → executeReward
  → read agent token from vault file
  → OWS policy-gated sign → Monad USDC transfer
  → persist payout in SQLite
```

### Credentials model

| What | Where |
|------|-------|
| Agent signing token | `$OWS_VAULT_PATH/reward-agent.token` |
| Wallet / key metadata | `$OWS_VAULT_PATH/wallets/`, `keys/`, `policies/` |
| Non-secret config | `.env` (`OWS_VAULT_PATH`, `DATABASE_URL`, etc.) |

Secrets are **never** stored in `.env`, SQLite, or API responses.

---

## Quick commands

```bash
npm install
cp .env.example .env          # set OWS_VAULT_PATH=./.ows-vault for local dev
npm run seed
npm run dev                   # http://localhost:3000

curl -X POST http://localhost:3000/api/treasury/setup
npm test
npm run build
```
