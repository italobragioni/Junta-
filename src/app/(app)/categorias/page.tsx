import type { Metadata } from "next";
import { Tags } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { AddCategoryButton, DeleteCategoryButton } from "./category-forms";

export const metadata: Metadata = { title: "Categorias" };

export default async function CategoriasPage() {
  const user = await requireUser();
  const categories = await prisma.category.findMany({
    where: { userId: user.id, type: "EXPENSE" },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    include: { _count: { select: { expenses: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Categorias"
        description="Organize suas despesas em categorias."
        action={<AddCategoryButton />}
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={<Tags className="h-6 w-6" />}
          title="Nenhuma categoria"
          description="Crie categorias para classificar seus gastos."
          action={<AddCategoryButton />}
        />
      ) : (
        <Card className="divide-y divide-border">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c._count.expenses}{" "}
                  {c._count.expenses === 1 ? "despesa" : "despesas"}
                  {c.isDefault && " · padrão"}
                </p>
              </div>
              <DeleteCategoryButton id={c.id} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
