import "server-only";

import { getAdminSupabase } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { isPremium, type Subscription } from "@/lib/billing/status";

export interface RecentUser {
  id: string;
  display_name: string | null;
  email: string | null;
  created_at: string;
  onboarding_completed: boolean;
  status: string; // subscription status
  premium: boolean;
}

export interface BillingEventRow {
  id: string;
  event: string;
  customer_email: string | null;
  created_at: string;
}

export interface AdminMetrics {
  available: boolean;
  totalUsers: number;
  premiumUsers: number; // com acesso agora (ativo + carência)
  activeSubs: number; // pagantes recorrentes
  canceledSubs: number;
  pastDueSubs: number;
  newUsers7d: number;
  newUsers30d: number;
  mrrCents: number;
  totalTransactions: number;
  totalAccounts: number;
  totalCards: number;
  totalGoals: number;
  totalDebts: number;
  recentUsers: RecentUser[];
  recentBilling: BillingEventRow[];
}

const emptyMetrics: AdminMetrics = {
  available: false,
  totalUsers: 0, premiumUsers: 0, activeSubs: 0, canceledSubs: 0, pastDueSubs: 0,
  newUsers7d: 0, newUsers30d: 0, mrrCents: 0,
  totalTransactions: 0, totalAccounts: 0, totalCards: 0, totalGoals: 0, totalDebts: 0,
  recentUsers: [], recentBilling: [],
};

type Admin = NonNullable<ReturnType<typeof getAdminSupabase>>;

/** Conta linhas de uma tabela, opcionalmente com created_at >= `since`. */
async function count(supabase: Admin, table: string, since?: string): Promise<number> {
  const q = supabase.from(table).select("*", { count: "exact", head: true });
  const { count: c } = since ? await q.gte("created_at", since) : await q;
  return c ?? 0;
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const supabase = getAdminSupabase();
  if (!supabase) return emptyMetrics;

  const now = Date.now();
  const d7 = new Date(now - 7 * 86_400_000).toISOString();
  const d30 = new Date(now - 30 * 86_400_000).toISOString();

  const [
    totalUsers, newUsers7d, newUsers30d,
    totalTransactions, totalAccounts, totalCards, totalGoals, totalDebts,
    subsRes, recentUsersRes, billingRes,
  ] = await Promise.all([
    count(supabase, "profiles"),
    count(supabase, "profiles", d7),
    count(supabase, "profiles", d30),
    count(supabase, "transactions"),
    count(supabase, "accounts"),
    count(supabase, "credit_cards"),
    count(supabase, "goals"),
    count(supabase, "debts"),
    supabase.from("subscriptions").select("user_id, status, plan, current_period_end, created_at, updated_at, cakto_order_id, cakto_subscription_id, cakto_customer_email"),
    supabase.from("profiles").select("id, display_name, email, created_at, onboarding_completed").order("created_at", { ascending: false }).limit(25),
    supabase.from("billing_events").select("id, event, customer_email, created_at").order("created_at", { ascending: false }).limit(20),
  ]);

  const subs = (subsRes.data as Subscription[] | null) ?? [];
  const subByUser = new Map(subs.map((s) => [s.user_id, s]));
  let premiumUsers = 0, activeSubs = 0, canceledSubs = 0, pastDueSubs = 0;
  for (const s of subs) {
    if (isPremium(s)) premiumUsers += 1;
    if (s.status === "active") activeSubs += 1;
    else if (s.status === "canceled") canceledSubs += 1;
    else if (s.status === "past_due") pastDueSubs += 1;
  }

  const recentUsers: RecentUser[] = ((recentUsersRes.data as Array<{ id: string; display_name: string | null; email: string | null; created_at: string; onboarding_completed: boolean }> | null) ?? []).map((u) => {
    const s = subByUser.get(u.id) ?? null;
    return {
      id: u.id,
      display_name: u.display_name,
      email: u.email,
      created_at: u.created_at,
      onboarding_completed: u.onboarding_completed,
      status: s?.status ?? "free",
      premium: isPremium(s),
    };
  });

  return {
    available: true,
    totalUsers, premiumUsers, activeSubs, canceledSubs, pastDueSubs,
    newUsers7d, newUsers30d,
    mrrCents: activeSubs * env.premiumPriceCents,
    totalTransactions, totalAccounts, totalCards, totalGoals, totalDebts,
    recentUsers,
    recentBilling: (billingRes.data as BillingEventRow[] | null) ?? [],
  };
}
