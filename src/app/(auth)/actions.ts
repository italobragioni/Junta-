"use server";

import { redirect } from "next/navigation";

import { getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, env } from "@/lib/env";
import { loginSchema, newPasswordSchema, resetRequestSchema, signupSchema } from "@/lib/validation";
import { fromZod, type ActionResult } from "@/lib/action-result";

const DEMO_MSG =
  "Cadastro/login indisponível: o Supabase ainda não está configurado neste ambiente. Veja o README para conectar em poucos minutos.";

export async function signupAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return fromZod(parsed.error);
  if (!isSupabaseConfigured()) return { ok: false, error: DEMO_MSG };

  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: DEMO_MSG };

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
      emailRedirectTo: `${env.siteUrl}/auth/callback?next=/assinar`,
    },
  });
  if (error) return { ok: false, error: traduzErro(error.message) };

  // Confirmação de e-mail DESLIGADA: já vem com sessão → vai direto pagar.
  if (data.session) redirect("/assinar");

  // Confirmação de e-mail LIGADA: sem sessão ainda; orienta a confirmar.
  return {
    ok: true,
    message:
      "Conta criada! Confirme seu e-mail (verifique a caixa de entrada) para continuar.",
  };
}

export async function loginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
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

  const next = String(formData.get("next") || "/painel");
  redirect(next.startsWith("/") ? next : "/painel");
}

export async function logoutAction(): Promise<void> {
  const supabase = await getServerSupabase();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}

export async function resetRequestAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = resetRequestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return fromZod(parsed.error);
  if (!isSupabaseConfigured()) return { ok: false, error: DEMO_MSG };

  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: DEMO_MSG };

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.siteUrl}/auth/callback?next=/redefinir-senha`,
  });
  return {
    ok: true,
    message: "Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha.",
  };
}

export async function newPasswordAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = newPasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: DEMO_MSG };

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

  return { ok: true, message: "Senha atualizada! Você já pode entrar." };
}

/** Traduz as mensagens de erro mais comuns do Supabase para pt-BR. */
function traduzErro(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (m.includes("user already registered")) return "Já existe uma conta com esse e-mail.";
  if (m.includes("rate limit") || m.includes("too many")) return "Muitas tentativas. Aguarde um instante e tente de novo.";
  if (m.includes("password")) return "Senha inválida. Use ao menos 8 caracteres.";
  return "Algo deu errado. Tente novamente.";
}
