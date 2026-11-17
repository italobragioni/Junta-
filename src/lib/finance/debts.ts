/**
 * Simuladores de quitação de dívidas: Bola de Neve e Avalanche.
 *
 * - Bola de neve (snowball): paga primeiro a dívida de MENOR saldo. Dá
 *   vitórias rápidas e motivação.
 * - Avalanche: paga primeiro a de MAIOR juros. Economiza mais dinheiro.
 *
 * O simulador aplica os valores mínimos em todas as dívidas e joga o "extra"
 * mensal na dívida-alvo. Quando uma dívida é quitada, seu pagamento é
 * redirecionado para a próxima (efeito "bola de neve").
 *
 * Juros são compostos mensalmente sobre o saldo devedor.
 */

import type { Cents } from "../money";

export type Strategy = "snowball" | "avalanche";

export interface DebtInput {
  id: string;
  name: string;
  balanceCents: Cents;
  /** Juros ao mês em %, ex.: 2.5 = 2,5% a.m. */
  monthlyRate: number;
  /** Pagamento mínimo mensal (ex.: valor da parcela). */
  minPaymentCents: Cents;
}

export interface PayoffResult {
  months: number;
  totalInterestCents: Cents;
  totalPaidCents: Cents;
  /** Ordem em que as dívidas foram quitadas. */
  payoffOrder: { id: string; name: string; month: number }[];
}

const MAX_MONTHS = 1200; // trava de segurança (100 anos)

/**
 * Simula a quitação. `extraCents` é quanto o usuário consegue pagar ALÉM da
 * soma dos mínimos, a cada mês.
 */
export function simulatePayoff(
  debts: DebtInput[],
  strategy: Strategy,
  extraCents: Cents,
): PayoffResult {
  // Cópia de trabalho
  let balances = debts.map((d) => ({ ...d }));
  let month = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  const payoffOrder: PayoffResult["payoffOrder"] = [];

  while (balances.some((d) => d.balanceCents > 0) && month < MAX_MONTHS) {
    month += 1;

    // 1) Juros do mês sobre o saldo de cada dívida ativa.
    for (const d of balances) {
      if (d.balanceCents <= 0) continue;
      const interest = Math.round(d.balanceCents * (d.monthlyRate / 100));
      d.balanceCents += interest;
      totalInterest += interest;
    }

    // 2) Orçamento do mês = soma dos mínimos (de dívidas ativas) + extra.
    const active = balances.filter((d) => d.balanceCents > 0);
    let budget = active.reduce((s, d) => s + d.minPaymentCents, 0) + extraCents;

    // 3) Paga os mínimos primeiro (prioriza manter contratos em dia).
    for (const d of active) {
      const pay = Math.min(d.minPaymentCents, d.balanceCents, budget);
      d.balanceCents -= pay;
      budget -= pay;
      totalPaid += pay;
    }

    // 4) Direciona o que sobrou para a dívida-alvo (ordem da estratégia).
    const targets = orderByStrategy(
      balances.filter((d) => d.balanceCents > 0),
      strategy,
    );
    for (const d of targets) {
      if (budget <= 0) break;
      const pay = Math.min(budget, d.balanceCents);
      d.balanceCents -= pay;
      budget -= pay;
      totalPaid += pay;
    }

    // 5) Registra dívidas quitadas neste mês.
    for (const d of balances) {
      if (d.balanceCents <= 0 && !payoffOrder.some((p) => p.id === d.id)) {
        payoffOrder.push({ id: d.id, name: d.name, month });
      }
    }

    // Normaliza saldos negativos para zero.
    balances = balances.map((d) => ({ ...d, balanceCents: Math.max(0, d.balanceCents) }));

    // Se nenhuma dívida está sendo paga (orçamento < juros em todas), evita loop infinito.
    if (active.length > 0 && extraCents <= 0 &&
        active.every((d) => d.minPaymentCents === 0)) break;
  }

  return {
    months: month,
    totalInterestCents: totalInterest,
    totalPaidCents: totalPaid,
    payoffOrder,
  };
}

function orderByStrategy(debts: DebtInput[], strategy: Strategy): DebtInput[] {
  const copy = [...debts];
  if (strategy === "snowball") {
    copy.sort((a, b) => a.balanceCents - b.balanceCents);
  } else {
    copy.sort((a, b) => b.monthlyRate - a.monthlyRate || a.balanceCents - b.balanceCents);
  }
  return copy;
}

/**
 * Compara as duas estratégias e quanto se economiza em juros com cada uma
 * em relação a pagar apenas os mínimos.
 */
export function compareStrategies(debts: DebtInput[], extraCents: Cents) {
  const snowball = simulatePayoff(debts, "snowball", extraCents);
  const avalanche = simulatePayoff(debts, "avalanche", extraCents);
  const minimumOnly = simulatePayoff(debts, "avalanche", 0);
  return {
    snowball,
    avalanche,
    minimumOnly,
    interestSavedSnowballCents: minimumOnly.totalInterestCents - snowball.totalInterestCents,
    interestSavedAvalancheCents: minimumOnly.totalInterestCents - avalanche.totalInterestCents,
  };
}
