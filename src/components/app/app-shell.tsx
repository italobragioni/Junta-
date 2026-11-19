"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "@/components/brand/logo";
import { ThemeQuickToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS, PRIMARY_NAV } from "./nav-items";
import { useQuickAdd } from "./quick-add";
import { logoutAction } from "@/app/(auth)/actions";

export function AppShell({
  children,
  displayName,
}: {
  children: React.ReactNode;
  displayName: string;
}) {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const { open } = useQuickAdd();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-dvh bg-background">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center px-5">
          <Link href="/painel"><Logo /></Link>
        </div>
        <Button onClick={() => open("expense")} className="mx-4 mb-2">
          <Plus className="h-4 w-4" /> Novo lançamento
        </Button>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand">
                {initials(displayName)}
              </span>
              <span className="truncate text-sm font-medium">{displayName || "Você"}</span>
            </div>
            <form action={logoutAction}>
              <button type="submit" aria-label="Sair" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
        <Link href="/painel"><Logo size="sm" /></Link>
        <div className="flex items-center gap-1">
          <ThemeQuickToggle />
          <button
            aria-label="Menu"
            onClick={() => setMobileMenu(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Top bar (desktop) */}
      <div className="sticky top-0 z-20 hidden h-16 items-center justify-end gap-2 border-b border-border bg-background/80 px-6 backdrop-blur lg:flex lg:pl-[17rem]">
        <ThemeQuickToggle />
      </div>

      {/* Conteúdo */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:pb-12 lg:pt-6">
          {children}
        </div>
      </main>

      {/* Navegação inferior (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {PRIMARY_NAV.slice(0, 2).map(({ href, label, icon: Icon }) => (
          <BottomLink key={href} href={href} label={label} Icon={Icon} active={isActive(href)} />
        ))}
        {/* Botão central de ação rápida (+) */}
        <div className="flex flex-1 justify-center">
          <button
            onClick={() => open("expense")}
            aria-label="Novo lançamento"
            className="-mt-5 flex h-14 w-14 items-center justify-center rounded-full brand-gradient text-white shadow-float ring-4 ring-background transition-transform active:scale-95"
          >
            <Plus className="h-7 w-7" />
          </button>
        </div>
        {PRIMARY_NAV.slice(2).map(({ href, label, icon: Icon }) => (
          <BottomLink key={href} href={href} label={label} Icon={Icon} active={isActive(href)} />
        ))}
        <BottomLink href="/configuracoes" label="Mais" Icon={Menu} active={false} onClick={(e) => { e.preventDefault(); setMobileMenu(true); }} />
      </nav>

      {/* Menu completo (mobile) */}
      {mobileMenu && (
        <MobileMenu isActive={isActive} onClose={() => setMobileMenu(false)} />
      )}
    </div>
  );
}

function BottomLink({ href, label, Icon, active, onClick }: {
  href: string; label: string; Icon: typeof Menu; active: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
        active ? "text-brand" : "text-muted-foreground",
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}

function MobileMenu({ isActive, onClose }: {
  isActive: (href: string) => boolean; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-[80%] max-w-xs flex-col bg-card shadow-float animate-slide-up">
        <div className="flex h-14 items-center justify-between px-4">
          <LogoMark className="h-8 w-8" />
          <button onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                isActive(href) ? "bg-brand/10 text-brand" : "text-foreground hover:bg-muted/60",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-negative hover:bg-negative-soft">
              <LogOut className="h-[18px] w-[18px]" /> Sair
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "F";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}
