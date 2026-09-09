-- SEE7VEN Presence System V7.2
-- Migration designed to EXTEND the existing CMS without deleting data.
-- Review in Supabase SQL Editor before running in production.

begin;

-- CLIENTS ---------------------------------------------------------------
alter table if exists public.clients add column if not exists slug text;
alter table if exists public.clients add column if not exists category text;
alter table if exists public.clients add column if not exists accent text;
alter table if exists public.clients add column if not exists website text;
alter table if exists public.clients add column if not exists brand_poster text;
alter table if exists public.clients add column if not exists public_cover text;
alter table if exists public.clients add column if not exists public_cover_fit text default 'cover';
alter table if exists public.clients add column if not exists public_proof text;
alter table if exists public.clients add column if not exists active boolean default true;
alter table if exists public.clients add column if not exists "order" integer default 0;

-- PROJECTS --------------------------------------------------------------
alter table if exists public.projects add column if not exists slug text;
alter table if exists public.projects add column if not exists client text;
alter table if exists public.projects add column if not exists label text;
alter table if exists public.projects add column if not exists category text;
alter table if exists public.projects add column if not exists tags text;
alter table if exists public.projects add column if not exists theme text;
alter table if exists public.projects add column if not exists size text;
alter table if exists public.projects add column if not exists cover text;
alter table if exists public.projects add column if not exists url text;
alter table if exists public.projects add column if not exists eyebrow text;
alter table if exists public.projects add column if not exists headline text;
alter table if exists public.projects add column if not exists case_intro text;
alter table if exists public.projects add column if not exists challenge text;
alter table if exists public.projects add column if not exists strategy text;
alter table if exists public.projects add column if not exists execution text;
alter table if exists public.projects add column if not exists result text;
alter table if exists public.projects add column if not exists proof text;
alter table if exists public.projects add column if not exists before_title text;
alter table if exists public.projects add column if not exists before_text text;
alter table if exists public.projects add column if not exists after_title text;
alter table if exists public.projects add column if not exists after_text text;
alter table if exists public.projects add column if not exists source_url text;
alter table if exists public.projects add column if not exists research_context text;
alter table if exists public.projects add column if not exists audience text;
alter table if exists public.projects add column if not exists objective text;
alter table if exists public.projects add column if not exists constraint_text text;
alter table if exists public.projects add column if not exists insight text;
alter table if exists public.projects add column if not exists decision_text text;
alter table if exists public.projects add column if not exists system_map text;
alter table if exists public.projects add column if not exists focus text;
alter table if exists public.projects add column if not exists channels text;
alter table if exists public.projects add column if not exists signal text;
alter table if exists public.projects add column if not exists active boolean default true;
alter table if exists public.projects add column if not exists "order" integer default 0;

-- CONTENTS / REELS ------------------------------------------------------
alter table if exists public.contents add column if not exists slug text;
alter table if exists public.contents add column if not exists client text;
alter table if exists public.contents add column if not exists category text;
alter table if exists public.contents add column if not exists description text;
alter table if exists public.contents add column if not exists permalink text;
alter table if exists public.contents add column if not exists video text;
alter table if exists public.contents add column if not exists poster text;
alter table if exists public.contents add column if not exists featured boolean default false;
alter table if exists public.contents add column if not exists active boolean default true;
alter table if exists public.contents add column if not exists "order" integer default 0;

-- SERVICES --------------------------------------------------------------
alter table if exists public.services add column if not exists active boolean default true;
alter table if exists public.services add column if not exists "order" integer default 0;

-- Optional indexes. They are non-unique on purpose so this migration does
-- not fail if legacy rows temporarily share a slug while you clean the CMS.
create index if not exists clients_slug_idx on public.clients(slug);
create index if not exists projects_slug_idx on public.projects(slug);
create index if not exists contents_slug_idx on public.contents(slug);
create index if not exists contents_client_idx on public.contents(client);

-- MEDIA VAULT -----------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = excluded.public;

-- Publicly readable published portfolio media.
drop policy if exists "seeven portfolio public read" on storage.objects;
create policy "seeven portfolio public read"
on storage.objects for select
to public
using (bucket_id = 'portfolio-assets');

-- Authenticated Admin can manage the bucket.
drop policy if exists "seeven portfolio authenticated insert" on storage.objects;
create policy "seeven portfolio authenticated insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-assets');

drop policy if exists "seeven portfolio authenticated update" on storage.objects;
create policy "seeven portfolio authenticated update"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-assets')
with check (bucket_id = 'portfolio-assets');

drop policy if exists "seeven portfolio authenticated delete" on storage.objects;
create policy "seeven portfolio authenticated delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-assets');

commit;

-- IMPORTANT:
-- This file intentionally does not replace your existing table RLS policies.
-- Keep your current public-read/authenticated-write rules for clients,
-- projects, contents and services. If those rules do not exist yet, create
-- them in Supabase after reviewing your authentication model.
