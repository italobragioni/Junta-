import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Barra de progresso simples (sem estado). `value` em 0..100.
 * `tone` muda a cor conforme o contexto (orçamento, meta, etc.).
 */
export function Progress({
  value,
  tone = "brand",
  className,
  trackClassName,
}: {
  value: number;
  tone?: "brand" | "positive" | "negative" | "warn";
  className?: string;
  trackClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const toneClass =
    tone === "positive"
      ? "bg-positive"
      : tone === "negative"
        ? "bg-negative"
        : tone === "warn"
          ? "bg-warn"
          : "bg-brand";
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-muted", trackClassName, className)}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", toneClass)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
