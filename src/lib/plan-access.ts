import "server-only";
import { prisma } from "@/lib/db";
import { currentMonthRange } from "@/lib/dates";
import {
  PLANS,
  canUseFeature,
  getLimit,
  type Feature,
  type PlanId,
  type PlanLimits,
} from "@/lib/plans";

export interface PlanUser {
  id: string;
  plan: PlanId;
}

export interface LimitResult {
  allowed: boolean;
  plan: PlanId;
  limit: number | null; // null = unlimited
  used: number;
  message?: string;
}

const RESOURCE_NOUN: Record<string, string> = {
  incomes: "receitas",
  expenses: "despesas",
  goals: "metas",
  budgets: "orçamentos",
  subscriptions: "assinaturas",
};

function blockedMessage(
  plan: PlanId,
  limit: number,
  resource: keyof typeof RESOURCE_NOUN,
  monthly: boolean,
): string {
  const noun = RESOURCE_NOUN[resource];
  return `Você atingiu o limite de ${limit} ${noun}${
    monthly ? " por mês" : ""
  } do plano ${PLANS[plan].name}.`;
}

async function evaluateLimit(params: {
  plan: PlanId;
  limitKey: keyof PlanLimits;
  resource: keyof typeof RESOURCE_NOUN;
  used: number;
  monthly: boolean;
}): Promise<LimitResult> {
  const { plan, limitKey, resource, used, monthly } = params;
  const limit = getLimit(plan, limitKey);
  if (limit === null) {
    return { allowed: true, plan, limit: null, used };
  }
  const allowed = used < limit;
  return {
    allowed,
    plan,
    limit,
    used,
    message: allowed ? undefined : blockedMessage(plan, limit, resource, monthly),
  };
}

async function monthlyCount(
  model: "income" | "expense",
  userId: string,
): Promise<number> {
  const { start, end } = currentMonthRange();
  const where = { userId, createdAt: { gte: start, lt: end } };
  return model === "income"
    ? prisma.income.count({ where })
    : prisma.expense.count({ where });
}

// ---- Limit checks (server-authoritative) ----

export async function canCreateExpense(user: PlanUser): Promise<LimitResult> {
  const used = await monthlyCount("expense", user.id);
  return evaluateLimit({
    plan: user.plan,
    limitKey: "expensesPerMonth",
    resource: "expenses",
    used,
    monthly: true,
  });
}

export async function canCreateIncome(user: PlanUser): Promise<LimitResult> {
  const used = await monthlyCount("income", user.id);
  return evaluateLimit({
    plan: user.plan,
    limitKey: "incomesPerMonth",
    resource: "incomes",
    used,
    monthly: true,
  });
}

export async function canCreateGoal(user: PlanUser): Promise<LimitResult> {
  const used = await prisma.financialGoal.count({ where: { userId: user.id } });
  return evaluateLimit({
    plan: user.plan,
    limitKey: "goals",
    resource: "goals",
    used,
    monthly: false,
  });
}

export async function canCreateBudget(user: PlanUser): Promise<LimitResult> {
  const used = await prisma.budget.count({ where: { userId: user.id } });
  return evaluateLimit({
    plan: user.plan,
    limitKey: "budgets",
    resource: "budgets",
    used,
    monthly: false,
  });
}

export async function canCreateSubscription(
  user: PlanUser,
): Promise<LimitResult> {
  const used = await prisma.subscription.count({ where: { userId: user.id } });
  return evaluateLimit({
    plan: user.plan,
    limitKey: "subscriptions",
    resource: "subscriptions",
    used,
    monthly: false,
  });
}

// ---- Feature checks ----

export function userCanUseFeature(user: PlanUser, feature: Feature): boolean {
  return canUseFeature(user.plan, feature);
}

// ---- Usage snapshot (for "Seu plano" area / management) ----

export interface PlanUsage {
  plan: PlanId;
  incomes: { used: number; limit: number | null };
  expenses: { used: number; limit: number | null };
  goals: { used: number; limit: number | null };
  budgets: { used: number; limit: number | null };
  subscriptions: { used: number; limit: number | null };
}

export async function getPlanUsage(user: PlanUser): Promise<PlanUsage> {
  const [incomes, expenses, goals, budgets, subscriptions] = await Promise.all([
    monthlyCount("income", user.id),
    monthlyCount("expense", user.id),
    prisma.financialGoal.count({ where: { userId: user.id } }),
    prisma.budget.count({ where: { userId: user.id } }),
    prisma.subscription.count({ where: { userId: user.id } }),
  ]);
  const l = PLANS[user.plan].limits;
  return {
    plan: user.plan,
    incomes: { used: incomes, limit: l.incomesPerMonth },
    expenses: { used: expenses, limit: l.expensesPerMonth },
    goals: { used: goals, limit: l.goals },
    budgets: { used: budgets, limit: l.budgets },
    subscriptions: { used: subscriptions, limit: l.subscriptions },
  };
}

/** History window (in months) the user's plan can access; null = unlimited. */
export function historyMonthsFor(plan: PlanId): number | null {
  return getLimit(plan, "historyMonths");
}
