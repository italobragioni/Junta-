import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SmartAlert } from "@/lib/analysis";

const styles = {
  warning: {
    wrap: "border-amber-200 bg-amber-50",
    icon: "text-amber-600",
    title: "text-amber-900",
    text: "text-amber-800",
    Icon: AlertTriangle,
  },
  info: {
    wrap: "border-sky-200 bg-sky-50",
    icon: "text-sky-600",
    title: "text-sky-900",
    text: "text-sky-800",
    Icon: Info,
  },
  success: {
    wrap: "border-brand-200 bg-brand-50",
    icon: "text-brand-600",
    title: "text-brand-900",
    text: "text-brand-800",
    Icon: CheckCircle2,
  },
} as const;

export function AlertCard({ alert }: { alert: SmartAlert }) {
  const s = styles[alert.kind];
  const Icon = s.Icon;
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border p-4",
        s.wrap,
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", s.icon)} />
      <div>
        <p className={cn("text-sm font-semibold", s.title)}>{alert.title}</p>
        <p className={cn("mt-0.5 text-sm", s.text)}>{alert.message}</p>
      </div>
    </div>
  );
}
