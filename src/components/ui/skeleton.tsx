import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton rounded-lg", className)} {...props} />;
}

/** Bloco de skeleton para um card de estatística. */
export function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-32" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  );
}
