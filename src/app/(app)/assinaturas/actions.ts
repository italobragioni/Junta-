"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { subscriptionSchema } from "@/lib/validation";
import { parseDateInput } from "@/lib/dates";
import { canCreateSubscription } from "@/lib/plan-access";
import {
  type ActionState,
  failure,
  fromZod,
  limitReached,
} from "@/lib/action-result";

function revalidateAll() {
  for (const path of ["/assinaturas", "/dashboard"]) revalidatePath(path);
}

export async function createSubscriptionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = subscriptionSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    billingCycle: formData.get("billingCycle"),
    nextBillingDate: formData.get("nextBillingDate"),
    active: formData.get("active") !== "off",
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { name, amount, billingCycle, nextBillingDate, active } = parsed.data;

  const limit = await canCreateSubscription(user);
  if (!limit.allowed) return limitReached(limit.message!);

  await prisma.subscription.create({
    data: {
      userId: user.id,
      name,
      amountCents: amount,
      billingCycle,
      nextBillingDate: nextBillingDate ? parseDateInput(nextBillingDate) : null,
      active,
    },
  });

  revalidateAll();
  return { ok: true };
}

export async function updateSubscriptionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return failure("Registro inválido.");

  const parsed = subscriptionSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    billingCycle: formData.get("billingCycle"),
    nextBillingDate: formData.get("nextBillingDate"),
    active: formData.get("active") !== "off",
  });
  if (!parsed.success) return fromZod(parsed.error);

  const existing = await prisma.subscription.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) return failure("Assinatura não encontrada.");

  const { name, amount, billingCycle, nextBillingDate, active } = parsed.data;

  await prisma.subscription.update({
    where: { id },
    data: {
      name,
      amountCents: amount,
      billingCycle,
      nextBillingDate: nextBillingDate ? parseDateInput(nextBillingDate) : null,
      active,
    },
  });

  revalidateAll();
  return { ok: true };
}

export async function deleteSubscriptionAction(
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.subscription.deleteMany({ where: { id, userId: user.id } });
  revalidateAll();
}
