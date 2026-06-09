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
 * AI Ethics 101 — 17 questions, 80+ to pass.
 * Matches quizpage.tsx exactly. Q11 is multi-select (all 4 correct);
 * the quiz page sends score directly so correctIndex is for direct-API callers.
 * Sections: AI Ethics Foundations (1-3), Bias & Fairness (4-7),
 *           Transparency (8-10), Privacy (11-13), Societal Impact (14-17).
 */
const AI_ETHICS_QUESTIONS: QuizQuestion[] = [
  { id: "q1",  correctIndex: 1 }, // B — moral questions around design, deployment, impact
  { id: "q2",  correctIndex: 1 }, // B — AI pursues goals reflecting human values
  { id: "q3",  correctIndex: 1 }, // B — decisions can be reviewed, corrected, held accountable
  { id: "q4",  correctIndex: 2 }, // C — biased or unrepresentative training data
  { id: "q5",  correctIndex: 1 }, // B — systematic bias causing disparate impact
  { id: "q6",  correctIndex: 2 }, // C — equalised odds
  { id: "q7",  correctIndex: 2 }, // C — audit model outputs across subgroups
  { id: "q8",  correctIndex: 1 }, // B — internal decision process not interpretable
  { id: "q9",  correctIndex: 3 }, // D — explaining individual predictions
  { id: "q10", correctIndex: 1 }, // B — right of individuals to receive explanation
  { id: "q11", correctIndex: 0 }, // multi-select: all 4 correct; 0 used as fallback for direct callers
  { id: "q12", correctIndex: 1 }, // B — collecting only strictly necessary data
  { id: "q13", correctIndex: 1 }, // B — training locally, sharing only model updates
  { id: "q14", correctIndex: 1 }, // B — recruitment, credit scoring, law enforcement
  { id: "q15", correctIndex: 1 }, // B — spread misinformation, erode trust
  { id: "q16", correctIndex: 2 }, // C — accountability, transparency, fairness, risk assessment
  { id: "q17", correctIndex: 2 }, // C — ensure AI benefits society while managing risks
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
