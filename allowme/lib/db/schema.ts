import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const institutions = sqliteTable("institutions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

export const treasury = sqliteTable("treasury", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  walletName: text("wallet_name").notNull(),
  address: text("address").notNull(),
  agentKeyId: text("agent_key_id"),
  agentKeyName: text("agent_key_name"),
  createdAt: text("created_at").notNull(),
});

export const programs = sqliteTable("programs", {
  id: text("id").primaryKey(),
  institutionId: text("institution_id")
    .notNull()
    .references(() => institutions.id),
  name: text("name").notNull(),
  rewardAmountUsdc: text("reward_amount_usdc").notNull(),
  dailyCapUsdc: text("daily_cap_usdc").notNull(),
  courseSlug: text("course_slug").notNull(),
  createdAt: text("created_at").notNull(),
});

export const enrollments = sqliteTable(
  "enrollments",
  {
    id: text("id").primaryKey(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id),
    learnerId: text("learner_id").notNull(),
    learnerWallet: text("learner_wallet").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("enrollments_program_learner_idx").on(
      table.programId,
      table.learnerId
    ),
  ]
);

export const completions = sqliteTable("completions", {
  id: text("id").primaryKey(),
  enrollmentId: text("enrollment_id")
    .notNull()
    .references(() => enrollments.id),
  score: integer("score").notNull(),
  verified: integer("verified", { mode: "boolean" }).notNull(),
  verifiedAt: text("verified_at"),
  createdAt: text("created_at").notNull(),
});

export const payouts = sqliteTable(
  "payouts",
  {
    id: text("id").primaryKey(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id),
    learnerId: text("learner_id").notNull(),
    learnerWallet: text("learner_wallet").notNull(),
    amountUsdc: text("amount_usdc").notNull(),
    txHash: text("tx_hash"),
    status: text("status").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("payouts_program_learner_idx").on(
      table.programId,
      table.learnerId
    ),
  ]
);

export type Institution = typeof institutions.$inferSelect;
export type Treasury = typeof treasury.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Completion = typeof completions.$inferSelect;
export type Payout = typeof payouts.$inferSelect;
