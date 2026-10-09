import { cn } from "@/lib/utils";

/**
 * Civio brand mark — original and intentionally simple so the name and symbol
 * are easy to replace. The mark is an abstract "conversation + check" shape
 * (an informed dialogue), not a campaign emblem. Swap the SVG and the word
 * "Civio" to rebrand.
 */
export function Logo({
  className,
  showWordmark = true,
  size = 32,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        role="img"
        aria-label="Civio"
        className="shrink-0"
      >
        <rect width="40" height="40" rx="11" fill="hsl(var(--brand-mark))" />
        {/* speech/dialogue bubble */}
        <path
          d="M11 13.5A3.5 3.5 0 0 1 14.5 10h11a3.5 3.5 0 0 1 3.5 3.5v6a3.5 3.5 0 0 1-3.5 3.5H19l-5 4v-4h-.5A3.5 3.5 0 0 1 11 19.5v-6Z"
          fill="white"
          fillOpacity="0.95"
        />
        {/* amber check = informed, verified */}
        <path
          d="m16.5 16.4 2.6 2.6 5-5"
          fill="none"
          stroke="hsl(var(--brand-accent))"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className="text-xl font-extrabold tracking-tight text-foreground">
          Civio
        </span>
      )}
    </span>
  );
}
