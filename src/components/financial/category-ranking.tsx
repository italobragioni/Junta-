import { formatCents } from "@/lib/money";
import type { CategorySpend } from "@/lib/finance";
import { ProgressBar } from "@/components/ui/progress-bar";

export function CategoryRanking({
  categories,
  limit = 6,
}: {
  categories: CategorySpend[];
  limit?: number;
}) {
  const items = categories.slice(0, limit);
  const max = items.length ? items[0].totalCents : 0;

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nenhum gasto registrado neste mês ainda.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((c) => (
        <li key={c.categoryId ?? c.name}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium">{c.name}</span>
            <span className="tabular-nums text-muted-foreground">
              {formatCents(c.totalCents)}
            </span>
          </div>
          <ProgressBar value={max > 0 ? (c.totalCents / max) * 100 : 0} />
        </li>
      ))}
    </ul>
  );
}
