"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import type { CategoryOption } from "./expense-form";

export function ExpenseFilters({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/despesas?${next.toString()}`);
  }

  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          defaultValue={params.get("q") ?? ""}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Pesquisar..."
          className="pl-9"
        />
      </div>
      <Select
        defaultValue={params.get("cat") ?? ""}
        onChange={(e) => update("cat", e.target.value)}
      >
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select
        defaultValue={params.get("period") ?? "this-month"}
        onChange={(e) => update("period", e.target.value)}
      >
        <option value="this-month">Este mês</option>
        <option value="last-month">Mês passado</option>
        <option value="last-3-months">Últimos 3 meses</option>
        <option value="all">Todo o período</option>
      </Select>
      <Select
        defaultValue={params.get("sort") ?? "date-desc"}
        onChange={(e) => update("sort", e.target.value)}
      >
        <option value="date-desc">Data (mais recente)</option>
        <option value="date-asc">Data (mais antiga)</option>
        <option value="amount-desc">Valor (maior)</option>
        <option value="amount-asc">Valor (menor)</option>
      </Select>
    </div>
  );
}
