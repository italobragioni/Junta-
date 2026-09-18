import Link from "next/link";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FEATURE_LABELS,
  PLANS,
  minPlanForFeature,
  type Feature,
} from "@/lib/plans";

const UNLOCK_COPY: Record<string, string> = {
  BASIC:
    "Com o Básico você também desbloqueia análise avançada e exportação CSV.",
  PRO: "Com o Pro você também desbloqueia Assistente com IA, histórico ilimitado, exportação PDF e insights personalizados.",
};

/**
 * Inline paywall shown in place of a feature the current plan can't use.
 * Explains clearly why it's blocked and links to the pricing page.
 */
export function LockedFeature({
  feature,
  title,
}: {
  feature: Feature;
  title?: string;
}) {
  const requiredPlan = minPlanForFeature(feature);
  return (
    <Card className="flex flex-col items-center border-dashed p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Lock className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {title ?? FEATURE_LABELS[feature]}
      </h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Esse recurso faz parte do plano {PLANS[requiredPlan].name}.
      </p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {UNLOCK_COPY[requiredPlan]}
      </p>
      <Link href="/planos" className="mt-4">
        <Button>Ver planos</Button>
      </Link>
    </Card>
  );
}
