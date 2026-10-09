# Civio — educação política em 5 minutos por dia

> **Nome provisório.** Não foi verificada a disponibilidade de marca, domínio
> ou perfis. O logotipo é tipográfico e fácil de substituir
> (`src/components/brand/logo.tsx`, `public/icon.svg`).

Civio é um micro SaaS de **educação política brasileira**: lições curtas,
exercícios com feedback e explicação, e progressão gamificada. Ensina como o
Brasil funciona e como avaliar informações — **sem recomendar candidato, sem
dar nota a crenças e sem empurrar ideologia**. Pensado para o celular.

- Mensagem principal: **"Entenda política em 5 minutos por dia."**
- Preço de teste do Premium: **R$ 19,90/mês** (hipótese de negócio, não previsão
  de vendas).

---

## 1. Stack

- [Next.js 15](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) — PostgreSQL, autenticação e RLS, via
  `@supabase/ssr` (padrão atual recomendado)
- [Zod](https://zod.dev) para validação (sempre no servidor)
- [Vitest](https://vitest.dev) para testes
- Hospedagem compatível com Vercel; manifesto PWA para "adicionar à tela inicial"

Versões registradas em `package.json`. **Consulte novamente a documentação
oficial atual** (Supabase Auth, Vercel, Cakto) antes de ir para produção — esta
implementação foi escrita com base em consulta de 09/10/2026.

### Modos de operação

- **Configurado:** com as chaves do Supabase, auth e banco reais funcionam.
- **Demonstração:** sem chaves, o app ainda sobe e mostra a landing e a lição
  de demonstração (isolada e identificada). O modo demo **não** substitui o
  banco de produção e não guarda nada.

---

## 2. Rodar localmente

Pré-requisitos: Node 20+ (recomendado 22).

```bash
npm install
cp .env.example .env.local   # preencha depois de criar o projeto no Supabase
npm run dev                  # http://localhost:3000
```

Scripts: `npm run dev`, `build`, `start`, `lint`, `typecheck`, `test`.

Sem `.env.local`, você ainda consegue ver `/` e `/demonstracao`.

---

## 3. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings → API**, copie para o `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (**segredo**, só no servidor)
3. Rode a migração (cria tabelas, RLS e funções):
   - Via CLI: `supabase db push` (precisa do
     [CLI do Supabase](https://supabase.com/docs)), **ou**
   - Cole o conteúdo de `supabase/migrations/0001_init.sql` no **SQL Editor** do
     painel e execute.
4. Em **Authentication → URL Configuration**, configure o *Site URL* e os
   *Redirect URLs* para incluir `https://SEU_DOMINIO/auth/callback` (e o
   `http://localhost:3000/auth/callback` em dev).
5. Decida se quer **confirmação de e-mail** ligada (Authentication → Providers →
   Email). O fluxo de cadastro já trata os dois casos.

### Autenticação

Usamos as bibliotecas atuais recomendadas pelo Supabase (`@supabase/ssr`):
sessão em cookie, atualizada pelo middleware. O cliente de **service role**
(`src/lib/supabase/admin.ts`) ignora o RLS e é usado **somente** em código de
servidor confiável (correção de respostas, XP, webhooks, operações de admin).

---

## 4. Criar o primeiro administrador (com segurança)

O papel de admin **nunca** é escolhido no cadastro nem editável pelo usuário
pela aplicação (um gatilho no banco preserva a coluna `role` em chamadas das
roles públicas `authenticated`/`anon`, e os privilégios de UPDATE do usuário
não incluem `role`). Conexões privilegiadas — o **SQL Editor** (role `postgres`)
e o service role — podem alterar o papel. Para promover alguém:

1. A pessoa cria uma conta normalmente no app.
2. No **SQL Editor** do Supabase, rode (troque o e-mail):

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'voce@exemplo.com');
   ```

3. Faça login e acesse **/admin**.

> **Importante:** aplique as migrações **0001 e 0002**. A 0002 corrige o
> gatilho para que a promoção acima funcione pelo SQL Editor. Se você já rodou
> só a 0001, o `update` acima é revertido silenciosamente pelo gatilho — rode a
> 0002 (um `create or replace function`, seguro de reexecutar) e tente de novo,
> ou contorne uma vez com:
>
> ```sql
> alter table public.profiles disable trigger profiles_lock_privileged;
> update public.profiles p set role = 'admin'
> from auth.users u where u.id = p.id and u.email = 'voce@exemplo.com';
> alter table public.profiles enable trigger profiles_lock_privileged;
> ```

Depois de configurar o banco, abra `/admin` e clique em **Sincronizar
conteúdo** uma vez: isso carrega trilhas, lições, questões, gabaritos e fontes
no banco (idempotente; não apaga dados de usuários).

---

## 5. Configurar o checkout e o webhook (Cakto) — PENDENTE

A arquitetura de assinatura está pronta e **desativada por padrão**. O que
**falta** (porque a especificação proíbe inventar endpoints, eventos, assinatura
de webhook e campos de vinculação) está marcado com `TODO(cakto)` em
`src/lib/billing/cakto.ts` e precisa ser implementado a partir da documentação
oficial atual:

- https://www.cakto.com.br/assinaturas
- https://ajuda.cakto.com.br/pt-br/articles/103-como-utilizar-a-api-da-cakto-para-integracoes-personalizadas

Itens a confirmar na documentação e implementar:

- Como anexar uma **referência opaca** (nosso `intentId`) ao checkout hospedado.
- O **esquema de assinatura do webhook** (cabeçalho + segredo) em
  `verifyWebhook` — hoje retorna `false` (nega tudo) de propósito.
- O **mapa payload → evento normalizado** em `parseWebhookEvent`.
- As **semânticas** de renovação, falha, cancelamento, reembolso e chargeback.

Enquanto isso:

- `CIVIO_BILLING_ENABLED` fica `false`; não há botão público de "virar Premium".
- A página `/assinar` mostra claramente que a cobrança não está ativa.
- O webhook (`/api/webhooks/cakto`) responde 404 quando desativado e **nega**
  enquanto a verificação de assinatura não estiver implementada.

Quando a integração estiver pronta e verificada, defina no ambiente:

```
CIVIO_BILLING_ENABLED=true
CAKTO_WEBHOOK_SECRET=...
CAKTO_CHECKOUT_BASE_URL=...
CAKTO_PREMIUM_PRODUCT_IDS=prod_xxx,prod_yyy
```

O **pipeline de processamento** (idempotência por evento, allowlist de produto,
vinculação à conta via intenção de compra, segurança contra eventos fora de
ordem, cancelamento preservando acesso pago, não reativar acesso estornado) já
está implementado em `src/lib/billing/process.ts` e **coberto por testes** com
fixtures identificadas (`src/lib/billing/process.test.ts`). O **teste real
contra a Cakto está pendente** da configuração acima.

> Nunca deixe um botão público "virar Premium" em produção. Simulações só em
> desenvolvimento.

---

## 6. Hospedagem (Vercel) e custos

- Conecte o repositório na Vercel e configure as variáveis de ambiente
  (seção 1 e `.env.example`).
- **O plano Hobby da Vercel é para uso pessoal não comercial.** Para **vender**
  o SaaS, use um plano compatível (ex.: Pro) ou outra hospedagem. Não há
  promessa de operação gratuita ilimitada.
- Custos externos a conferir pelo proprietário: plano do Supabase (banco,
  auth e armazenamento), hospedagem, domínio e as taxas da Cakto. **Criar código
  não cria automaticamente contas externas, domínio, banco ou oferta de
  assinatura.**

### Adicionar à tela inicial (PWA)

Há `manifest.webmanifest` e ícone (`public/icon.svg`).

- **Android (Chrome):** menu ⋮ → "Adicionar à tela inicial".
- **iPhone (Safari):** botão Compartilhar → "Adicionar à Tela de Início".

Não prometemos instalação automática em todos os aparelhos. A primeira versão
**exige conexão** para login, respostas e progresso — não há modo offline. Para
melhor suporte de ícone no iOS, é possível adicionar PNGs (192/512) depois;
hoje usamos SVG.

---

## 7. Modelo de segurança

- **RLS** ativado em todas as tabelas; cada usuário só acessa os próprios dados.
- Tabelas sensíveis (XP, sequência, conclusões, assinaturas) são **somente
  leitura** para o usuário; apenas o código de servidor confiável escreve.
- **`answer_keys`** tem RLS sem política: o navegador nunca lê o gabarito. A
  correção é no servidor e a explicação só aparece **após** registrar a
  tentativa.
- **Conteúdo Premium** é bloqueado no banco (`can_access_lesson`), não só na
  interface — não dá para puxar questão Premium com a chave anônima.
- O papel de **admin** é concedido fora do fluxo público (seção 4) e revalidado
  no servidor em toda rota/ação de admin.
- Segredos só no servidor (sem prefixo público). Logs não guardam tokens,
  senhas nem payloads de pagamento completos.
- Coletamos o mínimo: não pedimos partido, voto nem crença política.

---

## 8. Conteúdo e revisão editorial

- **Trilha A — "Como o Brasil funciona"**: lições **A1–A3 publicadas**
  (ancoradas em fatos constitucionais estáveis — CF/88 arts. 1º, 2º e 18 — com
  a fonte oficial do Planalto). As demais 17 lições (A4–A5, B, C, D) entram como
  **rascunhos completos**, não exibidos ao aluno até um administrador verificar
  as fontes e publicar.
- Cada lição/questão registra: objetivo, texto em português simples, fonte
  consultada (URL + título), data da consulta, trecho relevante, natureza
  (fato institucional / conceito interpretativo / dado datado) e status
  editorial.
- **Verificação de fontes — pendência honesta:** o ambiente de desenvolvimento
  bloqueou o acesso direto a algumas páginas `.gov.br`. As URLs citadas são as
  oficiais canônicas (confirmadas por busca), mas a **verificação final na
  página ao vivo e a aprovação editorial são responsabilidade do proprietário**
  antes de usar em produção. A especificação já exige essa aprovação explícita.
- Fontes das lições em rascunho que dependem de referências acadêmicas (trilha
  B) ou de dados datados (trilha C) estão marcadas com "RASCUNHO" no texto e
  devem ser completadas em revisão. **Rascunhos não aparecem como conteúdo
  publicado.**
- O aluno pode **"Reportar problema nesta lição"**; os relatos aparecem em
  `/admin/relatos`.
- Mudanças editoriais guardam versão. Uma sessão já iniciada fica **vinculada à
  versão** da lição em que começou (`lesson_sessions.lesson_version`).

### O que pode ser feito pelo celular

Tudo o que é operação cotidiana: a interface do aluno (aprender, revisar,
perfil), e o **painel administrativo** (`/admin`): ver métricas, sincronizar
conteúdo, mudar status editorial (rascunho → em revisão → publicado →
arquivado) com validação, pré-visualizar uma lição como aluno e resolver
relatos de erro. As configurações de Supabase/Cakto e a promoção do primeiro
admin exigem o painel do provedor (SQL) uma única vez.

### Como desativar a venda, arquivar uma lição, corrigir erro

- **Desativar a venda:** `CIVIO_BILLING_ENABLED=false` (ou remova os segredos da
  Cakto). O webhook passa a negar e o botão de assinatura some.
- **Arquivar uma lição:** `/admin/conteudo` → botão **Arquivar**. Ela deixa de
  ser exibida; o progresso dos usuários é preservado.
- **Corrigir um erro de conteúdo:** edite o texto em
  `src/lib/content/trails/*.ts`, suba o `version` da lição, rode **Sincronizar
  conteúdo** no admin. Sessões em andamento continuam na versão antiga.

---

## 9. Regras de gamificação (resumo)

- Primeira conclusão de uma lição: **20 XP** + **2 XP** por acerto de primeira
  tentativa naquela conclusão.
- Concluir exige responder as 5 questões **e revisar os erros** (acertar depois).
- Repetir lição não paga de novo a recompensa de primeira conclusão; a revisão
  também não duplica XP (idempotência por `xp_events.dedupe_key` e por
  `lesson_completions`).
- Nível = `1 + parte inteira do XP / 100`.
- Sequência diária conta por **atividade real** (lição ou revisão com questões),
  nunca por login; calculada no fuso do perfil (padrão America/Sao_Paulo);
  várias no mesmo dia contam uma vez; preserva a melhor sequência; trocar o fuso
  só afeta dias futuros.
- Conquistas: primeira lição, 3 dias seguidos, 7 dias seguidos, primeira trilha.
- Sem vidas e sem punição por erro. Recompensas dependem de eventos verificáveis
  no servidor, com proteção contra toque duplo/reenvio/abas simultâneas.

---

## 10. Testes realizados

`npm run test` (Vitest) cobre a lógica pura dos critérios de aceitação:

- Cálculo de XP, níveis e recompensa de primeira conclusão (`xp.test.ts`).
- Sequência diária: mesmo dia, dia seguinte, após intervalo, fuso e anti-retrocesso
  (`streak.test.ts`).
- Correção e regra de conclusão (5 respondidas + erros revisados), contagem de
  acertos de primeira e conjunto de revisão (`grading.test.ts`).
- Gating de plano: Premium sem direito ativo é bloqueado; plano vs pré-requisito
  distintos; cancelamento preserva acesso pago; estorno revoga (`access.test.ts`).
- Webhook: evento duplicado não reprocessa; produto fora da allowlist é rejeitado;
  evento fora de ordem é ignorado; estorno/chargeback revoga; renovação não
  reativa acesso estornado; cancelamento preserva período pago (`process.test.ts`).
- Versão pinada de uma sessão não muda ao editar o conteúdo (`version.test.ts`).

`npm run typecheck`, `npm run lint` e `npm run build` passam.

**Pendências de teste (honestas):**

- Integração real com a Cakto (ver seção 5) — só com documentação e credenciais.
- Execução das migrações contra um Supabase real e os testes fim-a-fim
  (cadastro → lição → erro → revisão → conclusão → persistência após novo login;
  toque duplo; 360px) dependem de um projeto Supabase provisionado pelo
  proprietário. O código foi escrito para esses fluxos; a verificação no banco
  real é o próximo passo após a seção 3.

---

## 11. Entregáveis neste repositório

- Código do app (Next.js), componentes e lógica de servidor.
- `supabase/migrations/0001_init.sql` (schema + RLS + funções).
- Conteúdo editorial como fonte única em `src/lib/content/` (20 lições, 100
  questões), sincronizável para o banco pelo admin.
- `.env.example` sem segredos; rotas de pagamento bloqueadas quando não
  configuradas.
- Testes (Vitest).

---

## 12. Entrega por etapas

- **Etapa 1 (experiência):** identidade, landing, demonstração sem cadastro,
  mapa de trilhas e motor de lições. ✅ Executável e verificável no celular.
- **Etapa 2 (produto):** auth, banco persistente, RLS/autorização, progressão,
  revisão, fontes, painel e migrações. ✅ Implementada; falta rodar as migrações
  num Supabase real (seção 3) e a verificação fim-a-fim no banco.
- **Etapa 3 (monetização):** planos gratuito/Premium e adaptador de cobrança.
  ✅ Arquitetura e pipeline prontos e testados; **integração real com a Cakto
  pendente** de documentação/credenciais (seção 5). Nada é declarado "pronto"
  sendo apenas mock.
