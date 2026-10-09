"use client";

import { useState, useTransition } from "react";
import { setLessonStatusAction } from "../actions";

type Status = "rascunho" | "em_revisao" | "publicado" | "arquivado";
const LABELS: Record<Status, string> = {
  rascunho: "Rascunho",
  em_revisao: "Em revisão",
  publicado: "Publicar",
  arquivado: "Arquivar",
};

export function StatusControls({
  lessonId,
  current,
}: {
  lessonId: string;
  current: Status;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const options: Status[] = ["rascunho", "em_revisao", "publicado", "arquivado"];

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2">
        {options.map((s) => (
          <button
            key={s}
            type="button"
            disabled={pending || s === current}
            onClick={() =>
              start(async () => {
                setError(null);
                const res = await setLessonStatusAction(lessonId, s);
                if (!res.ok) setError(res.error ?? "Erro.");
              })
            }
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              s === current
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            {LABELS[s]}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
