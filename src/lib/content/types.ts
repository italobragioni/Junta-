/**
 * Content domain model.
 *
 * This is the authoring representation of trails, lessons, questions and
 * sources. It is the single source of truth that feeds:
 *   - the isolated demonstration experience (no backend),
 *   - the database seed (supabase/seed.sql is generated from it),
 *   - development/preview rendering.
 *
 * IMPORTANT: a question's `correctOptionId` is the answer key. It must NEVER be
 * serialized to the browser before the learner has submitted an answer. Use
 * `toClientQuestion()` (see sanitize.ts) at every boundary that reaches the
 * client.
 */

/** Editorial lifecycle. Only `publicado` content is shown to learners. */
export type EditorialStatus =
  | "rascunho" // draft — complete but not verified / not for learners
  | "em_revisao" // in review
  | "publicado" // published
  | "arquivado"; // archived

/** What kind of claim a source backs — drives how carefully it must be read. */
export type SourceNature =
  | "fato_institucional" // stable institutional fact (laws, structure)
  | "conceito_interpretativo" // interpretive concept (ideologies, debates)
  | "dado_datado"; // time-stamped datum (an indicator at a point in time)

export type Plan = "free" | "premium";

export type QuestionKind = "multipla_escolha" | "verdadeiro_falso";

export interface Source {
  id: string;
  title: string;
  /** URL of the source actually consulted. Never fabricate one. */
  url: string;
  /** ISO date the source was consulted (YYYY-MM-DD). */
  consultedAt: string;
  /** The relevant article/section/excerpt consulted. */
  excerpt: string;
  nature: SourceNature;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  kind: QuestionKind;
  /** The learning objective this question checks. */
  objective: string;
  prompt: string;
  options: QuestionOption[];
  /** ANSWER KEY — server-only. Must be stripped before reaching the client. */
  correctOptionId: string;
  /** Shown only after an answer is recorded. */
  explanation: string;
  /** Ids into the lesson's `sources`. */
  sourceIds: string[];
}

export interface TeachingScreen {
  title: string;
  /** Short paragraphs in plain Portuguese. */
  body: string[];
}

export interface Lesson {
  id: string;
  slug: string;
  /** 1-based order within its trail. */
  order: number;
  title: string;
  objective: string;
  /** Minimum plan required to access when published. */
  plan: Plan;
  status: EditorialStatus;
  /** 2–3 short explanation screens shown before the questions. */
  teaching: TeachingScreen[];
  questions: Question[];
  sources: Source[];
  /** Editorial version. A started session is pinned to the version it began on. */
  version: number;
  /** ISO date of last revision (YYYY-MM-DD). */
  revisedAt: string;
}

export interface LearningPath {
  id: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

/** Shape sent to the client: answer key and correctness removed. */
export interface ClientQuestion {
  id: string;
  kind: QuestionKind;
  objective: string;
  prompt: string;
  options: QuestionOption[];
}
