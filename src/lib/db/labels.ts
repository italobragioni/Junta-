import type {
  AccountType, PaymentMethod, Recurrence, DebtKind, PatrimonyKind, TransactionKind,
} from "./types";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  checking: "Conta corrente",
  savings: "Poupança",
  cash: "Dinheiro em espécie",
  wallet: "Carteira física",
  digital: "Conta digital",
  investment: "Investimentos",
  other: "Outras",
};

export const ACCOUNT_TYPE_ICONS: Record<AccountType, string> = {
  checking: "landmark",
  savings: "piggy-bank",
  cash: "banknote",
  wallet: "wallet",
  digital: "smartphone",
  investment: "trending-up",
  other: "circle-dollar-sign",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: "Pix",
  debit: "Débito",
  credit: "Crédito",
  cash: "Dinheiro",
  boleto: "Boleto",
  transfer: "Transferência",
  other: "Outro",
};

export const RECURRENCE_LABELS: Record<Recurrence, string> = {
  none: "Não repete",
  daily: "Diária",
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
};

export const DEBT_KIND_LABELS: Record<DebtKind, string> = {
  loan: "Empréstimo",
  financing: "Financiamento",
  installment: "Parcelamento",
  card: "Cartão",
  personal: "Dívida pessoal",
};

export const PATRIMONY_KIND_LABELS: Record<PatrimonyKind, string> = {
  cash: "Dinheiro",
  property: "Imóvel",
  vehicle: "Veículo",
  investment: "Investimento",
  receivable: "A receber",
  other: "Outro bem",
};

export const TRANSACTION_KIND_LABELS: Record<TransactionKind, string> = {
  income: "Receita",
  expense: "Despesa",
  transfer: "Transferência",
  card_expense: "Compra no cartão",
  card_payment: "Pagamento de fatura",
};

/** Bandeiras de cartão comuns no Brasil. */
export const CARD_BRANDS = [
  "Visa", "Mastercard", "Elo", "American Express", "Hipercard", "Outra",
];

/** Paleta de cores usada para contas, cartões, categorias e metas. */
export const COLOR_PALETTE = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316",
  "#eab308", "#84cc16", "#22c55e", "#14b8a6", "#06b6d4",
  "#0ea5e9", "#64748b",
];
