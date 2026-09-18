"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { expenseSchema } from "@/lib/validation";
import { parseDateInput } from "@/lib/dates";
import { canCreateExpense } from "@/lib/plan-access";
import {
  type ActionState,
  failure,
  fromZod,
  limitReached,
} from "@/lib/action-result";

const REVALIDATE = ["/despesas", "/dashboard", "/analise", "/orcamento"];

function revalidateAll() {
  for (const path of REVALIDATE) revalidatePath(path);
}

async function assertCategoryOwned(userId: string, categoryId: string) {
  const cat = await prisma.category.findFirst({
    where: { id: categoryId, userId, type: "EXPENSE" },
    select: { id: true },
  });
  return Boolean(cat);
}

export async function createExpenseAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = expenseSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    recurring: formData.get("recurring") === "on",
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { description, amount, categoryId, date, recurring } = parsed.data;

  const limit = await canCreateExpense(user);
  if (!limit.allowed) return limitReached(limit.message!);

  if (!(await assertCategoryOwned(user.id, categoryId))) {
    return failure("Categoria inválida.");
  }

  const parsedDate = parseDateInput(date);
  if (!parsedDate) return failure("Data inválida.");

  await prisma.expense.create({
    data: {
      userId: user.id,
      description,
      amountCents: amount,
      categoryId,
      date: parsedDate,
      recurring,
    },
  });

  revalidateAll();
  return { ok: true };
}

export async function updateExpenseAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return failure("Registro inválido.");

  const parsed = expenseSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    recurring: formData.get("recurring") === "on",
  });
  if (!parsed.success) return fromZod(parsed.error);

  // Ownership check scoped to userId — never trust the client id alone.
  const existing = await prisma.expense.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) return failure("Despesa não encontrada.");

  const { description, amount, categoryId, date, recurring } = parsed.data;
  if (!(await assertCategoryOwned(user.id, categoryId))) {
    return failure("Categoria inválida.");
  }
  const parsedDate = parseDateInput(date);
  if (!parsedDate) return failure("Data inválida.");

  await prisma.expense.update({
    where: { id },
    data: {
      description,
      amountCents: amount,
      categoryId,
      date: parsedDate,
      recurring,
    },
  });

  revalidateAll();
  return { ok: true };
}

export async function deleteExpenseAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  // deleteMany with userId ensures a user can never delete another user's row.
  await prisma.expense.deleteMany({ where: { id, userId: user.id } });
  revalidateAll();
}
