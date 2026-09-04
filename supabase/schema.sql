create extension if not exists pgcrypto;

create table if not exists public.clients (
 id uuid primary key default gen_random_uuid(), name text not null, handle text default '', profile_url text default '', avatar_url text default '', active boolean default true, sort_order integer default 0, created_at timestamptz default now()
);
create table if not exists public.contents (
 id uuid primary key default gen_random_uuid(), client_name text not null, title text not null, url text not null, poster_url text default '', active boolean default true, featured boolean default false, sort_order integer default 0, created_at timestamptz default now()
);
create table if not exists public.projects (
 id uuid primary key default gen_random_uuid(), title text not null, category text default '', url text not null, cover_url text default '', description text default '', active boolean default true, featured boolean default false, sort_order integer default 0, created_at timestamptz default now()
);
create table if not exists public.services (
 id uuid primary key default gen_random_uuid(), title text not null, description text default '', tag text default '', icon text default 'Sparkles', active boolean default true, sort_order integer default 0, created_at timestamptz default now()
);

alter table public.clients enable row level security;
alter table public.contents enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;

create policy "public read active clients" on public.clients for select using (active = true);
create policy "public read active contents" on public.contents for select using (active = true);
create policy "public read active projects" on public.projects for select using (active = true);
create policy "public read active services" on public.services for select using (active = true);

create policy "authenticated manage clients" on public.clients for all to authenticated using (true) with check (true);
create policy "authenticated manage contents" on public.contents for all to authenticated using (true) with check (true);
create policy "authenticated manage projects" on public.projects for all to authenticated using (true) with check (true);
create policy "authenticated manage services" on public.services for all to authenticated using (true) with check (true);

-- Upgrade existing installations
alter table public.contents add column if not exists poster_url text default '';
alter table public.projects add column if not exists description text default '';
