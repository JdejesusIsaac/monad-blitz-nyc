import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const MONAD_TESTNET_POLICY_ID = "monad-testnet-limits";
export const AGENT_TOKEN_FILE = "reward-agent.token";
export const AGENT_KEY_NAME = "reward-agent";

export function getOwsVaultPath(): string {
  return process.env.OWS_VAULT_PATH ?? join(homedir(), ".ows");
}

export function getOwsTreasuryWallet(): string {
  return process.env.OWS_TREASURY_WALLET ?? "nypl-treasury";
}

export function getAgentTokenFilePath(): string {
  return join(getOwsVaultPath(), AGENT_TOKEN_FILE);
}

export function agentTokenFileExists(): boolean {
  return existsSync(getAgentTokenFilePath());
}

export function assertNoEnvSecrets(): void {
  if (process.env.OWS_AGENT_KEY || process.env.OWS_OWNER_PASSPHRASE) {
    throw new Error(
      `OWS credentials must not be set via .env. Use vault token file at ${getAgentTokenFilePath()}`
    );
  }
}

export function getOwsAgentKey(): string {
  assertNoEnvSecrets();

  const tokenPath = getAgentTokenFilePath();
  if (!existsSync(tokenPath)) {
    throw new Error(
      `Agent token file not found at ${tokenPath}. Run POST /api/treasury/setup first.`
    );
  }

  const token = readFileSync(tokenPath, "utf8").trim();
  if (!token.startsWith("ows_key_")) {
    throw new Error(
      `Invalid agent token in ${tokenPath}. Expected ows_key_ prefix.`
    );
  }

  return token;
}

export function writeAgentTokenFile(token: string): void {
  const vaultPath = getOwsVaultPath();
  mkdirSync(vaultPath, { recursive: true });
  writeFileSync(getAgentTokenFilePath(), `${token}\n`, { mode: 0o600 });
}
