"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validation";
import { type ActionState, fromZod } from "@/lib/action-result";

export async function completeOnboardingAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = onboardingSchema.safeParse({
    monthlyIncome: formData.get("monthlyIncome"),
    incomeFrequency: formData.get("incomeFrequency"),
    primaryGoal: formData.get("primaryGoal"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { monthlyIncome, incomeFrequency, primaryGoal } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        monthlyIncomeCents: monthlyIncome,
        incomeFrequency,
        primaryGoal,
        onboardedAt: new Date(),
      },
    });

    // Record the declared monthly income as a real, recurring income entry so
    // the dashboard reflects the user's own numbers from day one.
    await tx.income.create({
      data: {
        userId: user.id,
        description: "Renda mensal",
        amountCents: monthlyIncome,
        category: "Salário",
        date: new Date(),
        recurring: true,
      },
    });
  });

  redirect("/dashboard");
}
