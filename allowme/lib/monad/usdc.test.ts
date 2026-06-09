import { describe, expect, it } from "vitest";
import { encodeFunctionData, getAddress } from "viem";

import { MONAD_TESTNET } from "@/lib/monad/config";
import { buildUsdcTransferCalldata, erc20Abi } from "@/lib/monad/usdc";

const TEST_WALLET = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as const;

describe("USDC transfer calldata", () => {
  it("targets the Monad testnet USDC contract", () => {
    const learner = getAddress(TEST_WALLET);
    const amount = 1_000_000n;
    const built = buildUsdcTransferCalldata(learner, amount);

    expect(built.to).toBe(MONAD_TESTNET.usdc);

    const expected = encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [learner, amount],
    });
    expect(built.data).toBe(expected);
  });
});
