"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { budgetSchema } from "@/lib/validation";
import { type ActionState, failure, fromZod } from "@/lib/action-result";

function revalidateAll() {
  for (const path of ["/orcamento", "/dashboard"]) revalidatePath(path);
}

export async function upsertBudgetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = budgetSchema.safeParse({
    categoryId: formData.get("categoryId"),
    month: formData.get("month"),
    year: formData.get("year"),
    limitAmount: formData.get("limitAmount"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { categoryId, month, year, limitAmount } = parsed.data;

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: user.id, type: "EXPENSE" },
    select: { id: true },
  });
  if (!category) return failure("Categoria inválida.");

  await prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId: user.id,
        categoryId,
        month,
        year,
      },
    },
    create: {
      userId: user.id,
      categoryId,
      month,
      year,
      limitAmountCents: limitAmount,
    },
    update: { limitAmountCents: limitAmount },
  });

  revalidateAll();
  return { ok: true };
}

export async function deleteBudgetAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.budget.deleteMany({ where: { id, userId: user.id } });
  revalidateAll();
}
