import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Official Junta+ logo. The source asset (public/logo.jpg) is a square
 * app-icon containing the "J+" mark on top and the wordmark below; we crop to
 * the mark via background sizing and pair it with the crisp "Junta+" wordmark.
 */
export function Logo({
  href = "/",
  className,
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 font-bold", className)}
      aria-label="Junta+"
    >
      <span
        role="img"
        aria-hidden
        className="h-9 w-9 shrink-0 rounded-xl bg-white bg-no-repeat shadow-sm ring-1 ring-black/5"
        style={{
          backgroundImage: "url(/logo.jpg)",
          backgroundSize: "182%",
          backgroundPosition: "50% 24%",
        }}
      />
      {!compact && (
        <span className="text-lg tracking-tight">
          Junta<span className="text-brand-600">+</span>
        </span>
      )}
    </Link>
  );
}
