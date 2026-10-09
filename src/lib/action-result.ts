/** Minimal typed result for form server actions used with useActionState. */
export interface ActionResult {
  ok: boolean;
  error?: string;
  /** Field-level errors keyed by field name. */
  fieldErrors?: Record<string, string>;
  /** Optional success message (e.g. "check your email"). */
  message?: string;
}

export const idleResult: ActionResult = { ok: false };

import type { ZodError } from "zod";

export function fromZod(error: ZodError): ActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, fieldErrors };
}
