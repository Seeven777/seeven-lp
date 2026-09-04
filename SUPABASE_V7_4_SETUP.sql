-- SEE7VEN Presence System V7.4
-- One-time bootstrap / upgrade for the CMS.
-- Safe intention: create missing tables, add missing fields, enable public-read
-- and authenticated-write policies. Review before running in production.

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

-- Upgrade older schemas if they already existed.
alter table public.clients add column if not exists slug text;
alter table public.clients add column if not exists category text;
alter table public.clients add column if not exists accent text;
alter table public.clients add column if not exists website text;
alter table public.clients add column if not exists brand_poster text;
alter table public.clients add column if not exists public_cover text;
alter table public.clients add column if not exists public_cover_fit text default 'cover';
alter table public.clients add column if not exists public_proof text;
alter table public.clients add column if not exists active boolean default true;
alter table public.clients add column if not exists "order" integer default 0;

alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists client text;
alter table public.projects add column if not exists label text;
alter table public.projects add column if not exists description text;
alter table public.projects add column if not exists category text;
alter table public.projects add column if not exists tags text;
alter table public.projects add column if not exists theme text;
alter table public.projects add column if not exists size text;
alter table public.projects add column if not exists cover text;
alter table public.projects add column if not exists url text;
alter table public.projects add column if not exists eyebrow text;
alter table public.projects add column if not exists headline text;
alter table public.projects add column if not exists case_intro text;
alter table public.projects add column if not exists challenge text;
alter table public.projects add column if not exists strategy text;
alter table public.projects add column if not exists execution text;
alter table public.projects add column if not exists result text;
alter table public.projects add column if not exists proof text;
alter table public.projects add column if not exists before_title text;
alter table public.projects add column if not exists before_text text;
alter table public.projects add column if not exists after_title text;
alter table public.projects add column if not exists after_text text;
alter table public.projects add column if not exists source_url text;
alter table public.projects add column if not exists research_context text;
alter table public.projects add column if not exists audience text;
alter table public.projects add column if not exists objective text;
alter table public.projects add column if not exists constraint_text text;
alter table public.projects add column if not exists insight text;
alter table public.projects add column if not exists decision_text text;
alter table public.projects add column if not exists system_map text;
alter table public.projects add column if not exists focus text;
alter table public.projects add column if not exists channels text;
alter table public.projects add column if not exists signal text;
alter table public.projects add column if not exists active boolean default true;
alter table public.projects add column if not exists "order" integer default 0;

alter table public.contents add column if not exists slug text;
alter table public.contents add column if not exists client text;
alter table public.contents add column if not exists category text;
alter table public.contents add column if not exists description text;
alter table public.contents add column if not exists permalink text;
alter table public.contents add column if not exists video text;
alter table public.contents add column if not exists url text;
alter table public.contents add column if not exists poster text;
alter table public.contents add column if not exists featured boolean default false;
alter table public.contents add column if not exists active boolean default true;
alter table public.contents add column if not exists "order" integer default 0;

alter table public.services add column if not exists active boolean default true;
alter table public.services add column if not exists "order" integer default 0;

create index if not exists clients_slug_idx on public.clients(slug);
create index if not exists projects_slug_idx on public.projects(slug);
create index if not exists contents_slug_idx on public.contents(slug);
create index if not exists contents_client_idx on public.contents(client);
create index if not exists behance_items_order_idx on public.behance_items("order");

-- RLS ------------------------------------------------------------------
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.contents enable row level security;
alter table public.services enable row level security;
alter table public.behance_items enable row level security;

-- Public site can read published records.
do $$
declare t text;
begin
  foreach t in array array['clients','projects','contents','services','behance_items'] loop
    execute format('drop policy if exists "seeven public read" on public.%I', t);
    execute format('create policy "seeven public read" on public.%I for select to anon, authenticated using (active is distinct from false)', t);
    execute format('drop policy if exists "seeven authenticated insert" on public.%I', t);
    execute format('create policy "seeven authenticated insert" on public.%I for insert to authenticated with check (true)', t);
    execute format('drop policy if exists "seeven authenticated update" on public.%I', t);
    execute format('create policy "seeven authenticated update" on public.%I for update to authenticated using (true) with check (true)', t);
    execute format('drop policy if exists "seeven authenticated delete" on public.%I', t);
    execute format('create policy "seeven authenticated delete" on public.%I for delete to authenticated using (true)', t);
  end loop;
end $$;

-- Media Vault ----------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "seeven portfolio public read" on storage.objects;
create policy "seeven portfolio public read" on storage.objects for select to public using (bucket_id = 'portfolio-assets');

drop policy if exists "seeven portfolio authenticated insert" on storage.objects;
create policy "seeven portfolio authenticated insert" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-assets');

drop policy if exists "seeven portfolio authenticated update" on storage.objects;
create policy "seeven portfolio authenticated update" on storage.objects for update to authenticated using (bucket_id = 'portfolio-assets') with check (bucket_id = 'portfolio-assets');

drop policy if exists "seeven portfolio authenticated delete" on storage.objects;
create policy "seeven portfolio authenticated delete" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-assets');

commit;
