import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * Supabase client bound to the current request's cookies and to the
 * authenticated user's session. All reads/writes made through it run under
 * Row Level Security as that user — a user can only ever touch their own rows.
 *
 * Returns null in demo mode (no credentials), so callers can degrade to the
 * isolated demonstration experience instead of crashing.
 */
export async function getServerSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies are read-only. Session
          // refresh is handled by the middleware, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * The authenticated user, verified against Supabase Auth (getUser contacts the
 * auth server and validates the JWT — never trust the unverified session for
 * authorization decisions).
 */
export async function getCurrentUser() {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}
