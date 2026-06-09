import { NextResponse } from "next/server";
import { desc, eq, sum } from "drizzle-orm";

import { runMigrations, db } from "@/lib/db";
import { completions, enrollments, payouts, programs } from "@/lib/db/schema";
import { txExplorerUrl } from "@/lib/monad/config";

runMigrations();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json(
      { error: "wallet query param required" },
      { status: 400 }
    );
  }

  try {
    const learnerEnrollments = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.learnerWallet, wallet));

    const enrollmentIds = learnerEnrollments.map((e) => e.id);
    const programIds = [...new Set(learnerEnrollments.map((e) => e.programId))];

    const learnerCompletions =
      enrollmentIds.length > 0
        ? await db
            .select()
            .from(completions)
            .where(
              enrollmentIds.length === 1
                ? eq(completions.enrollmentId, enrollmentIds[0])
                : undefined
            )
            .orderBy(desc(completions.createdAt))
        : [];

    const learnerPayouts =
      programIds.length > 0
        ? await db
            .select()
            .from(payouts)
            .where(eq(payouts.learnerWallet, wallet))
            .orderBy(desc(payouts.createdAt))
        : [];

    const [totalEarned] = await db
      .select({ total: sum(payouts.amountUsdc) })
      .from(payouts)
      .where(eq(payouts.learnerWallet, wallet));

    const programRows =
      programIds.length > 0
        ? await db
            .select()
            .from(programs)
            .where(
              programIds.length === 1
                ? eq(programs.id, programIds[0])
                : undefined
            )
        : [];

    const programMap = new Map(programRows.map((p) => [p.id, p]));
    const enrollmentMap = new Map(learnerEnrollments.map((e) => [e.id, e]));

    const courseSummary = learnerEnrollments.map((enrollment) => {
      const program = programMap.get(enrollment.programId);
      const completion = learnerCompletions.find(
        (c) => c.enrollmentId === enrollment.id
      );
      const payout = learnerPayouts.find(
        (p) => p.programId === enrollment.programId
      );
      return {
        programId: enrollment.programId,
        programName: program?.name ?? "Unknown",
        courseSlug: program?.courseSlug ?? "",
        rewardAmountUsdc: program?.rewardAmountUsdc ?? "0",
        enrolled: true,
        completed: !!completion?.verified,
        score: completion?.score ?? null,
        verifiedAt: completion?.verifiedAt ?? null,
        payout: payout
          ? {
              txHash: payout.txHash,
              amountUsdc: payout.amountUsdc,
              status: payout.status,
              explorerLink: payout.txHash ? txExplorerUrl(payout.txHash) : null,
            }
          : null,
      };
    });

    return NextResponse.json({
      wallet,
      totalEarnedUsdc: totalEarned?.total ?? "0",
      courses: courseSummary,
      recentPayouts: learnerPayouts.map((p) => ({
        ...p,
        explorerLink: p.txHash ? txExplorerUrl(p.txHash) : null,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
