import { defineChain } from "viem";
import { MONAD_TESTNET } from "./config";

export const monadTestnet = defineChain({
  id: MONAD_TESTNET.id,
  name: "Monad Testnet",
  nativeCurrency: MONAD_TESTNET.nativeCurrency,
  rpcUrls: {
    default: { http: [MONAD_TESTNET.rpcUrl] },
  },
  blockExplorers: {
    default: {
      name: "MonadVision",
      url: MONAD_TESTNET.explorerBase,
    },
  },
});
