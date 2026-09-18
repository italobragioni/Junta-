import {
  PLANS,
  type Feature,
  type PlanId,
  type PlanLimits,
} from "./config";

export * from "./config";

export function getPlanConfig(plan: PlanId) {
  return PLANS[plan];
}

/**
 * Whether a plan grants a feature. Works for explicit features and for the
 * derived "UNLIMITED_*" features (a limit of null == unlimited).
 */
export function canUseFeature(plan: PlanId, feature: Feature): boolean {
  return PLANS[plan].features.includes(feature);
}

export function getLimit(plan: PlanId, key: keyof PlanLimits): number | null {
  return PLANS[plan].limits[key];
}

export function isUnlimited(plan: PlanId, key: keyof PlanLimits): boolean {
  return PLANS[plan].limits[key] === null;
}

/** The smallest plan that grants a given feature (for "upgrade to X" copy). */
export function minPlanForFeature(feature: Feature): PlanId {
  if (canUseFeature("BASIC", feature)) return "BASIC";
  return "PRO";
}

/** The smallest plan that lifts a given limit (makes it unlimited or higher). */
export function nextPlanForLimit(
  current: PlanId,
  key: keyof PlanLimits,
): PlanId | null {
  const order: PlanId[] = ["FREE", "BASIC", "PRO"];
  const idx = order.indexOf(current);
  const currentLimit = PLANS[current].limits[key];
  for (let i = idx + 1; i < order.length; i++) {
    const next = order[i];
    const limit = PLANS[next].limits[key];
    if (limit === null || (currentLimit !== null && limit > currentLimit)) {
      return next;
    }
  }
  return null;
}
