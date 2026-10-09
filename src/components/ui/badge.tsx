import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "amber" | "muted" | "premium" | "danger" | "success";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700",
  amber: "bg-amber-100 text-amber-800", // alerts / "em revisão" — intentionally kept
  muted: "bg-muted text-muted-foreground",
  premium: "bg-gold/25 text-ink", // gold highlight (Premium, XP, destaques)
  danger: "bg-red-50 text-red-700",
  success: "bg-brand-50 text-brand-700",
};

export function Badge({
  tone = "muted",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
