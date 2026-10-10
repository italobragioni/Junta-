import { ShieldQuestion, Info } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Card, CardContent } from "@/components/ui/card";
import { FactCheckForm } from "@/components/verify/fact-check-form";
import { isFactCheckConfigured, hasServiceRole } from "@/lib/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { getUserState } from "@/lib/progress/read";
import { getUsage, DAILY_LIMIT } from "@/lib/verify/usage";

export const metadata = { title: "Verificar" };

// The AI analysis (especially of an image) can take longer than the default
// serverless timeout. Server Actions inherit the maxDuration of the page they
// run on, so give the analysis room to finish instead of being killed early.
export const maxDuration = 60;

export default async function VerifyPage() {
  const [user, state] = await Promise.all([getCurrentUser(), getUserState()]);
  const plan = state?.plan ?? "free";
  const configured = isFactCheckConfigured() && hasServiceRole();

  const usage =
    configured && user ? await getUsage(user.id, plan).catch(() => null) : null;

  return (
    <div>
      <header className="border-b border-border bg-card">
        <div className="container-app flex items-center justify-between py-4">
          <Logo size={28} />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
            <ShieldQuestion className="h-4 w-4" aria-hidden /> Verificador
          </span>
        </div>
      </header>

      <main className="container-app py-6">
        <h1 className="text-2xl font-extrabold">É fake ou é real?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cole uma notícia, um link ou envie um print. O Verificador{" "}
          <strong>pesquisa em fontes confiáveis na web</strong>, mostra os links que
          encontrou e dá um veredito provável — com os sinais de alerta e como
          confirmar você mesmo.
        </p>

        <Card className="mt-4 border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-2 p-4 text-sm text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              O Verificador pesquisa em fontes da web e avalia a confiabilidade, mas{" "}
              <strong>pode errar</strong> e não substitui uma agência de checagem. Em
              caso de dúvida, confira na fonte original e nas agências indicadas no
              resultado.
            </span>
          </CardContent>
        </Card>

        <div className="mt-6">
          {configured ? (
            <FactCheckForm
              initialRemaining={usage?.remaining ?? DAILY_LIMIT[plan]}
              limit={usage?.limit ?? DAILY_LIMIT[plan]}
            />
          ) : (
            <Card>
              <CardContent className="p-5 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Em breve.</p>
                <p className="mt-1">
                  O Verificador ainda não foi ativado neste ambiente. Assim que a
                  chave de IA for configurada, esta tela passa a analisar o conteúdo
                  que você enviar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
