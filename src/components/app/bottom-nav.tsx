"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, RefreshCw, User } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/aprender", label: "Aprender", icon: BookOpen },
  { href: "/revisar", label: "Revisar", icon: RefreshCw },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="container-app flex items-stretch justify-around">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[60px] flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors",
                  active ? "text-brand-700" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <it.icon className="h-6 w-6" aria-hidden />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
