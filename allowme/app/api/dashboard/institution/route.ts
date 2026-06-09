import { NextResponse } from "next/server";
import { count, desc, eq, sum } from "drizzle-orm";

import { runMigrations, db } from "@/lib/db";
import { completions, enrollments, payouts, programs } from "@/lib/db/schema";
import { getTreasuryAddress, getTreasuryBalance } from "@/lib/ows/treasury";
import { txExplorerUrl } from "@/lib/monad/config";

runMigrations();

export async function GET() {
  try {
    const address = await getTreasuryAddress();
    const balance = address ? await getTreasuryBalance() : BigInt(0);

    const programRows = await db.select().from(programs);

    const programsWithStats = await Promise.all(
      programRows.map(async (program) => {
        const [completionCount] = await db
          .select({ count: count() })
          .from(completions)
          .innerJoin(enrollments, eq(completions.enrollmentId, enrollments.id))
          .where(eq(enrollments.programId, program.id));

        const [rewardTotal] = await db
          .select({ total: sum(payouts.amountUsdc) })
          .from(payouts)
          .where(eq(payouts.programId, program.id));

        return {
          ...program,
          completions: completionCount?.count ?? 0,
          totalRewardedUsdc: rewardTotal?.total ?? "0",
        };
      })
    );

    const recentPayouts = await db
      .select()
      .from(payouts)
      .where(eq(payouts.status, "confirmed"))
      .orderBy(desc(payouts.createdAt))
      .limit(20);

    return NextResponse.json({
      treasury: {
        address,
        balanceUsdc: balance.toString(),
      },
      programs: programsWithStats,
      recentPayouts: recentPayouts.map((p) => ({
        ...p,
        explorerLink: p.txHash ? txExplorerUrl(p.txHash) : null,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
