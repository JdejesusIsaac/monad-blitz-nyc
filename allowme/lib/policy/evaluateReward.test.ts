import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/lib/db";
import { programs } from "@/lib/db/schema";
import { DEFAULT_DAILY_CAP_MON, DEFAULT_REWARD_MON } from "@/lib/monad/config";
import { evaluateReward } from "@/lib/policy/evaluateReward";
import { resetTestDb, seedTestInstitution } from "@/lib/test/db";
import { TEST_LEARNER_WALLET } from "@/lib/test/fixtures";

vi.mock("@/lib/ows/treasury", () => ({
  getTreasuryBalance: vi.fn(),
}));

import { getTreasuryBalance } from "@/lib/ows/treasury";

const mockedBalance = vi.mocked(getTreasuryBalance);

describe("evaluateReward", () => {
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
  });

  it("approves when treasury is funded", async () => {
    mockedBalance.mockResolvedValue(10_000_000_000_000_000n);
    const result = await evaluateReward({
      programId,
      learnerId: "learner-1",
      learnerWallet: TEST_LEARNER_WALLET,
      verification: { verified: true, course: "AI Ethics 101" },
    });
    expect(result).toEqual({ approved: true, amountUsdc: DEFAULT_REWARD_MON });
  });

  it("denies when treasury is empty", async () => {
    mockedBalance.mockResolvedValue(0n);
    const result = await evaluateReward({
      programId,
      learnerId: "learner-1",
      learnerWallet: TEST_LEARNER_WALLET,
      verification: { verified: true, course: "AI Ethics 101" },
    });
    expect(result).toEqual({ approved: false, reason: "Treasury underfunded" });
  });

  it("denies when daily cap reached", async () => {
    mockedBalance.mockResolvedValue(DEFAULT_DAILY_CAP_MON * 2n);
    const { payouts } = await import("@/lib/db/schema");
    await db.insert(payouts).values({
      id: uuidv4(),
      programId,
      learnerId: "other",
      learnerWallet: TEST_LEARNER_WALLET,
      amountUsdc: DEFAULT_DAILY_CAP_MON.toString(),
      txHash: "0xabc",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });

    const result = await evaluateReward({
      programId,
      learnerId: "learner-2",
      learnerWallet: TEST_LEARNER_WALLET,
      verification: { verified: true, course: "AI Ethics 101" },
    });
    expect(result.approved).toBe(false);
    if (!result.approved) {
      expect(result.reason).toBe("Daily cap reached");
    }
  });

  it("denies duplicate payout", async () => {
    mockedBalance.mockResolvedValue(10_000_000_000_000_000n);
    const { payouts } = await import("@/lib/db/schema");
    await db.insert(payouts).values({
      id: uuidv4(),
      programId,
      learnerId: "learner-1",
      learnerWallet: TEST_LEARNER_WALLET,
      amountUsdc: DEFAULT_REWARD_MON.toString(),
      txHash: "0xdef",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });

    const result = await evaluateReward({
      programId,
      learnerId: "learner-1",
      learnerWallet: TEST_LEARNER_WALLET,
      verification: { verified: true, course: "AI Ethics 101" },
    });
    expect(result).toEqual({ approved: false, reason: "Duplicate payout" });
  });
});
