import type { Address } from "viem";
import { v4 as uuidv4 } from "uuid";
import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { payouts } from "../db/schema";
import { assertValidLearnerWallet } from "../monad/wallet";
import { txExplorerUrl } from "../monad/config";
import { evaluateReward } from "../policy/evaluateReward";
import type { VerificationPayload } from "../policy/types";
import { signAndSendReward } from "../ows/treasury";

export type ExecuteRewardInput = {
  programId: string;
  learnerId: string;
  learnerWallet: string;
  verification: VerificationPayload;
};

export type ExecuteRewardSuccess = {
  ok: true;
  amount: string;
  txHash: string;
  explorerLink: string;
  payoutId: string;
  idempotent?: boolean;
};

export type ExecuteRewardFailure = {
  ok: false;
  error: string;
  reason?: string;
};

export type ExecuteRewardResult = ExecuteRewardSuccess | ExecuteRewardFailure;

export async function executeReward(
  input: ExecuteRewardInput
): Promise<ExecuteRewardResult> {
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

  if (existing?.txHash) {
    return {
      ok: true,
      amount: existing.amountUsdc,
      txHash: existing.txHash,
      explorerLink: txExplorerUrl(existing.txHash),
      payoutId: existing.id,
      idempotent: true,
    };
  }

  const evaluation = await evaluateReward(input);
  if (!evaluation.approved) {
    return { ok: false, error: "policy_denied", reason: evaluation.reason };
  }

  try {
    assertValidLearnerWallet(input.learnerWallet);
  } catch {
    return { ok: false, error: "invalid_learner_wallet" };
  }

  const payoutId = uuidv4();
  const now = new Date().toISOString();

  await db.insert(payouts).values({
    id: payoutId,
    programId: input.programId,
    learnerId: input.learnerId,
    learnerWallet: input.learnerWallet,
    amountUsdc: evaluation.amountUsdc.toString(),
    status: "pending",
    createdAt: now,
  });

  try {
    const { txHash } = await signAndSendReward(
      input.learnerWallet as Address,
      evaluation.amountUsdc
    );

    await db
      .update(payouts)
      .set({ txHash, status: "confirmed" })
      .where(eq(payouts.id, payoutId));

    return {
      ok: true,
      amount: evaluation.amountUsdc.toString(),
      txHash,
      explorerLink: txExplorerUrl(txHash),
      payoutId,
    };
  } catch (error) {
    await db.delete(payouts).where(eq(payouts.id, payoutId));

    const message = error instanceof Error ? error.message : String(error);
    if (/fetch|network|timeout|ECONNREFUSED/i.test(message)) {
      return { ok: false, error: "rpc_unavailable", reason: message };
    }
    if (/policy|denied|allow/i.test(message)) {
      return { ok: false, error: "ows_signing_failed", reason: message };
    }
    return { ok: false, error: "payout_failed", reason: message };
  }
}
