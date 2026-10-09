import { cn } from "@/lib/utils";

/**
 * Civio brand mark — an open book inside a speech bubble (an informed
 * dialogue), on a green tile, matching the green/gold/white creatives:
 * green bubble/tile, gold book, white page. The mark is a single centralized
 * asset, so the brand colors live here (and in public/icon.svg) rather than
 * scattered across components. Swap the SVG and the word "Civio" to rebrand.
 */
export function Logo({
  className,
  showWordmark = true,
  size = 32,
  wordmarkClassName,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  wordmarkClassName?: string;
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
        <defs>
          <linearGradient id="civioTile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#059669" />
            <stop offset="1" stopColor="#064e3b" />
          </linearGradient>
        </defs>
        {/* green tile */}
        <rect width="40" height="40" rx="11" fill="url(#civioTile)" />
        {/* white speech bubble */}
        <path
          d="M11 13.5A3.5 3.5 0 0 1 14.5 10h11a3.5 3.5 0 0 1 3.5 3.5v6a3.5 3.5 0 0 1-3.5 3.5H19l-5 4v-4h-.5A3.5 3.5 0 0 1 11 19.5v-6Z"
          fill="#ffffff"
        />
        {/* gold open book */}
        <path
          d="M20 14.2c-1.8-.9-4.4-1-6.2-.3v5c1.8-.7 4.4-.6 6.2.2Z"
          fill="#facc15"
        />
        <path
          d="M20 14.2c1.8-.9 4.4-1 6.2-.3v5c-1.8-.7-4.4-.6-6.2.2Z"
          fill="#facc15"
        />
        <path
          d="M20 14.2v4.9"
          stroke="#eab308"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark && (
        <span
          className={cn(
            "text-xl font-extrabold tracking-tight text-foreground",
            wordmarkClassName,
          )}
        >
          Civio
        </span>
      )}
    </span>
  );
}
