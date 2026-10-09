"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { resolveReportAction } from "../actions";

export function ResolveButton({ reportId }: { reportId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() => start(async () => void (await resolveReportAction(reportId)))}
    >
      {pending ? "…" : "Marcar como resolvido"}
    </Button>
  );
}
