import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { DEMO_LESSON, DEMO_NOTICE } from "@/lib/content/demo";
import { DemoRunner } from "./demo-runner";

export const metadata = { title: "Demonstração" };

export default function DemoPage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="container-app flex h-16 items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Sair
          </Link>
          <Logo showWordmark={false} />
          <Badge tone="amber">Demonstração</Badge>
        </div>
      </header>

      <main className="container-app py-6">
        <div
          role="note"
          className="mb-6 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{DEMO_NOTICE}</p>
        </div>

        <h1 className="sr-only">Lição de demonstração: {DEMO_LESSON.title}</h1>
        <DemoRunner lesson={DEMO_LESSON} />
      </main>
    </div>
  );
}
