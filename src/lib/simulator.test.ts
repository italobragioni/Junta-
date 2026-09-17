import { describe, it, expect } from "vitest";
import {
  projectSavings,
  monthsToReach,
  goalMath,
  analyzePurchase,
} from "./simulator";

describe("projectSavings", () => {
  it("projects across default horizons", () => {
    const rows = projectSavings(30000); // R$ 300/mês
    expect(rows).toEqual([
      { months: 3, totalCents: 90000 },
      { months: 6, totalCents: 180000 },
      { months: 12, totalCents: 360000 },
      { months: 24, totalCents: 720000 },
    ]);
  });
});

describe("monthsToReach", () => {
  it("computes months needed", () => {
    expect(monthsToReach(500000, 30000)).toBe(17); // ceil(500000/30000)
  });
  it("accounts for current amount", () => {
    expect(monthsToReach(500000, 30000, 200000)).toBe(10);
  });
  it("returns 0 when already reached", () => {
    expect(monthsToReach(100000, 30000, 100000)).toBe(0);
  });
  it("returns null when unreachable", () => {
    expect(monthsToReach(100000, 0)).toBeNull();
  });
});

describe("goalMath", () => {
  it("computes progress and monthly needed", () => {
    const m = goalMath({
      targetAmountCents: 600000,
      currentAmountCents: 185000,
      monthsUntilTarget: 10,
    });
    expect(m.remainingCents).toBe(415000);
    expect(Math.round(m.progressPercent * 10) / 10).toBeCloseTo(30.8, 1);
    expect(m.monthlyNeededCents).toBe(41500);
  });

  it("has no monthly target without a date", () => {
    const m = goalMath({
      targetAmountCents: 100000,
      currentAmountCents: 0,
      monthsUntilTarget: null,
    });
    expect(m.monthlyNeededCents).toBeNull();
  });
});

describe("analyzePurchase", () => {
  it("flags comfortable purchases", () => {
    const r = analyzePurchase({
      priceCents: 100000,
      availableNowCents: 300000,
      monthlySavingsCents: 50000,
    });
    expect(r.canAffordNow).toBe(true);
    expect(r.verdict).toBe("comfortable");
    expect(r.leftoverIfBoughtNowCents).toBe(200000);
  });

  it("flags purchases that cannot be afforded now", () => {
    const r = analyzePurchase({
      priceCents: 300000,
      availableNowCents: 100000,
      monthlySavingsCents: 30000,
    });
    expect(r.canAffordNow).toBe(false);
    expect(r.verdict).toBe("not_now");
    expect(r.monthsToSaveUp).toBe(10);
  });
});
