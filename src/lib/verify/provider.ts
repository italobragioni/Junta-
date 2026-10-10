import "server-only";

import { env } from "@/lib/env";
import { SYSTEM_PROMPT, defaultModel } from "./prompt";

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
  try {
    return JSON.parse(text) as RawAnalysis;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(text.slice(start, end + 1)) as RawAnalysis;
    }
    throw new Error("Resposta da IA não pôde ser interpretada.");
  }
}

async function fetchJson(
  url: string,
  init: RequestInit,
  timeoutMs = 30_000,
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
  } finally {
    clearTimeout(timer);
  }
}

// --- Google Gemini (default; free tier, reads images) --------------------

async function analyzeGemini(
  text: string | undefined,
  image: ImagePart | null,
  apiKey: string,
  model: string,
): Promise<RawAnalysis> {
  const parts: Record<string, unknown>[] = [];
  if (text) parts.push({ text });
  if (image)
    parts.push({ inlineData: { mimeType: image.mimeType, data: image.base64 } });

  const data = (await fetchJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
      }),
    },
  )) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const out = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!out) throw new Error("A IA não retornou conteúdo.");
  return extractJson(out);
}

// --- OpenAI (optional) ---------------------------------------------------

async function analyzeOpenAI(
  text: string | undefined,
  image: ImagePart | null,
  apiKey: string,
  model: string,
): Promise<RawAnalysis> {
  const content: Record<string, unknown>[] = [];
  if (text) content.push({ type: "text", text });
  if (image)
    content.push({
      type: "image_url",
      image_url: { url: `data:${image.mimeType};base64,${image.base64}` },
    });

  const data = (await fetchJson("https://api.openai.com/v1/chat/completions", {
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
  return extractJson(out);
}

// --- Anthropic (optional) ------------------------------------------------

async function analyzeAnthropic(
  text: string | undefined,
  image: ImagePart | null,
  apiKey: string,
  model: string,
): Promise<RawAnalysis> {
  const content: Record<string, unknown>[] = [];
  if (text) content.push({ type: "text", text });
  if (image)
    content.push({
      type: "image",
      source: { type: "base64", media_type: image.mimeType, data: image.base64 },
    });

  const data = (await fetchJson("https://api.anthropic.com/v1/messages", {
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
  return extractJson(out);
}

/**
 * Run the configured provider on the given input. Throws when the provider
 * is not configured or the call fails; callers translate that into a
 * friendly message.
 */
export async function runProvider(input: {
  text?: string;
  imageDataUrl?: string;
}): Promise<RawAnalysis> {
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
