"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/lib/format";

/**
 * Campo de valor monetário. Internamente guarda CENTAVOS (inteiro). O usuário
 * digita apenas números e o campo formata "R$ 1.234,56" automaticamente —
 * impossível errar o separador decimal.
 *
 * Controlado: `value` em centavos, `onValueChange(cents)`.
 */
export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: number; // centavos
  onValueChange: (cents: number) => void;
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onValueChange, className, ...props }, ref) => {
    const display = formatAmount(Math.abs(value || 0));

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      // Mantém só dígitos; cada dígito empurra o valor em centavos.
      const digits = e.target.value.replace(/\D/g, "");
      const cents = digits === "" ? 0 : parseInt(digits, 10);
      onValueChange(cents);
    }

    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          R$
        </span>
        <input
          ref={ref}
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          className={cn(
            "flex h-11 w-full rounded-xl border border-input bg-card pl-10 pr-3.5 text-right text-base font-semibold tabular text-foreground shadow-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-brand",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
MoneyInput.displayName = "MoneyInput";
