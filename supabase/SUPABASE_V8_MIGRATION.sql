-- SEE7VEN Presence System V8
-- Migration for an existing V7.4 database.
-- Run ONCE in Supabase SQL Editor after deploying the V8 code.
-- This keeps public reads, restricts writes to explicit CMS admins,
-- adds service stack metadata and automatic updated_at timestamps.

begin;

create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- Preserve the existing administrator automatically only when this Supabase
-- project has exactly one Auth user. This avoids hard-coding personal data or
-- granting CMS access to every authenticated account.
do $$
begin
  if (select count(*) from auth.users) = 1 then
    insert into public.cms_admins (user_id, email)
    select id, email from auth.users limit 1
    on conflict (user_id) do update set email = excluded.email;
  end if;
end $$;

-- If the project has multiple Auth users, authorize the intended editor after
-- login using the copy-ready SQL shown by /admin → Access.

alter table public.cms_admins enable row level security;

grant select on public.cms_admins to authenticated;

drop policy if exists "seeven admin can read self" on public.cms_admins;
create policy "seeven admin can read self"
on public.cms_admins for select to authenticated
using (auth.uid() = user_id);

create or replace function public.is_seeven_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.cms_admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_seeven_admin() from public;
grant execute on function public.is_seeven_admin() to authenticated;

alter table public.services add column if not exists stack text;

-- Keep SQL privileges explicit; RLS below decides which rows each role can use.
grant usage on schema public to anon, authenticated;
grant select on public.clients, public.projects, public.contents, public.services, public.behance_items to anon, authenticated;
grant insert, update, delete on public.clients, public.projects, public.contents, public.services, public.behance_items to authenticated;

-- V7.4 already has updated_at, but keep this migration safe for older installs.
do $$
declare t text;
begin
  foreach t in array array['clients','projects','contents','services','behance_items'] loop
    execute format('alter table public.%I add column if not exists updated_at timestamptz not null default now()', t);
  end loop;
end $$;

create or replace function public.seeven_touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['clients','projects','contents','services','behance_items'] loop
    execute format('drop trigger if exists seeven_touch_updated_at on public.%I', t);
    execute format('create trigger seeven_touch_updated_at before update on public.%I for each row execute function public.seeven_touch_updated_at()', t);
  end loop;
end $$;

-- Helpful indexes for dashboard, filters and ordered public reads.
create index if not exists clients_active_order_idx on public.clients(active, "order");
create index if not exists projects_active_order_idx on public.projects(active, "order");
create index if not exists contents_active_order_idx on public.contents(active, "order");
create index if not exists contents_featured_idx on public.contents(featured) where featured is true;
create index if not exists services_active_order_idx on public.services(active, "order");
create index if not exists behance_active_order_idx on public.behance_items(active, "order");

-- CMS table policies ---------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['clients','projects','contents','services','behance_items'] loop
    -- Remove V7 policies and any previous V8 policies so this migration is retry-safe.
    execute format('drop policy if exists "seeven public read" on public.%I', t);
    execute format('drop policy if exists "seeven authenticated insert" on public.%I', t);
    execute format('drop policy if exists "seeven authenticated update" on public.%I', t);
    execute format('drop policy if exists "seeven authenticated delete" on public.%I', t);
    execute format('drop policy if exists "seeven v8 public read" on public.%I', t);
    execute format('drop policy if exists "seeven v8 admin read" on public.%I', t);
    execute format('drop policy if exists "seeven v8 admin insert" on public.%I', t);
    execute format('drop policy if exists "seeven v8 admin update" on public.%I', t);
    execute format('drop policy if exists "seeven v8 admin delete" on public.%I', t);

    -- Published content stays visible to the public site, even if a browser has a session.
    execute format('create policy "seeven v8 public read" on public.%I for select to anon, authenticated using (active is distinct from false)', t);
    -- Admin can also read drafts.
    execute format('create policy "seeven v8 admin read" on public.%I for select to authenticated using (public.is_seeven_admin())', t);
    execute format('create policy "seeven v8 admin insert" on public.%I for insert to authenticated with check (public.is_seeven_admin())', t);
    execute format('create policy "seeven v8 admin update" on public.%I for update to authenticated using (public.is_seeven_admin()) with check (public.is_seeven_admin())', t);
    execute format('create policy "seeven v8 admin delete" on public.%I for delete to authenticated using (public.is_seeven_admin())', t);
  end loop;
end $$;

-- Media Vault policies ------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "seeven portfolio public read" on storage.objects;
drop policy if exists "seeven portfolio authenticated insert" on storage.objects;
drop policy if exists "seeven portfolio authenticated update" on storage.objects;
drop policy if exists "seeven portfolio authenticated delete" on storage.objects;
drop policy if exists "seeven v8 portfolio public read" on storage.objects;
drop policy if exists "seeven v8 portfolio admin insert" on storage.objects;
drop policy if exists "seeven v8 portfolio admin update" on storage.objects;
drop policy if exists "seeven v8 portfolio admin delete" on storage.objects;

create policy "seeven v8 portfolio public read"
on storage.objects for select to public
using (bucket_id = 'portfolio-assets');

create policy "seeven v8 portfolio admin insert"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-assets' and public.is_seeven_admin());

create policy "seeven v8 portfolio admin update"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-assets' and public.is_seeven_admin())
with check (bucket_id = 'portfolio-assets' and public.is_seeven_admin());

create policy "seeven v8 portfolio admin delete"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-assets' and public.is_seeven_admin());

commit;
