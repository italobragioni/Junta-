# Finora — Seu dinheiro sob controle. Seu futuro em movimento.

Finora é um aplicativo de controle financeiro pessoal **completo, moderno e
responsivo** (mobile-first), pronto para evoluir como um SaaS. Reúne contas,
cartões, orçamentos, metas, dívidas, patrimônio, relatórios e um assistente de
IA — tudo com cálculos corretos, persistência real e isolamento de dados por
usuário.

> **Stack:** Next.js 15 (App Router) · React · TypeScript · Tailwind CSS ·
> Supabase (Postgres + Auth) · Recharts · Zod · Vitest.

---

## ✨ O que já está pronto

- **Painel inteligente** — saldo total, receitas/despesas do mês, resultado,
  renda comprometida, patrimônio, cartões e contas a pagar/receber; gráficos de
  evolução do saldo, receitas × despesas e gastos por categoria; resumo em
  linguagem natural e alertas automáticos.
- **Transações** — receitas, despesas, transferências e compras de cartão, com
  filtros, busca, agrupamento por dia e **exportação CSV**.
- **Contas e carteiras** — vários tipos, saldo calculado automaticamente e
  transferências entre contas (que **não** contam como receita/despesa).
- **Cartões de crédito** — limite, melhor dia de compra, **faturas geradas
  automaticamente**, parcelamento (cada parcela cai na fatura certa) e
  pagamento de fatura sem duplicar despesas.
- **Orçamentos** — limite por categoria/mês, com alertas em 50/75/90/100%.
- **Metas** — valor desejado, aportes, barra de progresso e previsão de
  conclusão.
- **Contas a pagar e a receber** — vencimentos, atrasos, recorrência e quitação
  (que gera o lançamento real).
- **Dívidas** — cadastro + **simulador de quitação (bola de neve × avalanche)**
  mostrando tempo, juros e economia.
- **Patrimônio** — ativos e passivos (incluindo contas e dívidas
  automaticamente) com patrimônio líquido.
- **Assinaturas / recorrências** — custo mensal e anual, com geração automática
  de lançamentos.
- **Relatórios** — comparativo mensal, categorias e exportação.
- **Finora IA** — assistente que responde em português **usando apenas seus
  dados reais** (nunca inventa números).
- **Autenticação** completa, **temas claro/escuro**, **onboarding** guiado e
  **configurações** (perfil, categorias, privacidade).

---

## 🚀 Como colocar no ar (passo a passo)

Você **não precisa ser programador**. São 3 partes: criar o banco (Supabase),
configurar as chaves e publicar (Vercel).

### 1) Criar o banco de dados (Supabase) — grátis

1. Acesse <https://supabase.com> e crie uma conta.
2. Clique em **New project**. Dê um nome (ex.: `finora`) e uma senha forte para
   o banco. Escolha a região mais próxima (ex.: São Paulo).
3. Com o projeto criado, vá em **SQL Editor** (menu lateral) → **New query**.
4. Abra o arquivo `supabase/migrations/0001_finora_init.sql` deste projeto,
   **copie todo o conteúdo**, cole no editor e clique em **Run**. Isso cria
   todas as tabelas, a segurança (RLS) e as categorias padrão.
5. Vá em **Project Settings → API** e anote:
   - **Project URL** (ex.: `https://xxxx.supabase.co`)
   - **anon public key**
   - **service_role key** (opcional, mas recomendada)

### 2) Configurar as chaves

Crie um arquivo `.env.local` na raiz (copie de `.env.example`) e preencha:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key   # opcional
```

No painel do Supabase, em **Authentication → URL Configuration**, adicione em
**Redirect URLs**: `http://localhost:3000/auth/callback` (e, depois do deploy, a
URL de produção: `https://seu-site.com/auth/callback`).

### 3) Rodar localmente

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>, crie sua conta e siga o onboarding.

### 4) Publicar na Vercel

1. Suba o projeto para o GitHub.
2. Em <https://vercel.com>, clique em **Add New → Project** e importe o repo.
3. Em **Environment Variables**, adicione as mesmas chaves do `.env.local`
   (troque `NEXT_PUBLIC_SITE_URL` pela URL do seu site).
4. **Deploy**. Depois, volte ao Supabase e adicione a URL de produção nas
   Redirect URLs.

---

## 🤖 Finora IA (opcional)

Sem chave de IA, a Finora IA já responde às perguntas mais comuns (gastos por
categoria, saldo, quanto você economizou, se cabe uma compra) **usando apenas
os seus dados** — sem inventar nada.

Para respostas em linguagem natural mais ricas, configure uma chave:

```bash
FINORA_AI_PROVIDER=anthropic          # ou: openai | gemini
FINORA_AI_API_KEY=sua-chave
FINORA_AI_MODEL=                      # opcional
```

A chave é lida **apenas no servidor** (nunca vai para o navegador).

---

## 💳 Assinatura Premium (Cakto)

O Finora tem um plano **Premium (R$ 29,90/mês)** pronto para vender, com
checkout e ativação automática via **Cakto**. Enquanto não estiver configurado,
tudo fica gratuito e o botão de assinar mostra "em breve".

**Passo a passo:**

1. **Service role key (obrigatória):** no Supabase → **Project Settings → API**,
   copie a **`service_role` key** (secreta!) e adicione na Vercel como
   `SUPABASE_SERVICE_ROLE_KEY`. O webhook precisa dela para ativar o Premium.
2. **Rode a migração** `supabase/migrations/0002_subscriptions.sql` no SQL Editor
   do Supabase (cria a tabela de assinaturas).
3. **Crie o produto na Cakto** (<https://cakto.com.br>): um produto de
   **assinatura mensal de R$ 29,90**. Copie o **link de checkout**
   (ex.: `https://pay.cakto.com.br/xxxxx`).
4. **Crie um Webhook na Cakto** apontando para:
   `https://SEU-DOMINIO/api/webhooks/cakto` (ex.:
   `https://appfinora.online/api/webhooks/cakto`). Marque os eventos de
   **compra aprovada** e de **assinatura** (criada, renovada, cancelada),
   **estorno** e **chargeback**. Copie o **segredo** do webhook.
5. **Configure as variáveis** na Vercel e faça **Redeploy**:
   ```
   FINORA_BILLING_ENABLED=true
   CAKTO_CHECKOUT_URL=https://pay.cakto.com.br/xxxxx
   CAKTO_WEBHOOK_SECRET=o-segredo-do-webhook
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   ```

**Como a ativação funciona:** quando o pagamento é aprovado, a Cakto chama o
webhook; o Finora valida a assinatura (HMAC), identifica o usuário pelo e-mail
do comprador (ou pelo `callback` do link) e ativa o Premium automaticamente.
Cancelamento mantém o acesso até o fim do período pago; estorno/chargeback
revogam na hora.

> **Dica:** o cliente deve pagar com o **mesmo e-mail** que usa no Finora, para
> o casamento automático funcionar. O link de checkout já leva um identificador
> do usuário no parâmetro `callback` como reforço.

**O que o Premium desbloqueia** fica fácil de ajustar: hoje o padrão é liberar a
**Finora IA** (o restante do app é gratuito). É só me dizer o que quer gated.

---

## 🔒 Segurança e privacidade

- **Isolamento por usuário:** toda tabela tem Row Level Security (RLS). Cada
  usuário só acessa as próprias linhas (`auth.uid() = user_id`). As *views* usam
  `security_invoker`, respeitando o RLS de quem consulta. Nenhum usuário —
  nem o navegador — enxerga dados de outro.
- **Validação no servidor** com Zod em todas as ações.
- **Segredos** (service role, chave de IA) nunca usam o prefixo `NEXT_PUBLIC_`.
- Boas práticas da **LGPD**: dados privados, exportáveis pelo próprio usuário.

---

## 🧮 Regras de cálculo (consistência financeira)

- **Dinheiro em centavos inteiros** (`BIGINT`) — zero erro de ponto flutuante.
- **Sem dupla contagem:** transferências entre contas e pagamentos de fatura
  **não** entram como receita/despesa. A compra no cartão é a despesa (pela
  competência); pagar a fatura apenas move o dinheiro da conta para o cartão.
- **Parcelamento exato:** a soma das parcelas é sempre igual ao total (os
  centavos restantes são distribuídos nas primeiras parcelas).
- **Testes automatizados** cobrem o motor financeiro:

```bash
npm test          # roda os testes (Vitest)
npm run typecheck # checagem de tipos
npm run build     # build de produção
```

---

## 🗂️ Estrutura do projeto

```
src/
  app/
    (auth)/            # entrar, criar-conta, recuperar/redefinir senha
    (app)/             # área logada: painel, transacoes, contas, cartoes, ...
    onboarding/        # assistente de primeiro acesso
    api/ia/            # endpoint da Finora IA
  components/
    ui/                # biblioteca de componentes (botões, dialog, inputs, ...)
    app/               # componentes da aplicação (shell, gráficos, formulários)
    brand/             # logo
  lib/
    money.ts           # motor de centavos
    finance/           # cálculos, faturas, dívidas, períodos, painel
    actions/           # server actions (transações, contas, cartões, ...)
    ai/                # contexto + respondedor + provedor da Finora IA
    db/                # tipos, rótulos e queries
    supabase/          # clients (browser, server, admin, middleware)
supabase/migrations/   # schema + RLS + seed
test/                  # testes do motor financeiro
```

---

## 📍 Próximos passos sugeridos

- Anexos de comprovantes (Supabase Storage) e importação de extratos.
- Gestão financeira familiar (compartilhamento com autorização).
- Notificações push de vencimentos.
- Exportação em PDF dos relatórios.

Feito com ❤️ para quem quer organizar a vida financeira de verdade.
