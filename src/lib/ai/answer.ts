import type { FinancialFacts } from "./context";
import { formatBRL, formatPercent } from "@/lib/format";
import { parseReais, toCents } from "@/lib/money";

/** Normaliza texto: minúsculo e sem acentos, para casar palavras-chave. */
function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Respondedor determinístico: responde às perguntas mais comuns usando APENAS
 * os dados reais do usuário. É o modo padrão quando não há chave de IA — e
 * nunca inventa números. Retorna null quando não entende a pergunta.
 */
export function deterministicAnswer(question: string, f: FinancialFacts): string | null {
  const q = norm(question);

  if (!f.hasData) {
    return "Ainda não há dados suficientes na sua conta. Cadastre contas e registre receitas e despesas para eu poder analisar.";
  }

  // "onde estou gastando mais" / "maior gasto"
  if (/(onde|em que|qual).*(gast|despesa)/.test(q) || q.includes("gastando mais") || q.includes("maior gasto")) {
    if (f.topCategories.length === 0) return "Você ainda não tem despesas registradas neste mês.";
    const top = f.topCategories[0];
    const list = f.topCategories.slice(0, 3).map((c) => `${c.name} (${formatBRL(c.totalCents)})`).join(", ");
    return `Neste mês, sua maior categoria de gasto é **${top.name}**, com ${formatBRL(top.totalCents)} (${formatPercent(top.share)} do total). As três maiores: ${list}.`;
  }

  // "quanto gastei com <categoria>"
  if (/(quanto).*(gast)/.test(q)) {
    const match = findCategory(q, f);
    if (match) {
      return `Em ${f.periodLabel}, você gastou **${formatBRL(match.cents)}** com ${match.name}.`;
    }
    return `Em ${f.periodLabel}, suas despesas somam **${formatBRL(f.expenseCents)}**. Se quiser por categoria, cite o nome (ex.: "quanto gastei com alimentação?").`;
  }

  // "posso gastar/comprar R$X" / "posso fazer uma compra de X"
  if (/(posso).*(gast|compr|fazer)/.test(q)) {
    const value = extractMoney(question);
    if (value != null) {
      const cents = toCents(value);
      const ok = cents <= f.totalBalanceCents;
      return ok
        ? `Você tem ${formatBRL(f.totalBalanceCents)} em contas. Uma compra de ${formatBRL(cents)} deixaria ${formatBRL(f.totalBalanceCents - cents)}. ${f.resultCents < 0 ? "Atenção: seu mês está no vermelho, avalie com cuidado." : "Parece caber no seu saldo."}`
        : `Sua compra de ${formatBRL(cents)} é maior que o seu saldo atual de ${formatBRL(f.totalBalanceCents)}. Não recomendo sem comprometer suas contas.`;
    }
    return `Seu saldo disponível é ${formatBRL(f.totalBalanceCents)} e o resultado do mês é ${formatBRL(f.resultCents)}. Me diga o valor da compra que eu avalio.`;
  }

  // "quanto posso gastar até o fim do mês"
  if (q.includes("ate o final") || q.includes("ate o fim") || /(quanto).*(posso).*(mes)/.test(q)) {
    const upcoming = f.upcomingBills.reduce((s, b) => s + b.amountCents, 0);
    const livre = f.totalBalanceCents - upcoming;
    return `Você tem ${formatBRL(f.totalBalanceCents)} em contas. Descontando ${formatBRL(upcoming)} de contas a pagar nos próximos 30 dias, sobram cerca de **${formatBRL(livre)}** antes de comprometer o essencial.`;
  }

  // "quanto economizei" / "quanto guardei"
  if (/(quanto).*(economi|guard|sobr|poup)/.test(q)) {
    const total = f.months.reduce((s, m) => s + (m.incomeCents - m.expenseCents), 0);
    return `Nos últimos ${f.months.length} meses, o saldo entre receitas e despesas foi de **${formatBRL(total)}**. Só neste mês, ${f.resultCents >= 0 ? "você guardou" : "faltou"} ${formatBRL(Math.abs(f.resultCents))} (${formatPercent(f.savingsRate)} da renda).`;
  }

  // "quais despesas aumentaram"
  if (/(aument|subi|cresc)/.test(q) && q.includes("despesa")) {
    if (f.months.length >= 2) {
      const [prev, cur] = [f.months[f.months.length - 2], f.months[f.months.length - 1]];
      const diff = cur.expenseCents - prev.expenseCents;
      return diff > 0
        ? `Suas despesas ${diff > 0 ? "subiram" : "caíram"} ${formatBRL(Math.abs(diff))} em relação ao mês anterior (de ${formatBRL(prev.expenseCents)} para ${formatBRL(cur.expenseCents)}). Verifique a categoria **${f.topCategories[0]?.name ?? "principal"}**.`
        : `Boa notícia: suas despesas não aumentaram em relação ao mês passado (${formatBRL(cur.expenseCents)} vs ${formatBRL(prev.expenseCents)}).`;
    }
  }

  // "como organizar/economizar"
  if (/(como).*(organiz|economi|melhor|poupar)/.test(q)) {
    const tips: string[] = [];
    if (f.savingsRate < 10) tips.push("sua taxa de economia está baixa — tente separar ao menos 10% da renda assim que receber");
    const overBudget = f.budgets.filter((b) => b.percent >= 90);
    if (overBudget.length) tips.push(`os orçamentos de ${overBudget.map((b) => b.name).join(", ")} estão perto do limite`);
    if (f.cardDebtCents > 0) tips.push(`você tem ${formatBRL(f.cardDebtCents)} em cartões — priorize quitar para evitar juros`);
    if (f.topCategories[0]) tips.push(`sua maior despesa é ${f.topCategories[0].name}; vale revisar`);
    const base = tips.length ? `Algumas ideias com base nos seus números: ${tips.join("; ")}.` : "Seus números estão equilibrados — continue acompanhando e defina metas para o que sobra.";
    return base;
  }

  // "qual meu saldo" / "quanto tenho"
  if (/(saldo|quanto tenho|quanto eu tenho)/.test(q)) {
    return `Seu saldo total em contas é **${formatBRL(f.totalBalanceCents)}**.${f.cardDebtCents > 0 ? ` Você também tem ${formatBRL(f.cardDebtCents)} em faturas de cartão.` : ""}`;
  }

  return null;
}

function findCategory(q: string, f: FinancialFacts): { name: string; cents: number } | null {
  for (const [name, cents] of Object.entries(f.byCategoryCents)) {
    if (q.includes(norm(name))) return { name, cents };
  }
  // Sinônimos comuns
  const synonyms: Record<string, string[]> = {
    "Alimentação": ["aliment", "comida", "mercado", "supermercado", "restaurante", "ifood"],
    "Transporte": ["transport", "uber", "gasolina", "combustivel", "onibus"],
    "Moradia": ["moradia", "aluguel", "casa"],
    "Lazer": ["lazer", "diversao"],
    "Saúde": ["saude", "remedio", "medic"],
  };
  for (const [name, keys] of Object.entries(synonyms)) {
    if (keys.some((k) => q.includes(k)) && f.byCategoryCents[name] != null) {
      return { name, cents: f.byCategoryCents[name] };
    }
  }
  return null;
}

function extractMoney(text: string): number | null {
  const m = text.match(/(?:r\$\s*)?(\d{1,3}(?:[.\s]\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)/i);
  if (!m) return null;
  const v = parseReais(m[1]);
  return v > 0 ? v : null;
}
