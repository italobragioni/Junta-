import { z } from "zod";

export interface ActionState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Set when the action was blocked by a plan limit — the UI shows an upgrade CTA. */
  upgrade?: boolean;
}

export const initialActionState: ActionState = { ok: false };

/** Result for an action blocked by a plan limit. */
export function limitReached(message: string): ActionState {
  return { ok: false, error: message, upgrade: true };
}

/** Flattens a ZodError into a simple field -> message map. */
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function failure(
  error: string,
  fieldErrors?: Record<string, string>,
): ActionState {
  return { ok: false, error, fieldErrors };
}

export function fromZod(error: z.ZodError): ActionState {
  return {
    ok: false,
    error: "Verifique os campos destacados.",
    fieldErrors: zodFieldErrors(error),
  };
}
