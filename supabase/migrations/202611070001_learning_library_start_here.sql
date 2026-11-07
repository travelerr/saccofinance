begin;
alter table public.premium_start_here_progress
 drop constraint premium_start_here_progress_step_check;
alter table public.premium_start_here_progress
 add constraint premium_start_here_progress_step_check
 check (step in ('learning-library','sector-gauge','opportunity','outlook'));
commit;
