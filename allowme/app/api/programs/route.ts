import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

import { runMigrations, db } from "@/lib/db";
import { programs } from "@/lib/db/schema";
import { DEFAULT_REWARD_USDC } from "@/lib/monad/config";

runMigrations();

export async function GET() {
  const rows = await db.select().from(programs);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      institutionId: string;
      name: string;
      rewardAmountUsdc?: string;
      dailyCapUsdc?: string;
      courseSlug?: string;
    };

    if (!body.institutionId || !body.name) {
      return NextResponse.json(
        { error: "institutionId and name are required" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const [program] = await db
      .insert(programs)
      .values({
        id,
        institutionId: body.institutionId,
        name: body.name,
        rewardAmountUsdc:
          body.rewardAmountUsdc ?? DEFAULT_REWARD_USDC.toString(),
        dailyCapUsdc: body.dailyCapUsdc ?? "100000000",
        courseSlug: body.courseSlug ?? "ai-ethics-101",
        createdAt: now,
      })
      .returning();

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      id: string;
      rewardAmountUsdc?: string;
      dailyCapUsdc?: string;
    };

    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updates: Partial<typeof programs.$inferInsert> = {};
    if (body.rewardAmountUsdc) updates.rewardAmountUsdc = body.rewardAmountUsdc;
    if (body.dailyCapUsdc) updates.dailyCapUsdc = body.dailyCapUsdc;

    const [program] = await db
      .update(programs)
      .set(updates)
      .where(eq(programs.id, body.id))
      .returning();

    return NextResponse.json(program);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
