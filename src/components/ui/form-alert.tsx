import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ActionResult } from "@/lib/action-result";
import { cn } from "@/lib/utils";

/** Mostra a mensagem de erro ou sucesso de uma action de formulário. */
export function FormAlert({ state, className }: { state: ActionResult; className?: string }) {
  if (state.error) {
    return (
      <div
        role="alert"
        className={cn(
          "flex items-start gap-2.5 rounded-xl border border-negative/30 bg-negative-soft px-3.5 py-3 text-sm text-foreground",
          className,
        )}
      >
        <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-negative" />
        <span>{state.error}</span>
      </div>
    );
  }
  if (state.ok && state.message) {
    return (
      <div
        role="status"
        className={cn(
          "flex items-start gap-2.5 rounded-xl border border-positive/30 bg-positive-soft px-3.5 py-3 text-sm text-foreground",
          className,
        )}
      >
        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-positive" />
        <span>{state.message}</span>
      </div>
    );
  }
  return null;
}
