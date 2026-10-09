import { describe, expect, it } from "vitest";

import {
  effectivePlan,
  lessonAccess,
  FREE_SUBSCRIPTION,
  type SubscriptionState,
} from "./access";

const now = new Date("2026-06-15T12:00:00Z");

describe("effectivePlan", () => {
  it("is free without any paid period", () => {
    expect(effectivePlan(FREE_SUBSCRIPTION, now)).toBe("free");
  });
  it("is premium while a non-revoked paid period covers now", () => {
    const sub: SubscriptionState = { accessUntil: "2026-07-01T00:00:00Z", revoked: false };
    expect(effectivePlan(sub, now)).toBe("premium");
  });
  it("keeps premium until the already-paid period ends (cancelled renewal)", () => {
    const sub: SubscriptionState = { accessUntil: "2026-06-20T00:00:00Z", revoked: false };
    expect(effectivePlan(sub, now)).toBe("premium");
    const later = new Date("2026-06-21T00:00:00Z");
    expect(effectivePlan(sub, later)).toBe("free");
  });
  it("is free when revoked even if the date is still in the future", () => {
    const sub: SubscriptionState = { accessUntil: "2026-07-01T00:00:00Z", revoked: true };
    expect(effectivePlan(sub, now)).toBe("free");
  });
});

describe("lessonAccess", () => {
  it("never exposes unpublished lessons", () => {
    expect(
      lessonAccess({
        lessonStatus: "rascunho",
        lessonPlan: "free",
        userPlan: "premium",
        prerequisiteMet: true,
      }),
    ).toEqual({ allowed: false, reason: "unpublished" });
  });

  it("blocks premium lessons for free users with a plan reason", () => {
    expect(
      lessonAccess({
        lessonStatus: "publicado",
        lessonPlan: "premium",
        userPlan: "free",
        prerequisiteMet: true,
      }),
    ).toEqual({ allowed: false, reason: "plan" });
  });

  it("blocks on prerequisite distinctly from plan", () => {
    expect(
      lessonAccess({
        lessonStatus: "publicado",
        lessonPlan: "free",
        userPlan: "free",
        prerequisiteMet: false,
      }),
    ).toEqual({ allowed: false, reason: "prerequisite" });
  });

  it("allows a published, in-plan, unlocked lesson", () => {
    expect(
      lessonAccess({
        lessonStatus: "publicado",
        lessonPlan: "free",
        userPlan: "free",
        prerequisiteMet: true,
      }),
    ).toEqual({ allowed: true, reason: "ok" });
  });
});
