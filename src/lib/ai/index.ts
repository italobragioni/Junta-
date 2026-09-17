import { FallbackAssistant } from "./fallback";
import type { AIProvider } from "./types";

export * from "./types";

/**
 * Resolves the active AI provider. Today it always returns the rule-based
 * fallback, but the shape is ready for a real provider: when an API key is
 * present a concrete provider can be constructed here without touching any
 * caller. The dashboard must never break due to a missing key.
 */
export function getAIProvider(): AIProvider {
  // Example of future wiring (kept intentionally inert):
  // if (process.env.AI_API_KEY) return new SomeProvider(process.env.AI_API_KEY);
  return new FallbackAssistant();
}

export function isRealAIConfigured(): boolean {
  return Boolean(process.env.AI_API_KEY);
}
