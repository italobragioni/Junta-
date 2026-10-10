"use server";

import { getCurrentUser } from "@/lib/supabase/server";
import { getUserState } from "@/lib/progress/read";
import { isFactCheckConfigured } from "@/lib/env";
import { analyzeContent, validateInput } from "@/lib/verify/analyze";
import { consumeUsage, getUsage, type UsageStatus } from "@/lib/verify/usage";
import type { VerifyInput, VerifyResult } from "@/lib/verify/types";

export type CheckNewsResult =
  | { ok: true; result: VerifyResult; usage: UsageStatus }
  | { ok: false; error: string; usage?: UsageStatus };

/**
 * Analyze pasted text/link and/or an uploaded image for signals of
 * unreliability. Auth + per-day rate limit are enforced server-side; the
 * quota unit is only spent on a successful analysis.
 */
export async function checkNewsAction(input: VerifyInput): Promise<CheckNewsResult> {
  // The whole body is guarded so the action never rejects to the client (which
  // would surface only a generic "algo deu errado"). Any failure returns the
  // real reason instead.
  try {
    const user = await getCurrentUser();
    const state = await getUserState();
    if (!user || !state) {
      return { ok: false, error: "Faça login para usar o Verificador." };
    }

    if (!isFactCheckConfigured()) {
      return {
        ok: false,
        error:
          "O Verificador ainda não foi ativado. Configure a chave de IA para habilitar.",
      };
    }

    const valid = validateInput(input);
    if (!valid.ok) {
      return { ok: false, error: valid.error! };
    }

    const plan = state.plan;
    const usage = await getUsage(user.id, plan);
    if (usage.remaining <= 0) {
      return {
        ok: false,
        error:
          plan === "free"
            ? `Você atingiu o limite de ${usage.limit} verificações grátis hoje. Volte amanhã ou assine o Premium para mais.`
            : `Limite diário de ${usage.limit} verificações atingido. Tente novamente amanhã.`,
        usage,
      };
    }

    let result: VerifyResult;
    try {
      result = await analyzeContent(input);
    } catch (e) {
      return {
        ok: false,
        error:
          e instanceof Error
            ? `Não foi possível analisar agora: ${e.message}`
            : "Não foi possível analisar agora. Tente novamente.",
        usage,
      };
    }

    // Only charge a quota unit once the analysis actually succeeded.
    const after = await consumeUsage(user.id, plan).catch(() => usage);
    return { ok: true, result, usage: after };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? `Falha no servidor: ${e.message}`
          : "Falha no servidor. Tente novamente.",
    };
  }
}
