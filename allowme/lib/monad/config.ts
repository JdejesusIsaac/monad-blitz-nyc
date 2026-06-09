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

export const MON_DECIMALS = 18;

/** 0.01 MON in wei — default learner reward for demo. */
export const DEFAULT_REWARD_MON = 10_000_000_000_000_000n;

/** 1 MON in wei — default daily payout cap. */
export const DEFAULT_DAILY_CAP_MON = 1_000_000_000_000_000_000n;

/** @deprecated DB column name; stores MON wei amounts. */
export const DEFAULT_REWARD_USDC = DEFAULT_REWARD_MON;

export function formatMon(wei: bigint): string {
  const asNumber = Number(wei) / 10 ** MON_DECIMALS;
  const formatted =
    asNumber >= 1 ? asNumber.toFixed(2) : asNumber.toFixed(4);
  return `${formatted} MON`;
}
