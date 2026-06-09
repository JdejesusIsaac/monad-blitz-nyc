# AllowMe for Institutions

> AI-managed learning treasuries — verified educational outcomes trigger automatic USDC payouts on Monad.

Institutions create an OWS policy-gated treasury wallet, define learning reward programs, and let an AI agent automatically pay verified learners in USDC on Monad testnet — no manual approvals, no custodians.

**Demo:** NYPL funds treasury → patron completes AI Ethics 101 → OWS agent signs payout → Monad settles in < 1 second.

## Team

| Name | Role | GitHub |
|---|---|---|
| Juan Isaac | Treasury & Infrastructure | [@JdejesusIsaac](https://github.com/JdejesusIsaac) |
| Shageenth | Full-Stack | [@shageenthsandrakumar](https://github.com/shageenthsandrakumar) |
| Wolfie | Frontend & Demo | [@Wolfie92](https://github.com/Wolfie92) |

## Stack

- **Wallet:** OWS (Open Wallet Standard) — policy-gated local treasury
- **Chain:** Monad Testnet (chain 10143, ~0.4s finality)
- **Settlement:** USDC `0x534b2f3A21130d7a60830c2Df862319e593943A3`
- **Frontend:** Next.js 16 + TypeScript + Tailwind
- **DB:** SQLite + Drizzle ORM
- **Explorer:** [testnet.monadvision.com](https://testnet.monadvision.com)

## Run

```bash
cd allowme
npm install
npm run seed          # seeds NYPL institution + AI Ethics program
```

First-time treasury setup (on the demo machine):
```bash
curl -X POST http://localhost:3000/api/treasury/setup
# fund the returned address with MON + USDC from the Monad testnet faucet
npm run dev -- --webpack
```

## Key API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/treasury` | Treasury address, balance, recent payouts |
| GET | `/api/programs` | List programs |
| POST | `/api/verify` | Submit quiz answers → grade → verify → payout |
| POST | `/api/rewards/execute` | Direct reward execution |
| GET | `/api/dashboard/institution` | Institution dashboard data |
| GET | `/api/dashboard/learner?wallet=0x…` | Learner earnings + completions |

## Monad Testnet

- RPC: `https://testnet-rpc.monad.xyz`
- Chain ID: `10143`
- Faucet (MON): [faucet.monad.xyz](https://faucet.monad.xyz)
- Faucet (USDC): [faucet.circle.com](https://faucet.circle.com)
