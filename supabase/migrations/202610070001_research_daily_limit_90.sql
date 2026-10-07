-- Temporary allowance for two 41-member updates; other safeguards stay unchanged.
update public.research_email_limits
set daily_limit = 90
where singleton = true and daily_limit = 80;
