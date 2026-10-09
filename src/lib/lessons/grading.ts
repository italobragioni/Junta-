/**
 * Pure grading helpers. Grading always happens on the server against the
 * answer_keys table (never exposed to the client), then the recorded attempt
 * unlocks the explanation.
 */

export interface AnswerKey {
  questionId: string;
  correctOptionId: string;
}

/** Grade a single submitted option against the key. */
export function gradeAnswer(
  key: AnswerKey,
  selectedOptionId: string,
): boolean {
  return key.correctOptionId === selectedOptionId;
}

export interface QuestionProgress {
  questionId: string;
  /** Whether any attempt has been recorded. */
  answered: boolean;
  /** Whether the FIRST attempt was correct (drives first-completion XP). */
  firstTryCorrect: boolean;
  /** Whether the question has since been answered correctly (review). */
  everCorrect: boolean;
}

/**
 * A lesson may be completed when every question has been answered AND every
 * question that was initially wrong has since been reviewed to a correct
 * answer (errors reviewed, not skipped). This encodes the rule "five questions
 * answered and errors reviewed to complete a lesson".
 */
export function canComplete(questions: QuestionProgress[]): boolean {
  if (questions.length === 0) return false;
  return questions.every((q) => q.answered && q.everCorrect);
}

/** Count of questions correct on the first attempt (for first-completion XP). */
export function countFirstTryCorrect(questions: QuestionProgress[]): number {
  return questions.filter((q) => q.firstTryCorrect).length;
}

/** Questions that were wrong on the first try — the review set for a lesson. */
export function reviewQuestionIds(questions: QuestionProgress[]): string[] {
  return questions
    .filter((q) => q.answered && !q.firstTryCorrect)
    .map((q) => q.questionId);
}
