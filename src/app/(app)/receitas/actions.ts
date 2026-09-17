"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { incomeSchema } from "@/lib/validation";
import { parseDateInput } from "@/lib/dates";
import { type ActionState, failure, fromZod } from "@/lib/action-result";

function revalidateAll() {
  for (const path of ["/receitas", "/dashboard", "/analise"]) {
    revalidatePath(path);
  }
}

export async function createIncomeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = incomeSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    date: formData.get("date"),
    recurring: formData.get("recurring") === "on",
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { description, amount, category, date, recurring } = parsed.data;
  const parsedDate = parseDateInput(date);
  if (!parsedDate) return failure("Data inválida.");

  await prisma.income.create({
    data: {
      userId: user.id,
      description,
      amountCents: amount,
      category: category || null,
      date: parsedDate,
      recurring,
    },
  });

  revalidateAll();
  return { ok: true };
}

export async function updateIncomeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return failure("Registro inválido.");

  const parsed = incomeSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    date: formData.get("date"),
    recurring: formData.get("recurring") === "on",
  });
  if (!parsed.success) return fromZod(parsed.error);

  const existing = await prisma.income.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) return failure("Receita não encontrada.");

  const { description, amount, category, date, recurring } = parsed.data;
  const parsedDate = parseDateInput(date);
  if (!parsedDate) return failure("Data inválida.");

  await prisma.income.update({
    where: { id },
    data: {
      description,
      amountCents: amount,
      category: category || null,
      date: parsedDate,
      recurring,
    },
  });

  revalidateAll();
  return { ok: true };
}

export async function deleteIncomeAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.income.deleteMany({ where: { id, userId: user.id } });
  revalidateAll();
}
