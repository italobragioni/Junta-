import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official Junta+ logo: the "J+" symbol paired with the "Junta+" wordmark.
 * Pass compact to render the symbol only.
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
      <Image
        src="/logo.png"
        alt="Junta+"
        width={40}
        height={40}
        priority
        className="h-9 w-9 object-contain"
      />
      {!compact && (
        <span className="text-lg tracking-tight">
          Junta<span className="text-brand-600">+</span>
        </span>
      )}
    </Link>
  );
}
