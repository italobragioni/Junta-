import { describe, expect, it } from "vitest";

import { applyActivity, dayDiff, localDay, type StreakState } from "./streak";

const fresh: StreakState = { current: 0, best: 0, lastActiveDay: null };

describe("localDay", () => {
  it("resolves the calendar day in the given timezone", () => {
    // 2026-01-01 02:00 UTC is still 2025-12-31 in São Paulo (UTC-3).
    const instant = new Date("2026-01-01T02:00:00Z");
    expect(localDay(instant, "America/Sao_Paulo")).toBe("2025-12-31");
    expect(localDay(instant, "UTC")).toBe("2026-01-01");
  });
});

describe("dayDiff", () => {
  it("counts whole days between calendar dates", () => {
    expect(dayDiff("2026-01-01", "2026-01-02")).toBe(1);
    expect(dayDiff("2026-01-01", "2026-01-01")).toBe(0);
    expect(dayDiff("2026-01-01", "2026-01-05")).toBe(4);
  });
});

describe("applyActivity", () => {
  it("starts a streak at 1 on first activity", () => {
    const s = applyActivity(fresh, "2026-03-10");
    expect(s).toEqual({ current: 1, best: 1, lastActiveDay: "2026-03-10" });
  });

  it("is idempotent for repeated activity on the same day", () => {
    const day1 = applyActivity(fresh, "2026-03-10");
    const again = applyActivity(day1, "2026-03-10");
    expect(again).toEqual(day1); // same day counts once
  });

  it("increments on the next day", () => {
    const day1 = applyActivity(fresh, "2026-03-10");
    const day2 = applyActivity(day1, "2026-03-11");
    expect(day2.current).toBe(2);
    expect(day2.best).toBe(2);
  });

  it("resets to 1 after a gap", () => {
    let s = applyActivity(fresh, "2026-03-10");
    s = applyActivity(s, "2026-03-11"); // current 2, best 2
    s = applyActivity(s, "2026-03-15"); // gap -> reset
    expect(s.current).toBe(1);
    expect(s.best).toBe(2); // best preserved
  });

  it("never fabricates days from a non-positive diff", () => {
    const s = applyActivity({ current: 3, best: 3, lastActiveDay: "2026-03-10" }, "2026-03-09");
    expect(s.current).toBe(1); // backwards day resets rather than increments
  });
});
