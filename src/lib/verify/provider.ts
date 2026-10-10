import "server-only";

import { env } from "@/lib/env";
import { SYSTEM_PROMPT, defaultModel } from "./prompt";
import type { FoundSource } from "./types";

/**
 * Raw analysis fields returned by the AI provider (before we attach the
 * static checker list + disclaimer). Shape mirrors the JSON in prompt.ts.
 */
export interface RawAnalysis {
  riskLevel?: string;
  summary?: string;
  signals?: unknown;
  positives?: unknown;
  claims?: unknown;
  checkSteps?: unknown;
}

/** What a provider call returns: the parsed analysis + any web sources used. */
export interface ProviderResult {
  raw: RawAnalysis;
  sources: FoundSource[];
}

interface ImagePart {
  mimeType: string;
  base64: string;
}

/** Split a data URL into its mime type and raw base64 payload. */
function parseDataUrl(dataUrl: string): ImagePart | null {
  const match = /^data:([^;,]+);base64,(.+)$/s.exec(dataUrl.trim());
  if (!match) return null;
  return { mimeType: match[1], base64: match[2] };
}

/** Best-effort extraction of a JSON object from a model response. */
function extractJson(text: string): RawAnalysis {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned) as RawAnalysis;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as RawAnalysis;
    }
    throw new Error("Resposta da IA não pôde ser interpretada.");
  }
}

async function fetchRaw(
  url: string,
  init: RequestInit,
  timeoutMs = 55_000,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Provedor respondeu ${res.status}: ${body.slice(0, 200)}`);
    }
    return (await res.json()) as unknown;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(
        "a análise demorou demais. Tente novamente ou use uma imagem menor.",
      );
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// --- Google Gemini (default; free tier, reads images, Google Search) ------

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    groundingMetadata?: {
      groundingChunks?: { web?: { uri?: string; title?: string } }[];
    };
  }[];
}

/** Pull the de-duplicated web sources Gemini actually grounded its answer on. */
function geminiSources(data: GeminiResponse): FoundSource[] {
  const chunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const seen = new Set<string>();
  const sources: FoundSource[] = [];
  for (const c of chunks) {
    const url = c.web?.uri;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    sources.push({ title: c.web?.title || url, url });
    if (sources.length >= 6) break;
  }
  return sources;
}

async function callGemini(
  text: string | undefined,
  image: ImagePart | null,
  apiKey: string,
  model: string,
  useSearch: boolean,
): Promise<ProviderResult> {
  const parts: Record<string, unknown>[] = [];
  if (text) parts.push({ text });
  if (image)
    parts.push({ inlineData: { mimeType: image.mimeType, data: image.base64 } });

  // When Google Search grounding is on, responseMimeType=json is NOT allowed,
  // so we rely on the prompt + extractJson. When it's off, we use the known-
  // good JSON config. maxOutputTokens gives the model room to answer (3.x
  // "thinking" models can otherwise spend the budget before emitting text).
  const generationConfig: Record<string, unknown> = {
    temperature: 0.2,
    // Generous, because on 3.x thinking models the reasoning tokens count
    // against this budget; too low and the model never emits its final text.
    maxOutputTokens: 4096,
  };
  if (!useSearch) generationConfig.responseMimeType = "application/json";

  const body: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts }],
    generationConfig,
  };
  if (useSearch) body.tools = [{ googleSearch: {} }];

  const data = (await fetchRaw(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  )) as GeminiResponse;

  const out = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("");
  if (!out) throw new Error("A IA não retornou conteúdo.");
  return { raw: extractJson(out), sources: useSearch ? geminiSources(data) : [] };
}

async function analyzeGemini(
  text: string | undefined,
  image: ImagePart | null,
  apiKey: string,
  model: string,
): Promise<ProviderResult> {
  // Prefer a grounded answer (real web sources). If grounding is unavailable
  // for this key/model, degrade gracefully to an ungrounded analysis.
  try {
    return await callGemini(text, image, apiKey, model, true);
  } catch {
    return callGemini(text, image, apiKey, model, false);
  }
}

// --- OpenAI (optional; no web grounding here) -----------------------------

async function analyzeOpenAI(
  text: string | undefined,
  image: ImagePart | null,
  apiKey: string,
  model: string,
): Promise<ProviderResult> {
  const content: Record<string, unknown>[] = [];
  if (text) content.push({ type: "text", text });
  if (image)
    content.push({
      type: "image_url",
      image_url: { url: `data:${image.mimeType};base64,${image.base64}` },
    });

  const data = (await fetchRaw("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
    }),
  })) as { choices?: { message?: { content?: string } }[] };

  const out = data.choices?.[0]?.message?.content;
  if (!out) throw new Error("A IA não retornou conteúdo.");
  return { raw: extractJson(out), sources: [] };
}

// --- Anthropic (optional; no web grounding here) --------------------------

async function analyzeAnthropic(
  text: string | undefined,
  image: ImagePart | null,
  apiKey: string,
  model: string,
): Promise<ProviderResult> {
  const content: Record<string, unknown>[] = [];
  if (text) content.push({ type: "text", text });
  if (image)
    content.push({
      type: "image",
      source: { type: "base64", media_type: image.mimeType, data: image.base64 },
    });

  const data = (await fetchRaw("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    }),
  })) as { content?: { text?: string }[] };

  const out = data.content?.[0]?.text;
  if (!out) throw new Error("A IA não retornou conteúdo.");
  return { raw: extractJson(out), sources: [] };
}

/**
 * Run the configured provider on the given input. Throws when the provider
 * is not configured or the call fails; callers translate that into a
 * friendly message.
 */
export async function runProvider(input: {
  text?: string;
  imageDataUrl?: string;
}): Promise<ProviderResult> {
  const apiKey = env.factCheckApiKey;
  if (!apiKey) throw new Error("Verificador não configurado (sem chave de IA).");

  const provider = env.factCheckProvider;
  const model = env.factCheckModel ?? defaultModel(provider);
  const image = input.imageDataUrl ? parseDataUrl(input.imageDataUrl) : null;
  if (input.imageDataUrl && !image) {
    throw new Error("Imagem inválida.");
  }

  switch (provider) {
    case "openai":
      return analyzeOpenAI(input.text, image, apiKey, model);
    case "anthropic":
      return analyzeAnthropic(input.text, image, apiKey, model);
    case "gemini":
    default:
      return analyzeGemini(input.text, image, apiKey, model);
  }
}
