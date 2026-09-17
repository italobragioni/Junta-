"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { goalSchema, addToGoalSchema } from "@/lib/validation";
import { parseDateInput } from "@/lib/dates";
import { type ActionState, failure, fromZod } from "@/lib/action-result";

function revalidateAll() {
  for (const path of ["/metas", "/dashboard"]) revalidatePath(path);
}

export async function createGoalAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = goalSchema.safeParse({
    name: formData.get("name"),
    targetAmount: formData.get("targetAmount"),
    currentAmount: formData.get("currentAmount") || "0",
    targetDate: formData.get("targetDate"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { name, targetAmount, currentAmount, targetDate } = parsed.data;

  await prisma.financialGoal.create({
    data: {
      userId: user.id,
      name,
      targetAmountCents: targetAmount,
      currentAmountCents: currentAmount ?? 0,
      targetDate: targetDate ? parseDateInput(targetDate) : null,
    },
  });

  revalidateAll();
  return { ok: true };
}

export async function updateGoalAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return failure("Registro inválido.");

  const parsed = goalSchema.safeParse({
    name: formData.get("name"),
    targetAmount: formData.get("targetAmount"),
    currentAmount: formData.get("currentAmount") || "0",
    targetDate: formData.get("targetDate"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const existing = await prisma.financialGoal.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) return failure("Meta não encontrada.");

  const { name, targetAmount, currentAmount, targetDate } = parsed.data;

  await prisma.financialGoal.update({
    where: { id },
    data: {
      name,
      targetAmountCents: targetAmount,
      currentAmountCents: currentAmount ?? 0,
      targetDate: targetDate ? parseDateInput(targetDate) : null,
    },
  });

  revalidateAll();
  return { ok: true };
}

export async function addToGoalAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = addToGoalSchema.safeParse({
    goalId: formData.get("goalId"),
    amount: formData.get("amount"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { goalId, amount } = parsed.data;
  const goal = await prisma.financialGoal.findFirst({
    where: { id: goalId, userId: user.id },
    select: { id: true, currentAmountCents: true },
  });
  if (!goal) return failure("Meta não encontrada.");

  await prisma.financialGoal.update({
    where: { id: goalId },
    data: { currentAmountCents: goal.currentAmountCents + amount },
  });

  revalidateAll();
  return { ok: true };
}

export async function deleteGoalAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.financialGoal.deleteMany({ where: { id, userId: user.id } });
  revalidateAll();
}
