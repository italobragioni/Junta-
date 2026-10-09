"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Flame, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { QuestionView, type GradeResult } from "./question-view";
import type { ClientQuestion, Source, TeachingScreen } from "@/lib/content/types";

export interface CompletionSummary {
  firstCompletion: boolean;
  xpAwarded: number;
  newAchievements: string[];
}

/**
 * Drives a lesson: teaching screens, then the questions in a single pass. Each
 * question is answered once; the correct answer, explanation and source appear
 * after the attempt, then the learner moves on — no punishment, no time
 * pressure, no repeating until correct. Wrong answers are saved for the
 * "Revisar" section. Completion is confirmed by the server via `onComplete`.
 */
export function LessonFlow({
  teaching,
  questions,
  sources,
  grade,
  onComplete,
  isReview = false,
  backHref = "/aprender",
}: {
  teaching: TeachingScreen[];
  questions: ClientQuestion[];
  sources: Source[];
  grade: (questionId: string, optionId: string) => Promise<GradeResult>;
  onComplete: () => Promise<CompletionSummary>;
  isReview?: boolean;
  backHref?: string;
}) {
  const [phase, setPhase] = useState<"intro" | "quiz" | "done">(
    teaching.length > 0 && !isReview ? "intro" : "quiz",
  );
  const [teachIdx, setTeachIdx] = useState(0);

  // Single linear pass through the questions.
  const [idx, setIdx] = useState(0);

  const [summary, setSummary] = useState<CompletionSummary | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = questions.length;
  const currentQuestion: ClientQuestion | undefined = questions[idx];

  async function handleContinue() {
    if (idx + 1 < total) {
      setIdx((i) => i + 1);
      return;
    }
    // Last question answered → confirm completion on the server.
    setFinishing(true);
    setError(null);
    try {
      const s = await onComplete();
      setSummary(s);
      setPhase("done");
    } catch {
      setError("Não foi possível concluir a lição. Tente novamente.");
    } finally {
      setFinishing(false);
    }
  }

  if (phase === "intro") {
    const screen = teaching[teachIdx];
    const isLast = teachIdx + 1 >= teaching.length;
    return (
      <div className="animate-fade-in">
        <ProgressBar
          value={teachIdx + 1}
          max={teaching.length}
          label="Progresso da explicação"
          className="mb-6"
        />
        <h2 className="mb-4 text-2xl font-extrabold leading-tight">{screen.title}</h2>
        <div className="flex flex-col gap-3 text-lg leading-relaxed text-foreground/90">
          {screen.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Button
          size="lg"
          className="mt-8 w-full"
          onClick={() => (isLast ? setPhase("quiz") : setTeachIdx((i) => i + 1))}
        >
          {isLast ? "Começar as questões" : "Avançar"}
        </Button>
      </div>
    );
  }

  if (phase === "done" && summary) {
    return (
      <div className="animate-fade-in text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
          <Sparkles className="h-8 w-8 text-brand-700" aria-hidden />
        </div>
        <h2 className="text-2xl font-extrabold">Lição concluída!</h2>
        <p className="mt-2 text-muted-foreground">
          {isReview
            ? "Boa! Revisão concluída."
            : summary.firstCompletion
              ? "Você concluiu esta lição pela primeira vez."
              : "Você revisou esta lição."}
        </p>

        {summary.xpAwarded > 0 && (
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2 text-base font-bold text-ink">
            <Flame className="h-5 w-5 text-gold-500" aria-hidden />+{summary.xpAwarded} XP
          </div>
        )}

        {summary.newAchievements.length > 0 && (
          <div className="mt-4 flex flex-col items-center gap-2">
            {summary.newAchievements.map((code) => (
              <span
                key={code}
                className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-sm font-semibold text-ink"
              >
                <Trophy className="h-4 w-4 text-gold-500" aria-hidden /> Nova conquista!
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={backHref}
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Voltar às trilhas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar
        value={idx}
        max={total}
        label="Progresso das questões"
        className="mb-6"
      />
      {currentQuestion && (
        <QuestionView
          key={currentQuestion.id}
          question={currentQuestion}
          index={idx}
          total={total}
          sources={sources}
          grade={(optionId) => grade(currentQuestion.id, optionId)}
          onContinue={handleContinue}
        />
      )}
      {finishing && <p className="mt-4 text-center text-sm text-muted-foreground">Concluindo…</p>}
      {error && (
        <p role="alert" className="mt-4 text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
