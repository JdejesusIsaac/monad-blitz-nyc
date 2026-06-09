import { db, runMigrations } from "@/lib/db";
import {
  completions,
  enrollments,
  institutions,
  payouts,
  programs,
  treasury,
} from "@/lib/db/schema";

let migrated = false;

export function ensureTestDb(): void {
  if (!migrated) {
    runMigrations();
    migrated = true;
  }
}

export async function resetTestDb(): Promise<void> {
  ensureTestDb();
  await db.delete(completions);
  await db.delete(payouts);
  await db.delete(enrollments);
  await db.delete(programs);
  await db.delete(treasury);
  await db.delete(institutions);
}

export async function seedTestInstitution(id = "nypl"): Promise<void> {
  await db.insert(institutions).values({
    id,
    name: "NYPL",
    createdAt: new Date().toISOString(),
  });
}
