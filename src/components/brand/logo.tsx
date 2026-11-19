import { cn } from "@/lib/utils";

/**
 * Logo COMPLETO do Finora (ícone + palavra "Finora" + moedas), imagem inteira,
 * sem cortar nada. O tamanho vem via `size` ou `className`.
 */
export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-10 w-10" : size === "lg" ? "h-20 w-20" : "h-12 w-12";
  return <LogoMark className={cn(dim, className)} />;
}

/** A imagem completa do logo, exibida inteira (object-contain). */
export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/finora-icon.png"
      alt="Finora"
      className={cn("object-contain", className)}
      draggable={false}
    />
  );
}
