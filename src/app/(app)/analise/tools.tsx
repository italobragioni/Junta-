"use client";

import * as React from "react";
import { Calculator, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { formatCents } from "@/lib/money";
import { parseToCents } from "@/lib/money";
import {
  projectSavings,
  monthsToReach,
  analyzePurchase,
  type PurchaseVerdict,
} from "@/lib/simulator";

interface GoalOption {
  id: string;
  name: string;
  targetAmountCents: number;
  currentAmountCents: number;
}

// Track the cents value typed into a CurrencyInput. We read the freshest value
// straight from the input element that fired the event (its displayed value is
// BRL-formatted and parseToCents handles it), avoiding any render-timing race.
function useCentsField() {
  const [cents, setCents] = React.useState(0);
  const onChange = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement;
    if (target && typeof target.value === "string") {
      setCents(parseToCents(target.value) ?? 0);
    }
  };
  return { cents, onChange };
}

export function SavingsSimulator({ goals }: { goals: GoalOption[] }) {
  const monthly = useCentsField();
  const [goalId, setGoalId] = React.useState<string>("");

  const projections = projectSavings(monthly.cents);
  const selectedGoal = goals.find((g) => g.id === goalId);
  const months =
    selectedGoal &&
    monthsToReach(
      selectedGoal.targetAmountCents,
      monthly.cents,
      selectedGoal.currentAmountCents,
    );

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <Calculator className="h-5 w-5 text-brand-600" />
        <CardTitle>Quanto posso juntar?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div onInput={monthly.onChange}>
          <Label htmlFor="sim-monthly">Quanto consegue economizar por mês?</Label>
          <CurrencyInput id="sim-monthly" name="sim-monthly" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {projections.map((p) => (
            <div
              key={p.months}
              className="rounded-xl border border-border bg-muted/40 p-3 text-center"
            >
              <p className="text-xs text-muted-foreground">
                Em {p.months} meses
              </p>
              <p className="mt-1 font-bold text-brand-600">
                {formatCents(p.totalCents)}
              </p>
            </div>
          ))}
        </div>

        {goals.length > 0 && (
          <div>
            <Label htmlFor="sim-goal">Aplicar a uma meta</Label>
            <Select
              id="sim-goal"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
            >
              <option value="">Selecione uma meta</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {selectedGoal && (
          <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
            {monthly.cents <= 0 ? (
              "Informe um valor mensal para simular."
            ) : months === 0 ? (
              "Você já alcançou essa meta! 🎉"
            ) : months === null ? (
              "Aumente o valor mensal para alcançar essa meta."
            ) : (
              <>
                Para alcançar sua meta de{" "}
                {formatCents(selectedGoal.targetAmountCents)}, economizando{" "}
                {formatCents(monthly.cents)}/mês, você precisará de
                aproximadamente <strong>{months} meses</strong>.
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const VERDICT_STYLES: Record<
  PurchaseVerdict,
  { label: string; cls: string }
> = {
  comfortable: {
    label: "Cabe no seu orçamento",
    cls: "bg-brand-50 text-brand-900",
  },
  tight: {
    label: "Dá para comprar, mas fica apertado",
    cls: "bg-amber-50 text-amber-900",
  },
  not_now: {
    label: "Talvez não seja o melhor momento",
    cls: "bg-red-50 text-red-900",
  },
};

export function PurchaseAnalyzer({
  availableCents,
  monthlySavingsCents,
}: {
  availableCents: number;
  monthlySavingsCents: number;
}) {
  const price = useCentsField();
  const [item, setItem] = React.useState("");

  const hasPrice = price.cents > 0;
  const result = hasPrice
    ? analyzePurchase({
        priceCents: price.cents,
        availableNowCents: availableCents,
        monthlySavingsCents,
      })
    : null;

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-brand-600" />
        <CardTitle>Posso comprar?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="buy-item">O que você quer comprar?</Label>
          <Input
            id="buy-item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Ex.: Notebook"
          />
        </div>
        <div onInput={price.onChange}>
          <Label htmlFor="buy-price">Quanto custa?</Label>
          <CurrencyInput id="buy-price" name="buy-price" />
        </div>

        {result && (
          <div className="space-y-3">
            <div
              className={`rounded-xl p-4 text-sm font-medium ${
                VERDICT_STYLES[result.verdict].cls
              }`}
            >
              {VERDICT_STYLES[result.verdict].label}
              {item ? `: ${item}` : ""}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Comprar agora
                </p>
                {result.canAffordNow ? (
                  <p className="mt-1 text-sm">
                    Sobraria{" "}
                    <strong>
                      {formatCents(result.leftoverIfBoughtNowCents)}
                    </strong>{" "}
                    do disponível deste mês.
                  </p>
                ) : (
                  <p className="mt-1 text-sm">
                    Faltariam{" "}
                    <strong>
                      {formatCents(Math.abs(result.leftoverIfBoughtNowCents))}
                    </strong>{" "}
                    do disponível deste mês.
                  </p>
                )}
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Guardar aos poucos
                </p>
                {monthlySavingsCents > 0 && result.monthsToSaveUp ? (
                  <p className="mt-1 text-sm">
                    Economizando {formatCents(monthlySavingsCents)}/mês, você
                    junta esse valor em{" "}
                    <strong>{result.monthsToSaveUp} meses</strong>.
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Registre uma economia mensal para simular o tempo até
                    juntar.
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Esta é uma simulação baseada exclusivamente nos dados que você
              inseriu — não é aconselhamento financeiro profissional.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
