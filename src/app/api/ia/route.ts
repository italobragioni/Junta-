import { NextResponse } from "next/server";
import { authContext } from "@/lib/db/queries";
import { buildFinancialFacts, factsToPrompt } from "@/lib/ai/context";
import { deterministicAnswer } from "@/lib/ai/answer";
import { callAi } from "@/lib/ai/provider";
import { isAiConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ctx = await authContext();
  if (!ctx) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  let message = "";
  try {
    const body = await request.json();
    message = String(body?.message ?? "").slice(0, 1000).trim();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
  if (!message) return NextResponse.json({ error: "Faça uma pergunta." }, { status: 400 });

  const facts = await buildFinancialFacts();

  // Com chave de IA: resposta rica, ancorada nos dados reais.
  if (isAiConfigured()) {
    try {
      const result = await callAi(factsToPrompt(facts), message);
      if (result.text) return NextResponse.json({ answer: result.text, source: result.provider });
    } catch (e) {
      // Cai para o modo determinístico em caso de erro na API.
      console.error("Finora IA provider error:", (e as Error)?.message);
    }
  }

  // Modo determinístico (sem IA externa): responde o que dá só com os dados.
  const deterministic = deterministicAnswer(message, facts);
  if (deterministic) return NextResponse.json({ answer: deterministic, source: "finora" });

  return NextResponse.json({
    answer:
      "Ainda não consigo responder isso com precisão por aqui. Experimente perguntar sobre seus gastos por categoria, seu saldo, quanto economizou ou se cabe uma compra. Para respostas mais completas em linguagem natural, configure uma chave de IA (veja o README).",
    source: "finora",
  });
}
