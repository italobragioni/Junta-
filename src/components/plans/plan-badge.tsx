import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

/** Compact current-plan indicator with an upgrade CTA when relevant. */
export function PlanBadge({
  plan,
  className,
}: {
  plan: PlanId;
  className?: string;
}) {
  const name = PLANS[plan].name;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-medium">
        {plan === "PRO" ? (
          <Crown className="h-4 w-4 text-brand-600" />
        ) : (
          <Sparkles className="h-4 w-4 text-brand-600" />
        )}
        Plano {name}
        {plan === "PRO" && <span className="text-brand-600">✓</span>}
      </span>
      {plan === "FREE" && (
        <Link
          href="/planos"
          className="text-sm font-semibold text-brand-600 hover:underline"
        >
          Fazer upgrade
        </Link>
      )}
      {plan === "BASIC" && (
        <Link
          href="/planos"
          className="text-sm font-semibold text-brand-600 hover:underline"
        >
          Upgrade para Pro
        </Link>
      )}
    </div>
  );
}
