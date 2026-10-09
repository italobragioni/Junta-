/**
 * XP and level rules. Pure functions — all XP is awarded on the server from
 * verified events; the browser never reports XP as truth.
 */

export const XP_FIRST_COMPLETION = 20;
export const XP_PER_FIRST_TRY_CORRECT = 2;
export const XP_PER_LEVEL = 100;

/** Level = 1 + floor(totalXp / 100). Level 1 at 0–99 XP, level 2 at 100, etc. */
export function levelForXp(totalXp: number): number {
  if (totalXp < 0) return 1;
  return 1 + Math.floor(totalXp / XP_PER_LEVEL);
}

/** XP still needed to reach the next level. */
export function xpToNextLevel(totalXp: number): number {
  const safe = Math.max(0, totalXp);
  const intoLevel = safe % XP_PER_LEVEL;
  return XP_PER_LEVEL - intoLevel;
}

/** Progress (0–1) through the current level, for the XP bar. */
export function levelProgress(totalXp: number): number {
  const safe = Math.max(0, totalXp);
  return (safe % XP_PER_LEVEL) / XP_PER_LEVEL;
}

/**
 * XP awarded the FIRST time a lesson is completed.
 * firstTryCorrect = number of questions answered correctly on the first
 * attempt during this completing session.
 */
export function firstCompletionXp(firstTryCorrect: number): number {
  const correct = Math.max(0, Math.floor(firstTryCorrect));
  return XP_FIRST_COMPLETION + correct * XP_PER_FIRST_TRY_CORRECT;
}
