import "server-only";

import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { eq } from "drizzle-orm";
import type { Address } from "viem";

import { db } from "../db";
import { treasury as treasuryTable } from "../db/schema";
import { getUsdcBalance } from "../monad/client";
import { MONAD_TESTNET } from "../monad/config";
import {
  createWallet,
  createPolicy,
  createApiKey,
  getWallet,
  listApiKeys,
} from "./client";
import {
  AGENT_KEY_NAME,
  agentTokenFileExists,
  getAgentTokenFilePath,
  getOwsTreasuryWallet,
  getOwsVaultPath,
  MONAD_TESTNET_POLICY_ID,
  writeAgentTokenFile,
} from "./config";

function findEvmAddress(
  accounts: { chainId: string; address: string }[]
): Address {
  const evm =
    accounts.find((a) => a.chainId.startsWith("eip155:")) ??
    accounts.find((a) => a.chainId === "eip155:1");
  if (!evm) {
    throw new Error("No EVM account found in OWS treasury wallet");
  }
  return evm.address as Address;
}

function generateOwnerPassphrase(): string {
  return randomBytes(32).toString("base64");
}

export function loadMonadTestnetPolicyJson(): string {
  const policyPath = join(
    process.cwd(),
    "policies",
    "monad-testnet-limits.json"
  );
  return readFileSync(policyPath, "utf8");
}

export function createPolicyFromFile(): void {
  createPolicy(loadMonadTestnetPolicyJson(), getOwsVaultPath());
}

export async function getTreasuryRecord() {
  const [row] = await db.select().from(treasuryTable).limit(1);
  return row ?? null;
}

async function createTreasuryWithPassphrase(
  ownerPassphrase: string,
  name?: string
) {
  const walletName = name ?? getOwsTreasuryWallet();
  const wallet = createWallet(
    walletName,
    ownerPassphrase,
    12,
    getOwsVaultPath()
  );
  const address = findEvmAddress(wallet.accounts);

  const [row] = await db
    .insert(treasuryTable)
    .values({
      walletName: wallet.name,
      address,
      createdAt: new Date().toISOString(),
    })
    .returning();

  return row;
}

function createRewardAgentKey(ownerPassphrase: string): {
  token: string;
  id: string;
  name: string;
} {
  return createApiKey(
    AGENT_KEY_NAME,
    [getOwsTreasuryWallet()],
    [MONAD_TESTNET_POLICY_ID],
    ownerPassphrase,
    undefined,
    getOwsVaultPath()
  );
}

function validateAgentKeyMetadata(agentKeyId?: string | null): void {
  const keys = listApiKeys(getOwsVaultPath()) as Array<{
    id: string;
    name: string;
    expires_at?: string;
  }>;
  const match = keys.find(
    (k) => k.id === agentKeyId || k.name === AGENT_KEY_NAME
  );
  if (!match) {
    throw new Error(`Agent key "${AGENT_KEY_NAME}" not found in OWS vault`);
  }
  if (match.expires_at && new Date(match.expires_at) <= new Date()) {
    throw new Error(`Agent key "${AGENT_KEY_NAME}" has expired`);
  }
}

export async function setupTreasury(): Promise<{
  address: Address;
  walletName: string;
  agentKeyId?: string;
  agentKeyName?: string;
  credentials: string;
}> {
  const existing = await getTreasuryRecord();

  if (existing?.agentKeyId && agentTokenFileExists()) {
    validateAgentKeyMetadata(existing.agentKeyId);
    return {
      address: existing.address as Address,
      walletName: existing.walletName,
      agentKeyId: existing.agentKeyId,
      agentKeyName: existing.agentKeyName ?? AGENT_KEY_NAME,
      credentials: "already provisioned in vault",
    };
  }

  if (existing && !agentTokenFileExists()) {
    throw new Error(
      "Treasury exists but agent token file is missing. Delete the OWS wallet and treasury DB row, then run setup again."
    );
  }

  const ownerPassphrase = generateOwnerPassphrase();
  const row = await createTreasuryWithPassphrase(ownerPassphrase);
  createPolicyFromFile();

  const agentKey = createRewardAgentKey(ownerPassphrase);
  writeAgentTokenFile(agentKey.token);

  await db
    .update(treasuryTable)
    .set({
      agentKeyId: agentKey.id,
      agentKeyName: agentKey.name,
    })
    .where(eq(treasuryTable.id, row.id));

  return {
    address: row.address as Address,
    walletName: row.walletName,
    agentKeyId: agentKey.id,
    agentKeyName: agentKey.name,
    credentials: `written to ${getAgentTokenFilePath()}`,
  };
}

export async function getTreasuryAddress(): Promise<Address | null> {
  const row = await getTreasuryRecord();
  if (row) return row.address as Address;

  try {
    const wallet = getWallet(getOwsTreasuryWallet(), getOwsVaultPath());
    return findEvmAddress(wallet.accounts);
  } catch {
    return null;
  }
}

export async function getTreasuryBalance(): Promise<bigint> {
  const address = await getTreasuryAddress();
  if (!address) return 0n;
  return getUsdcBalance(address);
}

export async function signAndSendReward(
  to: Address,
  amount: bigint
): Promise<{ txHash: string }> {
  const { sendUsdcTransfer, withRpcRetry } = await import("../monad/client");
  const { txHash } = await withRpcRetry(() => sendUsdcTransfer(to, amount));
  return { txHash };
}

export { MONAD_TESTNET };
