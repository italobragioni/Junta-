import { toReais, type Cents } from "./money";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const BRL_NO_SYMBOL = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formata centavos como moeda brasileira: 123456 → "R$ 1.234,56". */
export function formatBRL(cents: Cents): string {
  return BRL.format(toReais(cents));
}

/** Como formatBRL, mas sem o símbolo "R$" (para inputs/compactos). */
export function formatAmount(cents: Cents): string {
  return BRL_NO_SYMBOL.format(toReais(cents));
}

/**
 * Versão compacta para gráficos/cards: 1.234.567 centavos → "R$ 12,3 mil".
 * Mantém o sinal e usa K/mi para não estourar o layout mobile.
 */
export function formatCompactBRL(cents: Cents): string {
  const reais = toReais(cents);
  const abs = Math.abs(reais);
  const sign = reais < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}R$ ${(abs / 1_000_000).toFixed(1).replace(".", ",")} mi`;
  if (abs >= 1_000) return `${sign}R$ ${(abs / 1_000).toFixed(1).replace(".", ",")} mil`;
  return `${sign}R$ ${abs.toFixed(0)}`;
}

/** Formata um percentual com 0 ou 1 casa: 72.4 → "72%" / "72,4%". */
export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals).replace(".", ",")}%`;
}

const DATE_FMT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const DATE_FMT_SHORT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});
const MONTH_FMT = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

/** "2026-11-17" ou Date → "17/11/2026". Trata datas ISO como data local (sem fuso). */
export function formatDate(value: string | Date): string {
  return DATE_FMT.format(asLocalDate(value));
}

export function formatDateShort(value: string | Date): string {
  return DATE_FMT_SHORT.format(asLocalDate(value));
}

/** "2026-11" → "novembro de 2026". */
export function formatMonth(value: string | Date): string {
  const d = typeof value === "string" && value.length === 7 ? new Date(`${value}-01T00:00:00`) : asLocalDate(value);
  return MONTH_FMT.format(d);
}

/**
 * Converte "2026-11-17" em um Date no fuso LOCAL (meia-noite local), evitando
 * o bug clássico em que o JS interpreta a string como UTC e "volta um dia".
 */
export function asLocalDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Date(value);
}

/** Nomes de meses curtos em pt-BR para eixos de gráfico. */
export const SHORT_MONTHS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

/** Diferença em dias entre hoje e uma data (positivo = futuro). */
export function daysUntil(value: string | Date): number {
  const target = asLocalDate(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/** Texto relativo amigável: "em 3 dias", "hoje", "há 2 dias", "amanhã". */
export function relativeDay(value: string | Date): string {
  const d = daysUntil(value);
  if (d === 0) return "hoje";
  if (d === 1) return "amanhã";
  if (d === -1) return "ontem";
  if (d > 1) return `em ${d} dias`;
  return `há ${Math.abs(d)} dias`;
}
