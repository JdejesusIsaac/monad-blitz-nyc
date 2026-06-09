import { NextResponse } from "next/server";

import { runMigrations } from "@/lib/db";
import { executeReward } from "@/lib/rewards/executeReward";
import type { VerificationPayload } from "@/lib/policy/types";

runMigrations();

type ExecuteBody = {
  programId: string;
  learnerId: string;
  learnerWallet: string;
  verification: VerificationPayload;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExecuteBody;

    if (
      !body.programId ||
      !body.learnerId ||
      !body.learnerWallet ||
      !body.verification
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await executeReward(body);

    if (!result.ok) {
      const status =
        result.error === "policy_denied"
          ? 403
          : result.error === "invalid_learner_wallet"
            ? 400
            : 502;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
