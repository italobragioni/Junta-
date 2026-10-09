"use client";

import { LessonFlow } from "@/components/learn/lesson-flow";
import { toClientQuestion } from "@/lib/content/sanitize";
import type { Lesson } from "@/lib/content/types";

/**
 * Demo lesson runner. Because the demo has no account and grants no reward,
 * it grades in the browser from the lesson's own keys. The authenticated
 * engine always grades on the server.
 */
export function DemoRunner({ lesson }: { lesson: Lesson }) {
  const keyMap = Object.fromEntries(lesson.questions.map((q) => [q.id, q.correctOptionId]));
  const explMap = Object.fromEntries(lesson.questions.map((q) => [q.id, q.explanation]));

  return (
    <LessonFlow
      teaching={lesson.teaching}
      questions={lesson.questions.map(toClientQuestion)}
      sources={lesson.sources}
      backHref="/criar-conta"
      grade={async (questionId, optionId) => ({
        correct: keyMap[questionId] === optionId,
        correctOptionId: keyMap[questionId],
        explanation: explMap[questionId],
      })}
      onComplete={async () => ({
        firstCompletion: false,
        xpAwarded: 0,
        newAchievements: [],
      })}
    />
  );
}
