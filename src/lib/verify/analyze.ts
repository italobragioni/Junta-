import "server-only";

import { z } from "zod";

import { FACT_CHECKERS } from "./checkers";
import { runProvider } from "./provider";
import type { RiskLevel, VerifyInput, VerifyResult } from "./types";

/** Hard limits so a request can never blow up the provider call or quota. */
export const MAX_TEXT_LENGTH = 8_000;
/** Max decoded image size (~5MB). Base64 inflates ~33%, hence the raw cap. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const DISCLAIMER =
  "Isto é uma orientação educativa, não um veredito. O Verificador analisa sinais de confiabilidade e não confirma fatos. Sempre confira em fontes oficiais e agências de checagem.";

const rawSchema = z.object({
  riskLevel: z.enum(["baixo", "atencao", "alto"]).catch("atencao"),
  summary: z.string().catch(""),
  signals: z.array(z.string()).catch([]),
  positives: z.array(z.string()).catch([]),
  claims: z.array(z.string()).catch([]),
  checkSteps: z.array(z.string()).catch([]),
});

function clean(list: string[], max = 8): string[] {
  return list
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, max);
}

export interface InputValidation {
  ok: boolean;
  error?: string;
}

/** Validate user input before spending a provider call / quota unit. */
export function validateInput(input: VerifyInput): InputValidation {
  const hasText = Boolean(input.text && input.text.trim().length > 0);
  const hasImage = Boolean(input.imageDataUrl);
  if (!hasText && !hasImage) {
    return { ok: false, error: "Cole um texto/link ou envie uma imagem." };
  }
  if (input.text && input.text.length > MAX_TEXT_LENGTH) {
    return { ok: false, error: "Texto muito longo. Resuma ou cole um trecho menor." };
  }
  if (input.imageDataUrl) {
    const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s.exec(
      input.imageDataUrl.trim(),
    );
    if (!m) return { ok: false, error: "Imagem inválida. Use JPG, PNG ou WEBP." };
    // Approximate decoded size from base64 length.
    const bytes = Math.floor((m[2].length * 3) / 4);
    if (bytes > MAX_IMAGE_BYTES) {
      return { ok: false, error: "Imagem muito grande (máx. 5 MB)." };
    }
  }
  return { ok: true };
}

/**
 * Analyze content and return a complete, safe-by-construction result.
 * The AI only fills descriptive fields; the risk level is normalized and the
 * checker list + disclaimer are attached here, never trusted to the model.
 */
export async function analyzeContent(input: VerifyInput): Promise<VerifyResult> {
  const raw = await runProvider({
    text: input.text?.trim(),
    imageDataUrl: input.imageDataUrl,
  });

  const parsed = rawSchema.parse(raw ?? {});
  const riskLevel: RiskLevel = parsed.riskLevel;

  return {
    riskLevel,
    summary:
      parsed.summary.trim() ||
      "Não foi possível avaliar com segurança. Reúna mais contexto e confira nas fontes abaixo.",
    signals: clean(parsed.signals),
    positives: clean(parsed.positives),
    claims: clean(parsed.claims),
    checkSteps: clean(parsed.checkSteps),
    checkers: FACT_CHECKERS,
    disclaimer: DISCLAIMER,
  };
}
