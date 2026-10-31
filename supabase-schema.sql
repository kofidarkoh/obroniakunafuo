# Supabase Schema for Oak Website

Run this SQL in your Supabase project's SQL Editor to create the required tables.

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- --------------------------------------------------------
-- submissions: donations, contacts, volunteers, partnerships
-- --------------------------------------------------------

create table if not exists donations (
  id uuid primary key default uuid_generate_v4(),
  donor_name text not null,
  email text not null,
  phone text not null,
  amount numeric not null,
  frequency text check (frequency in ('once', 'monthly')) not null,
  method text check (method in ('momo', 'bank')) not null,
  reference text not null,
  message text,
  status text check (status in ('pending', 'confirmed', 'cancelled')) not null default 'pending',
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  acknowledged_at timestamptz,
  acknowledged_by text
);

create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  organisation text,
  reason text not null,
  message text not null,
  preferred_response text not null,
  status text check (status in ('new', 'reviewed', 'archived')) not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists volunteers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text not null,
  location text not null,
  interests text[] not null default '{}',
  availability text not null,
  involvement text not null,
  skills text,
  motivation text,
  experience text,
  status text check (status in ('new', 'reviewed', 'archived')) not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists partnerships (
  id uuid primary key default uuid_generate_v4(),
  organisation text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  area text not null,
  support_type text not null,
  message text not null,
  meeting_format text not null,
  contact_method text not null,
  status text check (status in ('new', 'reviewed', 'archived')) not null default 'new',
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------
-- content: stories, programmes, settings
-- --------------------------------------------------------

create table if not exists stories (
  slug text primary key,
  title text not null,
  category text not null,
  location text not null,
  date text not null,
  read_time text not null,
  image text not null,
  image_alt text not null,
  excerpt text not null,
  blocks jsonb not null default '[]',
  pull_quote_text text not null default '',
  pull_quote_attribution text not null default '',
  programmes text[] not null default '{}',
  status text check (status in ('draft', 'published')) not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists programmes (
  slug text primary key,
  title text not null,
  short_title text not null,
  category text not null,
  accent text check (accent in ('green', 'orange', 'blue', 'purple')) not null default 'green',
  icon text check (icon in ('utensils', 'graduation', 'heart-pulse', 'home', 'hand-heart')) not null default 'utensils',
  summary text not null,
  description text not null,
  bullets text[] not null default '{}',
  cta text not null,
  meta text not null,
  image text not null,
  image_alt text not null default '',
  featured_on_home boolean not null default false,
  show_on_programmes boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------
-- public notifications / announcements
-- --------------------------------------------------------

create table if not exists notifications (
  slug text primary key,
  title text not null,
  summary text not null,
  content text not null,
  date text not null,
  status text check (status in ('draft', 'published')) not null default 'draft',
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_status on notifications(status);
create index if not exists idx_notifications_date on notifications(date desc);

alter table notifications enable row level security;

create policy "Public can read published notifications"
  on notifications for select
  using (status = 'published');

create policy "Admins can manage notifications"
  on notifications for all
  using (true);

-- --------------------------------------------------------
-- gallery
-- --------------------------------------------------------

create table if not exists gallery (
  slug text primary key,
  title text not null,
  image text not null,
  image_alt text,
  caption text,
  category text,
  status text check (status in ('draft', 'published')) not null default 'draft',
  created_at timestamptz not null default now()
);

create index if not exists idx_gallery_status on gallery(status);
create index if not exists idx_gallery_created on gallery(created_at desc);

alter table gallery enable row level security;

create policy "Public can read published gallery"
  on gallery for select
  using (status = 'published');

create policy "Admins can manage gallery"
  on gallery for all
  using (true);

-- --------------------------------------------------------
-- storage: site-images bucket
-- --------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- Public read access to images in site-images bucket
create policy "Public can view site images"
  on storage.objects for select
  using (bucket_id = 'site-images');

-- Admins can manage images in site-images bucket
create policy "Admins can manage site images"
  on storage.objects for all
  using (bucket_id = 'site-images')
  with check (bucket_id = 'site-images');

-- --------------------------------------------------------
-- internal admin notes
-- --------------------------------------------------------

create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  collection text check (collection in ('contacts', 'volunteers', 'partnerships')) not null,
  record_id text not null,
  author text not null,
  text text not null,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------
-- admin audit log
-- --------------------------------------------------------

create table if not exists admin_audit_log (
  id uuid primary key default uuid_generate_v4(),
  actor text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  before_summary text,
  after_summary text,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_audit_log_created_at
  on admin_audit_log(created_at desc);
create index if not exists idx_admin_audit_log_entity
  on admin_audit_log(entity_type, entity_id);

-- --------------------------------------------------------
-- indexes for common queries
-- --------------------------------------------------------

create index if not exists idx_donations_status on donations(status);
create index if not exists idx_donations_created_at on donations(created_at desc);
create index if not exists idx_contacts_status on contacts(status);
create index if not exists idx_contacts_created_at on contacts(created_at desc);
create index if not exists idx_volunteers_status on volunteers(status);
create index if not exists idx_volunteers_created_at on volunteers(created_at desc);
create index if not exists idx_partnerships_status on partnerships(status);
create index if not exists idx_partnerships_created_at on partnerships(created_at desc);
create index if not exists idx_stories_status on stories(status);
create index if not exists idx_stories_date on stories(date desc);
create index if not exists idx_notes_collection_record on notes(collection, record_id);

-- --------------------------------------------------------
-- Row Level Security (RLS)
-- --------------------------------------------------------

-- Enable RLS on all tables
alter table donations enable row level security;
alter table contacts enable row level security;
alter table volunteers enable row level security;
alter table partnerships enable row level security;
alter table stories enable row level security;
alter table programmes enable row level security;
alter table settings enable row level security;
alter table notes enable row level security;

-- Public read access for published stories, programmes, settings
create policy "Public can read published stories"
  on stories for select
  using (status = 'published');

create policy "Public can read programmes"
  on programmes for select
  using (true);

create policy "Public can read settings"
  on settings for select
  using (true);

create policy "Public can read published notifications"
  on notifications for select
  using (status = 'published');

-- Public can submit enquiry/donation forms
create policy "Public can insert contacts"
  on contacts for insert
  with check (true);

create policy "Public can insert donations"
  on donations for insert
  with check (true);

create policy "Public can insert volunteers"
  on volunteers for insert
  with check (true);

create policy "Public can insert partnerships"
  on partnerships for insert
  with check (true);

-- Admin write access (requires authenticated admin role)
-- In production, restrict these to your admin users via JWT claims
create policy "Admins can manage donations"
  on donations for all
  using (true);

create policy "Admins can manage contacts"
  on contacts for all
  using (true);

create policy "Admins can manage volunteers"
  on volunteers for all
  using (true);

create policy "Admins can manage partnerships"
  on partnerships for all
  using (true);

create policy "Admins can manage stories"
  on stories for all
  using (true);

create policy "Admins can manage programmes"
  on programmes for all
  using (true);

create policy "Admins can manage settings"
  on settings for all
  using (true);

create policy "Admins can manage notes"
  on notes for all
  using (true);

alter table admin_audit_log enable row level security;

create policy "Admins can manage audit log"
  on admin_audit_log for all
  using (true);

create policy "Public can read audit log"
  on admin_audit_log for select
  using (false);

-- --------------------------------------------------------
-- Seed settings with defaults
-- --------------------------------------------------------

insert into settings (key, value) values
  ('email', 'obroniakunafuo@gmail.com'),
  ('phonePrimary', '0241 936 699'),
  ('phoneSecondary', '0541 597 436'),
  ('address', 'Head Office, Mim, Ahafo Region, Ghana'),
  ('bankName', 'Ecobank Ghana'),
  ('bankAccountName', 'Obroni Akunafo Kuo'),
  ('bankAccountNumber', '0011020008964'),
  ('momoNumber', '0541597436'),
  ('momoName', 'Collins Afriyie'),
  ('facebook', 'https://facebook.com'),
  ('instagram', 'https://instagram.com'),
  ('linkedin', 'https://linkedin.com'),
  ('whatsapp', 'https://wa.me/233541597436'),
  ('adminEmail', 'obroniakunafuo@gmail.com')
on conflict (key) do nothing;
```

## Environment variables for Vercel

Add these to your Vercel project settings:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-ref.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `RESEND_API_KEY` | Your Resend API key (optional) |
| `RESEND_FROM_EMAIL` | `Obroni Akunafo Kuo <noreply@your-domain.com>` |
| `ADMIN_NOTIFICATION_EMAIL` | `obroniakunafuo@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` |

## Admin access

Create your admin user in the Supabase dashboard (Authentication → Users → Add user). There is no public sign-up page by design.

Once Supabase env vars are set, the app automatically switches from mock auth/JSON storage to Supabase — no code changes needed.