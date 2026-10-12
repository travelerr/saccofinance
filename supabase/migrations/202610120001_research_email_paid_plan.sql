-- NULL disables the daily research budget. Monthly budget remains a rolling
-- 30-day application guard, not a meter for all provider/account email usage.
begin;
alter table public.research_email_limits alter column daily_limit drop not null;
alter table public.research_email_limits alter column daily_limit drop default;
alter table public.research_email_limits alter column monthly_limit set default 50000;
update public.research_email_limits set daily_limit=null,monthly_limit=50000 where singleton=true;
-- reserve_research_notification compares usage > daily_limit. With NULL this
-- condition is not true, so daily enforcement is disabled; all other guards remain.
commit;
