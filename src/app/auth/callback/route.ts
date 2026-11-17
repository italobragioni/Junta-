import { NextResponse, type NextRequest } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

/**
 * Troca o código do link de e-mail (confirmação de cadastro ou recuperação de
 * senha) por uma sessão, e redireciona para `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/painel";
  const safeNext = next.startsWith("/") ? next : "/painel";

  if (code) {
    const supabase = await getServerSupabase();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }
  return NextResponse.redirect(`${origin}/entrar?erro=link`);
}
