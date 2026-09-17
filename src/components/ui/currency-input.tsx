"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  name: string;
  id?: string;
  defaultCents?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

function formatFromDigits(digits: string): string {
  const cents = Number(digits || "0");
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * BRL currency input. Internally tracks only digits (cents) and renders a
 * formatted "1.234,56" value. The submitted value is BRL-formatted; the
 * server parses it with parseToCents.
 */
export function CurrencyInput({
  name,
  id,
  defaultCents,
  placeholder = "0,00",
  required,
  className,
}: CurrencyInputProps) {
  const [digits, setDigits] = React.useState<string>(
    defaultCents && defaultCents > 0 ? String(defaultCents) : "",
  );

  const display = digits ? formatFromDigits(digits) : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 15);
    setDigits(onlyDigits);
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        R$
      </span>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        value={display}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={cn(
          "flex h-11 w-full rounded-xl border border-input bg-card pl-9 pr-3.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200",
          className,
        )}
      />
      {/* Submitted value: BRL-formatted, parsed server-side */}
      <input type="hidden" name={name} value={display} />
    </div>
  );
}
