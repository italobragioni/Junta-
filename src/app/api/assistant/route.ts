import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getFinancialOverview } from "@/lib/finance";
import { getAIProvider, type FinancialContext } from "@/lib/ai";
import { monthName } from "@/lib/dates";

const bodySchema = z.object({
  question: z.string().trim().min(1).max(500),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Pergunta inválida." }, { status: 400 });
  }

  const [overview, goals] = await Promise.all([
    getFinancialOverview(user.id),
    prisma.financialGoal.findMany({
      where: { userId: user.id },
      select: {
        name: true,
        targetAmountCents: true,
        currentAmountCents: true,
      },
    }),
  ]);

  const context: FinancialContext = {
    monthLabel: `${monthName(overview.month)}/${overview.year}`,
    incomeCents: overview.incomeCents,
    expensesCents: overview.expensesCents,
    availableCents: overview.availableCents,
    savingsCents: overview.savingsCents,
    savingsRate: overview.savingsRate,
    topCategories: overview.categories
      .slice(0, 5)
      .map((c) => ({ name: c.name, totalCents: c.totalCents })),
    goals,
    subscriptionsMonthlyCents: overview.subscriptionsMonthlyCents,
  };

  // The assistant never throws on a missing key — the provider resolves to a
  // deterministic fallback when no AI is configured.
  const provider = getAIProvider();
  const result = await provider.ask(parsed.data.question, context);

  return NextResponse.json(result);
}
