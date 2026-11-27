-- Preserve audit inserts and reads; prevent ordinary sessions from changing history.
revoke update, delete, truncate, trigger on table public.audit_logs from public, anon, authenticated;
