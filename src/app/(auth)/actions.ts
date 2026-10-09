"use server";

import { redirect } from "next/navigation";

import { getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, env } from "@/lib/env";
import {
  loginSchema,
  newPasswordSchema,
  resetRequestSchema,
  signupSchema,
} from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";

const DEMO_MSG =
  "Cadastro/login indisponível: o Supabase ainda não está configurado neste ambiente. Use a demonstração enquanto isso.";

export async function signupAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  if (!isSupabaseConfigured()) return { ok: false, error: DEMO_MSG };

  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: DEMO_MSG };

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
      emailRedirectTo: `${env.siteUrl}/auth/callback?next=/aprender`,
    },
  });
  if (error) return { ok: false, error: traduzErro(error.message) };

  return {
    ok: true,
    message:
      "Conta criada. Se a confirmação por e-mail estiver ativada, verifique sua caixa de entrada para confirmar o acesso.",
  };
}

export async function loginAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  if (!isSupabaseConfigured()) return { ok: false, error: DEMO_MSG };
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: DEMO_MSG };

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { ok: false, error: traduzErro(error.message) };

  const next = String(formData.get("next") || "/aprender");
  redirect(next.startsWith("/") ? next : "/aprender");
}

export async function logoutAction(): Promise<void> {
  const supabase = await getServerSupabase();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}

export async function resetRequestAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetRequestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return fromZod(parsed.error);

  if (!isSupabaseConfigured()) return { ok: false, error: DEMO_MSG };
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: DEMO_MSG };

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.siteUrl}/auth/callback?next=/redefinir-senha`,
  });
  // Always report success to avoid leaking which e-mails are registered.
  return {
    ok: true,
    message:
      "Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha.",
  };
}

export async function newPasswordAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = newPasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: DEMO_MSG };

  // Requires a recovery session established by the link in the e-mail.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      error: "Link expirado ou inválido. Solicite um novo e-mail de redefinição.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: traduzErro(error.message) };
  return { ok: true, message: "Senha redefinida. Você já pode entrar." };
}

function traduzErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Este e-mail já possui conta. Tente entrar.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  return "Não foi possível concluir. Tente novamente.";
}
