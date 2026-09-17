import { formatCents, formatPercent } from "@/lib/money";
import type { AIProvider, AssistantAnswer, FinancialContext } from "./types";

/**
 * Deterministic, rule-based assistant used when no AI provider is configured.
 * It answers common questions directly from the user's own numbers so the
 * feature is useful (and honest) even without an API key.
 */
export class FallbackAssistant implements AIProvider {
  readonly name = "fallback";

  isConfigured(): boolean {
    return true;
  }

  async ask(
    question: string,
    ctx: FinancialContext,
  ): Promise<AssistantAnswer> {
    const q = question.toLowerCase();

    const top = ctx.topCategories[0];

    if (q.includes("gast") && (q.includes("mais") || q.includes("demais"))) {
      if (top) {
        return this.reply(
          `No mês ${ctx.monthLabel}, sua maior categoria de gasto é ${top.name}, com ${formatCents(
            top.totalCents,
          )}.`,
        );
      }
      return this.reply(
        "Ainda não há gastos suficientes registrados para identificar onde você gasta mais.",
      );
    }

    if (q.includes("gast") && (q.includes("mês") || q.includes("mes"))) {
      return this.reply(
        `Você gastou ${formatCents(ctx.expensesCents)} em ${ctx.monthLabel}.`,
      );
    }

    if (q.includes("guard") || q.includes("econom") || q.includes("junt")) {
      return this.reply(
        `Neste mês você conseguiu separar ${formatCents(
          ctx.savingsCents,
        )} (${formatPercent(ctx.savingsRate)} da sua renda).`,
      );
    }

    if (q.includes("meta") || q.includes("falta")) {
      if (ctx.goals.length === 0) {
        return this.reply(
          "Você ainda não criou nenhuma meta. Crie uma meta para acompanharmos quanto falta.",
        );
      }
      const lines = ctx.goals.map((g) => {
        const remaining = Math.max(
          0,
          g.targetAmountCents - g.currentAmountCents,
        );
        return `• ${g.name}: faltam ${formatCents(remaining)} de ${formatCents(
          g.targetAmountCents,
        )}.`;
      });
      return this.reply(`Suas metas:\n${lines.join("\n")}`);
    }

    if (q.includes("posso gastar") || q.includes("disponível") || q.includes("disponivel")) {
      return this.reply(
        `Neste mês sobraram ${formatCents(
          ctx.availableCents,
        )} depois das despesas registradas.`,
      );
    }

    // Default summary
    return this.reply(
      `Resumo de ${ctx.monthLabel}: renda ${formatCents(
        ctx.incomeCents,
      )}, gastos ${formatCents(ctx.expensesCents)}, disponível ${formatCents(
        ctx.availableCents,
      )}. (A assistente com IA completa pode ser ativada configurando uma chave de API.)`,
    );
  }

  private reply(answer: string): AssistantAnswer {
    return { answer, aiPowered: false };
  }
}
