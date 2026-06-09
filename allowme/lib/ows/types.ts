export interface OwsAccountInfo {
  chainId: string;
  address: string;
  derivationPath: string;
}

export interface OwsWalletInfo {
  id: string;
  name: string;
  accounts: OwsAccountInfo[];
  createdAt: string;
}

export interface OwsApiKeyResult {
  token: string;
  id: string;
  name: string;
}

export interface OwsCoreModule {
  createWallet: (
    name: string,
    passphrase?: string,
    words?: number,
    vaultPath?: string
  ) => OwsWalletInfo;
  getWallet: (nameOrId: string, vaultPath?: string) => OwsWalletInfo;
  createPolicy: (policyJson: string, vaultPath?: string) => void;
  createApiKey: (
    name: string,
    walletIds: string[],
    policyIds: string[],
    passphrase: string,
    expiresAt?: string,
    vaultPath?: string
  ) => OwsApiKeyResult;
  signAndSend: (
    wallet: string,
    chain: string,
    txHex: string,
    passphrase?: string,
    index?: number,
    rpcUrl?: string,
    vaultPath?: string
  ) => { txHash: string };
  signMessage: (
    wallet: string,
    chain: string,
    message: string,
    passphrase?: string,
    encoding?: string,
    index?: number,
    vaultPath?: string
  ) => { signature: string; recoveryId?: number };
  signTransaction: (
    wallet: string,
    chain: string,
    txHex: string,
    passphrase?: string,
    index?: number,
    vaultPath?: string
  ) => { signature: string; recoveryId?: number };
  signTypedData: (
    wallet: string,
    chain: string,
    typedDataJson: string,
    passphrase?: string,
    index?: number,
    vaultPath?: string
  ) => { signature: string; recoveryId?: number };
  listApiKeys: (vaultPath?: string) => Array<Record<string, unknown>>;
}
