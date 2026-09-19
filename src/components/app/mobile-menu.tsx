"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { PlanBadge } from "@/components/plans/plan-badge";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import type { PlanId } from "@/lib/plans";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu({
  name,
  email,
  plan,
}: {
  name: string;
  email: string;
  plan: PlanId;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-muted"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="font-semibold">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="space-y-3 border-t border-border p-3">
              <PlanBadge plan={plan} />
              <Link
                href="/perfil"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-2 py-1"
              >
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </Link>
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
