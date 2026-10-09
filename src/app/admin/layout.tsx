import Link from "next/link";
import { notFound } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { getUserState } from "@/lib/progress/read";

// Admin is per-request and authenticated — never statically prerendered.
export const dynamic = "force-dynamic";

/**
 * Admin area. Authorization is enforced here (role must be 'admin') AND again
 * in every admin server action. The admin role is granted out-of-band (SQL),
 * never through the public sign-up flow.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = await getUserState();
  if (!state || state.profile.role !== "admin") notFound();

  return (
    <div className="min-h-dvh pb-10">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="container-app flex h-16 items-center justify-between">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <Logo showWordmark={false} />
            <span className="font-bold">Admin</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-semibold">
            <Link href="/admin/usuarios" className="rounded-lg px-3 py-2 hover:bg-muted">
              Usuários
            </Link>
            <Link href="/admin/conteudo" className="rounded-lg px-3 py-2 hover:bg-muted">
              Conteúdo
            </Link>
            <Link href="/admin/relatos" className="rounded-lg px-3 py-2 hover:bg-muted">
              Relatos
            </Link>
            <Link href="/aprender" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted">
              Sair
            </Link>
          </nav>
        </div>
      </header>
      <main className="container-app py-6">{children}</main>
    </div>
  );
}
