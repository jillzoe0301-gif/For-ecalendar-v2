select cron.schedule('for-e-mobile-daily-0830','30 0 * * *',$job$
 select net.http_post(
  url := 'https://mpieaxgmbihmvgofluwz.supabase.co/functions/v1/for-e-push-daily',
  headers := jsonb_build_object('Content-Type','application/json','x-for-e-scheduler',(select decrypted_secret from vault.decrypted_secrets where name='for_e_push_daily_scheduler')),
  body := '{"action":"daily"}'::jsonb,
  timeout_milliseconds := 10000
 );
$job$);