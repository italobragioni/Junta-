import "server-only";

import { env } from "@/lib/env";
import {
  IMAGE_EXTRACTION_PROMPT,
  SYSTEM_PROMPT_PLAIN,
  SYSTEM_PROMPT_SEARCH,
  defaultModel,
} from "./prompt";
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
    finishReason?: string;
    groundingMetadata?: {
      groundingChunks?: { web?: { uri?: string; title?: string } }[];
    };
  }[];
  promptFeedback?: { blockReason?: string };
}

/**
 * Permissive safety settings (standard categories). The app's purpose is to
 * analyze potentially-misleading content, so default blocking would get in the
 * way; the prompt enforces apartidarismo. Only widely-supported categories are
 * listed to avoid a 400 on models that don't accept newer ones.
 */
const GEMINI_SAFETY = [
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
].map((category) => ({ category, threshold: "BLOCK_NONE" }));

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

interface GeminiCallOptions {
  systemPrompt: string;
  parts: Record<string, unknown>[];
  useSearch?: boolean;
  json?: boolean;
}

/** One low-level Gemini generateContent call. Returns text + any sources. */
async function geminiCall(
  apiKey: string,
  model: string,
  opts: GeminiCallOptions,
): Promise<{ text: string; sources: FoundSource[] }> {
  const generationConfig: Record<string, unknown> = { temperature: 0.2 };
  if (opts.useSearch) {
    // Grounded + "thinking" needs headroom: reasoning tokens count against
    // this budget, so give the final answer room to be emitted.
    generationConfig.maxOutputTokens = 8192;
  } else if (opts.json) {
    generationConfig.responseMimeType = "application/json";
  }

  const body: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: opts.systemPrompt }] },
    contents: [{ role: "user", parts: opts.parts }],
    generationConfig,
    safetySettings: GEMINI_SAFETY,
  };
  // Never combine the search tool with an image in the same request: Gemini
  // returns MALFORMED_FUNCTION_CALL. The caller guarantees search calls are
  // text-only.
  if (opts.useSearch) body.tools = [{ googleSearch: {} }];

  const data = (await fetchRaw(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  )) as GeminiResponse;

  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("");
  if (!text) {
    const reason =
      data.promptFeedback?.blockReason ??
      data.candidates?.[0]?.finishReason ??
      "sem detalhe";
    throw new Error(`A IA não retornou conteúdo (motivo: ${reason}).`);
  }
  return { text, sources: opts.useSearch ? geminiSources(data) : [] };
}

/**
 * Gemini analysis in up to two steps:
 *  1. If there's an image, transcribe it to text (no search — image + search
 *     together cause MALFORMED_FUNCTION_CALL).
 *  2. Verify the text WITH Google Search grounding. If grounding fails, fall
 *     back to an ungrounded JSON analysis (still returns a useful result).
 */
async function analyzeGemini(
  text: string | undefined,
  image: ImagePart | null,
  apiKey: string,
  model: string,
): Promise<ProviderResult> {
  // Step 1 — read the image into text, if present.
  let described: string | undefined;
  if (image) {
    const extraction = await geminiCall(apiKey, model, {
      systemPrompt: "Você transcreve e descreve imagens com precisão.",
      parts: [
        { inlineData: { mimeType: image.mimeType, data: image.base64 } },
        { text: IMAGE_EXTRACTION_PROMPT },
      ],
    });
    described = extraction.text;
  }

  const contentText = [
    text?.trim(),
    described && `Conteúdo extraído da imagem enviada:\n${described}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const parts = [{ text: contentText || "(sem conteúdo)" }];

  // Step 2 — verify with web search; fall back to ungrounded on failure.
  try {
    const grounded = await geminiCall(apiKey, model, {
      systemPrompt: SYSTEM_PROMPT_SEARCH,
      parts,
      useSearch: true,
    });
    return { raw: extractJson(grounded.text), sources: grounded.sources };
  } catch {
    const plain = await geminiCall(apiKey, model, {
      systemPrompt: SYSTEM_PROMPT_PLAIN,
      parts,
      json: true,
    });
    return { raw: extractJson(plain.text), sources: [] };
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
        { role: "system", content: SYSTEM_PROMPT_PLAIN },
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
      system: SYSTEM_PROMPT_PLAIN,
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
