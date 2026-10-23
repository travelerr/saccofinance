-- Permit the manually queued Learning Library announcement.
-- No rows, audience preferences, queue functions, or worker behavior change.
begin;
alter table public.research_notification_log
 drop constraint if exists research_notification_log_notification_type_check;
alter table public.research_notification_log
 add constraint research_notification_log_notification_type_check
 check (notification_type in (
  'WEEKLY_OUTLOOK_PUBLISHED',
  'OPPORTUNITY_PUBLISHED',
  'OPPORTUNITY_MATERIAL_UPDATE',
  'LEARNING_LIBRARY_ANNOUNCEMENT'
 ));
commit;
