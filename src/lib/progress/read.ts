import "server-only";

import { getServerSupabase } from "@/lib/supabase/server";
import { effectivePlan, FREE_SUBSCRIPTION, type SubscriptionState } from "@/lib/plans/access";
import type { Plan } from "@/lib/content/types";

export interface UserState {
  plan: Plan;
  subscription: SubscriptionState;
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  completedLessonIds: string[];
  achievementCodes: string[];
  profile: {
    displayName: string;
    timezone: string;
    dailyGoal: number;
    role: "learner" | "admin";
    reduceMotion: boolean;
    soundEnabled: boolean;
  };
}

/**
 * Read the current user's state through RLS (own rows only). Returns null when
 * there is no session / demo mode. The effective plan is derived from the
 * server subscription row, never from the client.
 */
export async function getUserState(): Promise<UserState | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, statsRes, subRes, completionsRes, achievementsRes] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, timezone, daily_goal, role, reduce_motion, sound_enabled")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("user_stats")
        .select("total_xp, current_streak, best_streak")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("subscriptions")
        .select("access_until, revoked")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase.from("lesson_completions").select("lesson_id").eq("user_id", user.id),
      supabase.from("user_achievements").select("code").eq("user_id", user.id),
    ]);

  const stats = statsRes.data;

  const subscription: SubscriptionState = subRes.data
    ? {
        accessUntil: (subRes.data.access_until as string) ?? null,
        revoked: Boolean(subRes.data.revoked),
      }
    : FREE_SUBSCRIPTION;

  const p = profileRes.data;

  return {
    plan: effectivePlan(subscription),
    subscription,
    totalXp: (stats?.total_xp as number) ?? 0,
    currentStreak: (stats?.current_streak as number) ?? 0,
    bestStreak: (stats?.best_streak as number) ?? 0,
    completedLessonIds: (completionsRes.data ?? []).map((c) => c.lesson_id as string),
    achievementCodes: (achievementsRes.data ?? []).map((a) => a.code as string),
    profile: {
      displayName: (p?.display_name as string) ?? "",
      timezone: (p?.timezone as string) ?? "America/Sao_Paulo",
      dailyGoal: (p?.daily_goal as number) ?? 1,
      role: ((p?.role as string) ?? "learner") as "learner" | "admin",
      reduceMotion: Boolean(p?.reduce_motion),
      soundEnabled: p?.sound_enabled ?? true,
    },
  };
}
