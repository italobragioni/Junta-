/**
 * Finora — Money engine.
 *
 * REGRA DE OURO: todo valor monetário é um INTEIRO em CENTAVOS (BRL).
 * Nunca usamos float para armazenar ou somar dinheiro — isso elimina os erros
 * clássicos de ponto flutuante (0.1 + 0.2 !== 0.3). A conversão para/de reais
 * só acontece na borda (entrada do usuário e exibição).
 *
 * Um "Cents" é sempre um número inteiro. As funções aqui garantem esse
 * invariante arredondando de forma determinística (half-up) e validando.
 */

export type Cents = number;

/** Converte um valor em reais (número ou string "1.234,56"/"1234.56") em centavos inteiros. */
export function toCents(value: number | string): Cents {
  const reais = typeof value === "string" ? parseReais(value) : value;
  if (!Number.isFinite(reais)) return 0;
  // Arredondamento half-up robusto: trabalhamos com o valor * 100 e usamos
  // Math.round com correção de epsilon para evitar que 1.005 vire 100 em vez
  // de 101 por causa da representação binária.
  return Math.round((reais + Number.EPSILON * Math.sign(reais)) * 100);
}

/** Converte centavos inteiros em reais (number) — use apenas para exibição/gráficos. */
export function toReais(cents: Cents): number {
  return Math.round(cents) / 100;
}

/**
 * Lê uma string digitada pelo usuário em formato brasileiro ou americano e
 * retorna reais como number. Aceita "R$ 1.234,56", "1234,56", "1,234.56",
 * "1234.56", "1.234" (milhar), etc. Tolerante, mas determinístico.
 */
export function parseReais(input: string): number {
  if (typeof input !== "string") return Number(input) || 0;
  let s = input.trim().replace(/[R$\s ]/g, "");
  if (s === "") return 0;
  const neg = /^-/.test(s) || /^\(.*\)$/.test(s);
  s = s.replace(/[()]/g, "").replace(/^-/, "");

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  if (hasComma && hasDot) {
    // O último separador é o decimal.
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      // Formato BR: ponto = milhar, vírgula = decimal.
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      // Formato US: vírgula = milhar, ponto = decimal.
      s = s.replace(/,/g, "");
    }
  } else if (hasComma) {
    // Só vírgula → decimal brasileiro.
    s = s.replace(",", ".");
  } else if (hasDot) {
    // Só ponto: ambíguo. "1.000"/"1.234.567" = milhar; "1.5"/"19.90" = decimal.
    // Grupos de exatamente 3 dígitos → separador de milhar (removemos).
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  }
  // Agora está em formato parseável (ponto = decimal).
  const n = Number(s);
  if (!Number.isFinite(n)) return 0;
  return neg ? -n : n;
}

/** Soma uma lista de centavos de forma segura (inteiros). */
export function sumCents(values: Cents[]): Cents {
  let total = 0;
  for (const v of values) total += Math.round(v);
  return total;
}

/**
 * Divide um valor em `n` parcelas inteiras cuja SOMA é exatamente o total.
 * Distribui os centavos restantes nas primeiras parcelas, então nunca se
 * perde nem se cria 1 centavo (ex.: 1000 / 3 → [334, 333, 333]).
 */
export function splitInstallments(total: Cents, n: number): Cents[] {
  const count = Math.max(1, Math.trunc(n));
  const base = Math.trunc(total / count);
  const remainder = total - base * count; // 0..count-1 (mesmo sinal do total)
  const parts: Cents[] = [];
  const step = Math.sign(remainder) || 1;
  let left = Math.abs(remainder);
  for (let i = 0; i < count; i++) {
    let part = base;
    if (left > 0) {
      part += step;
      left -= 1;
    }
    parts.push(part);
  }
  return parts;
}

/** Percentual (0..100+) de `part` sobre `whole`, protegido contra divisão por zero. */
export function percentOf(part: Cents, whole: Cents): number {
  if (!whole) return 0;
  return (part / whole) * 100;
}

/** Garante inteiro (centavos). Use ao vir de fontes externas. */
export function asCents(value: unknown): Cents {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : 0;
}
