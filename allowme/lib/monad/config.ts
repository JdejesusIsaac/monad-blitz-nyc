export const MONAD_TESTNET = {
  id: 10143,
  caip2: "eip155:10143",
  rpcUrl: process.env.MONAD_RPC_URL ?? "https://testnet-rpc.monad.xyz",
  explorerBase: "https://testnet.monadvision.com",
  usdc: "0x534b2f3A21130d7a60830c2Df862319e593943A3" as const,
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
} as const;

export function txExplorerUrl(hash: string): string {
  const normalized = hash.startsWith("0x") ? hash : `0x${hash}`;
  return `${MONAD_TESTNET.explorerBase}/tx/${normalized}`;
}

export const USDC_DECIMALS = 6;

/** $1 USDC in base units (6 decimals). */
export const DEFAULT_REWARD_USDC = 1_000_000n;
