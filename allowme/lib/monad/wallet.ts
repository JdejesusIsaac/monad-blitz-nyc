import { isAddress, type Address } from "viem";

export function assertValidLearnerWallet(wallet: string): asserts wallet is Address {
  if (!isAddress(wallet)) {
    throw new Error(`Invalid learner wallet address: ${wallet}`);
  }
}
