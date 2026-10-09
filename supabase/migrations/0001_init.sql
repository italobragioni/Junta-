-- Civio — initial schema, Row Level Security and helper functions.
--
-- Run with the Supabase CLI (supabase db push) or paste into the SQL editor.
-- This migration is versioned; never edit it after it has run in production —
-- add a new migration file instead.
--
-- Security model (see README):
--   * Every per-user table has RLS enabled and only lets a user read/affect
--     their OWN rows (auth.uid()).
--   * Sensitive progress tables (xp, streak, completions, subscriptions) are
--     READ-ONLY to users; only trusted server code (service role, which
--     bypasses RLS) writes them. This is why the browser can never fake XP or
--     a subscription.
--   * answer_keys has RLS enabled with NO policy, so it is unreadable by anon
--     and authenticated users. Grading happens server-side.
--   * Published content is world-readable, but PREMIUM lesson content is gated
--     at the database via can_access_lesson(), so premium questions cannot be
--     pulled with the anon key.
--   * The admin role is never user-settable (a trigger preserves it; users
--     also cannot update privileged columns).

-- ---------------------------------------------------------------------------
-- Extensions & enums
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

create type plan as enum ('free', 'premium');
create type editorial_status as enum ('rascunho', 'em_revisao', 'publicado', 'arquivado');
create type source_nature as enum ('fato_institucional', 'conceito_interpretativo', 'dado_datado');
create type question_kind as enum ('multipla_escolha', 'verdadeiro_falso');
create type user_role as enum ('learner', 'admin');

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  timezone text not null default 'America/Sao_Paulo',
  daily_goal smallint not null default 1 check (daily_goal in (1, 2)),
  role user_role not null default 'learner',
  reduce_motion boolean not null default false,
  sound_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create a profile automatically for every new auth user.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  insert into public.subscriptions (user_id) values (new.id)
  on conflict (user_id) do nothing;
  insert into public.user_stats (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Prevent users from granting themselves admin or editing privileged columns.
create or replace function lock_privileged_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() is distinct from 'service_role' then
    new.role := old.role;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_lock_privileged
  before update on profiles
  for each row execute function lock_privileged_profile_columns();

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------
create table learning_paths (
  id text primary key,
  slug text unique not null,
  "order" smallint not null,
  title text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table lessons (
  id text primary key,
  path_id text not null references learning_paths (id) on delete cascade,
  slug text not null,
  "order" smallint not null,
  title text not null,
  objective text not null,
  plan plan not null default 'free',
  status editorial_status not null default 'rascunho',
  version integer not null default 1,
  revised_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sources (
  id text primary key,
  title text not null,
  url text not null,
  consulted_at date not null,
  excerpt text not null,
  nature source_nature not null
);

create table lesson_sources (
  lesson_id text not null references lessons (id) on delete cascade,
  source_id text not null references sources (id) on delete cascade,
  primary key (lesson_id, source_id)
);

-- Editorial snapshot of a lesson's teaching content at a given version.
create table lesson_versions (
  id uuid primary key default gen_random_uuid (),
  lesson_id text not null references lessons (id) on delete cascade,
  version integer not null,
  title text not null,
  objective text not null,
  teaching jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (lesson_id, version)
);

-- Editorial snapshot of a question (text only, no answer key).
create table question_versions (
  id uuid primary key default gen_random_uuid (),
  lesson_id text not null references lessons (id) on delete cascade,
  lesson_version integer not null,
  question_id text not null,
  kind question_kind not null,
  objective text not null,
  prompt text not null,
  explanation text not null,
  source_ids text[] not null default '{}',
  "order" smallint not null,
  unique (lesson_id, lesson_version, question_id)
);

create table question_options (
  id uuid primary key default gen_random_uuid (),
  question_version_id uuid not null references question_versions (id) on delete cascade,
  option_id text not null,
  text text not null,
  "order" smallint not null,
  unique (question_version_id, option_id)
);

-- SERVER-ONLY: the answer key. RLS enabled, no policy -> unreadable to users.
create table answer_keys (
  question_version_id uuid primary key references question_versions (id) on delete cascade,
  correct_option_id text not null
);

-- ---------------------------------------------------------------------------
-- Learning progress
-- ---------------------------------------------------------------------------
create table lesson_sessions (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null references lessons (id) on delete cascade,
  -- A started session is pinned to the lesson version it began on, so later
  -- edits never change a session in progress.
  lesson_version integer not null,
  status text not null default 'em_andamento'
    check (status in ('em_andamento', 'concluida', 'abandonada')),
  is_review boolean not null default false,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table responses (
  id uuid primary key default gen_random_uuid (),
  session_id uuid not null references lesson_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  question_id text not null,
  selected_option_id text not null,
  correct boolean not null,
  attempt smallint not null,
  is_first_attempt boolean not null,
  answered_at timestamptz not null default now()
);
create index responses_session_idx on responses (session_id);
create index responses_user_lesson_idx on responses (user_id, lesson_id);

-- One first-completion per user per lesson (idempotency anchor for the reward).
create table lesson_completions (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null references lessons (id) on delete cascade,
  first_completed_at timestamptz not null default now(),
  xp_awarded integer not null default 0,
  first_try_correct smallint not null default 0,
  primary key (user_id, lesson_id)
);

create table review_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null references lessons (id) on delete cascade,
  question_id text not null,
  wrong_count integer not null default 1,
  reviewed boolean not null default false,
  last_seen_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

-- XP ledger. dedupe_key makes each award idempotent (double-tap safe).
create table xp_events (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  amount integer not null,
  dedupe_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, dedupe_key)
);

create table activity_days (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  primary key (user_id, day)
);

-- Denormalized per-user stats, maintained by trusted server code.
create table user_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  total_xp integer not null default 0,
  current_streak integer not null default 0,
  best_streak integer not null default 0,
  last_active_day date
);

create table achievements (
  code text primary key,
  title text not null,
  description text not null
);

create table user_achievements (
  user_id uuid not null references auth.users (id) on delete cascade,
  code text not null references achievements (code) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, code)
);

-- ---------------------------------------------------------------------------
-- Billing
-- ---------------------------------------------------------------------------
create table purchase_intents (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan plan not null default 'premium',
  product_id text,
  status text not null default 'criada'
    check (status in ('criada', 'em_confirmacao', 'confirmada', 'cancelada')),
  created_at timestamptz not null default now()
);

create table subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  access_until timestamptz,
  revoked boolean not null default false,
  last_event_at timestamptz,
  updated_at timestamptz not null default now()
);

-- Webhook ledger. provider_event_id unique -> each event processed once.
create table payment_events (
  id uuid primary key default gen_random_uuid (),
  provider_event_id text unique not null,
  user_id uuid references auth.users (id) on delete set null,
  intent_id uuid references purchase_intents (id) on delete set null,
  type text not null,
  product_id text,
  -- Redacted payload only: never store full payment data or secrets.
  summary jsonb not null default '{}'::jsonb,
  processed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Reports & audit
-- ---------------------------------------------------------------------------
create table content_reports (
  id uuid primary key default gen_random_uuid (),
  user_id uuid references auth.users (id) on delete set null,
  lesson_id text not null references lessons (id) on delete cascade,
  question_id text,
  message text not null,
  status text not null default 'aberto' check (status in ('aberto', 'resolvido')),
  created_at timestamptz not null default now()
);

create table administrative_audit_log (
  id uuid primary key default gen_random_uuid (),
  admin_id uuid references auth.users (id) on delete set null,
  action text not null,
  target text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

-- Is the caller an admin? (Used by admin RLS policies.)
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Effective plan of the current user, derived only from subscription state.
create or replace function current_effective_plan()
returns plan
language sql
stable
security definer
set search_path = public
as $$
  select case
    when s.user_id is null then 'free'::plan
    when s.revoked then 'free'::plan
    when s.access_until is null then 'free'::plan
    when s.access_until >= now() then 'premium'::plan
    else 'free'::plan
  end
  from (select auth.uid() as uid) u
  left join public.subscriptions s on s.user_id = u.uid;
$$;

-- Can the current user read a given lesson's content? Published + (free or
-- premium entitlement). Admins can read everything.
create or replace function can_access_lesson(p_lesson_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    is_admin()
    or exists (
      select 1 from public.lessons l
      where l.id = p_lesson_id
        and l.status = 'publicado'
        and (l.plan = 'free' or current_effective_plan() = 'premium')
    );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

-- Profiles: read/update own row only (role locked by trigger above).
alter table profiles enable row level security;
create policy profiles_select_own on profiles for select using (id = auth.uid());
create policy profiles_update_own on profiles for update using (id = auth.uid());
create policy profiles_admin_read on profiles for select using (is_admin());

-- Content catalog: paths and sources are world-readable (public metadata).
alter table learning_paths enable row level security;
create policy paths_read on learning_paths for select using (true);

alter table sources enable row level security;
create policy sources_read on sources for select using (true);

alter table lesson_sources enable row level security;
create policy lesson_sources_read on lesson_sources for select using (true);

-- Lessons: a row is visible if published (catalog needs titles/plan to show
-- locks) or the caller is an admin. Premium CONTENT is gated separately below.
alter table lessons enable row level security;
create policy lessons_read_published on lessons
  for select using (status = 'publicado' or is_admin());

-- Teaching content and questions: only if the user can access the lesson.
alter table lesson_versions enable row level security;
create policy lesson_versions_read on lesson_versions
  for select using (can_access_lesson(lesson_id));

alter table question_versions enable row level security;
create policy question_versions_read on question_versions
  for select using (can_access_lesson(lesson_id));

alter table question_options enable row level security;
create policy question_options_read on question_options
  for select using (
    exists (
      select 1 from question_versions qv
      where qv.id = question_options.question_version_id
        and can_access_lesson(qv.lesson_id)
    )
  );

-- answer_keys: RLS on, NO policy. Unreadable to anon/authenticated.
alter table answer_keys enable row level security;

-- Per-user progress: users may READ their own rows. Writes go through the
-- service role (trusted server code), so there are no user write policies.
alter table lesson_sessions enable row level security;
create policy sessions_select_own on lesson_sessions for select using (user_id = auth.uid());

alter table responses enable row level security;
create policy responses_select_own on responses for select using (user_id = auth.uid());

alter table lesson_completions enable row level security;
create policy completions_select_own on lesson_completions for select using (user_id = auth.uid());

alter table review_items enable row level security;
create policy review_select_own on review_items for select using (user_id = auth.uid());

alter table xp_events enable row level security;
create policy xp_select_own on xp_events for select using (user_id = auth.uid());

alter table activity_days enable row level security;
create policy activity_select_own on activity_days for select using (user_id = auth.uid());

alter table user_stats enable row level security;
create policy stats_select_own on user_stats for select using (user_id = auth.uid());

alter table achievements enable row level security;
create policy achievements_read on achievements for select using (true);

alter table user_achievements enable row level security;
create policy user_achievements_select_own on user_achievements for select using (user_id = auth.uid());

-- Billing: users read their own subscription and intents only. Writes are
-- server-side (service role).
alter table subscriptions enable row level security;
create policy subscriptions_select_own on subscriptions for select using (user_id = auth.uid());

alter table purchase_intents enable row level security;
create policy intents_select_own on purchase_intents for select using (user_id = auth.uid());

alter table payment_events enable row level security; -- no user policy (admin/server only)

-- Content reports: a user may create their own and read their own. Admins read all.
alter table content_reports enable row level security;
create policy reports_insert_own on content_reports
  for insert with check (user_id = auth.uid());
create policy reports_select_own on content_reports
  for select using (user_id = auth.uid() or is_admin());

alter table administrative_audit_log enable row level security;
create policy audit_admin_read on administrative_audit_log for select using (is_admin());

-- ---------------------------------------------------------------------------
-- Least-privilege grants
-- ---------------------------------------------------------------------------
-- Users can never directly update the privileged profile columns. Restricting
-- UPDATE to the self-editable columns is defense-in-depth alongside the
-- trigger above.
revoke update on profiles from authenticated;
grant update (display_name, timezone, daily_goal, reduce_motion, sound_enabled)
  on profiles to authenticated;
