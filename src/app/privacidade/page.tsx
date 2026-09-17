import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/marketing/public-header";

export const metadata: Metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="container-app flex-1 py-12">
        <article className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight">
            Política de Privacidade
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última atualização: modelo inicial
          </p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="mb-2 text-lg font-semibold">
                1. Dados que coletamos
              </h2>
              <p>
                Coletamos os dados que você fornece: nome, e-mail e as
                informações financeiras que você registra (receitas, despesas,
                metas, orçamentos e assinaturas).
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold">2. Como usamos</h2>
              <p>
                Seus dados são usados exclusivamente para fornecer as
                funcionalidades do Junta+ — como cálculos de economia, alertas e
                simulações. Não vendemos seus dados.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold">3. Segurança</h2>
              <p>
                Sua senha é armazenada com hash seguro e nunca em texto puro.
                Cada usuário acessa somente os próprios dados, e todas as
                operações são validadas no servidor.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold">
                4. Isolamento de dados
              </h2>
              <p>
                Todo dado financeiro pertence à conta autenticada que o criou.
                Um usuário nunca tem acesso aos dados de outro usuário.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold">5. Seus direitos</h2>
              <p>
                Você pode editar ou excluir seus dados a qualquer momento dentro
                do aplicativo.
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
