declare module "@open-wallet-standard/core" {
  export interface AccountInfo {
    chainId: string;
    address: string;
    derivationPath: string;
  }

  export interface WalletInfo {
    id: string;
    name: string;
    accounts: AccountInfo[];
    createdAt: string;
  }

  export interface ApiKeyResult {
    token: string;
    id: string;
    name: string;
  }

  export function createWallet(
    name: string,
    passphrase?: string,
    words?: number,
    vaultPath?: string
  ): WalletInfo;

  export function getWallet(
    nameOrId: string,
    vaultPath?: string
  ): WalletInfo;

  export function createPolicy(
    policyJson: string,
    vaultPath?: string
  ): void;

  export function createApiKey(
    name: string,
    walletIds: string[],
    policyIds: string[],
    passphrase: string,
    expiresAt?: string,
    vaultPath?: string
  ): ApiKeyResult;

  export function signAndSend(
    wallet: string,
    chain: string,
    txHex: string,
    passphrase?: string,
    index?: number,
    rpcUrl?: string,
    vaultPath?: string
  ): { txHash: string };
}
