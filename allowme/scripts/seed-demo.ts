import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

import { db, runMigrations } from "../lib/db";
import { institutions, programs } from "../lib/db/schema";
import { DEFAULT_DAILY_CAP_MON, DEFAULT_REWARD_MON } from "../lib/monad/config";

async function seed() {
  runMigrations();

  const institutionId = "nypl";
  const [existingInstitution] = await db
    .select()
    .from(institutions)
    .where(eq(institutions.id, institutionId))
    .limit(1);

  if (!existingInstitution) {
    await db.insert(institutions).values({
      id: institutionId,
      name: "New York Public Library",
      createdAt: new Date().toISOString(),
    });
    console.log("Created institution: NYPL");
  }

  const programRows = await db.select().from(programs).limit(1);
  if (programRows.length === 0) {
    const programId = uuidv4();
    await db.insert(programs).values({
      id: programId,
      institutionId,
      name: "NYPL AI Ethics Program",
      rewardAmountUsdc: DEFAULT_REWARD_MON.toString(),
      dailyCapUsdc: DEFAULT_DAILY_CAP_MON.toString(),
      courseSlug: "ai-ethics-101",
      createdAt: new Date().toISOString(),
    });
    console.log("Created program:", programId);
    console.log("NYPL AI Ethics Program — 0.01 MON reward");
  } else {
    console.log("Program already seeded:", programRows[0].id);
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
