import "server-only";

import { requireAdminSupabase } from "@/lib/supabase/admin";
import type { Plan } from "@/lib/content/types";

/**
 * Daily limits for the credibility checker. Free users get a taste (great for
 * conversion); Premium gets a generous cap. Tune here as provider costs /
 * free-tier quotas change. The external AI provider is the real cost, so this
 * is the guard that keeps a bad actor from draining it.
 */
export const DAILY_LIMIT: Record<Plan, number> = {
  free: 3,
  premium: 30,
};

export interface UsageStatus {
  limit: number;
  used: number;
  remaining: number;
}

/** Current day in Brazil (yyyy-mm-dd), so the quota resets at local midnight. */
export function brazilDay(now: Date = new Date()): string {
  // en-CA formats as yyyy-mm-dd.
  return now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

/** Read how many analyses the user has already run today. */
export async function getUsage(userId: string, plan: Plan): Promise<UsageStatus> {
  const db = requireAdminSupabase();
  const day = brazilDay();
  const { data } = await db
    .from("fact_check_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("day", day)
    .maybeSingle();
  const used = (data?.count as number) ?? 0;
  const limit = DAILY_LIMIT[plan];
  return { limit, used, remaining: Math.max(0, limit - used) };
}

/**
 * Atomically consume one unit of the daily quota. Returns allowed=false (and
 * does not increment) when the limit is already reached. Uses the service
 * role and is always scoped to the authenticated userId.
 */
export async function consumeUsage(
  userId: string,
  plan: Plan,
): Promise<{ allowed: boolean } & UsageStatus> {
  const db = requireAdminSupabase();
  const day = brazilDay();
  const limit = DAILY_LIMIT[plan];

  const { data } = await db
    .from("fact_check_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("day", day)
    .maybeSingle();

  const used = (data?.count as number) ?? 0;
  if (used >= limit) {
    return { allowed: false, limit, used, remaining: 0 };
  }

  const next = used + 1;
  await db
    .from("fact_check_usage")
    .upsert(
      { user_id: userId, day, count: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id,day" },
    );

  return { allowed: true, limit, used: next, remaining: Math.max(0, limit - next) };
}
