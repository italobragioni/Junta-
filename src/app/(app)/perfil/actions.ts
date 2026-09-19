"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  profileSchema,
  preferencesSchema,
  passwordChangeSchema,
} from "@/lib/validation";
import { type ActionState, failure, fromZod } from "@/lib/action-result";

function revalidateProfile() {
  for (const path of ["/perfil", "/dashboard", "/configuracoes"]) {
    revalidatePath(path);
  }
}

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { name, email } = parsed.data;

  // Enforce unique email (excluding the current user).
  if (email !== user.email) {
    const taken = await prisma.user.findFirst({
      where: { email, NOT: { id: user.id } },
      select: { id: true },
    });
    if (taken) {
      return failure("Este e-mail já está em uso.", {
        email: "E-mail já cadastrado.",
      });
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, email },
  });

  // The email is part of the session token — reissue it when it changes.
  if (email !== user.email) {
    await setSessionCookie({ userId: user.id, email });
  }

  revalidateProfile();
  return { ok: true };
}

export async function updatePreferencesAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = preferencesSchema.safeParse({
    monthlyIncome: formData.get("monthlyIncome"),
    incomeFrequency: formData.get("incomeFrequency"),
    primaryGoal: formData.get("primaryGoal"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { monthlyIncome, incomeFrequency, primaryGoal } = parsed.data;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      monthlyIncomeCents: monthlyIncome,
      incomeFrequency,
      primaryGoal,
    },
  });

  revalidateProfile();
  return { ok: true };
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { currentPassword, newPassword } = parsed.data;

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (!record) return failure("Usuário não encontrado.");

  const valid = await verifyPassword(currentPassword, record.passwordHash);
  if (!valid) {
    return failure("Senha atual incorreta.", {
      currentPassword: "Senha atual incorreta.",
    });
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { ok: true };
}
