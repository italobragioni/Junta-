import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official Junta+ logo — shows the complete logo image (mark + wordmark) only,
 * with no extra text beside it.
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
  const size = compact ? 36 : 40;
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center", className)}
      aria-label="Junta+"
    >
      <Image
        src="/logo.jpg"
        alt="Junta+"
        width={size}
        height={size}
        priority
        className="h-9 w-9 rounded-lg object-contain sm:h-10 sm:w-10"
      />
    </Link>
  );
}
