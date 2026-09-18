import Link from "next/link";
import type { ActionState } from "@/lib/action-result";

/**
 * Renders a form-level error banner. When the action was blocked by a plan
 * limit (state.upgrade), it also shows a "Conhecer planos" call-to-action.
 */
export function ActionError({ state }: { state: ActionState }) {
  if (!state.error || state.fieldErrors) return null;
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <p>{state.error}</p>
      {state.upgrade && (
        <Link
          href="/planos"
          className="mt-2 inline-flex font-semibold text-brand-700 underline"
        >
          Conhecer planos →
        </Link>
      )}
    </div>
  );
}
