import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { env, isSupabaseConfigured } from "@/lib/env";

/** Private areas that require an authenticated session. */
const PROTECTED_PREFIXES = ["/aprender", "/licao", "/revisar", "/perfil", "/assinar", "/admin"];

/**
 * Refreshes the Supabase session cookie on every request and guards private
 * routes. Admin authorization itself is enforced again inside the /admin
 * layout and every admin server action — this middleware only checks that a
 * session exists.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const path = request.nextUrl.pathname;
  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/"),
  );

  // Demo mode: no auth backend. Send would-be private routes to the landing
  // page, which hosts the public demonstration.
  if (!isSupabaseConfigured()) {
    if (needsAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("demo", "1");
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (needsAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response;
}
