import { describe, it, expect } from "vitest";
import {
  canUseFeature,
  getLimit,
  isUnlimited,
  minPlanForFeature,
  nextPlanForLimit,
  PLANS,
} from "./index";

describe("plan features", () => {
  it("FREE has no premium features", () => {
    expect(canUseFeature("FREE", "AI_ASSISTANT")).toBe(false);
    expect(canUseFeature("FREE", "PURCHASE_ANALYSIS")).toBe(false);
    expect(canUseFeature("FREE", "CSV_EXPORT")).toBe(false);
    expect(canUseFeature("FREE", "PDF_EXPORT")).toBe(false);
    expect(canUseFeature("FREE", "ADVANCED_ANALYSIS")).toBe(false);
  });

  it("BASIC unlocks purchase analysis, CSV and advanced analysis but not AI/PDF", () => {
    expect(canUseFeature("BASIC", "PURCHASE_ANALYSIS")).toBe(true);
    expect(canUseFeature("BASIC", "CSV_EXPORT")).toBe(true);
    expect(canUseFeature("BASIC", "ADVANCED_ANALYSIS")).toBe(true);
    expect(canUseFeature("BASIC", "AI_ASSISTANT")).toBe(false);
    expect(canUseFeature("BASIC", "PDF_EXPORT")).toBe(false);
  });

  it("PRO unlocks everything", () => {
    for (const f of [
      "AI_ASSISTANT",
      "PURCHASE_ANALYSIS",
      "CSV_EXPORT",
      "PDF_EXPORT",
      "ADVANCED_ANALYSIS",
      "UNLIMITED_GOALS",
      "UNLIMITED_HISTORY",
    ] as const) {
      expect(canUseFeature("PRO", f)).toBe(true);
    }
  });
});

describe("plan limits", () => {
  it("FREE limits match spec", () => {
    expect(getLimit("FREE", "incomesPerMonth")).toBe(10);
    expect(getLimit("FREE", "expensesPerMonth")).toBe(30);
    expect(getLimit("FREE", "goals")).toBe(1);
    expect(getLimit("FREE", "budgets")).toBe(1);
    expect(getLimit("FREE", "subscriptions")).toBe(3);
    expect(getLimit("FREE", "historyMonths")).toBe(3);
  });

  it("BASIC lifts income/expense limits and raises the rest", () => {
    expect(isUnlimited("BASIC", "incomesPerMonth")).toBe(true);
    expect(isUnlimited("BASIC", "expensesPerMonth")).toBe(true);
    expect(getLimit("BASIC", "goals")).toBe(5);
    expect(getLimit("BASIC", "subscriptions")).toBe(10);
    expect(getLimit("BASIC", "historyMonths")).toBe(12);
  });

  it("PRO is unlimited across the board", () => {
    expect(isUnlimited("PRO", "goals")).toBe(true);
    expect(isUnlimited("PRO", "budgets")).toBe(true);
    expect(isUnlimited("PRO", "subscriptions")).toBe(true);
    expect(isUnlimited("PRO", "historyMonths")).toBe(true);
  });
});

describe("upgrade helpers", () => {
  it("finds the minimum plan for a feature", () => {
    expect(minPlanForFeature("PURCHASE_ANALYSIS")).toBe("BASIC");
    expect(minPlanForFeature("AI_ASSISTANT")).toBe("PRO");
  });

  it("finds the next plan that lifts a limit", () => {
    expect(nextPlanForLimit("FREE", "goals")).toBe("BASIC");
    expect(nextPlanForLimit("BASIC", "goals")).toBe("PRO");
    expect(nextPlanForLimit("PRO", "goals")).toBeNull();
  });

  it("prices are in cents", () => {
    expect(PLANS.FREE.priceCents).toBe(0);
    expect(PLANS.BASIC.priceCents).toBe(990);
    expect(PLANS.PRO.priceCents).toBe(1990);
  });
});
