"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

/** Lê o tema atual do DOM/localStorage. */
function readTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem("finora-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return "system";
}

/** Aplica o tema no <html> e persiste. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
    try {
      localStorage.removeItem("finora-theme");
    } catch {
      /* ignore */
    }
  } else {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("finora-theme", theme);
    } catch {
      /* ignore */
    }
  }
}

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

/** Seletor de tema em 3 estados (claro / escuro / sistema). */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<Theme>("system");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setTheme(readTheme());
    setMounted(true);
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1 rounded-xl bg-muted p-1", className)}
      role="radiogroup"
      aria-label="Tema"
    >
      {OPTIONS.map(({ value, label, icon: Ico }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => choose(value)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Ico className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Botão compacto que alterna claro/escuro (para a barra superior). */
export function ThemeQuickToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const t = readTheme();
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(t === "dark" || (t === "system" && systemDark));
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema claro/escuro"
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {mounted && isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
