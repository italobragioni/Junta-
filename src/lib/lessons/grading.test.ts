import { describe, expect, it } from "vitest";

import {
  canComplete,
  countFirstTryCorrect,
  gradeAnswer,
  reviewQuestionIds,
  type QuestionProgress,
} from "./grading";

describe("gradeAnswer", () => {
  it("compares the selected option to the key", () => {
    const key = { questionId: "q1", correctOptionId: "b" };
    expect(gradeAnswer(key, "b")).toBe(true);
    expect(gradeAnswer(key, "a")).toBe(false);
  });
});

function p(partial: Partial<QuestionProgress> & { questionId: string }): QuestionProgress {
  return {
    answered: false,
    firstTryCorrect: false,
    everCorrect: false,
    ...partial,
  };
}

describe("canComplete", () => {
  it("requires every question answered and eventually correct (errors reviewed)", () => {
    const all = [
      p({ questionId: "1", answered: true, firstTryCorrect: true, everCorrect: true }),
      p({ questionId: "2", answered: true, firstTryCorrect: false, everCorrect: true }),
    ];
    expect(canComplete(all)).toBe(true);
  });

  it("is false when a wrong answer was not reviewed to correct", () => {
    const notReviewed = [
      p({ questionId: "1", answered: true, firstTryCorrect: true, everCorrect: true }),
      p({ questionId: "2", answered: true, firstTryCorrect: false, everCorrect: false }),
    ];
    expect(canComplete(notReviewed)).toBe(false);
  });

  it("is false with an unanswered question and false for empty", () => {
    expect(canComplete([p({ questionId: "1", answered: false })])).toBe(false);
    expect(canComplete([])).toBe(false);
  });
});

describe("countFirstTryCorrect / reviewQuestionIds", () => {
  const set = [
    p({ questionId: "1", answered: true, firstTryCorrect: true, everCorrect: true }),
    p({ questionId: "2", answered: true, firstTryCorrect: false, everCorrect: true }),
    p({ questionId: "3", answered: true, firstTryCorrect: false, everCorrect: false }),
  ];
  it("counts only first-try correct for XP", () => {
    expect(countFirstTryCorrect(set)).toBe(1);
  });
  it("lists the questions that were initially wrong (review set)", () => {
    expect(reviewQuestionIds(set)).toEqual(["2", "3"]);
  });
});
