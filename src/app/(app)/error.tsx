"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-negative-soft text-negative">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <div>
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Tivemos um problema ao carregar esta tela. Tente novamente.
        </p>
        {error?.digest && (
          <p className="mt-2 text-xs text-muted-foreground">Código: {error.digest}</p>
        )}
      </div>
      <Button onClick={reset}>
        <RefreshCw className="h-4 w-4" /> Tentar de novo
      </Button>
    </div>
  );
}
