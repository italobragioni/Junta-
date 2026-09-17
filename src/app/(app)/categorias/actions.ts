"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { categorySchema } from "@/lib/validation";
import { type ActionState, failure, fromZod } from "@/lib/action-result";

function revalidateAll() {
  for (const path of ["/categorias", "/despesas", "/orcamento", "/dashboard"]) {
    revalidatePath(path);
  }
}

export async function createCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type") ?? "EXPENSE",
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { name, type } = parsed.data;

  const existing = await prisma.category.findFirst({
    where: { userId: user.id, name, type },
    select: { id: true },
  });
  if (existing) return failure("Já existe uma categoria com esse nome.");

  await prisma.category.create({
    data: { userId: user.id, name, type },
  });

  revalidateAll();
  return { ok: true };
}

export async function renameCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id) return failure("Registro inválido.");
  if (name.length < 1) return failure("Informe o nome.", { name: "Informe o nome." });

  const existing = await prisma.category.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) return failure("Categoria não encontrada.");

  await prisma.category.update({ where: { id }, data: { name } });
  revalidateAll();
  return { ok: true };
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.category.deleteMany({ where: { id, userId: user.id } });
  revalidateAll();
}
