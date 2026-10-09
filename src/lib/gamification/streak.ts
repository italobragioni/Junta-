/**
 * Daily streak logic. Pure functions over calendar days.
 *
 * A "day" is computed in the learner's saved timezone (initially
 * America/Sao_Paulo). The streak advances only on a real learning activity
 * (completing a lesson, or a review session that had pending questions) —
 * never on login alone. Changing timezone only affects FUTURE activities and
 * can never manufacture extra days, because history is stored as the already
 * resolved local calendar day (a string), not recomputed from timestamps.
 */

export interface StreakState {
  current: number;
  best: number;
  /** Last activity day as an ISO calendar date (YYYY-MM-DD) in local tz. */
  lastActiveDay: string | null;
}

/** Local calendar date (YYYY-MM-DD) for an instant in a given IANA timezone. */
export function localDay(instant: Date, timeZone: string): string {
  // en-CA formats as YYYY-MM-DD, which is exactly the key we want.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** Whole-day difference between two YYYY-MM-DD calendar dates (b - a). */
export function dayDiff(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const aUtc = Date.UTC(ay, am - 1, ad);
  const bUtc = Date.UTC(by, bm - 1, bd);
  return Math.round((bUtc - aUtc) / 86_400_000);
}

/**
 * Apply an activity happening on `today` (already resolved to the local
 * calendar day) to the current streak state.
 *
 *  - same day as last activity   → unchanged (idempotent)
 *  - exactly the next day        → current + 1
 *  - any larger gap / first ever → resets to 1
 *
 * `best` only ever grows.
 */
export function applyActivity(state: StreakState, today: string): StreakState {
  const { current, best, lastActiveDay } = state;

  if (lastActiveDay === today) {
    return state; // multiple activities in one day count once
  }

  let nextCurrent: number;
  if (lastActiveDay === null) {
    nextCurrent = 1;
  } else {
    const diff = dayDiff(lastActiveDay, today);
    // Guard against clock/timezone anomalies producing a past day: never
    // increment on a non-positive diff, and never fabricate days.
    nextCurrent = diff === 1 ? current + 1 : 1;
  }

  return {
    current: nextCurrent,
    best: Math.max(best, nextCurrent),
    lastActiveDay: today,
  };
}
