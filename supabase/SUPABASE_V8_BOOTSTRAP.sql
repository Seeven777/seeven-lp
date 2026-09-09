-- SEE7VEN Presence System V8
-- Fresh Supabase bootstrap. Use this only for a new database.
-- Existing V7.4 installs should run SUPABASE_V8_MIGRATION.sql instead.

begin;

create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  slug text,
  name text,
  handle text,
  category text,
  accent text,
  url text,
  website text,
  brand_poster text,
  public_cover text,
  public_cover_fit text default 'cover',
  public_proof text,
  active boolean default true,
  "order" integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text,
  client text,
  label text,
  title text,
  description text,
  category text,
  tags text,
  theme text,
  size text,
  cover text,
  url text,
  eyebrow text,
  headline text,
  case_intro text,
  challenge text,
  strategy text,
  execution text,
  result text,
  proof text,
  before_title text,
  before_text text,
  after_title text,
  after_text text,
  source_url text,
  research_context text,
  audience text,
  objective text,
  constraint_text text,
  insight text,
  decision_text text,
  system_map text,
  focus text,
  channels text,
  signal text,
  active boolean default true,
  "order" integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  slug text,
  client text,
  category text default 'reel',
  title text,
  description text,
  permalink text,
  video text,
  url text,
  poster text,
  featured boolean default false,
  active boolean default true,
  "order" integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  stack text,
  active boolean default true,
  "order" integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.behance_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Projeto Behance',
  client text default 'Seeven Projects',
  url text,
  cover text,
  tools text,
  theme text default 'editorial',
  active boolean default true,
  "order" integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- If this fresh project already has exactly one Auth user, preserve that
-- account as the initial CMS administrator. With zero or multiple users, no
-- account is auto-authorized; /admin shows copy-ready authorization SQL.
do $$
begin
  if (select count(*) from auth.users) = 1 then
    insert into public.cms_admins (user_id, email)
    select id, email from auth.users limit 1
    on conflict (user_id) do update set email = excluded.email;
  end if;
end $$;

alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.contents enable row level security;
alter table public.services enable row level security;
alter table public.behance_items enable row level security;
alter table public.cms_admins enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.clients, public.projects, public.contents, public.services, public.behance_items to anon, authenticated;
grant insert, update, delete on public.clients, public.projects, public.contents, public.services, public.behance_items to authenticated;
grant select on public.cms_admins to authenticated;

drop policy if exists "seeven admin can read self" on public.cms_admins;
create policy "seeven admin can read self" on public.cms_admins for select to authenticated using (auth.uid()=user_id);

create or replace function public.is_seeven_admin()
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(select 1 from public.cms_admins where user_id=auth.uid());
$$;
revoke all on function public.is_seeven_admin() from public;
grant execute on function public.is_seeven_admin() to authenticated;

create or replace function public.seeven_touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path=public
as $$
begin
  new.updated_at=now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['clients','projects','contents','services','behance_items'] loop
    execute format('drop trigger if exists seeven_touch_updated_at on public.%I',t);
    execute format('create trigger seeven_touch_updated_at before update on public.%I for each row execute function public.seeven_touch_updated_at()',t);
    execute format('drop policy if exists "seeven v8 public read" on public.%I',t);
    execute format('drop policy if exists "seeven v8 admin read" on public.%I',t);
    execute format('drop policy if exists "seeven v8 admin insert" on public.%I',t);
    execute format('drop policy if exists "seeven v8 admin update" on public.%I',t);
    execute format('drop policy if exists "seeven v8 admin delete" on public.%I',t);
    execute format('create policy "seeven v8 public read" on public.%I for select to anon, authenticated using (active is distinct from false)',t);
    execute format('create policy "seeven v8 admin read" on public.%I for select to authenticated using (public.is_seeven_admin())',t);
    execute format('create policy "seeven v8 admin insert" on public.%I for insert to authenticated with check (public.is_seeven_admin())',t);
    execute format('create policy "seeven v8 admin update" on public.%I for update to authenticated using (public.is_seeven_admin()) with check (public.is_seeven_admin())',t);
    execute format('create policy "seeven v8 admin delete" on public.%I for delete to authenticated using (public.is_seeven_admin())',t);
  end loop;
end $$;

create index if not exists clients_slug_idx on public.clients(slug);
create index if not exists projects_slug_idx on public.projects(slug);
create index if not exists contents_slug_idx on public.contents(slug);
create index if not exists contents_client_idx on public.contents(client);
create index if not exists clients_active_order_idx on public.clients(active,"order");
create index if not exists projects_active_order_idx on public.projects(active,"order");
create index if not exists contents_active_order_idx on public.contents(active,"order");
create index if not exists contents_featured_idx on public.contents(featured) where featured is true;
create index if not exists services_active_order_idx on public.services(active,"order");
create index if not exists behance_active_order_idx on public.behance_items(active,"order");

insert into storage.buckets(id,name,public)
values('portfolio-assets','portfolio-assets',true)
on conflict(id) do update set public=excluded.public;

drop policy if exists "seeven v8 portfolio public read" on storage.objects;
drop policy if exists "seeven v8 portfolio admin insert" on storage.objects;
drop policy if exists "seeven v8 portfolio admin update" on storage.objects;
drop policy if exists "seeven v8 portfolio admin delete" on storage.objects;

create policy "seeven v8 portfolio public read" on storage.objects for select to public using(bucket_id='portfolio-assets');
create policy "seeven v8 portfolio admin insert" on storage.objects for insert to authenticated with check(bucket_id='portfolio-assets' and public.is_seeven_admin());
create policy "seeven v8 portfolio admin update" on storage.objects for update to authenticated using(bucket_id='portfolio-assets' and public.is_seeven_admin()) with check(bucket_id='portfolio-assets' and public.is_seeven_admin());
create policy "seeven v8 portfolio admin delete" on storage.objects for delete to authenticated using(bucket_id='portfolio-assets' and public.is_seeven_admin());

commit;
