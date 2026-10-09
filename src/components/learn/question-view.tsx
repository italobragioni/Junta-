"use client";

import { useState } from "react";
import { Check, X, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ClientQuestion, Source } from "@/lib/content/types";

export interface GradeResult {
  correct: boolean;
  correctOptionId: string;
  explanation: string;
}

/**
 * One question. The answer button only enables after an option is selected.
 * The correct answer, explanation and source appear ONLY after the attempt is
 * graded (the grader returns them). Works by simple tap and with keyboard /
 * screen readers; it never depends on color, sound, animation or timing.
 */
export function QuestionView({
  question,
  index,
  total,
  sources,
  grade,
  onContinue,
}: {
  question: ClientQuestion;
  index: number;
  total: number;
  sources: Source[];
  grade: (optionId: string) => Promise<GradeResult>;
  onContinue: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answered = result !== null;

  async function submit() {
    if (!selected || answered) return;
    setSubmitting(true);
    setError(null);
    try {
      setResult(await grade(selected));
    } catch {
      setError("Não foi possível registrar sua resposta. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  const relevantSources = sources; // sources attached at the lesson level

  return (
    <div className="animate-fade-in">
      <p className="mb-2 text-sm font-medium text-muted-foreground">
        Questão {index + 1} de {total}
      </p>
      <h2 className="mb-5 text-xl font-bold leading-snug">{question.prompt}</h2>

      <div role="radiogroup" aria-label="Alternativas" className="flex flex-col gap-3">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrect = answered && result?.correctOptionId === opt.id;
          const isWrongPick = answered && isSelected && !result?.correct;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={answered}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                !answered && isSelected && "border-brand-500 bg-brand-50",
                !answered && !isSelected && "border-border bg-card hover:bg-muted",
                isCorrect && "border-emerald-500 bg-emerald-50",
                isWrongPick && "border-red-400 bg-red-50",
                answered && !isCorrect && !isWrongPick && "border-border bg-card opacity-70",
              )}
            >
              <span>{opt.text}</span>
              {isCorrect && <Check className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />}
              {isWrongPick && <X className="h-5 w-5 shrink-0 text-red-600" aria-hidden />}
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {!answered ? (
        <Button
          className="mt-6 w-full"
          size="lg"
          disabled={!selected || submitting}
          onClick={submit}
        >
          {submitting ? "Registrando…" : "Responder"}
        </Button>
      ) : (
        <div className="mt-6">
          <div
            className={cn(
              "rounded-2xl border p-4",
              result?.correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50",
            )}
          >
            <p className="mb-1 font-bold">
              {result?.correct ? "Correto!" : "Vamos revisar."}
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              {result?.explanation}
            </p>
            {relevantSources.length > 0 && (
              <div className="mt-3 flex flex-col gap-1">
                {relevantSources.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 underline underline-offset-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    Fonte: {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>
          <Button className="mt-4 w-full" size="lg" variant="primary" onClick={onContinue}>
            {index + 1 < total ? "Continuar" : "Concluir"}
          </Button>
        </div>
      )}
    </div>
  );
}
