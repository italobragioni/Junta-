import { requireOnboardedUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Logo } from "@/components/brand/logo";
import { Sidebar } from "@/components/app/sidebar";
import { BottomNav } from "@/components/app/bottom-nav";
import { LogoutButton } from "@/components/app/logout-button";
import { FloatingAddExpense } from "@/components/app/fab";
import { PlanBadge } from "@/components/plans/plan-badge";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireOnboardedUser();
  const categories = await prisma.category.findMany({
    where: { userId: user.id, type: "EXPENSE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar />
        </div>
        <div className="space-y-2 border-t border-border p-3">
          <PlanBadge plan={user.plan} />
          <div className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <LogoutButton compact />
          </div>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur lg:hidden">
          <Logo />
          <LogoutButton compact />
        </header>

        <main className="flex-1 pb-24 lg:pb-8">
          <div className="container-app py-6 lg:py-8">{children}</div>
        </main>
      </div>

      <BottomNav />
      {categories.length > 0 && <FloatingAddExpense categories={categories} />}
    </div>
  );
}
