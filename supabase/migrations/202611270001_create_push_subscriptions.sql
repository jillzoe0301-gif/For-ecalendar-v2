-- FOR-e Calendar V2｜PWA Web Push subscriptions
-- 2026-11-27｜1-3fd
-- Subscription endpoints and encryption keys are only accessed by the Edge Function service role.

create table if not exists public.push_subscriptions (
  push_subscription_id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(profile_id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  device_label text,
  is_enabled boolean not null default true,
  notify_new_schedule boolean not null default true,
  notify_schedule_updated boolean not null default true,
  notify_schedule_cancelled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists push_subscriptions_profile_enabled_idx
  on public.push_subscriptions (profile_id, is_enabled);

alter table public.push_subscriptions enable row level security;

revoke all on table public.push_subscriptions from anon, authenticated;
grant select, insert, update, delete on table public.push_subscriptions to service_role;
