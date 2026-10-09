import { describe, expect, it } from "vitest";

import {
  firstCompletionXp,
  levelForXp,
  levelProgress,
  xpToNextLevel,
} from "./xp";

describe("levelForXp", () => {
  it("is level 1 from 0 to 99 XP", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
  });
  it("advances every 100 XP", () => {
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(250)).toBe(3);
  });
  it("never drops below 1 for negatives", () => {
    expect(levelForXp(-50)).toBe(1);
  });
});

describe("xpToNextLevel / levelProgress", () => {
  it("computes remaining XP within a level", () => {
    expect(xpToNextLevel(0)).toBe(100);
    expect(xpToNextLevel(30)).toBe(70);
    expect(xpToNextLevel(100)).toBe(100);
  });
  it("computes progress fraction", () => {
    expect(levelProgress(0)).toBe(0);
    expect(levelProgress(50)).toBeCloseTo(0.5);
  });
});

describe("firstCompletionXp", () => {
  it("is 20 base plus 2 per first-try-correct", () => {
    expect(firstCompletionXp(0)).toBe(20);
    expect(firstCompletionXp(5)).toBe(30); // 20 + 5*2
  });
  it("ignores negatives and fractions", () => {
    expect(firstCompletionXp(-3)).toBe(20);
    expect(firstCompletionXp(2.9)).toBe(24);
  });
});
