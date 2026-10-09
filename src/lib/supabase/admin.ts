import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { env, hasServiceRole } from "@/lib/env";

/**
 * Service-role Supabase client. BYPASSES Row Level Security.
 *
 * Use ONLY inside trusted server code for operations that must be
 * tamper-proof and cannot be trusted to the browser:
 *   - grading answers against answer_keys (never exposed to the client)
 *   - awarding XP / recording completions / updating streaks
 *   - processing billing webhooks and flipping subscription state
 *   - admin content operations (after verifying the admin role server-side)
 *
 * Every function that uses this MUST scope writes to a specific, already
 * authenticated userId. Never pass a user-supplied id through unchecked.
 */
export function getAdminSupabase(): SupabaseClient | null {
  if (!hasServiceRole()) return null;
  return createClient(env.supabaseUrl!, env.supabaseServiceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Like getAdminSupabase but throws — for code paths that require the DB. */
export function requireAdminSupabase(): SupabaseClient {
  const client = getAdminSupabase();
  if (!client) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ausente: operação de servidor indisponível.",
    );
  }
  return client;
}
