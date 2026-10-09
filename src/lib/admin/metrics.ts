import "server-only";

import { requireAdminSupabase } from "@/lib/supabase/admin";
import { dayDiff } from "@/lib/gamification/streak";

export interface Metric {
  numerator: number;
  denominator: number;
  /** Human description of the interval considered. */
  interval: string;
}

export interface AdminMetrics {
  totalLearners: number;
  activeSubscriptions: number;
  /** New signups who completed at least one lesson. */
  activation: Metric;
  /** Activated learners with new activity on days 1–7 after activation. */
  retention7d: Metric;
}

/**
 * Real metrics computed from the database (service role). Definitions are the
 * ones stated in the product spec; the numerator, denominator and interval are
 * all surfaced so nothing is a mysterious percentage. These are REAL figures —
 * never demo numbers presented as real.
 */
export async function computeMetrics(): Promise<AdminMetrics> {
  const db = requireAdminSupabase();

  const [{ count: totalLearners }, { count: activeSubs }, completionsRes, activityRes] =
    await Promise.all([
      db.from("profiles").select("id", { count: "exact", head: true }),
      db
        .from("subscriptions")
        .select("user_id", { count: "exact", head: true })
        .eq("revoked", false)
        .gte("access_until", new Date().toISOString()),
      db.from("lesson_completions").select("user_id, first_completed_at"),
      db.from("activity_days").select("user_id, day"),
    ]);

  const completions = completionsRes.data ?? [];
  const activity = activityRes.data ?? [];

  // Activation day per user = date of their earliest completion.
  const activationDay = new Map<string, string>();
  for (const c of completions) {
    const day = String(c.first_completed_at).slice(0, 10);
    const uid = c.user_id as string;
    const prev = activationDay.get(uid);
    if (!prev || day < prev) activationDay.set(uid, day);
  }

  const activatedUsers = [...activationDay.keys()];

  // 7-day return: among activated users, those with an activity_day in
  // [activation+1, activation+7].
  const activityByUser = new Map<string, string[]>();
  for (const a of activity) {
    const uid = a.user_id as string;
    const list = activityByUser.get(uid) ?? [];
    list.push(a.day as string);
    activityByUser.set(uid, list);
  }

  let retained = 0;
  for (const uid of activatedUsers) {
    const act = activationDay.get(uid)!;
    const days = activityByUser.get(uid) ?? [];
    if (days.some((d) => dayDiff(act, d) >= 1 && dayDiff(act, d) <= 7)) retained += 1;
  }

  return {
    totalLearners: totalLearners ?? 0,
    activeSubscriptions: activeSubs ?? 0,
    activation: {
      numerator: activatedUsers.length,
      denominator: totalLearners ?? 0,
      interval: "Desde o início (todos os cadastros)",
    },
    retention7d: {
      numerator: retained,
      denominator: activatedUsers.length,
      interval: "Dias 1 a 7 após a ativação de cada aluno",
    },
  };
}
