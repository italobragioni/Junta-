import type { CategoryType } from "@prisma/client";
import { prisma } from "@/lib/db";

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Compras",
  "Assinaturas",
  "Contas",
  "Outros",
] as const;

export const DEFAULT_INCOME_CATEGORIES = [
  "Salário",
  "Freelance",
  "Comissão",
  "Benefício",
  "Outras receitas",
] as const;

/**
 * Creates the default categories for a freshly-registered user.
 * Idempotent: uses skipDuplicates so re-running is safe.
 */
export async function createDefaultCategories(userId: string): Promise<void> {
  const data: {
    userId: string;
    name: string;
    type: CategoryType;
    isDefault: boolean;
  }[] = [
    ...DEFAULT_EXPENSE_CATEGORIES.map((name) => ({
      userId,
      name,
      type: "EXPENSE" as CategoryType,
      isDefault: true,
    })),
  ];

  await prisma.category.createMany({ data, skipDuplicates: true });
}
