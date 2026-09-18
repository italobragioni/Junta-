import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { userCanUseFeature } from "@/lib/plan-access";
import { formatCentsPlain } from "@/lib/money";
import { formatDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

function csvEscape(value: string): string {
  if (/[";\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toCsv(rows: string[][]): string {
  // Semicolon-separated for pt-BR spreadsheets; BOM for UTF-8 in Excel.
  const body = rows.map((r) => r.map(csvEscape).join(";")).join("\r\n");
  return "﻿" + body;
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  // CSV export is a Basic/Pro feature — enforced on the server.
  if (!userCanUseFeature(user, "CSV_EXPORT")) {
    return NextResponse.json(
      { error: "A exportação CSV faz parte do plano Básico." },
      { status: 403 },
    );
  }

  const type = new URL(req.url).searchParams.get("type") ?? "expenses";

  let rows: string[][];
  let filename: string;

  if (type === "incomes") {
    const incomes = await prisma.income.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });
    rows = [
      ["Data", "Descrição", "Fonte", "Valor (R$)", "Recorrente"],
      ...incomes.map((i) => [
        formatDate(i.date),
        i.description,
        i.category ?? "",
        formatCentsPlain(i.amountCents),
        i.recurring ? "Sim" : "Não",
      ]),
    ];
    filename = "receitas-junta.csv";
  } else {
    const expenses = await prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      include: { category: { select: { name: true } } },
    });
    rows = [
      ["Data", "Descrição", "Categoria", "Valor (R$)", "Recorrente"],
      ...expenses.map((e) => [
        formatDate(e.date),
        e.description,
        e.category?.name ?? "Sem categoria",
        formatCentsPlain(e.amountCents),
        e.recurring ? "Sim" : "Não",
      ]),
    ];
    filename = "despesas-junta.csv";
  }

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
