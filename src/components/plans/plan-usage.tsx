import { ProgressBar } from "@/components/ui/progress-bar";
import type { PlanUsage } from "@/lib/plan-access";

interface UsageRow {
  label: string;
  used: number;
  limit: number | null;
  monthly?: boolean;
}

function UsageItem({ row }: { row: UsageRow }) {
  const unlimited = row.limit === null;
  const pct = unlimited ? 0 : Math.min(100, (row.used / row.limit!) * 100);
  const near = !unlimited && pct >= 80;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {row.label}
          {row.monthly && " (mês)"}
        </span>
        <span className="font-medium tabular-nums">
          {unlimited ? "Ilimitado" : `${row.used} / ${row.limit}`}
        </span>
      </div>
      {!unlimited && (
        <ProgressBar value={pct} tone={near ? "warning" : "brand"} />
      )}
    </div>
  );
}

/** "Seu plano" usage overview. Only shows meters for limited resources. */
export function PlanUsageList({ usage }: { usage: PlanUsage }) {
  const rows: UsageRow[] = [
    { label: "Receitas", ...usage.incomes, monthly: true },
    { label: "Despesas", ...usage.expenses, monthly: true },
    { label: "Metas", ...usage.goals },
    { label: "Orçamentos", ...usage.budgets },
    { label: "Assinaturas", ...usage.subscriptions },
  ];

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <UsageItem key={r.label} row={r} />
      ))}
    </div>
  );
}
