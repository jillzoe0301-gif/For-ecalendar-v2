-- Per-person service-record reminders, independent of the calendar's visible date range.
-- No existing schedule or service record is changed.
create or replace function public.for_e_service_record_pending_items(p_staff_id uuid)
returns table(schedule_id uuid,schedule_date date,schedule_type text,title text,overdue boolean)
language sql stable security invoker set search_path='' as $$
  with today as (select (now() at time zone 'Asia/Taipei')::date as d)
  select s.schedule_id,s.start_date,coalesce(s.schedule_type,s.category,''),coalesce(s.title,''),s.start_date<=today.d-14
  from public.schedules s cross join today
  where p_staff_id is not null and s.need_service_record is true
    and s.deleted_at is null and not coalesce(s.is_cancelled,false) and s.cancelled_at is null
    and coalesce(s.status,'') not in ('取消','已取消','取消行程','已刪除','刪除','deleted')
    and s.start_date<=today.d
    and btrim(coalesce(s.category,'')) not in ('會議室預約','公務車保養','一般記事','待辦事項','辦件提醒','請假 / 會議 / 活動 / 外訓','證件交付')
    and btrim(coalesce(s.schedule_type,'')) not in ('逃跑通知','轉出追蹤','住變資訊','住變資訊提供','住變資訊通知','轉出通知','驗證提醒','返台提醒','電表提醒','駐廠')
    and (
      exists(select 1 from public.schedule_assignees a where a.schedule_id=s.schedule_id and a.staff_id=p_staff_id and a.deleted_at is null)
      or (s.creator_staff_id=p_staff_id and not exists(select 1 from public.schedule_assignees a where a.schedule_id=s.schedule_id and a.staff_id is not null and a.deleted_at is null))
    )
    and not exists(select 1 from public.service_records r where r.schedule_id=s.schedule_id and r.staff_id=p_staff_id and (r.need_submit is false or r.submitted is true or r.submitted_date is not null))
    and (
      exists(select 1 from public.service_records r where r.schedule_id=s.schedule_id and r.staff_id=p_staff_id and coalesce(r.need_submit,true))
      or (
        not coalesce(s.service_record_submitted,false) and s.service_record_submitted_date is null
        and not exists(select 1 from public.service_records r where r.schedule_id=s.schedule_id and r.staff_id is null and (r.need_submit is false or r.submitted is true or r.submitted_date is not null))
      )
    )
  order by s.start_date,s.schedule_id;
$$;
revoke all on function public.for_e_service_record_pending_items(uuid) from public,anon,authenticated;
grant execute on function public.for_e_service_record_pending_items(uuid) to service_role;

-- Only the current enabled translator can read their own counts and list.
create or replace function public.for_e_my_service_record_reminders()
returns jsonb language sql stable security definer set search_path='' as $$
  with me as (
    select p.staff_id from public.get_my_profile() p
    join public.staff st on st.staff_id=p.staff_id and st.deleted_at is null
    where p.staff_id is not null and p.status='啟用' and p.deleted_at is null
      and coalesce(st.role,p.role)='翻譯' and coalesce(st.status,p.status)='啟用'
  ), items as (
    select item.* from me cross join lateral public.for_e_service_record_pending_items(me.staff_id) item
  )
  select jsonb_build_object(
    'pending',count(*) filter(where not overdue),
    'overdue',count(*) filter(where overdue),
    'items',coalesce(jsonb_agg(to_jsonb(items) order by overdue desc,schedule_date,schedule_id),'[]'::jsonb)
  ) from items;
$$;
revoke all on function public.for_e_my_service_record_reminders() from public,anon;
grant execute on function public.for_e_my_service_record_reminders() to authenticated;

-- The existing 08:30 job consumes counts only; no case names are sent.
create or replace function public.for_e_push_service_record_digest_items()
returns table(subscription_id uuid,profile_id uuid,record_pending bigint,record_overdue bigint)
language sql stable security invoker set search_path='' as $$
  select ps.push_subscription_id,p.profile_id,totals.pending,totals.overdue
  from public.profiles p
  join public.staff st on st.staff_id=p.staff_id and st.deleted_at is null
  join public.push_subscriptions ps on ps.profile_id=p.profile_id and ps.is_enabled
  cross join lateral (
    select count(*) filter(where not item.overdue) as pending,count(*) filter(where item.overdue) as overdue
    from public.for_e_service_record_pending_items(p.staff_id) item
  ) totals
  where p.deleted_at is null and p.status='啟用' and coalesce(st.role,p.role)='翻譯' and coalesce(st.status,p.status)='啟用'
    and totals.pending+totals.overdue>0;
$$;
revoke all on function public.for_e_push_service_record_digest_items() from public,anon,authenticated;
grant execute on function public.for_e_push_service_record_digest_items() to service_role;
