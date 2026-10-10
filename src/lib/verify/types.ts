/**
 * Types for the credibility checker ("Verificador").
 *
 * IMPORTANT product/ethics note: this feature NEVER delivers a binary
 * "fake vs. true" verdict. No system can reliably do that for arbitrary
 * news — especially recent events or an image out of context — and a wrong
 * categorical label would mislead users and expose the product legally.
 *
 * Instead it returns a RISK LEVEL based on signals of (un)reliability and,
 * above all, teaches the person how to check for themselves and points them
 * to professional Brazilian fact-checkers. It is a media-literacy aid, not an
 * oracle.
 */

/** How many warning signs the content shows — never a truth verdict. */
export type RiskLevel = "baixo" | "atencao" | "alto";

export interface FactChecker {
  name: string;
  url: string;
}

/** A real source the AI consulted on the web (via search grounding). */
export interface FoundSource {
  title: string;
  url: string;
}

export interface VerifyResult {
  /** Risk that the content is unreliable, based on observable signals. */
  riskLevel: RiskLevel;
  /** One-paragraph, plain-language reading of the content. */
  summary: string;
  /** Concrete warning signs found (sensationalism, no source, etc.). */
  signals: string[];
  /** Points in favor of reliability, when present. */
  positives: string[];
  /** Checkable factual claims extracted from the content. */
  claims: string[];
  /** Step-by-step on how the person can confirm it themselves. */
  checkSteps: string[];
  /** Real web sources the AI consulted (via Google Search grounding). */
  foundSources: FoundSource[];
  /** Brazilian fact-checkers to consult (filled server-side, static list). */
  checkers: FactChecker[];
  /** Always-present reminder that this is guidance, not a verdict. */
  disclaimer: string;
}

/** What the user submits for analysis. Exactly one of text/image is enough. */
export interface VerifyInput {
  /** Pasted headline, article text, or a link. */
  text?: string;
  /** A data URL (data:image/...;base64,...) of a screenshot/photo. */
  imageDataUrl?: string;
}
