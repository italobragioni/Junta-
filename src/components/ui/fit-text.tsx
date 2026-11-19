"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// useLayoutEffect no cliente (sem "piscar"), useEffect no servidor (sem aviso).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * Ajusta o tamanho da fonte para o texto SEMPRE caber na largura do contêiner
 * (nunca "vaza" do card), seja qual for o valor. Começa em `max` e reduz até
 * `min` conforme necessário. Reage a mudanças de tamanho da tela.
 */
export function FitText({
  children,
  max = 24,
  min = 13,
  className,
}: {
  children: React.ReactNode;
  max?: number;
  min?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      let size = max;
      el.style.fontSize = `${size}px`;
      // Reduz 1px por vez enquanto o texto for mais largo que o espaço disponível.
      while (el.scrollWidth > parent.clientWidth && size > min) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [children, max, min]);

  return (
    <span
      ref={ref}
      className={cn("inline-block max-w-full whitespace-nowrap align-bottom", className)}
      style={{ fontSize: `${max}px` }}
    >
      {children}
    </span>
  );
}
