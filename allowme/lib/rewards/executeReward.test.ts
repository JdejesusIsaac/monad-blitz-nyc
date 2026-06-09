import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/lib/db";
import { payouts, programs } from "@/lib/db/schema";
import { executeReward } from "@/lib/rewards/executeReward";
import { DEFAULT_DAILY_CAP_MON, DEFAULT_REWARD_MON } from "@/lib/monad/config";
import { resetTestDb, seedTestInstitution } from "@/lib/test/db";
import { TEST_LEARNER_WALLET } from "@/lib/test/fixtures";

vi.mock("@/lib/ows/treasury", () => ({
  getTreasuryBalance: vi.fn(),
  signAndSendReward: vi.fn(),
}));

import { getTreasuryBalance, signAndSendReward } from "@/lib/ows/treasury";

const mockedBalance = vi.mocked(getTreasuryBalance);
const mockedSign = vi.mocked(signAndSendReward);

describe("executeReward", () => {
  let programId: string;

  beforeEach(async () => {
    await resetTestDb();
    programId = uuidv4();
    await seedTestInstitution();
    await db.insert(programs).values({
      id: programId,
      institutionId: "nypl",
      name: "AI Ethics",
      rewardAmountUsdc: DEFAULT_REWARD_MON.toString(),
      dailyCapUsdc: DEFAULT_DAILY_CAP_MON.toString(),
      courseSlug: "ai-ethics-101",
      createdAt: new Date().toISOString(),
    });
    mockedBalance.mockReset();
    mockedSign.mockReset();
  });

  it("returns idempotent result for duplicate submission", async () => {
    await db.insert(payouts).values({
      id: uuidv4(),
      programId,
      learnerId: "learner-1",
      learnerWallet: TEST_LEARNER_WALLET,
      amountUsdc: DEFAULT_REWARD_MON.toString(),
      txHash: "0xexisting",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });

    const result = await executeReward({
      programId,
      learnerId: "learner-1",
      learnerWallet: TEST_LEARNER_WALLET,
      verification: { verified: true, course: "AI Ethics 101" },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.idempotent).toBe(true);
      expect(result.txHash).toBe("0xexisting");
    }
    expect(mockedSign).not.toHaveBeenCalled();
  });

  it("signs and persists payout on approval", async () => {
    mockedBalance.mockResolvedValue(10_000_000_000_000_000n);
    mockedSign.mockResolvedValue({ txHash: "0xnewtx" });

    const result = await executeReward({
      programId,
      learnerId: "learner-1",
      learnerWallet: TEST_LEARNER_WALLET,
      verification: { verified: true, course: "AI Ethics 101" },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.txHash).toBe("0xnewtx");
      expect(result.explorerLink).toContain("0xnewtx");
    }
    expect(mockedSign).toHaveBeenCalledOnce();
  });

  it("rejects invalid learner wallet", async () => {
    mockedBalance.mockResolvedValue(10_000_000_000_000_000n);

    const result = await executeReward({
      programId,
      learnerId: "learner-1",
      learnerWallet: "not-an-address",
      verification: { verified: true, course: "AI Ethics 101" },
    });

    expect(result).toEqual({ ok: false, error: "invalid_learner_wallet" });
  });
});
