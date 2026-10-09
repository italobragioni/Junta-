-- Fix: the role-lock trigger was too strict and also blocked legitimate admin
-- promotion done directly in SQL (the documented way to create the first
-- admin). It used auth.role(), which is NULL outside an API request, so a
-- direct SQL UPDATE had its role change silently reverted.
--
-- New rule: only block role changes coming from the PUBLIC API roles
-- (authenticated / anon). Privileged connections — the SQL editor (postgres /
-- supabase_admin) and the service role — may change it. Users still cannot
-- promote themselves through the app.

create or replace function lock_privileged_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_user in ('authenticated', 'anon') then
    new.role := old.role;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
