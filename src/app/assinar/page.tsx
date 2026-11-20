import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Sparkles, Check, ShieldCheck, Crown, CalendarClock, Info, ArrowRight,
} from "lucide-react";
import { authContext, getSubscription } from "@/lib/db/queries";
import { isBillingConfigured, caktoCheckoutFor, isAdminEmail, env } from "@/lib/env";
import { isPremium } from "@/lib/billing/status";
import { formatBRL, formatDate } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/components/app/subscribe-button";

export const metadata: Metadata = { title: "Finora Premium" };
export const dynamic = "force-dynamic";

const BENEFITS = [
  "Acesso completo ao Finora",
  "Painel, contas, cartões e transações",
  "Orçamentos, metas, dívidas e patrimônio",
  "Relatórios e exportações",
  "Finora IA — seu assistente financeiro pessoal",
];

export default async function SubscribePage() {
  const [ctx, sub] = await Promise.all([authContext(), getSubscription()]);
  if (!ctx) redirect("/entrar");

  const admin = isAdminEmail(ctx.email);
  const premium = admin || isPremium(sub);
  const billingOn = isBillingConfigured();
  const checkoutUrl = caktoCheckoutFor(ctx.userId);
  const priceLabel = formatBRL(env.premiumPriceCents);

  return (
    <div className="w-full max-w-xl space-y-5">
      <div className="text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient text-white">
          <Crown className="h-7 w-7" />
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Finora Premium</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          O Finora é um app por assinatura. Assine para ter acesso completo ao seu controle financeiro.
        </p>
      </div>

      {premium ? (
        <Card className="overflow-hidden">
          <div className="brand-gradient p-5 text-white">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              <p className="font-semibold">{admin ? "Acesso liberado" : "Você é Premium 🎉"}</p>
            </div>
            {!admin && sub?.current_period_end && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
                <CalendarClock className="h-4 w-4" />
                {sub.status === "canceled"
                  ? `Acesso até ${formatDate(sub.current_period_end)}`
                  : `Renova em ${formatDate(sub.current_period_end)}`}
              </p>
            )}
          </div>
          <CardContent className="p-5">
            <Button asChild size="lg" className="w-full">
              <Link href="/painel">
                Ir para o painel <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {!admin && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-muted px-3.5 py-2.5 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                Para alterar ou cancelar, use o e-mail de cobrança enviado pela Cakto ou fale com o suporte.
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-baseline justify-between">
              <Badge variant="brand"><Sparkles className="h-3 w-3" /> Premium</Badge>
              <div className="text-right">
                <span className="text-3xl font-bold tabular">{priceLabel}</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-positive-soft text-positive">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-5">
              {billingOn && checkoutUrl ? (
                <SubscribeButton checkoutUrl={checkoutUrl} priceLabel={priceLabel} />
              ) : (
                <div className="rounded-xl border border-warn/30 bg-warn-soft px-4 py-3 text-sm text-foreground/80">
                  As assinaturas ainda não estão ativas neste ambiente. (Configuração da Cakto pendente — veja o README.)
                </div>
              )}
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Pagamento seguro via Cakto · cancele quando quiser
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
