-- Record only real committed schedule changes; never backfill existing rows.
create table if not exists public.push_schedule_events (
  event_id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null,
  actor_profile_id uuid not null,
  event_type text not null check (event_type in ('created','updated','cancelled')),
  occurred_at timestamptz not null default clock_timestamp(),
  claimed_at timestamptz
);
create index if not exists push_schedule_events_latest_idx
  on public.push_schedule_events(schedule_id, occurred_at desc, event_id desc);
alter table public.push_schedule_events enable row level security;
revoke all on public.push_schedule_events from public, anon, authenticated;
grant select, insert, update on public.push_schedule_events to service_role;

create schema if not exists for_e_push_private;
revoke all on schema for_e_push_private from public, anon, authenticated;

create or replace function for_e_push_private.capture_schedule_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  kind text;
begin
  if actor is null then return new; end if;
  if tg_op = 'INSERT' then
    if new.deleted_at is not null or coalesce(new.is_cancelled,false) then return new; end if;
    kind := 'created';
  elsif not coalesce(old.is_cancelled,false) and coalesce(new.is_cancelled,false) then
    kind := 'cancelled';
  elsif new.deleted_at is null and not coalesce(new.is_cancelled,false)
    and row(old.category,old.schedule_type,old.sub_type,old.sub_type_note,old.title,old.content,old.description,old.start_date,old.end_date,old.time_type,old.start_time,old.end_time,old.customer_name,old.location_name,old.address,old.car_no,old.is_follow_up,old.follow_up_date,old.follow_up_time,old.need_service_record)
    is distinct from
    row(new.category,new.schedule_type,new.sub_type,new.sub_type_note,new.title,new.content,new.description,new.start_date,new.end_date,new.time_type,new.start_time,new.end_time,new.customer_name,new.location_name,new.address,new.car_no,new.is_follow_up,new.follow_up_date,new.follow_up_time,new.need_service_record) then
    kind := 'updated';
  else return new;
  end if;
  insert into public.push_schedule_events(schedule_id,actor_profile_id,event_type)
    values(new.schedule_id,actor,kind);
  return new;
exception when others then
  -- Notification bookkeeping must not interfere with the original schedule save.
  raise warning 'FOR-e push event capture failed: %', sqlstate;
  return new;
end;
$$;
revoke all on function for_e_push_private.capture_schedule_change() from public, anon, authenticated;
drop trigger if exists for_e_push_capture_schedule on public.schedules;
create trigger for_e_push_capture_schedule after insert or update on public.schedules
for each row execute function for_e_push_private.capture_schedule_change();
