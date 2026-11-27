-- Mobile daily digest preferences; no existing schedules are changed.
alter table public.push_subscriptions
 add column if not exists notify_escape boolean not null default true,
 add column if not exists notify_transfer boolean not null default true,
 add column if not exists notify_verification boolean not null default true,
 add column if not exists notify_return boolean not null default true,
 add column if not exists notify_meeting boolean not null default true;
create table if not exists public.push_daily_claims (
 subscription_id uuid not null references public.push_subscriptions(push_subscription_id) on delete cascade,
 reminder_day date not null,
 claimed_at timestamptz not null default now(),
 primary key(subscription_id,reminder_day)
);
alter table public.push_daily_claims enable row level security;
revoke all on public.push_daily_claims from public,anon,authenticated;
grant select,insert on public.push_daily_claims to service_role;
create or replace function public.for_e_push_digest_items()
returns table(subscription_id uuid,profile_id uuid,kind text,schedule_id uuid,title text,start_time time,end_time time,location text)
language sql stable security invoker set search_path='' as $$
 with today as (select (now() at time zone 'Asia/Taipei')::date as d),
 eligible as (
 select s.*,case
 when s.schedule_type='逃跑通知' or s.sub_type='逃跑通知' then 'escape'
 when s.schedule_type='轉出追蹤' or s.sub_type='轉出追蹤' then 'transfer'
 when s.schedule_type='驗證提醒' or s.sub_type='驗證提醒' then 'verification'
 when s.schedule_type='返台提醒' or s.sub_type='返台提醒' then 'return'
 when s.schedule_type in ('會議','會議室預約') or s.sub_type='會議' then 'meeting'
 end as kind
 from public.schedules s cross join today
 where s.deleted_at is null and not coalesce(s.is_completed,false) and not coalesce(s.is_cancelled,false)
 and coalesce(s.status,'') not in ('已完成','取消','已取消')
 and (s.start_date=today.d or ((s.schedule_type='逃跑通知' or s.sub_type='逃跑通知') and today.d between s.start_date and least(coalesce(s.end_date,s.start_date+2),s.start_date+2)))
 )
 select distinct ps.push_subscription_id,p.profile_id,e.kind,e.schedule_id,
 case when e.kind='meeting' then e.title else null end,
 case when e.kind='meeting' then e.start_time else null end,
 case when e.kind='meeting' then e.end_time else null end,
 case when e.kind='meeting' then coalesce(nullif(e.location_name,''),case when e.schedule_type='會議室預約' then e.sub_type end) else null end
 from eligible e join public.schedule_assignees a on a.schedule_id=e.schedule_id and a.deleted_at is null
 join public.profiles p on p.staff_id=a.staff_id and p.deleted_at is null and p.status='啟用'
 join public.push_subscriptions ps on ps.profile_id=p.profile_id and ps.is_enabled
 where coalesce(a.assignee_type,'executor') in ('executor','follow_up','admin_notice')
 and case e.kind when 'escape' then ps.notify_escape when 'transfer' then ps.notify_transfer when 'verification' then ps.notify_verification when 'return' then ps.notify_return when 'meeting' then ps.notify_meeting else false end;
$$;
revoke all on function public.for_e_push_digest_items() from public,anon,authenticated;
grant execute on function public.for_e_push_digest_items() to service_role;
-- Generate the scheduler credential on the database server; never return its value.
do $$ begin
 if not exists(select 1 from vault.secrets where name='for_e_push_daily_scheduler') then
 perform vault.create_secret(gen_random_uuid()::text||gen_random_uuid()::text,'for_e_push_daily_scheduler','FOR-e daily push scheduler');
 end if;
end $$;
create or replace function public.for_e_push_digest_authorized(p_token text)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from vault.decrypted_secrets where name='for_e_push_daily_scheduler' and decrypted_secret=p_token);
$$;
revoke all on function public.for_e_push_digest_authorized(text) from public,anon,authenticated;
grant execute on function public.for_e_push_digest_authorized(text) to service_role;
