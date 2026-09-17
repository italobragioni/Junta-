import Link from "next/link";
import { PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

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
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white">
        <PiggyBank className="h-5 w-5" />
      </span>
      {!compact && (
        <span className="text-lg tracking-tight">
          Junta<span className="text-brand-600">+</span>
        </span>
      )}
    </Link>
  );
}
