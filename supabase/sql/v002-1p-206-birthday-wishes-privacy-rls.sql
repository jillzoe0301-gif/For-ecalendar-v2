-- V002-1P-206｜生日祝福權限與隱私修正
-- 其他同仁可以留言；只有壽星本人可以看到寫給自己的祝福。

create table if not exists public.birthday_wishes (
  wish_id uuid primary key default gen_random_uuid(),
  birthday_staff_id text not null,
  birthday_staff_name text,
  birthday_date date not null,
  birthday_month_day text not null,
  sender_staff_id text,
  sender_name text,
  message text not null,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.birthday_wishes
  add column if not exists wish_id uuid default gen_random_uuid(),
  add column if not exists birthday_staff_id text,
  add column if not exists birthday_staff_name text,
  add column if not exists birthday_date date,
  add column if not exists birthday_month_day text,
  add column if not exists sender_staff_id text,
  add column if not exists sender_name text,
  add column if not exists message text,
  add column if not exists created_by uuid default auth.uid(),
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists deleted_at timestamptz;

create index if not exists birthday_wishes_staff_date_idx
  on public.birthday_wishes (birthday_staff_id, birthday_date);

create index if not exists birthday_wishes_month_day_idx
  on public.birthday_wishes (birthday_month_day);

create index if not exists birthday_wishes_sender_idx
  on public.birthday_wishes (sender_staff_id, created_at);

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.birthday_wishes to anon, authenticated;

create or replace function public.for_e_current_staff_id_for_birthday_wishes()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  result_staff_id text;
  link_col text;
  profile_email text;
begin
  if auth.uid() is null then
    return null;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'staff_id'
  ) then
    return null;
  end if;

  foreach link_col in array array['id', 'profile_id', 'user_id', 'auth_user_id'] loop
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'profiles'
        and column_name = link_col
    ) then
      execute format(
        'select staff_id::text from public.profiles where %I::text = $1 and staff_id is not null limit 1',
        link_col
      )
      into result_staff_id
      using auth.uid()::text;

      if result_staff_id is not null and result_staff_id <> '' then
        return result_staff_id;
      end if;
    end if;
  end loop;

  profile_email := nullif(auth.jwt() ->> 'email', '');

  if profile_email is not null and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'email'
  ) then
    execute 'select staff_id::text from public.profiles where lower(email::text) = lower($1) and staff_id is not null limit 1'
    into result_staff_id
    using profile_email;

    if result_staff_id is not null and result_staff_id <> '' then
      return result_staff_id;
    end if;
  end if;

  return null;
end;
$$;

grant execute on function public.for_e_current_staff_id_for_birthday_wishes() to anon, authenticated;

alter table public.birthday_wishes enable row level security;

drop policy if exists birthday_wishes_select_authenticated on public.birthday_wishes;
drop policy if exists birthday_wishes_insert_authenticated on public.birthday_wishes;
drop policy if exists birthday_wishes_update_own on public.birthday_wishes;
drop policy if exists birthday_wishes_select_recipient_only on public.birthday_wishes;
drop policy if exists birthday_wishes_insert_staff_authenticated on public.birthday_wishes;
drop policy if exists birthday_wishes_update_sender_own on public.birthday_wishes;

create policy birthday_wishes_select_recipient_only
  on public.birthday_wishes
  for select
  to authenticated
  using (
    deleted_at is null
    and birthday_staff_id = public.for_e_current_staff_id_for_birthday_wishes()
  );

create policy birthday_wishes_insert_staff_authenticated
  on public.birthday_wishes
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and deleted_at is null
    and sender_staff_id = public.for_e_current_staff_id_for_birthday_wishes()
    and birthday_staff_id is not null
    and birthday_staff_id <> sender_staff_id
    and message is not null
    and length(trim(message)) > 0
  );

create policy birthday_wishes_update_sender_own
  on public.birthday_wishes
  for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());
