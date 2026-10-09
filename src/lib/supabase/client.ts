"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { env, isSupabaseConfigured } from "@/lib/env";

let cached: SupabaseClient | null = null;

/**
 * Browser-side Supabase client (anon key only). Used for auth UI flows such as
 * password reset. Returns null in demo mode. The anon key is public by design;
 * RLS is what protects the data.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (cached) return cached;
  cached = createBrowserClient(env.supabaseUrl!, env.supabaseAnonKey!);
  return cached;
}
