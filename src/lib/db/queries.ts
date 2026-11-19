import "server-only";

import { getServerSupabase } from "@/lib/supabase/server";
import type {
  Account, AccountWithBalance, Category, CreditCard, CreditCardWithBalance,
  Transaction, Budget, Goal, Bill, Debt, PatrimonyItem, Profile, RecurringRule,
  GoalContribution, ActivityLog,
} from "./types";
import type { Subscription } from "@/lib/billing/status";

/** Contexto autenticado. Retorna null em modo demo ou sem sessão. */
export async function authContext() {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, userId: user.id, email: user.email ?? null };
}

export async function getProfile(): Promise<Profile | null> {
  const ctx = await authContext();
  if (!ctx) return null;
  const { data } = await ctx.supabase.from("profiles").select("*").eq("id", ctx.userId).single();
  return (data as Profile) ?? null;
}

export async function getSubscription(): Promise<Subscription | null> {
  const ctx = await authContext();
  if (!ctx) return null;
  const { data } = await ctx.supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", ctx.userId)
    .maybeSingle();
  return (data as Subscription) ?? null;
}

export async function listCategories(): Promise<Category[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  const { data } = await ctx.supabase
    .from("categories")
    .select("*")
    .eq("archived", false)
    .order("type")
    .order("sort");
  return (data as Category[]) ?? [];
}

export async function listAccounts(): Promise<AccountWithBalance[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  const [accountsRes, balancesRes] = await Promise.all([
    ctx.supabase.from("accounts").select("*").eq("archived", false).order("sort").order("created_at"),
    ctx.supabase.from("account_balances").select("account_id, balance_cents"),
  ]);
  const accounts = (accountsRes.data as Account[]) ?? [];
  const balances = new Map<string, number>(
    ((balancesRes.data as { account_id: string; balance_cents: number }[]) ?? []).map((b) => [
      b.account_id,
      b.balance_cents,
    ]),
  );
  return accounts.map((a) => ({ ...a, balance_cents: balances.get(a.id) ?? a.opening_balance_cents }));
}

export async function listCards(): Promise<CreditCardWithBalance[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  const [cardsRes, balancesRes] = await Promise.all([
    ctx.supabase.from("credit_cards").select("*").eq("archived", false).order("created_at"),
    ctx.supabase.from("card_balances").select("card_id, used_cents, limit_cents"),
  ]);
  const cards = (cardsRes.data as CreditCard[]) ?? [];
  const used = new Map<string, number>(
    ((balancesRes.data as { card_id: string; used_cents: number }[]) ?? []).map((b) => [
      b.card_id,
      b.used_cents,
    ]),
  );
  return cards.map((c) => {
    const usedCents = used.get(c.id) ?? 0;
    return { ...c, used_cents: usedCents, available_cents: c.limit_cents - usedCents };
  });
}

export interface TransactionFilter {
  from?: string;
  to?: string;
  kind?: string;
  categoryId?: string;
  accountId?: string;
  cardId?: string;
  search?: string;
  limit?: number;
}

export async function listTransactions(filter: TransactionFilter = {}): Promise<Transaction[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  let q = ctx.supabase.from("transactions").select("*").order("occurred_on", { ascending: false }).order("created_at", { ascending: false });
  if (filter.from) q = q.gte("occurred_on", filter.from);
  if (filter.to) q = q.lte("occurred_on", filter.to);
  if (filter.kind) q = q.eq("kind", filter.kind);
  if (filter.categoryId) q = q.eq("category_id", filter.categoryId);
  if (filter.accountId) q = q.or(`account_id.eq.${filter.accountId},to_account_id.eq.${filter.accountId}`);
  if (filter.cardId) q = q.eq("card_id", filter.cardId);
  if (filter.search) q = q.ilike("description", `%${filter.search}%`);
  if (filter.limit) q = q.limit(filter.limit);
  const { data } = await q;
  return (data as Transaction[]) ?? [];
}

export async function listBudgets(month: string): Promise<Budget[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  const { data } = await ctx.supabase.from("budgets").select("*").eq("month", month);
  return (data as Budget[]) ?? [];
}

export async function listGoals(): Promise<(Goal & { saved_cents: number })[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  const [goalsRes, progressRes] = await Promise.all([
    ctx.supabase.from("goals").select("*").eq("archived", false).order("created_at"),
    ctx.supabase.from("goal_progress").select("goal_id, saved_cents"),
  ]);
  const goals = (goalsRes.data as Goal[]) ?? [];
  const saved = new Map<string, number>(
    ((progressRes.data as { goal_id: string; saved_cents: number }[]) ?? []).map((p) => [p.goal_id, p.saved_cents]),
  );
  return goals.map((g) => ({ ...g, saved_cents: saved.get(g.id) ?? 0 }));
}

export async function listContributions(goalId: string): Promise<GoalContribution[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  const { data } = await ctx.supabase
    .from("goal_contributions")
    .select("*")
    .eq("goal_id", goalId)
    .order("contributed_on", { ascending: false });
  return (data as GoalContribution[]) ?? [];
}

export async function listBills(status?: "open" | "paid"): Promise<Bill[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  let q = ctx.supabase.from("bills").select("*").order("due_date");
  if (status) q = q.eq("status", status);
  const { data } = await q;
  return (data as Bill[]) ?? [];
}

export async function listDebts(): Promise<Debt[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  const { data } = await ctx.supabase.from("debts").select("*").eq("archived", false).order("created_at");
  return (data as Debt[]) ?? [];
}

export async function listPatrimony(): Promise<PatrimonyItem[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  const { data } = await ctx.supabase.from("patrimony_items").select("*").order("created_at");
  return (data as PatrimonyItem[]) ?? [];
}

export async function listRecurring(): Promise<RecurringRule[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  const { data } = await ctx.supabase
    .from("recurring_rules")
    .select("*")
    .eq("active", true)
    .order("next_run");
  return (data as RecurringRule[]) ?? [];
}

export async function listActivity(limit = 20): Promise<ActivityLog[]> {
  const ctx = await authContext();
  if (!ctx) return [];
  const { data } = await ctx.supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as ActivityLog[]) ?? [];
}
