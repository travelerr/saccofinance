-- Preserve historical research_fit responses while accepting the expanded choices.
begin;
alter table public.billing_retention_events drop constraint billing_retention_events_reason_check;
alter table public.billing_retention_events add constraint billing_retention_events_reason_check
 check(reason in ('too_expensive','unused','research_fit','not_enough_research','not_expected','technical_issues','other','prefer_not_to_say'));
commit;
