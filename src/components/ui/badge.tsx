import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "amber" | "muted" | "premium" | "danger" | "success";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700",
  amber: "bg-amber-100 text-amber-800",
  muted: "bg-muted text-muted-foreground",
  premium: "bg-amber-500/15 text-amber-700",
  danger: "bg-red-50 text-red-700",
  success: "bg-emerald-50 text-emerald-700",
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
