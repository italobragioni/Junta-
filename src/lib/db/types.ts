/**
 * Tipos do domínio Finora — espelham o schema do banco (0001_finora_init.sql).
 * Valores monetários são sempre centavos (inteiros).
 */

export type AccountType =
  | "checking" | "savings" | "cash" | "wallet" | "digital" | "investment" | "other";

export type TransactionKind =
  | "income" | "expense" | "transfer" | "card_expense" | "card_payment";

export type CategoryType = "income" | "expense";

export type PaymentMethod =
  | "pix" | "debit" | "credit" | "cash" | "boleto" | "transfer" | "other";

export type Recurrence = "none" | "daily" | "weekly" | "monthly" | "yearly";
export type TxStatus = "pending" | "cleared";
export type BillKind = "payable" | "receivable";
export type BillStatus = "open" | "paid";
export type DebtKind = "loan" | "financing" | "installment" | "card" | "personal";
export type PatrimonyKind =
  | "cash" | "property" | "vehicle" | "investment" | "receivable" | "other";
export type ThemePref = "light" | "dark" | "system";

export interface Profile {
  id: string;
  display_name: string;
  email: string | null;
  theme: ThemePref;
  currency: string;
  timezone: string;
  monthly_income_cents: number;
  primary_goal: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  is_default: boolean;
  sort: number;
  archived: boolean;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  institution: string | null;
  color: string;
  icon: string;
  opening_balance_cents: number;
  include_in_total: boolean;
  archived: boolean;
  sort: number;
  created_at: string;
  updated_at: string;
}

export interface AccountWithBalance extends Account {
  balance_cents: number;
}

export interface CreditCard {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  color: string;
  limit_cents: number;
  closing_day: number;
  due_day: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditCardWithBalance extends CreditCard {
  used_cents: number;
  available_cents: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  kind: TransactionKind;
  description: string;
  amount_cents: number;
  category_id: string | null;
  account_id: string | null;
  to_account_id: string | null;
  card_id: string | null;
  payment_method: PaymentMethod | null;
  occurred_on: string; // YYYY-MM-DD
  status: TxStatus;
  notes: string | null;
  attachment_url: string | null;
  installment_group: string | null;
  installment_number: number | null;
  installment_total: number | null;
  invoice_period: string | null; // YYYY-MM
  recurring_rule_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: string; // YYYY-MM
  limit_cents: number;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  image_url: string | null;
  color: string;
  target_cents: number;
  deadline: string | null;
  started_on: string;
  archived: boolean;
  created_at: string;
}

export interface GoalContribution {
  id: string;
  user_id: string;
  goal_id: string;
  amount_cents: number;
  contributed_on: string;
  notes: string | null;
  created_at: string;
}

export interface Bill {
  id: string;
  user_id: string;
  kind: BillKind;
  description: string;
  amount_cents: number;
  due_date: string;
  category_id: string | null;
  account_id: string | null;
  frequency: Recurrence;
  status: BillStatus;
  paid_on: string | null;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Debt {
  id: string;
  user_id: string;
  name: string;
  kind: DebtKind;
  creditor: string | null;
  principal_cents: number;
  balance_cents: number;
  interest_rate: number; // % ao mês
  installments_total: number | null;
  installment_cents: number | null;
  next_due: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface PatrimonyItem {
  id: string;
  user_id: string;
  name: string;
  kind: PatrimonyKind;
  value_cents: number;
  is_liability: boolean;
  acquired_on: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecurringRule {
  id: string;
  user_id: string;
  kind: TransactionKind;
  description: string;
  amount_cents: number;
  category_id: string | null;
  account_id: string | null;
  card_id: string | null;
  payment_method: PaymentMethod | null;
  frequency: Recurrence;
  day_of_month: number | null;
  start_date: string;
  end_date: string | null;
  next_run: string;
  is_subscription: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  entity: string;
  action: string;
  summary: string;
  amount_cents: number | null;
  created_at: string;
}
