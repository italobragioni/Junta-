-- ===========================================================================
-- Finora — Assinaturas (Premium) via Cakto.
--
-- Rode no SQL Editor do Supabase DEPOIS da migração 0001.
--
-- Segurança:
--   * O usuário só LÊ a própria assinatura (RLS). Ele NUNCA escreve — quem
--     escreve é o webhook da Cakto, usando a service-role key (ignora o RLS).
--   * billing_events registra cada evento recebido (idempotência + auditoria)
--     e não é legível por usuários.
-- ===========================================================================

create type subscription_status as enum ('free', 'active', 'past_due', 'canceled');

create table subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  status subscription_status not null default 'free',
  plan text not null default 'free', -- 'free' | 'premium'
  cakto_order_id text,
  cakto_subscription_id text,
  cakto_customer_email text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

-- O usuário lê apenas a própria assinatura. Sem política de INSERT/UPDATE/DELETE:
-- usuários não conseguem alterar o status (só a service-role do webhook).
create policy "subscriptions_select_own" on subscriptions
  for select using (auth.uid() = user_id);

create trigger subscriptions_updated before update on subscriptions
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Log de eventos de cobrança (idempotência + auditoria). Sem políticas RLS:
-- inacessível a usuários; apenas a service-role escreve/lê.
-- ---------------------------------------------------------------------------
create table billing_events (
  id text primary key,            -- id do pedido/evento da Cakto (dedup)
  event text not null,
  user_id uuid references auth.users (id) on delete set null,
  customer_email text,
  raw jsonb,
  created_at timestamptz not null default now()
);

alter table billing_events enable row level security;
