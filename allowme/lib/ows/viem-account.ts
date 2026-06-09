import "server-only";

import { getWallet, signMessage, signTransaction, signTypedData } from "./client";
import { toAccount, type Account } from "viem/accounts";

export interface OwsViemAccountOptions {
  chain?: string;
  passphrase?: string;
  index?: number;
  vaultPath?: string;
}

/** viem account backed by the local OWS fork (monad-blitz-nyc/ows-monad/ows). */
export function owsToViemAccount(
  walletNameOrId: string,
  options: OwsViemAccountOptions = {}
): Account {
  const chain = options.chain ?? "eip155:1";
  const wallet = getWallet(walletNameOrId, options.vaultPath);
  const evmAccount =
    wallet.accounts.find((a) => a.chainId === chain) ??
    wallet.accounts.find((a) => a.chainId.startsWith("eip155:"));
  if (!evmAccount) {
    throw new Error(`No EVM account found in wallet "${walletNameOrId}".`);
  }
  const address = evmAccount.address as `0x${string}`;
  return toAccount({
    address,
    async signMessage({ message }) {
      const signable = message as string | { raw?: string | Uint8Array };
      const raw = typeof signable === "object" && "raw" in signable ? signable.raw ?? signable : signable;
      const msg =
        typeof signable === "string"
          ? signable
          : typeof raw === "string"
            ? raw.startsWith("0x")
              ? raw.slice(2)
              : Buffer.from(raw).toString("hex")
            : Buffer.from(raw as Uint8Array).toString("hex");
      const result = signMessage(
        walletNameOrId,
        chain,
        msg,
        options.passphrase,
        typeof message === "string" ? undefined : "hex",
        options.index,
        options.vaultPath
      );
      return result.signature.startsWith("0x")
        ? (result.signature as `0x${string}`)
        : (`0x${result.signature}` as `0x${string}`);
    },
    async signTransaction(transaction) {
      const { serializeTransaction } = await import("viem");
      const serialized = serializeTransaction(transaction);
      const txHex = serialized.startsWith("0x") ? serialized.slice(2) : serialized;
      const result = signTransaction(
        walletNameOrId,
        chain,
        txHex,
        options.passphrase,
        options.index,
        options.vaultPath
      );
      const sig = result.signature.startsWith("0x")
        ? result.signature.slice(2)
        : result.signature;
      const r = `0x${sig.slice(0, 64)}` as `0x${string}`;
      const s = `0x${sig.slice(64, 128)}` as `0x${string}`;
      const yParity =
        result.recoveryId != null
          ? result.recoveryId >= 27
            ? result.recoveryId - 27
            : result.recoveryId
          : parseInt(sig.slice(128, 130), 16);
      return serializeTransaction(transaction, { r, s, yParity });
    },
    async signTypedData(typedData) {
      const result = signTypedData(
        walletNameOrId,
        chain,
        JSON.stringify(typedData),
        options.passphrase,
        options.index,
        options.vaultPath
      );
      return result.signature.startsWith("0x")
        ? (result.signature as `0x${string}`)
        : (`0x${result.signature}` as `0x${string}`);
    },
  });
}
