import Link from "next/link";
import { BookOpen, Compass, ShieldCheck, Sparkles, Lock, Check } from "lucide-react";

import { PublicHeader } from "@/components/marketing/public-header";
import { Logo } from "@/components/brand/logo";
import { TRAILS } from "@/lib/content";

export default function LandingPage() {
  return (
    <div className="bg-brand-gradient min-h-dvh text-white">
      <PublicHeader />

      {/* Hero */}
      <section className="container-app relative overflow-hidden pt-12 pb-10 text-center sm:pt-16">
        {/* discreet green glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
        />
        <div className="relative">
          <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-mint ring-1 ring-white/15">
            Educação política • em português • para o celular
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Entenda política em{" "}
            <span className="text-gold">5 minutos por dia</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Aprenda como o Brasil funciona, avalie informações e forme suas próprias
            conclusões. Lições curtas, com fontes, sem empurrar ideologia.
          </p>
          <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
            <Link
              href="/demonstracao"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gold px-6 text-base font-bold text-ink shadow-lg shadow-black/20 transition-colors hover:bg-gold-300"
            >
              <Sparkles className="h-5 w-5" aria-hidden />
              Experimentar uma lição grátis
            </Link>
            <Link
              href="/criar-conta"
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/25 bg-white/5 px-6 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Criar minha conta
            </Link>
          </div>
          <p className="mt-3 text-sm text-white/60">
            A demonstração não exige cadastro.
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="container-app grid gap-4 py-6 sm:grid-cols-3">
        {[
          { icon: BookOpen, title: "Lições de 3 a 5 minutos", desc: "Explicações curtas e exemplos concretos — feito para caber no seu dia." },
          { icon: ShieldCheck, title: "Com fonte e sem viés", desc: "Cada explicação cita a fonte consultada. Não recomendamos candidato nem ideologia." },
          { icon: Compass, title: "Trilhas que progridem", desc: "Um mapa de aprendizado com XP, níveis e sequência diária para manter o ritmo." },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-mint/15 text-gold">
              <f.icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="font-bold text-white">{f.title}</h3>
            <p className="mt-1 text-sm text-white/70">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Trails */}
      <section className="container-app py-8">
        <h2 className="mb-4 text-2xl font-extrabold">As trilhas</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {TRAILS.map((t) => {
            const published = t.lessons.filter((l) => l.status === "publicado").length;
            return (
              <div
                key={t.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-white">{t.title}</h3>
                  <span
                    className={
                      published > 0
                        ? "rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-semibold text-mint"
                        : "rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70"
                    }
                  >
                    {published > 0 ? `${published} publicada(s)` : "Em breve"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/70">{t.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Plans */}
      <section className="container-app py-8">
        <h2 className="mb-4 text-2xl font-extrabold">Planos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold text-white">Gratuito</h3>
            <p className="mt-1 text-sm text-white/70">Para começar.</p>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              {[
                "Demonstração sem cadastro",
                "As 3 primeiras lições publicadas da trilha “Como o Brasil funciona”",
                "Revisão dos erros dessas lições",
                "Progresso, XP e sequência diária",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gold/40 bg-white/5 p-6 ring-1 ring-gold/20">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white">Premium</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-ink">
                <Lock className="h-3 w-3" aria-hidden /> R$ 9,90/mês*
              </span>
            </div>
            <p className="mt-1 text-sm text-white/70">Acesso completo.</p>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              {[
                "Todas as lições publicadas",
                "Novas trilhas quando forem lançadas",
                "Revisão dos erros de todo o conteúdo acessível",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-white/55">
              *Preço de teste. Mostramos exatamente o que está incluído antes de
              iniciar qualquer assinatura.
            </p>
          </div>
        </div>
      </section>

      <footer className="container-app border-t border-white/10 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size={28} wordmarkClassName="text-white" />
          <p className="max-w-md text-sm text-white/60">
            Civio ensina política e cidadania com linguagem simples. Não recomenda
            candidato, não dá nota a crenças e não busca convencer você de uma
            ideologia.
          </p>
        </div>
      </footer>
    </div>
  );
}
