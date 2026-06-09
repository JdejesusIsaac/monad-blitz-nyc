import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { and, eq } from "drizzle-orm";

import { runMigrations, db } from "@/lib/db";
import { completions, enrollments } from "@/lib/db/schema";
import { executeReward } from "@/lib/rewards/executeReward";
import {
  gradeQuiz,
  verifyCompletion,
  type QuizAnswer,
  type QuizQuestion,
} from "@/lib/verify/gradeQuiz";

runMigrations();

/** Mock AI Ethics 101 quiz — 5 questions, 80+ to pass. */
const AI_ETHICS_QUESTIONS: QuizQuestion[] = [
  { id: "q1", correctIndex: 1 },
  { id: "q2", correctIndex: 0 },
  { id: "q3", correctIndex: 2 },
  { id: "q4", correctIndex: 1 },
  { id: "q5", correctIndex: 0 },
];

type VerifyBody = {
  programId: string;
  learnerId: string;
  learnerWallet: string;
  answers: QuizAnswer[];
  score?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyBody;

    if (!body.programId || !body.learnerId || !body.learnerWallet) {
      return NextResponse.json(
        { error: "programId, learnerId, and learnerWallet are required" },
        { status: 400 }
      );
    }

    let score = body.score;
    if (score === undefined) {
      if (!body.answers?.length) {
        return NextResponse.json(
          { error: "answers or score required" },
          { status: 400 }
        );
      }
      const graded = gradeQuiz(AI_ETHICS_QUESTIONS, body.answers);
      score = graded.score;
    }

    const verification = verifyCompletion(score);

    let [enrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.programId, body.programId),
          eq(enrollments.learnerId, body.learnerId)
        )
      )
      .limit(1);

    if (!enrollment) {
      [enrollment] = await db
        .insert(enrollments)
        .values({
          id: uuidv4(),
          programId: body.programId,
          learnerId: body.learnerId,
          learnerWallet: body.learnerWallet,
          createdAt: new Date().toISOString(),
        })
        .returning();
    }

    await db.insert(completions).values({
      id: uuidv4(),
      enrollmentId: enrollment.id,
      score,
      verified: verification.verified,
      verifiedAt: verification.verified ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
    });

    if (!verification.verified) {
      return NextResponse.json({
        verified: false,
        course: verification.course,
        score,
      });
    }

    const reward = await executeReward({
      programId: body.programId,
      learnerId: body.learnerId,
      learnerWallet: body.learnerWallet,
      verification,
    });

    return NextResponse.json({
      verified: true,
      course: verification.course,
      score,
      reward,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
