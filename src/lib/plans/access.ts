import type { Plan } from "@/lib/content/types";

/**
 * Plan + access rules. The effective plan is derived ONLY from server-side
 * subscription state (the paid-through date), never from the browser, a URL
 * parameter or a checkout return page.
 */

export interface SubscriptionState {
  /** Paid-through instant (ISO). Null when the user never had access. */
  accessUntil: string | null;
  /**
   * True when access was reversed (refund/chargeback) and must not be
   * honored even if accessUntil is still in the future. Out-of-order events
   * can never un-revoke this; reconciliation with the provider does.
   */
  revoked: boolean;
}

export const FREE_SUBSCRIPTION: SubscriptionState = {
  accessUntil: null,
  revoked: false,
};

/**
 * The learner's effective plan right now. Premium only while a non-revoked
 * paid period covers the current instant. A cancelled renewal keeps access
 * until the period it already paid for ends.
 */
export function effectivePlan(
  sub: SubscriptionState,
  now: Date = new Date(),
): Plan {
  if (sub.revoked || !sub.accessUntil) return "free";
  return now.getTime() <= new Date(sub.accessUntil).getTime()
    ? "premium"
    : "free";
}

/** Number of first-trail lessons available on the free plan (a taste). */
export const FREE_TRAIL_A_LESSONS = 1;

export type AccessReason =
  | "ok"
  | "plan" // blocked because the lesson needs Premium
  | "prerequisite" // blocked because an earlier lesson isn't done
  | "unpublished"; // not published yet (never shown as locked content)

export interface AccessDecision {
  allowed: boolean;
  reason: AccessReason;
}

export interface LessonAccessInput {
  lessonStatus: "rascunho" | "em_revisao" | "publicado" | "arquivado";
  lessonPlan: Plan;
  userPlan: Plan;
  /** Whether the lesson's prerequisite (previous lesson) is completed. */
  prerequisiteMet: boolean;
}

/**
 * Decide access to a single lesson. Plan-locks and prerequisite-locks are
 * reported distinctly so the UI can explain the real reason to the learner.
 * Plan is checked before prerequisite so a free user sees "needs Premium"
 * rather than a misleading "finish the previous lesson".
 */
export function lessonAccess(input: LessonAccessInput): AccessDecision {
  if (input.lessonStatus !== "publicado") {
    return { allowed: false, reason: "unpublished" };
  }
  if (input.lessonPlan === "premium" && input.userPlan !== "premium") {
    return { allowed: false, reason: "plan" };
  }
  if (!input.prerequisiteMet) {
    return { allowed: false, reason: "prerequisite" };
  }
  return { allowed: true, reason: "ok" };
}
