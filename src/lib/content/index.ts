import type { Lesson, LearningPath, Question } from "./types";
import { trailA } from "./trails/trail-a";
import { trailB } from "./trails/trail-b";
import { trailC } from "./trails/trail-c";
import { trailD } from "./trails/trail-d";
import { trailE } from "./trails/trail-e";
import { trailF } from "./trails/trail-f";
import { trailG } from "./trails/trail-g";
import { trailH } from "./trails/trail-h";
import { trailI } from "./trails/trail-i";
import { trailJ } from "./trails/trail-j";
import { trailK } from "./trails/trail-k";
import { trailL } from "./trails/trail-l";
import { trailM } from "./trails/trail-m";
import { trailN } from "./trails/trail-n";

/** All trails, in display order. Source of truth for seed + demo + dev. */
export const TRAILS: LearningPath[] = [
  trailA,
  trailB,
  trailC,
  trailD,
  trailE,
  trailF,
  trailG,
  trailH,
  trailI,
  trailJ,
  trailK,
  trailL,
  trailM,
  trailN,
].sort((a, b) => a.order - b.order);

export function allLessons(): Lesson[] {
  return TRAILS.flatMap((t) => t.lessons);
}

export function publishedLessons(): Lesson[] {
  return allLessons().filter((l) => l.status === "publicado");
}

export function findLessonById(id: string): Lesson | undefined {
  return allLessons().find((l) => l.id === id);
}

export function findTrailOfLesson(lessonId: string): LearningPath | undefined {
  return TRAILS.find((t) => t.lessons.some((l) => l.id === lessonId));
}

/** The lesson immediately before `lessonId` within its trail (the prerequisite). */
export function prerequisiteLesson(lessonId: string): Lesson | undefined {
  const trail = findTrailOfLesson(lessonId);
  if (!trail) return undefined;
  const idx = trail.lessons.findIndex((l) => l.id === lessonId);
  return idx > 0 ? trail.lessons[idx - 1] : undefined;
}

export function findQuestion(
  lessonId: string,
  questionId: string,
): Question | undefined {
  return findLessonById(lessonId)?.questions.find((q) => q.id === questionId);
}

/** Server-only answer key for a lesson: questionId -> correctOptionId. */
export function answerKeyFor(lessonId: string): Record<string, string> {
  const lesson = findLessonById(lessonId);
  if (!lesson) return {};
  return Object.fromEntries(
    lesson.questions.map((q) => [q.id, q.correctOptionId]),
  );
}
