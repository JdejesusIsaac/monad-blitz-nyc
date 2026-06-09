import { NextResponse } from "next/server";
import { count, desc, eq } from "drizzle-orm";

import { runMigrations, db } from "@/lib/db";
import { payouts } from "@/lib/db/schema";
import {
  getTreasuryAddress,
  getTreasuryBalance,
} from "@/lib/ows/treasury";

runMigrations();

export async function GET() {
  try {
    const address = await getTreasuryAddress();
    const balance = address ? await getTreasuryBalance() : BigInt(0);
    const [payoutCount] = await db
      .select({ count: count() })
      .from(payouts)
      .where(eq(payouts.status, "confirmed"));

    const recentPayouts = await db
      .select()
      .from(payouts)
      .orderBy(desc(payouts.createdAt))
      .limit(20);

    return NextResponse.json({
      address,
      balanceMon: balance.toString(),
      balanceUsdc: balance.toString(),
      rewardsSent: payoutCount?.count ?? 0,
      recentPayouts,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
