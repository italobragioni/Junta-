import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface FinancialCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  hint?: string;
  tone?: "neutral" | "positive" | "negative" | "brand";
}

const tones: Record<string, string> = {
  neutral: "text-foreground",
  positive: "text-brand-600",
  negative: "text-red-600",
  brand: "text-brand-700",
};

export function FinancialCard({
  label,
  value,
  icon,
  hint,
  tone = "neutral",
}: FinancialCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            {icon}
          </span>
        )}
      </div>
      {/* Fluid size so long values (e.g. R$ 10.000,00) never touch the edge,
          on any screen. Caps at ~text-2xl on larger viewports. */}
      <p
        className={cn(
          "mt-3 font-bold leading-tight tracking-tight tabular-nums text-[clamp(1.05rem,5vw,1.5rem)]",
          tones[tone],
        )}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
    </Card>
  );
}
