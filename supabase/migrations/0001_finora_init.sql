-- ===========================================================================
-- Finora — schema inicial, Row Level Security, triggers e views.
--
-- Rode com a CLI do Supabase (supabase db push) ou cole no SQL Editor.
-- Esta migração é versionada: nunca a edite após rodar em produção — crie
-- uma nova migração.
--
-- MODELO DE SEGURANÇA
--   * Toda tabela por-usuário tem RLS ligado e só permite ler/alterar as
--     PRÓPRIAS linhas (auth.uid() = user_id).
--   * As views usam security_invoker = true, então RESPEITAM o RLS do usuário
--     que consulta (nunca vazam dados de outro usuário).
--   * Um usuário jamais vê dados financeiros de outro usuário.
--
-- REGRAS DE DINHEIRO
--   * Todo valor monetário é BIGINT em CENTAVOS (nunca float).
--   * amount_cents é sempre >= 0; o EFEITO no saldo é derivado do "kind".
--   * Transferências e pagamentos de fatura NÃO são receita/despesa (evita
--     contagem dupla nos relatórios).
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type account_type as enum (
  'checking', 'savings', 'cash', 'wallet', 'digital', 'investment', 'other'
);
create type transaction_kind as enum (
  'income', 'expense', 'transfer', 'card_expense', 'card_payment'
);
create type category_type as enum ('income', 'expense');
create type payment_method as enum (
  'pix', 'debit', 'credit', 'cash', 'boleto', 'transfer', 'other'
);
create type recurrence as enum ('none', 'daily', 'weekly', 'monthly', 'yearly');
create type tx_status as enum ('pending', 'cleared');
create type bill_kind as enum ('payable', 'receivable');
create type bill_status as enum ('open', 'paid');
create type debt_kind as enum ('loan', 'financing', 'installment', 'card', 'personal');
create type patrimony_kind as enum ('cash', 'property', 'vehicle', 'investment', 'receivable', 'other');
create type theme_pref as enum ('light', 'dark', 'system');

-- ---------------------------------------------------------------------------
-- Helper: updated_at automático
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 com auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  email text,
  theme theme_pref not null default 'system',
  currency text not null default 'BRL',
  timezone text not null default 'America/Sao_Paulo',
  monthly_income_cents bigint not null default 0,
  primary_goal text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create trigger profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Categorias
-- ---------------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type category_type not null,
  color text not null default '#64748b',
  icon text not null default 'tag',
  is_default boolean not null default false,
  sort smallint not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
create index categories_user_idx on categories (user_id, type);
alter table categories enable row level security;
create policy "categories_all_own" on categories for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Contas e carteiras
-- ---------------------------------------------------------------------------
create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type account_type not null default 'checking',
  institution text,
  color text not null default '#6366f1',
  icon text not null default 'wallet',
  opening_balance_cents bigint not null default 0,
  include_in_total boolean not null default true,
  archived boolean not null default false,
  sort smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index accounts_user_idx on accounts (user_id);
alter table accounts enable row level security;
create policy "accounts_all_own" on accounts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger accounts_updated before update on accounts
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Cartões de crédito
-- ---------------------------------------------------------------------------
create table credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  brand text,
  color text not null default '#0ea5e9',
  limit_cents bigint not null default 0 check (limit_cents >= 0),
  closing_day smallint not null default 1 check (closing_day between 1 and 31),
  due_day smallint not null default 10 check (due_day between 1 and 31),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index credit_cards_user_idx on credit_cards (user_id);
alter table credit_cards enable row level security;
create policy "credit_cards_all_own" on credit_cards for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger credit_cards_updated before update on credit_cards
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Regras de recorrência (geram lançamentos) + assinaturas
-- ---------------------------------------------------------------------------
create table recurring_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind transaction_kind not null,
  description text not null,
  amount_cents bigint not null check (amount_cents >= 0),
  category_id uuid references categories (id) on delete set null,
  account_id uuid references accounts (id) on delete set null,
  card_id uuid references credit_cards (id) on delete set null,
  payment_method payment_method,
  frequency recurrence not null default 'monthly',
  day_of_month smallint check (day_of_month between 1 and 31),
  start_date date not null default current_date,
  end_date date,
  next_run date not null default current_date,
  is_subscription boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index recurring_user_idx on recurring_rules (user_id, active);
alter table recurring_rules enable row level security;
create policy "recurring_all_own" on recurring_rules for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger recurring_updated before update on recurring_rules
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Lançamentos (o livro-razão)
-- ---------------------------------------------------------------------------
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind transaction_kind not null,
  description text not null default '',
  amount_cents bigint not null check (amount_cents >= 0),
  category_id uuid references categories (id) on delete set null,
  account_id uuid references accounts (id) on delete set null,
  to_account_id uuid references accounts (id) on delete set null,
  card_id uuid references credit_cards (id) on delete set null,
  payment_method payment_method,
  occurred_on date not null default current_date,
  status tx_status not null default 'cleared',
  notes text,
  attachment_url text,
  installment_group uuid,
  installment_number smallint,
  installment_total smallint,
  invoice_period text, -- 'YYYY-MM' da fatura (para card_expense/card_payment)
  recurring_rule_id uuid references recurring_rules (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Integridade por tipo:
  constraint transfer_needs_two_accounts check (
    kind <> 'transfer' or (account_id is not null and to_account_id is not null
      and account_id <> to_account_id)
  ),
  constraint card_expense_needs_card check (
    kind <> 'card_expense' or card_id is not null
  ),
  constraint card_payment_needs_both check (
    kind <> 'card_payment' or (card_id is not null and account_id is not null)
  )
);
create index tx_user_date_idx on transactions (user_id, occurred_on desc);
create index tx_user_kind_idx on transactions (user_id, kind);
create index tx_account_idx on transactions (account_id);
create index tx_to_account_idx on transactions (to_account_id);
create index tx_card_idx on transactions (card_id);
create index tx_category_idx on transactions (category_id);
create index tx_installment_idx on transactions (installment_group);
alter table transactions enable row level security;
create policy "tx_all_own" on transactions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger tx_updated before update on transactions
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Orçamentos (por categoria por mês)
-- ---------------------------------------------------------------------------
create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references categories (id) on delete cascade,
  month text not null, -- 'YYYY-MM'
  limit_cents bigint not null check (limit_cents >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, category_id, month)
);
create index budgets_user_month_idx on budgets (user_id, month);
alter table budgets enable row level security;
create policy "budgets_all_own" on budgets for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Metas financeiras + aportes
-- ---------------------------------------------------------------------------
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  image_url text,
  color text not null default '#8b5cf6',
  target_cents bigint not null check (target_cents > 0),
  deadline date,
  started_on date not null default current_date,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
create index goals_user_idx on goals (user_id);
alter table goals enable row level security;
create policy "goals_all_own" on goals for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table goal_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal_id uuid not null references goals (id) on delete cascade,
  amount_cents bigint not null check (amount_cents <> 0),
  contributed_on date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);
create index goal_contrib_idx on goal_contributions (goal_id);
alter table goal_contributions enable row level security;
create policy "goal_contrib_all_own" on goal_contributions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Contas a pagar e a receber
-- ---------------------------------------------------------------------------
create table bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind bill_kind not null,
  description text not null,
  amount_cents bigint not null check (amount_cents >= 0),
  due_date date not null,
  category_id uuid references categories (id) on delete set null,
  account_id uuid references accounts (id) on delete set null,
  frequency recurrence not null default 'none',
  status bill_status not null default 'open',
  paid_on date,
  transaction_id uuid references transactions (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bills_user_due_idx on bills (user_id, due_date);
alter table bills enable row level security;
create policy "bills_all_own" on bills for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger bills_updated before update on bills
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Dívidas + pagamentos
-- ---------------------------------------------------------------------------
create table debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  kind debt_kind not null default 'loan',
  creditor text,
  principal_cents bigint not null check (principal_cents >= 0),
  balance_cents bigint not null check (balance_cents >= 0),
  interest_rate numeric(7,4) not null default 0, -- % ao mês
  installments_total smallint,
  installment_cents bigint,
  next_due date,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index debts_user_idx on debts (user_id);
alter table debts enable row level security;
create policy "debts_all_own" on debts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger debts_updated before update on debts
  for each row execute function set_updated_at();

create table debt_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  debt_id uuid not null references debts (id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  principal_part_cents bigint not null default 0,
  interest_part_cents bigint not null default 0,
  paid_on date not null default current_date,
  created_at timestamptz not null default now()
);
create index debt_payments_idx on debt_payments (debt_id);
alter table debt_payments enable row level security;
create policy "debt_payments_all_own" on debt_payments for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Patrimônio (ativos manuais e passivos manuais)
-- ---------------------------------------------------------------------------
create table patrimony_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  kind patrimony_kind not null default 'other',
  value_cents bigint not null default 0,
  is_liability boolean not null default false,
  acquired_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index patrimony_user_idx on patrimony_items (user_id);
alter table patrimony_items enable row level security;
create policy "patrimony_all_own" on patrimony_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger patrimony_updated before update on patrimony_items
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Central de atividades (histórico de alterações)
-- ---------------------------------------------------------------------------
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity text not null,
  action text not null,
  summary text not null,
  amount_cents bigint,
  created_at timestamptz not null default now()
);
create index activity_user_idx on activity_log (user_id, created_at desc);
alter table activity_log enable row level security;
create policy "activity_all_own" on activity_log for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===========================================================================
-- VIEWS derivadas (security_invoker: respeitam o RLS do consultante)
-- ===========================================================================

-- Saldo atual de cada conta = abertura + entradas - saídas (apenas 'cleared').
create view account_balances
with (security_invoker = true) as
select
  a.id as account_id,
  a.user_id,
  a.opening_balance_cents
    + coalesce((select sum(t.amount_cents) from transactions t
        where t.account_id = a.id and t.status = 'cleared'
          and t.kind = 'income'), 0)
    - coalesce((select sum(t.amount_cents) from transactions t
        where t.account_id = a.id and t.status = 'cleared'
          and t.kind in ('expense','transfer','card_payment')), 0)
    + coalesce((select sum(t.amount_cents) from transactions t
        where t.to_account_id = a.id and t.status = 'cleared'
          and t.kind = 'transfer'), 0)
    as balance_cents
from accounts a;

-- Saldo devedor e limite disponível de cada cartão.
-- Dívida = compras no cartão (card_expense) - pagamentos (card_payment).
create view card_balances
with (security_invoker = true) as
select
  c.id as card_id,
  c.user_id,
  c.limit_cents,
  coalesce((select sum(t.amount_cents) from transactions t
      where t.card_id = c.id and t.kind = 'card_expense'), 0)
    - coalesce((select sum(t.amount_cents) from transactions t
      where t.card_id = c.id and t.kind = 'card_payment'), 0)
    as used_cents
from credit_cards c;

-- Saldo acumulado por meta.
create view goal_progress
with (security_invoker = true) as
select
  g.id as goal_id,
  g.user_id,
  g.target_cents,
  coalesce((select sum(gc.amount_cents) from goal_contributions gc
      where gc.goal_id = g.id), 0) as saved_cents
from goals g;

-- ===========================================================================
-- Trigger: cria perfil + categorias padrão para todo novo usuário.
-- ===========================================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', ''),
    new.email
  ) on conflict (id) do nothing;

  -- Categorias de despesa padrão
  insert into public.categories (user_id, name, type, color, icon, is_default, sort)
  values
    (new.id, 'Alimentação',       'expense', '#f97316', 'utensils',      true, 1),
    (new.id, 'Moradia',           'expense', '#6366f1', 'home',          true, 2),
    (new.id, 'Transporte',        'expense', '#0ea5e9', 'car',           true, 3),
    (new.id, 'Saúde',             'expense', '#ef4444', 'heart-pulse',   true, 4),
    (new.id, 'Educação',          'expense', '#8b5cf6', 'graduation-cap',true, 5),
    (new.id, 'Lazer',             'expense', '#ec4899', 'party-popper',  true, 6),
    (new.id, 'Compras',           'expense', '#14b8a6', 'shopping-bag',  true, 7),
    (new.id, 'Assinaturas',       'expense', '#a855f7', 'repeat',        true, 8),
    (new.id, 'Contas domésticas', 'expense', '#eab308', 'receipt',       true, 9),
    (new.id, 'Pets',              'expense', '#84cc16', 'paw-print',     true, 10),
    (new.id, 'Impostos',          'expense', '#64748b', 'landmark',      true, 11),
    (new.id, 'Viagens',           'expense', '#06b6d4', 'plane',         true, 12),
    (new.id, 'Outros',            'expense', '#94a3b8', 'ellipsis',      true, 13);

  -- Categorias de receita padrão
  insert into public.categories (user_id, name, type, color, icon, is_default, sort)
  values
    (new.id, 'Salário',    'income', '#10b981', 'briefcase',  true, 1),
    (new.id, 'Freelance',  'income', '#22c55e', 'laptop',     true, 2),
    (new.id, 'Vendas',     'income', '#84cc16', 'tag',        true, 3),
    (new.id, 'Comissões',  'income', '#14b8a6', 'percent',    true, 4),
    (new.id, 'Rendimentos','income', '#06b6d4', 'trending-up',true, 5),
    (new.id, 'Aluguéis',   'income', '#0ea5e9', 'building',   true, 6),
    (new.id, 'Benefícios', 'income', '#6366f1', 'gift',       true, 7),
    (new.id, 'Outras',     'income', '#94a3b8', 'ellipsis',   true, 8);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
