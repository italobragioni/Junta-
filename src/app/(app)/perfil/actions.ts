"use server";

import { revalidatePath } from "next/cache";

import { getServerSupabase, getCurrentUser } from "@/lib/supabase/server";
import { dailyGoalSchema, preferencesSchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";

export async function updatePreferencesAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = preferencesSchema.safeParse({
    displayName: formData.get("displayName"),
    timezone: formData.get("timezone"),
    reduceMotion: formData.get("reduceMotion") === "on",
    soundEnabled: formData.get("soundEnabled") === "on",
  });
  if (!parsed.success) return fromZod(parsed.error);

  const user = await getCurrentUser();
  const supabase = await getServerSupabase();
  if (!user || !supabase) return { ok: false, error: "Sessão expirada." };

  // Updates run under RLS (own row). Column grants prevent editing role/plan.
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      timezone: parsed.data.timezone,
      reduce_motion: parsed.data.reduceMotion,
      sound_enabled: parsed.data.soundEnabled,
    })
    .eq("id", user.id);
  if (error) return { ok: false, error: "Não foi possível salvar." };

  revalidatePath("/perfil");
  return { ok: true, message: "Preferências salvas." };
}

export async function updateDailyGoalAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = dailyGoalSchema.safeParse({ dailyGoal: formData.get("dailyGoal") });
  if (!parsed.success) return fromZod(parsed.error);

  const user = await getCurrentUser();
  const supabase = await getServerSupabase();
  if (!user || !supabase) return { ok: false, error: "Sessão expirada." };

  const { error } = await supabase
    .from("profiles")
    .update({ daily_goal: parsed.data.dailyGoal })
    .eq("id", user.id);
  if (error) return { ok: false, error: "Não foi possível salvar a meta." };

  revalidatePath("/perfil");
  revalidatePath("/aprender");
  return { ok: true, message: "Meta diária atualizada." };
}
