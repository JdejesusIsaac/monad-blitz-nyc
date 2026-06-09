import { describe, expect, it } from "vitest";

import { gradeQuiz, verifyCompletion } from "@/lib/verify/gradeQuiz";

describe("gradeQuiz", () => {
  const questions = [
    { id: "q1", correctIndex: 1 },
    { id: "q2", correctIndex: 0 },
    { id: "q3", correctIndex: 2 },
    { id: "q4", correctIndex: 1 },
    { id: "q5", correctIndex: 0 },
  ];

  it("passes at 80+", () => {
    const answers = [
      { questionId: "q1", selectedIndex: 1 },
      { questionId: "q2", selectedIndex: 0 },
      { questionId: "q3", selectedIndex: 2 },
      { questionId: "q4", selectedIndex: 1 },
      { questionId: "q5", selectedIndex: 1 },
    ];
    const result = gradeQuiz(questions, answers);
    expect(result.score).toBe(80);
    expect(result.passed).toBe(true);
  });

  it("fails below 80", () => {
    const answers = [
      { questionId: "q1", selectedIndex: 0 },
      { questionId: "q2", selectedIndex: 1 },
      { questionId: "q3", selectedIndex: 0 },
      { questionId: "q4", selectedIndex: 0 },
      { questionId: "q5", selectedIndex: 1 },
    ];
    const result = gradeQuiz(questions, answers);
    expect(result.score).toBeLessThan(80);
    expect(result.passed).toBe(false);
  });
});

describe("verifyCompletion", () => {
  it("returns verified for passing score", () => {
    expect(verifyCompletion(92)).toEqual({
      verified: true,
      course: "AI Ethics 101",
    });
  });

  it("returns unverified for failing score", () => {
    expect(verifyCompletion(70).verified).toBe(false);
  });
});
