-- Daily usage counter for the credibility checker ("Verificador").
-- Each row counts how many analyses a user ran on a given day, so we can
-- rate-limit calls to the external AI provider (which costs money / has a
-- free-tier quota). Writes happen only in trusted server code via the
-- service role; RLS lets a user read their own counter and nothing else.
create table if not exists public.fact_check_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

alter table public.fact_check_usage enable row level security;

-- A user may read only their own usage (to show "X de Y hoje" in the UI).
-- No insert/update/delete policies: all mutations go through the service
-- role, which bypasses RLS, and are always scoped to the authenticated id.
drop policy if exists fact_check_usage_select_own on public.fact_check_usage;
create policy fact_check_usage_select_own
  on public.fact_check_usage
  for select
  using (user_id = auth.uid());
