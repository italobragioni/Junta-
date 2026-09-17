import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  tone?: "brand" | "warning" | "danger";
}

export function ProgressBar({
  value,
  className,
  tone = "brand",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const tones: Record<string, string> = {
    brand: "bg-brand-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
  };
  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all", tones[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
