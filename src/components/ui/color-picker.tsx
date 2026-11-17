"use client";

import { Check } from "lucide-react";
import { COLOR_PALETTE } from "@/lib/db/labels";
import { cn } from "@/lib/utils";

export function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_PALETTE.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-label={`Cor ${c}`}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110",
            value === c && "ring-2 ring-offset-2 ring-offset-card",
          )}
          style={{ backgroundColor: c, ...(value === c ? { ["--tw-ring-color" as string]: c } : {}) }}
        >
          {value === c && <Check className="h-4 w-4 text-white" />}
        </button>
      ))}
    </div>
  );
}
