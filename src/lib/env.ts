/**
 * Centralized environment access.
 *
 * Civio is designed to run in two modes:
 *
 *  - CONFIGURED: Supabase credentials are present, so real auth, database and
 *    (when also configured) billing are active.
 *  - DEMO: no credentials. The app still boots and shows the public landing
 *    page and an isolated, clearly-labelled demonstration lesson. The demo
 *    mode NEVER stands in for the production database — it stores nothing.
 *
 * Secrets (service role key, Cakto secret) are only ever read on the server.
 * They must NOT carry the NEXT_PUBLIC_ prefix, so they can never leak to the
 * browser bundle.
 */

function read(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const env = {
  supabaseUrl: read("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  // Server-only. Bypasses RLS — used exclusively inside trusted server code
  // (grading, awarding XP, webhook processing). Never import into client code.
  supabaseServiceRoleKey: read("SUPABASE_SERVICE_ROLE_KEY"),

  // Billing (Cakto). Billing stays disabled until BOTH a secret and an
  // explicit opt-in flag are present, so a half-configured deploy can never
  // expose a payment route. See src/lib/billing.
  caktoWebhookSecret: read("CAKTO_WEBHOOK_SECRET"),
  caktoCheckoutBaseUrl: read("CAKTO_CHECKOUT_BASE_URL"),
  billingEnabledFlag: read("CIVIO_BILLING_ENABLED") === "true",

  siteUrl: read("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
} as const;

/** True when Supabase auth + database are usable. */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

/** True only on the server, when the service-role key is also present. */
export function hasServiceRole(): boolean {
  return Boolean(
    env.supabaseUrl && env.supabaseServiceRoleKey,
  );
}

/**
 * Billing is only "live" when explicitly enabled AND the provider secret and
 * checkout base URL are present AND the database is configured. Any missing
 * piece keeps checkout and webhooks disabled, which is the safe default for
 * production. This is what guards the payment routes.
 */
export function isBillingConfigured(): boolean {
  return Boolean(
    env.billingEnabledFlag &&
      env.caktoWebhookSecret &&
      env.caktoCheckoutBaseUrl &&
      hasServiceRole(),
  );
}
