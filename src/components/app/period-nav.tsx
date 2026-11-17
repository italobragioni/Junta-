"use client";

import { Suspense } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { addMonthsToPeriod, currentPeriod } from "@/lib/finance/period";
import { formatMonth } from "@/lib/format";

/**
 * Navegador de mês (anterior / próximo) que atualiza ?mes= na URL.
 *
 * `useSearchParams` precisa estar dentro de um <Suspense> (exigência do Next em
 * produção). Por isso expomos um wrapper com Suspense e mantemos o uso do hook
 * no componente interno.
 */
export function PeriodNav({ period, param = "mes" }: { period: string; param?: string }) {
  return (
    <Suspense fallback={<PeriodNavShell period={period} />}>
      <PeriodNavInner period={period} param={param} />
    </Suspense>
  );
}

function PeriodNavInner({ period, param = "mes" }: { period: string; param?: string }) {
  const router = useRouter();
  const search = useSearchParams();

  function go(delta: number) {
    const next = addMonthsToPeriod(period, delta);
    const params = new URLSearchParams(search?.toString() ?? "");
    if (next === currentPeriod()) params.delete(param);
    else params.set(param, next);
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?", { scroll: false });
  }

  return <PeriodNavShell period={period} onPrev={() => go(-1)} onNext={() => go(1)} />;
}

function PeriodNavShell({
  period,
  onPrev,
  onNext,
}: {
  period: string;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
      <button onClick={onPrev} aria-label="Mês anterior" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="min-w-[8.5rem] text-center text-sm font-semibold capitalize">
        {formatMonth(period)}
      </span>
      <button onClick={onNext} aria-label="Próximo mês" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
