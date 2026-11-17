"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";
interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

let listeners: ((t: ToastItem) => void)[] = [];
let counter = 0;

/** Dispara um toast de qualquer lugar: toast.success("Salvo!"). */
export const toast = {
  show(message: string, tone: ToastTone = "info") {
    const item = { id: ++counter, tone, message };
    listeners.forEach((l) => l(item));
  },
  success(message: string) {
    this.show(message, "success");
  },
  error(message: string) {
    this.show(message, "error");
  },
  info(message: string) {
    this.show(message, "info");
  },
};

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };
const TONES = {
  success: "text-positive",
  error: "text-negative",
  info: "text-brand",
};

/** Monte uma vez no layout do app. Renderiza os toasts no canto. */
export function Toaster() {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    const listener = (t: ToastItem) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== t.id));
      }, 4000);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  function dismiss(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end">
      {items.map((item) => {
        const Ico = ICONS[item.tone];
        return (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-popover p-3.5 shadow-float animate-slide-up"
          >
            <Ico className={cn("mt-0.5 h-5 w-5 shrink-0", TONES[item.tone])} />
            <p className="flex-1 text-sm text-popover-foreground">{item.message}</p>
            <button
              onClick={() => dismiss(item.id)}
              className="rounded-md p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
