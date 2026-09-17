/**
 * Pure financial simulation helpers. No DB access — all inputs are cents.
 * These power the savings simulator, the "Posso comprar?" tool and goal math.
 */

export interface SavingsProjectionRow {
  months: number;
  totalCents: number;
}

export function projectSavings(
  monthlyCents: number,
  horizons: number[] = [3, 6, 12, 24],
): SavingsProjectionRow[] {
  return horizons.map((months) => ({
    months,
    totalCents: Math.max(0, monthlyCents) * months,
  }));
}

/**
 * Months needed to reach `targetCents` saving `monthlyCents` per month,
 * optionally starting from `currentCents`. Returns null when it is not
 * reachable (monthly <= 0 and there is still a gap).
 */
export function monthsToReach(
  targetCents: number,
  monthlyCents: number,
  currentCents = 0,
): number | null {
  const remaining = Math.max(0, targetCents - currentCents);
  if (remaining <= 0) return 0;
  if (monthlyCents <= 0) return null;
  return Math.ceil(remaining / monthlyCents);
}

export interface GoalMath {
  remainingCents: number;
  progressPercent: number;
  monthlyNeededCents: number | null; // to hit targetDate, null if no date
  monthsUntilTarget: number | null;
}

export function goalMath(params: {
  targetAmountCents: number;
  currentAmountCents: number;
  monthsUntilTarget: number | null;
}): GoalMath {
  const { targetAmountCents, currentAmountCents, monthsUntilTarget } = params;
  const remainingCents = Math.max(0, targetAmountCents - currentAmountCents);
  const progressPercent =
    targetAmountCents > 0
      ? Math.min(100, (currentAmountCents / targetAmountCents) * 100)
      : 0;

  let monthlyNeededCents: number | null = null;
  if (monthsUntilTarget !== null && monthsUntilTarget > 0) {
    monthlyNeededCents = Math.ceil(remainingCents / monthsUntilTarget);
  } else if (monthsUntilTarget === 0) {
    monthlyNeededCents = remainingCents;
  }

  return {
    remainingCents,
    progressPercent,
    monthlyNeededCents,
    monthsUntilTarget,
  };
}

export type PurchaseVerdict = "comfortable" | "tight" | "not_now";

export interface PurchaseAnalysis {
  priceCents: number;
  availableNowCents: number;
  monthlySavingsCents: number;
  canAffordNow: boolean;
  leftoverIfBoughtNowCents: number; // available - price (can be negative)
  monthsToSaveUp: number | null; // if saving monthlySavings toward the price
  verdict: PurchaseVerdict;
}

/**
 * Analyse a potential purchase strictly from the user's own numbers.
 * This is a simulation, not financial advice.
 */
export function analyzePurchase(params: {
  priceCents: number;
  availableNowCents: number;
  monthlySavingsCents: number;
}): PurchaseAnalysis {
  const { priceCents, availableNowCents, monthlySavingsCents } = params;
  const leftover = availableNowCents - priceCents;
  const canAffordNow = leftover >= 0;

  const monthsToSaveUp = monthsToReach(priceCents, monthlySavingsCents, 0);

  let verdict: PurchaseVerdict;
  if (canAffordNow && leftover >= priceCents * 0.5) {
    verdict = "comfortable";
  } else if (canAffordNow) {
    verdict = "tight";
  } else {
    verdict = "not_now";
  }

  return {
    priceCents,
    availableNowCents,
    monthlySavingsCents,
    canAffordNow,
    leftoverIfBoughtNowCents: leftover,
    monthsToSaveUp,
    verdict,
  };
}
