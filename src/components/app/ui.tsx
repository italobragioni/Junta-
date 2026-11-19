import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/format";
import type { Cents } from "@/lib/money";
import { FitText } from "@/components/ui/fit-text";

/** Cabeçalho de página com título, descrição e ação opcional. */
export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Valor monetário colorido (verde/vermelho) e com sinal opcional. */
export function MoneyText({
  cents,
  signed = false,
  colored = true,
  className,
}: {
  cents: Cents;
  signed?: boolean;
  colored?: boolean;
  className?: string;
}) {
  const positive = cents >= 0;
  const prefix = signed ? (positive ? "+" : "−") : cents < 0 ? "−" : "";
  return (
    <span
      className={cn(
        "tabular font-semibold",
        colored && (positive ? "text-positive" : "text-negative"),
        className,
      )}
    >
      {prefix}
      {formatBRL(Math.abs(cents))}
    </span>
  );
}

/** Card de indicador do painel. */
export function StatCard({
  label,
  cents,
  icon: Icon,
  tone = "neutral",
  trend,
  sublabel,
  colored = false,
}: {
  label: string;
  cents: Cents;
  icon?: LucideIcon;
  tone?: "neutral" | "positive" | "negative" | "brand";
  trend?: number;
  sublabel?: string;
  colored?: boolean;
}) {
  const toneBubble =
    tone === "positive"
      ? "bg-positive-soft text-positive"
      : tone === "negative"
        ? "bg-negative-soft text-negative"
        : tone === "brand"
          ? "bg-brand/10 text-brand"
          : "bg-muted text-muted-foreground";
  const valueColor =
    colored || tone === "positive"
      ? "text-positive"
      : tone === "negative"
        ? "text-negative"
        : "text-foreground";

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-sm text-muted-foreground">{label}</p>
        {Icon && (
          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", toneBubble)}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-2">
        <FitText max={26} min={14} className={cn("font-bold tabular tracking-tight", valueColor)}>
          {formatBRL(cents)}
        </FitText>
      </p>
      <div className="mt-1 flex min-h-[1rem] items-center gap-1.5 text-xs">
        {trend !== undefined && trend !== 0 && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 font-medium",
              trend > 0 ? "text-negative" : "text-positive",
            )}
          >
            {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend).toFixed(0)}%
          </span>
        )}
        {sublabel && <span className="min-w-0 truncate text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}

/** Título de seção com ação opcional. */
export function SectionTitle({
  children,
  action,
  className,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-center justify-between", className)}>
      <h2 className="text-base font-semibold">{children}</h2>
      {action}
    </div>
  );
}
