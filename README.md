# Junta+

**Organize seu dinheiro. Corte desperdícios. Alcance seus objetivos.**

Junta+ é um SaaS de organização financeira pessoal que ajuda o usuário a
descobrir para onde o dinheiro está indo, reduzir gastos desnecessários e
juntar dinheiro para objetivos concretos.

> Descubra para onde seu dinheiro está indo e transforme pequenas economias em
> grandes objetivos.

## ✨ Funcionalidades

- **Dashboard** com renda, gastos, disponível, economia (%) e o card
  destaque "Quanto você pode gastar".
- **Receitas e Despesas** com criar/editar/excluir, busca, filtros por
  categoria e período, ordenação e totais.
- **Categorias** de despesa (criadas automaticamente para novos usuários).
- **Metas** com progresso, quanto falta e quanto guardar por mês.
- **Orçamento** mensal por categoria com barra de progresso e alerta ao
  exceder.
- **Assinaturas** com custo mensal/anual e alerta para excesso de assinaturas.
- **Análise financeira**: "Onde estou gastando demais?", alertas inteligentes,
  simulador "Quanto posso juntar?" e ferramenta "Posso comprar?".
- **Assistente financeiro** (camada de IA desacoplada, com _fallback_
  determinístico que funciona sem chave de API).
- **Landing page** comercial + páginas de Termos e Privacidade.
- **Mobile-first** com navegação inferior e botão de ação rápida.

## 🧱 Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma ORM](https://www.prisma.io) + **PostgreSQL** (recomendado: Neon /
  Vercel Postgres)
- [Zod](https://zod.dev) para validação (sempre no servidor)
- Autenticação própria: senha com `bcryptjs` (hash) + sessão JWT (`jose`) em
  cookie `httpOnly` seguro
- [Lucide Icons](https://lucide.dev) e [Recharts](https://recharts.org)
  (quando um gráfico realmente ajuda)

Valores monetários são armazenados como **INTEGER em centavos** para evitar
problemas de ponto flutuante. Foco em **BRL** e Brasil.

## 🔐 Segurança

- Toda consulta é escopada pelo usuário autenticado (`userId`); um usuário
  nunca acessa dados de outro.
- Ações de servidor (Server Actions) e rotas de API validam a sessão.
- Edição/exclusão sempre verificam a posse do registro (`findFirst`/
  `deleteMany` com `userId`).
- Rotas privadas protegidas por middleware.
- Senhas nunca são armazenadas em texto puro.
- Todos os inputs são validados no servidor com Zod.

## 🚀 Começando localmente

### Pré-requisitos

- Node.js 20+ (recomendado 22)
- Um banco PostgreSQL (local ou Neon)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` e defina:

- `DATABASE_URL` — string de conexão PostgreSQL.
- `AUTH_SECRET` — segredo forte (`openssl rand -base64 32`).

### 3. Banco de dados (migrations)

```bash
# cria/atualiza o schema no banco e gera o Prisma Client
npm run db:migrate

# ou, para apenas empurrar o schema (sem histórico de migrations)
npm run db:push
```

Gerar o Prisma Client isoladamente: `npm run db:generate`.

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

## 🧪 Qualidade

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # Testes (Vitest)
npm run build       # Build de produção (roda prisma generate)
```

## ☁️ Deploy na Vercel

1. Crie um banco PostgreSQL. A opção mais simples e estável é o **Neon**
   (disponível no Vercel Marketplace / Vercel Postgres). Use a string de
   conexão **pooled** para o runtime serverless.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente (`DATABASE_URL`, `AUTH_SECRET`, e
   opcionalmente `AI_API_KEY`).
4. As migrations podem ser aplicadas com `npm run db:deploy` (localmente
   apontando para o banco de produção, ou em um passo de CI). O comando de
   build (`prisma generate && next build`) já gera o client.
5. Faça o deploy. Não há necessidade de VPS, Supabase ou Firebase.

## 📁 Estrutura do projeto

```
prisma/
  schema.prisma          # modelos (User, Income, Expense, Category,
                         # FinancialGoal, Budget, Subscription)
src/
  app/
    (auth)/              # login, cadastro, actions de auth
    (app)/               # área autenticada (layout com sidebar + nav mobile)
      dashboard/
      receitas/          # + actions, forms, dialogs
      despesas/
      categorias/
      metas/
      orcamento/
      assinaturas/
      analise/           # overspending, simulador, "posso comprar", assistente
      configuracoes/
    onboarding/
    api/assistant/       # rota da camada de IA
    termos/ privacidade/ # páginas legais públicas
    page.tsx             # landing page
    layout.tsx globals.css
  components/
    ui/                  # Button, Card, Input, Modal, ProgressBar, states...
    financial/           # FinancialCard, AlertCard, CategoryRanking
    app/                 # Sidebar, BottomNav, PageHeader, FAB
    marketing/ brand/
  lib/
    db.ts money.ts dates.ts validation.ts password.ts session.ts auth.ts
    categories.ts finance.ts analysis.ts simulator.ts action-result.ts
    ai/                  # types.ts, fallback.ts, index.ts (desacoplado)
  middleware.ts          # proteção das rotas privadas
```

## 🗺️ Roadmap (preparado, não implementado nesta versão)

- Recuperação de senha por e-mail.
- Importação de CSV / extratos bancários / cartão (arquitetura preparada;
  sem Open Finance nesta versão).
- Integração com um provedor de IA real (basta implementar em `src/lib/ai`).

## ⚠️ Aviso

As simulações e insights são baseados exclusivamente nos dados inseridos pelo
usuário e não constituem aconselhamento financeiro profissional.
