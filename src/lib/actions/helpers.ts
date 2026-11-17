import "server-only";

import { getServerSupabase } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Ctx {
  supabase: SupabaseClient;
  userId: string;
}

const DEMO = "Banco de dados não configurado. Conecte o Supabase para salvar dados (veja o README).";
const UNAUTH = "Sessão expirada. Entre novamente.";

/** Garante um usuário autenticado; retorna erro padronizado caso contrário. */
export async function requireCtx(): Promise<{ ctx: Ctx } | { error: string }> {
  const supabase = await getServerSupabase();
  if (!supabase) return { error: DEMO };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: UNAUTH };
  return { ctx: { supabase, userId: user.id } };
}

/** Registra uma entrada na central de atividades (best-effort, nunca quebra o fluxo). */
export async function logActivity(
  ctx: Ctx,
  entity: string,
  action: string,
  summary: string,
  amountCents?: number,
): Promise<void> {
  try {
    await ctx.supabase.from("activity_log").insert({
      user_id: ctx.userId,
      entity,
      action,
      summary,
      amount_cents: amountCents ?? null,
    });
  } catch {
    /* não propaga */
  }
}

/** Traduz erros comuns do Postgres/Supabase. */
export function dbError(message?: string): string {
  if (!message) return "Não foi possível salvar. Tente novamente.";
  const m = message.toLowerCase();
  if (m.includes("duplicate key")) return "Esse registro já existe.";
  if (m.includes("violates row-level security")) return "Você não tem acesso a esse registro.";
  if (m.includes("check constraint")) return "Há um valor inválido no formulário.";
  return "Não foi possível salvar. Tente novamente.";
}
