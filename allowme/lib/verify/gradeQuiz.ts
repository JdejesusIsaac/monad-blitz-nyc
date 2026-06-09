import type { VerificationPayload } from "../policy/types";

const PASSING_SCORE = 80;

export type QuizAnswer = {
  questionId: string;
  selectedIndex: number;
};

export type QuizQuestion = {
  id: string;
  correctIndex: number;
};

export function gradeQuiz(
  questions: QuizQuestion[],
  answers: QuizAnswer[]
): { score: number; passed: boolean } {
  if (questions.length === 0) {
    return { score: 0, passed: false };
  }

  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedIndex]));
  let correct = 0;

  for (const q of questions) {
    if (answerMap.get(q.id) === q.correctIndex) {
      correct += 1;
    }
  }

  const score = Math.round((correct / questions.length) * 100);
  return { score, passed: score >= PASSING_SCORE };
}

export function verifyCompletion(score: number): VerificationPayload {
  const passed = score >= PASSING_SCORE;
  return {
    verified: passed,
    course: "AI Ethics 101",
  };
}
