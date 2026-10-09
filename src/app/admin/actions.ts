"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/supabase/server";
import { getUserState } from "@/lib/progress/read";
import { requireAdminSupabase } from "@/lib/supabase/admin";
import { syncContent } from "@/lib/content/sync";

/** Guard: the caller must be an authenticated admin. */
async function requireAdmin(): Promise<string> {
  const user = await getCurrentUser();
  const state = await getUserState();
  if (!user || !state || state.profile.role !== "admin") {
    throw new Error("Acesso negado.");
  }
  return user.id;
}

async function audit(adminId: string, action: string, target: string, detail: object = {}) {
  const db = requireAdminSupabase();
  await db.from("administrative_audit_log").insert({ admin_id: adminId, action, target, detail });
}

export async function syncContentAction(): Promise<{ ok: boolean; message: string }> {
  const adminId = await requireAdmin();
  try {
    const result = await syncContent();
    await audit(adminId, "sync_content", "all", result);
    revalidatePath("/admin/conteudo");
    revalidatePath("/aprender");
    return {
      ok: true,
      message: `Conteúdo sincronizado: ${result.lessons} lições, ${result.questions} questões.`,
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Falha ao sincronizar." };
  }
}

export async function setLessonStatusAction(
  lessonId: string,
  status: "rascunho" | "em_revisao" | "publicado" | "arquivado",
): Promise<{ ok: boolean; error?: string }> {
  const adminId = await requireAdmin();
  const db = requireAdminSupabase();

  // Validation gate before publishing: the lesson must exist with content.
  if (status === "publicado") {
    const { data: lesson } = await db
      .from("lessons")
      .select("id, title, objective")
      .eq("id", lessonId)
      .maybeSingle();
    const { count: qCount } = await db
      .from("question_versions")
      .select("question_id", { count: "exact", head: true })
      .eq("lesson_id", lessonId);
    if (!lesson || !lesson.title || !lesson.objective || (qCount ?? 0) < 1) {
      return {
        ok: false,
        error: "Não é possível publicar: faltam campos obrigatórios ou questões.",
      };
    }
  }

  const { error } = await db
    .from("lessons")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", lessonId);
  if (error) return { ok: false, error: "Não foi possível atualizar o status." };

  await audit(adminId, "set_lesson_status", lessonId, { status });
  revalidatePath("/admin/conteudo");
  revalidatePath("/aprender");
  return { ok: true };
}

export async function resolveReportAction(
  reportId: string,
): Promise<{ ok: boolean; error?: string }> {
  const adminId = await requireAdmin();
  const db = requireAdminSupabase();
  const { error } = await db
    .from("content_reports")
    .update({ status: "resolvido" })
    .eq("id", reportId);
  if (error) return { ok: false, error: "Falha ao resolver." };
  await audit(adminId, "resolve_report", reportId);
  revalidatePath("/admin/relatos");
  return { ok: true };
}

/**
 * Manually set a user's plan. Granting Premium writes a paid-through date one
 * year ahead; removing it clears the paid period (the user becomes free and
 * can still purchase later — we do NOT set the sticky `revoked` flag, which is
 * reserved for refunds/chargebacks). Admin-only; audited.
 */
export async function setUserPlanAction(
  userId: string,
  makePremium: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const adminId = await requireAdmin();
  const db = requireAdminSupabase();

  if (!/^[0-9a-fA-F-]{36}$/.test(userId)) {
    return { ok: false, error: "Usuário inválido." };
  }
  if (userId === adminId && !makePremium) {
    // harmless, but avoids an admin accidentally locking their own test account
  }

  const now = new Date();
  const accessUntil = makePremium
    ? new Date(now.getTime() + 365 * 86_400_000).toISOString()
    : null;

  const { error } = await db.from("subscriptions").upsert(
    {
      user_id: userId,
      access_until: accessUntil,
      revoked: false,
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) return { ok: false, error: "Não foi possível atualizar o plano." };

  await audit(adminId, makePremium ? "grant_premium" : "revoke_premium", userId, {
    accessUntil,
  });
  revalidatePath("/admin/usuarios");
  return { ok: true };
}
