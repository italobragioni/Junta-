/**
 * Central plan configuration. Pure data — safe to import on client and server.
 * This is the single place that defines what each plan offers. Access rules are
 * derived from here; never hard-code plan checks elsewhere.
 */

export type PlanId = "FREE" | "BASIC" | "PRO";

export type Feature =
  | "AI_ASSISTANT"
  | "PURCHASE_ANALYSIS"
  | "CSV_EXPORT"
  | "PDF_EXPORT"
  | "ADVANCED_ANALYSIS"
  | "UNLIMITED_GOALS"
  | "UNLIMITED_BUDGETS"
  | "UNLIMITED_SUBSCRIPTIONS"
  | "UNLIMITED_HISTORY";

/** A null limit means "unlimited". */
export interface PlanLimits {
  incomesPerMonth: number | null;
  expensesPerMonth: number | null;
  goals: number | null;
  budgets: number | null;
  subscriptions: number | null;
  historyMonths: number | null;
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  priceCents: number;
  tagline: string;
  order: number;
  limits: PlanLimits;
  features: Feature[];
}

export const PLANS: Record<PlanId, PlanConfig> = {
  FREE: {
    id: "FREE",
    name: "Gratuito",
    priceCents: 0,
    tagline: "Para começar a organizar suas finanças.",
    order: 0,
    limits: {
      incomesPerMonth: 10,
      expensesPerMonth: 10,
      goals: 1,
      budgets: 1,
      subscriptions: 3,
      historyMonths: 3,
    },
    features: [],
  },
  BASIC: {
    id: "BASIC",
    name: "Básico",
    priceCents: 990,
    tagline: "Para quem quer controle sem limites de lançamentos.",
    order: 1,
    limits: {
      incomesPerMonth: null,
      expensesPerMonth: null,
      goals: 5,
      budgets: 5,
      subscriptions: 10,
      historyMonths: 12,
    },
    features: ["PURCHASE_ANALYSIS", "CSV_EXPORT", "ADVANCED_ANALYSIS"],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    priceCents: 1990,
    tagline: "Tudo liberado, incluindo o Assistente com IA.",
    order: 2,
    limits: {
      incomesPerMonth: null,
      expensesPerMonth: null,
      goals: null,
      budgets: null,
      subscriptions: null,
      historyMonths: null,
    },
    features: [
      "PURCHASE_ANALYSIS",
      "CSV_EXPORT",
      "PDF_EXPORT",
      "ADVANCED_ANALYSIS",
      "AI_ASSISTANT",
      "UNLIMITED_GOALS",
      "UNLIMITED_BUDGETS",
      "UNLIMITED_SUBSCRIPTIONS",
      "UNLIMITED_HISTORY",
    ],
  },
};

export const PLAN_ORDER: PlanId[] = ["FREE", "BASIC", "PRO"];

/** Human-readable labels for features (used in paywalls and comparison). */
export const FEATURE_LABELS: Record<Feature, string> = {
  AI_ASSISTANT: "Assistente com IA",
  PURCHASE_ANALYSIS: '"Posso comprar?"',
  CSV_EXPORT: "Exportação CSV",
  PDF_EXPORT: "Exportação PDF",
  ADVANCED_ANALYSIS: "Análise financeira avançada",
  UNLIMITED_GOALS: "Metas ilimitadas",
  UNLIMITED_BUDGETS: "Orçamentos ilimitados",
  UNLIMITED_SUBSCRIPTIONS: "Assinaturas ilimitadas",
  UNLIMITED_HISTORY: "Histórico ilimitado",
};

/** Which limit key maps to which "unlimited" feature. */
export const UNLIMITED_FEATURE_BY_LIMIT: Partial<
  Record<keyof PlanLimits, Feature>
> = {
  goals: "UNLIMITED_GOALS",
  budgets: "UNLIMITED_BUDGETS",
  subscriptions: "UNLIMITED_SUBSCRIPTIONS",
  historyMonths: "UNLIMITED_HISTORY",
};
