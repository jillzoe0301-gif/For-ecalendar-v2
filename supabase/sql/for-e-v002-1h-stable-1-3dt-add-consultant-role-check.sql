-- FOR-e Calendar V2
-- V002-1H-stable-1-3dt
-- 目的：保留 staff / profiles 既有角色 CHECK 條件，只額外允許「顧問」。
-- 特性：可重複執行；不更新既有人員或行程資料；不重建資料表。

begin;

do $$
declare
  constraint_row record;
  existing_expression text;
  updated_count integer := 0;
begin
  for constraint_row in
    select
      namespace_row.nspname as schema_name,
      table_row.relname as table_name,
      constraint_data.conname as constraint_name,
      pg_get_expr(constraint_data.conbin, constraint_data.conrelid) as constraint_expression
    from pg_constraint constraint_data
    join pg_class table_row
      on table_row.oid = constraint_data.conrelid
    join pg_namespace namespace_row
      on namespace_row.oid = table_row.relnamespace
    where namespace_row.nspname = 'public'
      and table_row.relname in ('staff', 'profiles')
      and constraint_data.contype = 'c'
      and constraint_data.conname ilike '%role%'
  loop
    existing_expression := constraint_row.constraint_expression;

    if position('顧問' in coalesce(existing_expression, '')) = 0 then
      execute format(
        'alter table %I.%I drop constraint %I',
        constraint_row.schema_name,
        constraint_row.table_name,
        constraint_row.constraint_name
      );

      execute format(
        'alter table %I.%I add constraint %I check (((%s)) or role = %L) not valid',
        constraint_row.schema_name,
        constraint_row.table_name,
        constraint_row.constraint_name,
        existing_expression,
        '顧問'
      );

      execute format(
        'alter table %I.%I validate constraint %I',
        constraint_row.schema_name,
        constraint_row.table_name,
        constraint_row.constraint_name
      );

      updated_count := updated_count + 1;
    end if;
  end loop;

  -- 正常正式環境已有 staff_role_check。
  -- 只有在該限制完全不存在時，才建立保守的後備限制。
  if not exists (
    select 1
    from pg_constraint constraint_data
    join pg_class table_row
      on table_row.oid = constraint_data.conrelid
    join pg_namespace namespace_row
      on namespace_row.oid = table_row.relnamespace
    where namespace_row.nspname = 'public'
      and table_row.relname = 'staff'
      and constraint_data.conname = 'staff_role_check'
      and constraint_data.contype = 'c'
  ) then
    alter table public.staff
      add constraint staff_role_check
      check (
        role is null
        or role in (
          '管理員',
          '主管',
          '行政 / 海外',
          '行政/海外',
          '行政',
          '翻譯',
          '外務 / 宿管人員 / 會計',
          '外務/宿管人員/會計',
          '一般職員',
          '顧問'
        )
      ) not valid;

    alter table public.staff
      validate constraint staff_role_check;
  end if;

  raise notice 'FOR-e 1-3dt 完成：已處理 % 個既有角色限制。', updated_count;
end
$$;

commit;

-- 驗證結果：staff_role_check 的定義應包含「顧問」。
select
  namespace_row.nspname as schema_name,
  table_row.relname as table_name,
  constraint_data.conname as constraint_name,
  pg_get_constraintdef(constraint_data.oid) as constraint_definition
from pg_constraint constraint_data
join pg_class table_row
  on table_row.oid = constraint_data.conrelid
join pg_namespace namespace_row
  on namespace_row.oid = table_row.relnamespace
where namespace_row.nspname = 'public'
  and table_row.relname in ('staff', 'profiles')
  and constraint_data.contype = 'c'
  and constraint_data.conname ilike '%role%'
order by table_row.relname, constraint_data.conname;
