import "server-only";

import { env } from "@/lib/env";

const SYSTEM_PROMPT = `Você é a Finora IA, assistente financeiro pessoal dentro do app Finora.
Regras OBRIGATÓRIAS:
- Responda SEMPRE em português do Brasil, de forma curta, clara e amigável.
- Use SOMENTE os dados fornecidos no contexto "DADOS DO USUÁRIO". NUNCA invente valores, datas ou movimentações.
- Se a pergunta exigir uma informação que não está nos dados, diga claramente que não há informação suficiente e sugira o que o usuário pode registrar.
- Valores monetários sempre em reais (R$). Seja prático e dê uma dica acionável quando fizer sentido.
- Não dê conselhos de investimento específicos nem prometa rentabilidade.`;

export interface AiResult {
  text: string;
  provider: string;
}

/** Chama o provedor de IA configurado. Lança se a chamada falhar. */
export async function callAi(factsPrompt: string, question: string): Promise<AiResult> {
  const provider = env.aiProvider;
  const userContent = `DADOS DO USUÁRIO (fonte da verdade — não invente nada fora disto):\n${factsPrompt}\n\nPERGUNTA DO USUÁRIO:\n${question}`;

  if (provider === "openai") return callOpenAi(userContent);
  if (provider === "gemini") return callGemini(userContent);
  return callAnthropic(userContent);
}

async function callAnthropic(content: string): Promise<AiResult> {
  const model = env.aiModel || "claude-haiku-5-5";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.aiApiKey!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.content ?? []).map((b: { text?: string }) => b.text ?? "").join("").trim();
  return { text, provider: "anthropic" };
}

async function callOpenAi(content: string): Promise<AiResult> {
  const model = env.aiModel || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${env.aiApiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 700,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { text: (data.choices?.[0]?.message?.content ?? "").trim(), provider: "openai" };
}

async function callGemini(content: string): Promise<AiResult> {
  const model = env.aiModel || "gemini-2.0-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.aiApiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: content }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 700 },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("").trim();
  return { text, provider: "gemini" };
}
