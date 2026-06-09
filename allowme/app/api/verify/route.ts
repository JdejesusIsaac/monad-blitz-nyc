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

/**
 * AI Best Practices Quiz — 17 questions, 80+ to pass.
 * Sections: Basic AI Understanding (1-4), Safe AI Behavior (5-8),
 *           Prompting Skills (9-11), Critical Thinking (12-14),
 *           Scenario Questions (15-17).
 * Q11 rephrased as single-select: D = "All of the above" (index 3).
 */
const AI_ETHICS_QUESTIONS: QuizQuestion[] = [
  { id: "q1",  correctIndex: 1 }, // B — help you learn, brainstorm, work faster
  { id: "q2",  correctIndex: 1 }, // B — verify important information
  { id: "q3",  correctIndex: 2 }, // C — check reliable sources, ask follow-ups
  { id: "q4",  correctIndex: 1 }, // B — predicts and generates information
  { id: "q5",  correctIndex: 2 }, // C — No
  { id: "q6",  correctIndex: 2 }, // C — personal passwords or private family details
  { id: "q7",  correctIndex: 1 }, // B — fact-check and understand it first
  { id: "q8",  correctIndex: 2 }, // C — correct it and ask better questions
  { id: "q9",  correctIndex: 2 }, // C — "Give me 5 creative science project ideas..."
  { id: "q10", correctIndex: 1 }, // B — help AI give more useful answers
  { id: "q11", correctIndex: 3 }, // D — All of the above (clear goal + context + details + format)
  { id: "q12", correctIndex: 1 }, // B — ask questions and verify
  { id: "q13", correctIndex: 1 }, // B — think smarter and faster
  { id: "q14", correctIndex: 1 }, // B — asking for help understanding math
  { id: "q15", correctIndex: 1 }, // B — ask AI to explain and fact-check
  { id: "q16", correctIndex: 2 }, // C — check trusted sources or professionals
  { id: "q17", correctIndex: 1 }, // B — "No technology is perfect — it should still be checked."
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
