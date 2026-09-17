import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/marketing/public-header";

export const metadata: Metadata = { title: "Termos de Uso" };

export default function TermosPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="container-app flex-1 py-12">
        <article className="prose-app mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight">Termos de Uso</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última atualização: modelo inicial
          </p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="mb-2 text-lg font-semibold">1. Sobre o serviço</h2>
              <p>
                O Junta+ é uma ferramenta de organização financeira pessoal que
                ajuda você a registrar receitas e despesas, criar metas e
                simular economias. Todas as análises são baseadas exclusivamente
                nos dados que você insere.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold">
                2. Não é aconselhamento financeiro
              </h2>
              <p>
                As simulações e insights são informativos e não constituem
                aconselhamento financeiro, contábil ou de investimento
                profissional. Decisões financeiras são de sua responsabilidade.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold">3. Sua conta</h2>
              <p>
                Você é responsável por manter a confidencialidade das suas
                credenciais de acesso e por todas as atividades realizadas na
                sua conta.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold">4. Uso adequado</h2>
              <p>
                Você concorda em utilizar o serviço apenas para fins lícitos e
                de acordo com estes termos.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold">5. Alterações</h2>
              <p>
                Estes termos podem ser atualizados. Continuar usando o serviço
                após alterações significa concordância com a versão vigente.
              </p>
            </section>
          </div>

          <p className="mt-10 text-sm">
            <Link href="/" className="text-brand-600 hover:underline">
              ← Voltar para o início
            </Link>
          </p>
        </article>
      </main>
    </div>
  );
}
