import { cn } from "@/lib/utils";

/** Marca do Finora: símbolo (F estilizado em gradiente) + wordmark. */
export function Logo({
  className,
  showText = true,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const text = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={dim} />
      {showText && (
        <span className={cn("font-bold tracking-tight", text)}>Finora</span>
      )}
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl brand-gradient text-white shadow-sm",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-[62%] w-[62%]" fill="none">
        {/* Gráfico ascendente dentro de um "F" — crescimento financeiro. */}
        <path
          d="M5 19V6.5C5 5.67 5.67 5 6.5 5H18"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path d="M6 12.5H13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M8.5 17L12 13L14.5 15.5L19 10"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
      </svg>
    </span>
  );
}
