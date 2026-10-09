"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Users, BookOpen, Flag, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/conteudo", label: "Conteúdo", icon: BookOpen },
  { href: "/admin/relatos", label: "Relatos", icon: Flag },
];

/** Hamburger menu for the admin header. Opens a dropdown with the options. */
export function AdminMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Menu do painel"
          className="animate-fade-in absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        >
          <nav className="flex flex-col p-1.5">
            {items.map((it) => {
              const active = it.exact
                ? pathname === it.href
                : pathname === it.href || pathname.startsWith(it.href + "/");
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-sm font-semibold",
                    active ? "bg-brand-50 text-brand-700" : "text-foreground hover:bg-muted",
                  )}
                >
                  <it.icon className="h-5 w-5 shrink-0" aria-hidden />
                  {it.label}
                </Link>
              );
            })}
            <div className="my-1 border-t border-border" />
            <Link
              href="/aprender"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-5 w-5 shrink-0" aria-hidden />
              Sair do painel
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
