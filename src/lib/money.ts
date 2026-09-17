/**
 * Money utilities. Values are always stored and passed around as INTEGER cents.
 * Formatting/parsing targets Brazilian Real (BRL).
 */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const BRL_NO_SYMBOL = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format cents to "R$ 1.234,56". */
export function formatCents(cents: number): string {
  return BRL.format((cents ?? 0) / 100);
}

/** Format cents to "1.234,56" (no currency symbol). */
export function formatCentsPlain(cents: number): string {
  return BRL_NO_SYMBOL.format((cents ?? 0) / 100);
}

/**
 * Parse a user-typed BRL string ("1.234,56", "R$ 1234,5", "1234.56") into
 * integer cents. Returns null when the input cannot be parsed.
 */
export function parseToCents(input: string | number): number | null {
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return null;
    return Math.round(input * 100);
  }
  if (!input) return null;

  let s = input.trim().replace(/\s/g, "").replace(/R\$/gi, "");
  if (!s) return null;

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  if (hasComma && hasDot) {
    // Assume "." thousands separator and "," decimal — BRL style.
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    s = s.replace(",", ".");
  }
  // else: only dots or plain digits -> treat "." as decimal separator.

  const value = Number(s);
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 100);
}

/** Format a percentage with one decimal place, pt-BR style ("18,4%"). */
export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}
