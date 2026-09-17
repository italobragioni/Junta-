"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { type ActionState, fromZod } from "@/lib/action-result";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(80),
});

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return fromZod(parsed.error);

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
  });

  revalidatePath("/configuracoes");
  revalidatePath("/dashboard");
  return { ok: true };
}
