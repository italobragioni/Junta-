import type { Metadata } from "next";
import { Target } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCents, formatPercent } from "@/lib/money";
import {
  formatDate,
  toDateInputValue,
  monthsUntil,
} from "@/lib/dates";
import { goalMath } from "@/lib/simulator";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/ui/states";
import {
  AddGoalButton,
  EditGoalButton,
  AddMoneyButton,
  DeleteGoalButton,
} from "./goal-forms";

export const metadata: Metadata = { title: "Metas" };

export default async function MetasPage() {
  const user = await requireUser();
  const goals = await prisma.financialGoal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Metas"
        description="Defina objetivos e acompanhe quanto falta para alcançá-los."
        action={<AddGoalButton />}
      />

      {goals.length === 0 ? (
        <EmptyState
          icon={<Target className="h-6 w-6" />}
          title="Você ainda não tem metas"
          description="Crie sua primeira meta — como uma reserva de emergência — e veja quanto precisa guardar por mês."
          action={<AddGoalButton label="Criar primeira meta" />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {goals.map((g) => {
            const months = g.targetDate ? monthsUntil(g.targetDate) : null;
            const math = goalMath({
              targetAmountCents: g.targetAmountCents,
              currentAmountCents: g.currentAmountCents,
              monthsUntilTarget: months,
            });
            const done = math.remainingCents <= 0;
            return (
              <Card key={g.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold">
                        {g.name}
                      </h3>
                      {g.targetDate && (
                        <p className="text-xs text-muted-foreground">
                          Até {formatDate(g.targetDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0">
                      <EditGoalButton
                        goal={{
                          id: g.id,
                          name: g.name,
                          targetAmountCents: g.targetAmountCents,
                          currentAmountCents: g.currentAmountCents,
                          targetDate: g.targetDate
                            ? toDateInputValue(g.targetDate)
                            : "",
                        }}
                      />
                      <DeleteGoalButton id={g.id} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-brand-600">
                        {formatCents(g.currentAmountCents)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        de {formatCents(g.targetAmountCents)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPercent(math.progressPercent)}
                    </span>
                  </div>

                  <ProgressBar
                    value={math.progressPercent}
                    className="mt-2"
                    tone={done ? "brand" : "brand"}
                  />

                  <div className="mt-4 space-y-1 text-sm">
                    {done ? (
                      <p className="font-medium text-brand-600">
                        Meta alcançada! 🎉
                      </p>
                    ) : (
                      <>
                        <p className="text-muted-foreground">
                          Faltam{" "}
                          <span className="font-medium text-foreground">
                            {formatCents(math.remainingCents)}
                          </span>
                        </p>
                        {math.monthlyNeededCents !== null &&
                          math.monthsUntilTarget !== null && (
                            <p className="text-muted-foreground">
                              Guarde{" "}
                              <span className="font-medium text-foreground">
                                {formatCents(math.monthlyNeededCents)}/mês
                              </span>{" "}
                              para chegar na data.
                            </p>
                          )}
                      </>
                    )}
                  </div>

                  <div className="mt-4">
                    <AddMoneyButton goalId={g.id} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
