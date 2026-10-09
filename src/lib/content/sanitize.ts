import type { ClientQuestion, Question } from "./types";

/**
 * Strip the answer key from a question before it crosses to the client.
 * The correct option and explanation are only revealed AFTER the server has
 * recorded the learner's attempt.
 */
export function toClientQuestion(q: Question): ClientQuestion {
  return {
    id: q.id,
    kind: q.kind,
    objective: q.objective,
    prompt: q.prompt,
    options: q.options.map((o) => ({ id: o.id, text: o.text })),
  };
}
