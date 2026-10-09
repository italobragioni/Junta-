import type {
  EditorialStatus,
  LearningPath,
  Lesson,
  Plan,
  Question,
  Source,
  TeachingScreen,
} from "./types";

/**
 * Compact authoring helpers so we can write large question banks with quality
 * (and without repetitive boilerplate). Question ids are derived from the
 * lesson id and are therefore globally unique (review_items is keyed by
 * question id across all lessons).
 */

const LETTERS = ["a", "b", "c", "d", "e"];

/** Multiple-choice question spec: options + index of the correct one. */
type MCSpec = [
  kind: "mc",
  objective: string,
  prompt: string,
  options: string[],
  correct: number,
  explanation: string,
  sourceIds?: string[],
];

/** True/false question spec. */
type TFSpec = [
  kind: "tf",
  objective: string,
  prompt: string,
  correct: boolean,
  explanation: string,
  sourceIds?: string[],
];

export type QSpec = MCSpec | TFSpec;

export function buildQuestions(lessonId: string, specs: QSpec[]): Question[] {
  return specs.map((s, i) => {
    const id = `${lessonId}-q${i + 1}`;
    if (s[0] === "mc") {
      const [, objective, prompt, options, correct, explanation, sourceIds = []] = s;
      return {
        id,
        kind: "multipla_escolha",
        objective,
        prompt,
        options: options.map((text, idx) => ({ id: LETTERS[idx], text })),
        correctOptionId: LETTERS[correct],
        explanation,
        sourceIds,
      };
    }
    const [, objective, prompt, correct, explanation, sourceIds = []] = s;
    return {
      id,
      kind: "verdadeiro_falso",
      objective,
      prompt,
      options: [
        { id: "v", text: "Verdadeiro" },
        { id: "f", text: "Falso" },
      ],
      correctOptionId: correct ? "v" : "f",
      explanation,
      sourceIds,
    };
  });
}

export interface LessonInput {
  id: string;
  slug: string;
  order: number;
  title: string;
  objective: string;
  plan?: Plan;
  status?: EditorialStatus;
  version?: number;
  revisedAt?: string;
  sources: Source[];
  teaching: TeachingScreen[];
  specs: QSpec[];
}

/** Build a lesson. Defaults to a Premium draft (editorial review required). */
export function buildLesson(l: LessonInput): Lesson {
  return {
    id: l.id,
    slug: l.slug,
    order: l.order,
    title: l.title,
    objective: l.objective,
    plan: l.plan ?? "premium",
    status: l.status ?? "rascunho",
    version: l.version ?? 1,
    revisedAt: l.revisedAt ?? "2026-10-09",
    sources: l.sources,
    teaching: l.teaching,
    questions: buildQuestions(l.id, l.specs),
  };
}

export function buildTrail(t: {
  id: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  lessons: Lesson[];
}): LearningPath {
  return t;
}

/**
 * Mark every lesson of a trail as published. Use only for content the owner
 * has decided to publish (clean, source-anchored, no RASCUNHO placeholders).
 */
export function publishTrail(trail: LearningPath): LearningPath {
  return {
    ...trail,
    lessons: trail.lessons.map((l) => ({ ...l, status: "publicado" as const })),
  };
}

/** A short teaching screen. */
export function screen(title: string, ...body: string[]): TeachingScreen {
  return { title, body };
}
