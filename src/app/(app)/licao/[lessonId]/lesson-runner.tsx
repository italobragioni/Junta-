"use client";

import { useState } from "react";

import { LessonFlow } from "@/components/learn/lesson-flow";
import { Button } from "@/components/ui/button";
import type { ClientQuestion, Source, TeachingScreen } from "@/lib/content/types";
import {
  gradeQuestionAction,
  completeLessonAction,
  reportProblemAction,
} from "./actions";

export function LessonRunner({
  lessonId,
  sessionId,
  teaching,
  questions,
  sources,
  isReview,
}: {
  lessonId: string;
  sessionId: string;
  teaching: TeachingScreen[];
  questions: ClientQuestion[];
  sources: Source[];
  isReview: boolean;
}) {
  return (
    <div>
      <LessonFlow
        teaching={teaching}
        questions={questions}
        sources={sources}
        isReview={isReview}
        backHref={isReview ? "/revisar" : "/aprender"}
        grade={(questionId, optionId) =>
          gradeQuestionAction({ sessionId, questionId, optionId })
        }
        onComplete={() => completeLessonAction(sessionId)}
      />
      <ReportProblem lessonId={lessonId} />
    </div>
  );
}

function ReportProblem({ lessonId }: { lessonId: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setStatus("sending");
    setError(null);
    const res = await reportProblemAction({ lessonId, message });
    if (res.ok) {
      setStatus("sent");
      setMessage("");
    } else {
      setStatus("error");
      setError(res.error ?? "Erro ao enviar.");
    }
  }

  return (
    <div className="mt-10 border-t border-border pt-5">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm font-medium text-muted-foreground underline underline-offset-2"
        >
          Reportar problema nesta lição
        </button>
      ) : status === "sent" ? (
        <p role="status" className="text-sm text-emerald-700">
          Obrigado! Seu relato foi registrado e será revisado.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor="report" className="text-sm font-medium">
            O que está errado ou confuso?
          </label>
          <textarea
            id="report"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-input bg-card p-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button size="sm" onClick={submit} disabled={status === "sending" || message.trim().length < 5}>
              {status === "sending" ? "Enviando…" : "Enviar relato"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
