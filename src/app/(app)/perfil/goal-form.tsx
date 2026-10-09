"use client";

import { useActionState } from "react";

import { updateDailyGoalAction } from "./actions";
import { idleResult } from "@/lib/action-result";
import { cn } from "@/lib/utils";

export function GoalForm({ current }: { current: number }) {
  const [state, action] = useActionState(updateDailyGoalAction, idleResult);
  return (
    <form action={action}>
      {state.message && state.ok && (
        <p role="status" className="mb-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          {state.message}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((n) => (
          <button
            key={n}
            type="submit"
            name="dailyGoal"
            value={n}
            aria-pressed={current === n}
            className={cn(
              "min-h-[72px] rounded-2xl border-2 p-4 text-left transition-colors",
              current === n ? "border-brand-500 bg-brand-50" : "border-border bg-card hover:bg-muted",
            )}
          >
            <span className="block text-lg font-bold">
              {n} {n === 1 ? "lição" : "lições"}
            </span>
            <span className="block text-sm text-muted-foreground">por dia</span>
          </button>
        ))}
      </div>
    </form>
  );
}
