import { cn } from "@/lib/utils";

/** Marca do Finora: símbolo (ícone) + wordmark "Finora". */
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
      {showText && <span className={cn("font-bold tracking-tight", text)}>Finora</span>}
    </span>
  );
}

/** Apenas o símbolo (ícone) do Finora. O tamanho vem via className (ex.: h-9 w-9). */
export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/finora-mark.png"
      alt="Finora"
      className={cn("rounded-[24%] object-cover shadow-sm", className)}
      draggable={false}
    />
  );
}
