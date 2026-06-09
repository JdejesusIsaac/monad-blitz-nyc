# AllowMe for Institutions

AI-managed learning treasuries powered by the **local OWS fork** (`../ows-monad/ows`) and Monad testnet MON settlement.

> **OWS is only consumed from the local fork** at [`../ows-monad/ows`](../ows-monad/ows) — not from the npm registry. `postinstall` copies the loader into that fork and installs the platform native binary.

## Stack

- Next.js 16 + TypeScript + Tailwind
- SQLite (Drizzle ORM)
- OWS local fork (`../ows-monad/ows/bindings/node`) — lazy-loaded at runtime via `lib/ows/client.ts`
- viem + in-repo viem adapter (`lib/ows/viem-account.ts`)
- Monad Testnet (chain `10143`, USDC `0x534b2f3A21130d7a60830c2Df862319e593943A3`)

## Credentials (no secrets in `.env`)

Agent signing credentials live in the OWS vault directory, **not** in environment variables:

```
$OWS_VAULT_PATH/reward-agent.token   # chmod 600, written by POST /api/treasury/setup
```

The app rejects `OWS_AGENT_KEY` and `OWS_OWNER_PASSPHRASE` if set in `.env`.

## Quick start (local)

```bash
cd monad-blitz-nyc/allowme

npm install
npm run ows:build   # optional if postinstall installed native binary

cp .env.example .env
# Set OWS_VAULT_PATH only — no signing secrets in .env

npm run seed
npm run dev

# Non-interactive treasury + agent key provisioning
curl -X POST http://localhost:3000/api/treasury/setup
```

## VPS deployment

```bash
bash scripts/deploy-vps.sh
npm run start
curl -X POST http://localhost:3000/api/treasury/setup
```

Fund the treasury wallet with MON from the [faucet](https://faucet.monad.xyz) before running rewards.

## API (infrastructure)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/treasury` | Treasury address, MON balance, payout history |
| `POST` | `/api/treasury/setup` | Create OWS wallet + policy + vault token file |
| `POST` | `/api/rewards/execute` | Policy check → OWS sign → Monad MON transfer |
| `POST` | `/api/verify` | Grade quiz → verify → execute reward |
| `GET/POST` | `/api/programs` | Program CRUD |

## Demo flow

1. `POST /api/treasury/setup` — provisions wallet, policy, and `$OWS_VAULT_PATH/reward-agent.token`
2. Fund treasury on Monad testnet
3. `npm run seed` — NYPL AI Ethics Program (0.01 MON)
4. Learner passes quiz → `POST /api/verify` with `score: 92`
5. OWS agent signs native MON transfer on `eip155:10143`
6. View tx on [testnet.monadvision.com](https://testnet.monadvision.com)

## Tests

```bash
npm test
```

## Environment

See [`.env.example`](.env.example). Only paths and non-secret config belong in `.env`.
