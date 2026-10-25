-- MUALink production schema
-- Run this once in the Supabase SQL editor (Project → SQL → New query).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Artists
-- ---------------------------------------------------------------------------
create table if not exists public.artists (
  id uuid primary key,
  owner_id uuid references auth.users(id) on delete cascade,
  username text not null,
  full_name text not null default '',
  city text not null default '',
  whatsapp text not null default '',
  email text,
  bio text not null default '',
  profile_photo text not null default '',
  services jsonb not null default '[]'::jsonb,
  portfolio jsonb not null default '[]'::jsonb,
  service_cities jsonb not null default '[]'::jsonb,
  travel_available boolean not null default true,
  working_days jsonb not null default '[]'::jsonb,
  working_from text not null default '09:00',
  working_to text not null default '21:00',
  languages jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists artists_username_lower_idx on public.artists (lower(username));
create unique index if not exists artists_owner_idx on public.artists (owner_id) where owner_id is not null;

-- ---------------------------------------------------------------------------
-- Enquiries (leads)
-- ---------------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  bride_name text not null check (char_length(bride_name) between 2 and 80),
  bride_whatsapp text not null check (bride_whatsapp ~ '^[6-9][0-9]{9}$'),
  occasion text not null,
  services jsonb not null default '[]'::jsonb,
  family_count integer not null default 0 check (family_count between 0 and 20),
  event_date date,
  ready_by text,
  venue text not null default '',
  budget text not null default '',
  notes text not null default '',
  inspiration_photo text,
  status text not null default 'new' check (status in ('new', 'replied', 'quote_sent', 'confirmed', 'lost', 'archived')),
  unread boolean not null default true,
  summary text not null default '',
  fit_label text not null default 'unreviewed' check (fit_label in ('good_fit', 'needs_review', 'not_a_fit', 'unreviewed')),
  fit_reason text not null default '',
  whatsapp_opener text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_artist_created_idx on public.enquiries (artist_id, created_at desc);
create index if not exists enquiries_artist_phone_idx on public.enquiries (artist_id, bride_whatsapp);

-- ---------------------------------------------------------------------------
-- Unavailable dates
-- ---------------------------------------------------------------------------
create table if not exists public.unavailable_dates (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  date date not null,
  created_at timestamptz not null default now(),
  unique (artist_id, date)
);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.artists enable row level security;
alter table public.enquiries enable row level security;
alter table public.unavailable_dates enable row level security;

-- The base table is private: only the owner and the public view below expose data.
drop policy if exists "artists public read" on public.artists;
drop policy if exists "artists owner read" on public.artists;
create policy "artists owner read" on public.artists
  for select to authenticated
  using (owner_id = auth.uid());

drop policy if exists "artists owner insert" on public.artists;
create policy "artists owner insert" on public.artists
  for insert to authenticated
  with check (owner_id = auth.uid() and is_demo = false);

drop policy if exists "artists owner update" on public.artists;
create policy "artists owner update" on public.artists
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid() and is_demo = false);

drop policy if exists "artists owner delete" on public.artists;
create policy "artists owner delete" on public.artists
  for delete to authenticated
  using (owner_id = auth.uid());

drop policy if exists "enquiries public insert" on public.enquiries;
create policy "enquiries public insert" on public.enquiries
  for insert to anon, authenticated
  with check (status = 'new' and unread = true);

drop policy if exists "enquiries owner read" on public.enquiries;
create policy "enquiries owner read" on public.enquiries
  for select to authenticated
  using (
    exists (
      select 1 from public.artists a
      where a.id = artist_id and a.owner_id = auth.uid()
    )
  );

drop policy if exists "enquiries owner update" on public.enquiries;
create policy "enquiries owner update" on public.enquiries
  for update to authenticated
  using (
    exists (
      select 1 from public.artists a
      where a.id = artist_id and a.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.artists a
      where a.id = artist_id and a.owner_id = auth.uid()
    )
  );

drop policy if exists "enquiries owner delete" on public.enquiries;
create policy "enquiries owner delete" on public.enquiries
  for delete to authenticated
  using (
    exists (
      select 1 from public.artists a
      where a.id = artist_id and a.owner_id = auth.uid()
    )
  );

drop policy if exists "availability public read" on public.unavailable_dates;
create policy "availability public read" on public.unavailable_dates
  for select using (true);

drop policy if exists "availability owner write" on public.unavailable_dates;
create policy "availability owner write" on public.unavailable_dates
  for insert to authenticated
  with check (
    exists (
      select 1 from public.artists a
      where a.id = artist_id and a.owner_id = auth.uid()
    )
  );

drop policy if exists "availability owner delete" on public.unavailable_dates;
create policy "availability owner delete" on public.unavailable_dates
  for delete to authenticated
  using (
    exists (
      select 1 from public.artists a
      where a.id = artist_id and a.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Enquiry guard: published artist + light spam protection
-- ---------------------------------------------------------------------------
create or replace function public.prepare_enquiry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.artists where id = new.artist_id and published = true) then
    raise exception 'This profile is not accepting requests.';
  end if;

  if (
    select count(*) from public.enquiries
    where artist_id = new.artist_id
      and bride_whatsapp = new.bride_whatsapp
      and created_at > now() - interval '24 hours'
  ) >= 6 then
    raise exception 'Too many requests from this number today. Please try again tomorrow.';
  end if;

  new.status := 'new';
  new.unread := true;
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists prepare_enquiry_trigger on public.enquiries;
create trigger prepare_enquiry_trigger
  before insert on public.enquiries
  for each row execute function public.prepare_enquiry();

-- ---------------------------------------------------------------------------
-- Timestamps
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists artists_touch_updated_at on public.artists;
create trigger artists_touch_updated_at
  before update on public.artists
  for each row execute function public.touch_updated_at();

drop trigger if exists enquiries_touch_updated_at on public.enquiries;
create trigger enquiries_touch_updated_at
  before update on public.enquiries
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Username availability (checks drafts too)
-- ---------------------------------------------------------------------------
create or replace function public.username_taken(candidate text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.artists where lower(username) = lower(trim(candidate))
  );
$$;

grant execute on function public.username_taken(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Public profile view
-- The base table stays private so a bride (or any visitor) can never read an
-- artist's WhatsApp number or email straight from the API.
-- ---------------------------------------------------------------------------
create or replace view public.public_artists
with (security_invoker = false) as
select
  id,
  username,
  full_name,
  city,
  bio,
  profile_photo,
  services,
  portfolio,
  service_cities,
  travel_available,
  working_days,
  working_from,
  working_to,
  languages,
  published,
  is_demo,
  ''::text as whatsapp,
  null::text as email,
  null::uuid as owner_id
from public.artists
where published = true;

grant select on public.public_artists to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Grants (RLS still decides what each request can touch)
-- ---------------------------------------------------------------------------
grant select on public.artists to authenticated;
grant insert, update, delete on public.artists to authenticated;
grant insert on public.enquiries to anon, authenticated;
grant select, update, delete on public.enquiries to authenticated;
grant select on public.unavailable_dates to anon, authenticated;
grant insert, delete on public.unavailable_dates to authenticated;

-- ---------------------------------------------------------------------------
-- Storage bucket for artist photos
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media owner upload" on storage.objects;
create policy "media owner upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "media owner update" on storage.objects;
create policy "media owner update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "media owner delete" on storage.objects;
create policy "media owner delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- Demo artist used by the marketing "live profile" link
-- ---------------------------------------------------------------------------
insert into public.artists (
  id, owner_id, username, full_name, city, whatsapp, email, bio, profile_photo,
  services, portfolio, service_cities, travel_available, working_days,
  working_from, working_to, languages, published, is_demo
) values (
  '00000000-0000-4000-8000-000000000001',
  null,
  'priyanka',
  'Priyanka Sharma',
  'New Delhi',
  '9876543210',
  'hello@priyankamua.in',
  'Soft glam, luminous skin, and looks that still feel like you. I specialise in modern bridal and occasion makeup across Delhi NCR, with a calm, unhurried experience on your big day.',
  '/images/look1.jpg',
  '[{"id":"s1","name":"Signature Bridal","description":"HD makeup, hairstyling, draping & lashes","priceType":"starting_from","price":25000,"visible":true},
    {"id":"s2","name":"Engagement & Reception","description":"A polished look with hair & draping","priceType":"starting_from","price":15000,"visible":true},
    {"id":"s3","name":"Party Makeup","description":"Soft glam or bold makeup with lashes","priceType":"fixed","price":6500,"visible":true},
    {"id":"s4","name":"Family Makeup","description":"Occasion makeup for your favourite people","priceType":"starting_from","price":3500,"visible":true},
    {"id":"s5","name":"Pre-wedding Shoot","description":"Camera-ready makeup, tailored to your concept","priceType":"custom_quote","price":null,"visible":true}]'::jsonb,
  '[{"id":"p1","url":"/images/hero.jpg","tag":"Bridal"},
    {"id":"p2","url":"/images/look1.jpg","tag":"Party"},
    {"id":"p3","url":"/images/look2.jpg","tag":"HD"},
    {"id":"p4","url":"/images/look3.jpg","tag":"Engagement"},
    {"id":"p5","url":"/images/look4.jpg","tag":"Hair"}]'::jsonb,
  '["Delhi","Gurgaon","Noida","Faridabad"]'::jsonb,
  true,
  '["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]'::jsonb,
  '07:00',
  '21:00',
  '["Hindi","English","Punjabi"]'::jsonb,
  true,
  true
)
on conflict (id) do nothing;
