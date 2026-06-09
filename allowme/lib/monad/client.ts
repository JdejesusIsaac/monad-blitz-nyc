/** Server-side Monad + viem helpers. Do not import from client components. */
import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Hex,
} from "viem";
import { owsToViemAccount } from "../ows/viem-account";

import { monadTestnet } from "./chain";
import { MONAD_TESTNET } from "./config";
import { getOwsAgentKey, getOwsTreasuryWallet, getOwsVaultPath } from "../ows/config";

export function getPublicClient() {
  return createPublicClient({
    chain: monadTestnet,
    transport: http(MONAD_TESTNET.rpcUrl),
  });
}

export async function getNativeBalance(address: Address): Promise<bigint> {
  const client = getPublicClient();
  return client.getBalance({ address });
}

/** @deprecated Use getNativeBalance — demo pays native MON, not USDC. */
export async function getUsdcBalance(address: Address): Promise<bigint> {
  return getNativeBalance(address);
}

export async function sendMonTransfer(
  to: Address,
  amount: bigint
): Promise<{ txHash: Hex }> {
  const account = owsToViemAccount(getOwsTreasuryWallet(), {
    chain: MONAD_TESTNET.caip2,
    passphrase: getOwsAgentKey(),
    vaultPath: getOwsVaultPath(),
  });

  const walletClient = createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(MONAD_TESTNET.rpcUrl),
  });

  const hash = await walletClient.sendTransaction({
    account,
    to,
    value: amount,
  });

  return { txHash: hash };
}

/** @deprecated Use sendMonTransfer — demo pays native MON, not USDC. */
export async function sendUsdcTransfer(
  to: Address,
  amount: bigint
): Promise<{ txHash: Hex }> {
  return sendMonTransfer(to, amount);
}

export async function withRpcRetry<T>(
  fn: () => Promise<T>,
  retries = 2
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}
