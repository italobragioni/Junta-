import Link from "next/link";
import { BookOpen, Compass, ShieldCheck, Sparkles, Lock } from "lucide-react";

import { PublicHeader } from "@/components/marketing/public-header";
import { Logo } from "@/components/brand/logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TRAILS } from "@/lib/content";

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <PublicHeader />

      {/* Hero */}
      <section className="container-app pt-12 pb-10 text-center sm:pt-16">
        <Badge tone="brand" className="mb-4">
          Educação política • em português • para o celular
        </Badge>
        <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Entenda política em 5 minutos por dia
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Aprenda como o Brasil funciona, avalie informações e forme suas próprias
          conclusões. Lições curtas, com fontes, sem empurrar ideologia.
        </p>
        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
          <Link
            href="/demonstracao"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            <Sparkles className="h-5 w-5" aria-hidden />
            Experimentar uma lição grátis
          </Link>
          <Link
            href="/criar-conta"
            className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-border bg-card px-6 text-base font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Criar minha conta
          </Link>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          A demonstração não exige cadastro.
        </p>
      </section>

      {/* Value props */}
      <section className="container-app grid gap-4 py-6 sm:grid-cols-3">
        {[
          { icon: BookOpen, title: "Lições de 3 a 5 minutos", desc: "Explicações curtas e exemplos concretos — feito para caber no seu dia." },
          { icon: ShieldCheck, title: "Com fonte e sem viés", desc: "Cada explicação cita a fonte consultada. Não recomendamos candidato nem ideologia." },
          { icon: Compass, title: "Trilhas que progridem", desc: "Um mapa de aprendizado com XP, níveis e sequência diária para manter o ritmo." },
        ].map((f) => (
          <Card key={f.title}>
            <CardContent className="pt-6">
              <f.icon className="mb-3 h-6 w-6 text-brand-600" aria-hidden />
              <h3 className="font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Trails */}
      <section className="container-app py-8">
        <h2 className="mb-4 text-2xl font-extrabold">As trilhas</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {TRAILS.map((t) => {
            const published = t.lessons.filter((l) => l.status === "publicado").length;
            return (
              <Card key={t.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{t.title}</h3>
                    <Badge tone={published > 0 ? "success" : "muted"}>
                      {published > 0 ? `${published} publicada(s)` : "Em breve"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Plans */}
      <section className="container-app py-8">
        <h2 className="mb-4 text-2xl font-extrabold">Planos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold">Gratuito</h3>
              <p className="mt-1 text-sm text-muted-foreground">Para começar.</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Demonstração sem cadastro</li>
                <li>• As 3 primeiras lições publicadas da trilha “Como o Brasil funciona”</li>
                <li>• Revisão dos erros dessas lições</li>
                <li>• Progresso, XP e sequência diária</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-brand-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Premium</h3>
                <Badge tone="premium">
                  <Lock className="h-3 w-3" aria-hidden /> R$ 19,90/mês*
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Acesso completo.</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Todas as lições publicadas</li>
                <li>• Novas trilhas quando forem lançadas</li>
                <li>• Revisão dos erros de todo o conteúdo acessível</li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                *Preço de teste. Mostramos exatamente o que está incluído antes de
                iniciar qualquer assinatura.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="container-app border-t border-border py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size={28} />
          <p className="max-w-md text-sm text-muted-foreground">
            Civio ensina política e cidadania com linguagem simples. Não recomenda
            candidato, não dá nota a crenças e não busca convencer você de uma
            ideologia.
          </p>
        </div>
      </footer>
    </div>
  );
}
