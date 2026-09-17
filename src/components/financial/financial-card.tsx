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
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            {icon}
          </span>
        )}
      </div>
      <p className={cn("mt-3 text-2xl font-bold tracking-tight", tones[tone])}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
