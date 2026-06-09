import { and, eq, gte, sql } from "drizzle-orm";

import { db } from "../db";
import { payouts, programs } from "../db/schema";
import { getTreasuryBalance } from "../ows/treasury";
import type { EvaluateInput, EvaluateResult, PolicyEvaluationResponse } from "./types";

function startOfUtcDayIso(): string {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString();
}

export async function evaluateReward(
  input: EvaluateInput
): Promise<EvaluateResult> {
  if (!input.verification.verified) {
    return { approved: false, reason: "Verification failed" };
  }

  const [program] = await db
    .select()
    .from(programs)
    .where(eq(programs.id, input.programId))
    .limit(1);

  if (!program) {
    return { approved: false, reason: "Program not found" };
  }

  if (!program.rewardAmountUsdc || BigInt(program.rewardAmountUsdc) <= 0n) {
    return { approved: false, reason: "Reward not configured for program" };
  }

  const amountUsdc = BigInt(program.rewardAmountUsdc);
  const treasuryBalance = await getTreasuryBalance();

  if (treasuryBalance < amountUsdc) {
    return { approved: false, reason: "Treasury underfunded" };
  }

  const dayStart = startOfUtcDayIso();
  const [dailyRow] = await db
    .select({
      total: sql<string>`coalesce(sum(${payouts.amountUsdc}), '0')`.as("total"),
    })
    .from(payouts)
    .where(
      and(
        eq(payouts.programId, input.programId),
        eq(payouts.status, "confirmed"),
        gte(payouts.createdAt, dayStart)
      )
    );

  const dailyTotal = BigInt(dailyRow?.total ?? "0");
  const dailyCap = BigInt(program.dailyCapUsdc);

  if (dailyTotal + amountUsdc > dailyCap) {
    return { approved: false, reason: "Daily cap reached" };
  }

  const [existing] = await db
    .select()
    .from(payouts)
    .where(
      and(
        eq(payouts.programId, input.programId),
        eq(payouts.learnerId, input.learnerId),
        eq(payouts.status, "confirmed")
      )
    )
    .limit(1);

  if (existing) {
    return { approved: false, reason: "Duplicate payout" };
  }

  return { approved: true, amountUsdc };
}

export function toPolicyResponse(result: EvaluateResult): PolicyEvaluationResponse {
  if (result.approved) {
    return { approved: true };
  }
  return { approved: false, reason: result.reason };
}
