/**
 * AI service contract. The rest of the app depends only on this interface,
 * never on a concrete provider. This keeps AI optional and swappable.
 */

export interface FinancialContext {
  monthLabel: string;
  incomeCents: number;
  expensesCents: number;
  availableCents: number;
  savingsCents: number;
  savingsRate: number;
  topCategories: { name: string; totalCents: number }[];
  goals: {
    name: string;
    targetAmountCents: number;
    currentAmountCents: number;
  }[];
  subscriptionsMonthlyCents: number;
}

export interface AssistantAnswer {
  answer: string;
  /** true when produced by a real AI provider, false for the built-in fallback. */
  aiPowered: boolean;
}

export interface AIProvider {
  readonly name: string;
  isConfigured(): boolean;
  ask(question: string, context: FinancialContext): Promise<AssistantAnswer>;
}
