import { redirect } from "next/navigation";

import { BottomNav } from "@/components/app/bottom-nav";
import { getCurrentUser } from "@/lib/supabase/server";
import { getUserState } from "@/lib/progress/read";

// Every authenticated page is per-user — never statically prerendered.
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const state = await getUserState();

  return (
    <div
      className="min-h-dvh pb-24"
      data-reduce-motion={state?.profile.reduceMotion ? "true" : undefined}
    >
      {children}
      <BottomNav />
    </div>
  );
}
