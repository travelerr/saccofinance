# First-week engagement and retention

Local implementation only. Migration `202610200005_member_engagement.sql` depends on the existing onboarding and retention migrations. It has been applied to the local Supabase database, not production. Apply it after migrations 001–004 during the authorized combined rollout; deploy the website afterward. No additional Lambda update is required for engagement tracking itself.

The migration records when capture began. Only new eligible onboarding cohorts starting afterward qualify. Existing members are not retroactively assigned engagement. An authenticated non-anonymous member's identity and event time are resolved on the server. The service-only RPC deduplicates each activity per 24-hour day since joining and stops at seven days. It stores no URLs, content text, IP addresses, or user agents.

## Manual local checks

1. Use a fresh sandbox signup and finish claiming the account. Administrator accounts are excluded. Keep analytics enabled.
2. Open the dashboard, an Opportunity detail page, and the Sector Gauge. Change a Gauge control. Repeated reloads should produce only one row per activity/day in `member_engagement_days` (test mode).
3. Decline Analytics preferences, then open those pages again: no new records should be created. Repeat with browser Global Privacy Control. Neither setting affects email preferences or membership access.
4. Open Analytics as an administrator. First-week activity totals require seven complete days; cancellation comparisons require 30 complete days. Empty mature cohorts display dashes for rates, not a zero cancellation rate.
5. For accelerated validation, use disposable fixtures in a rollback transaction, not real members. Test multiple day indices, a confirmed cancellation inside day 30, an unconfirmed request, a cancellation after day 30, and a later keep event. Keep restores do not erase an earlier request from this specific outcome metric.
6. Check cancellation breakdown spacing on desktop and mobile, and check that tables scroll rather than overflow the page.

## Meaning and limits

The outcome is a confirmed cancellation request within 30 days, not churn or actual continued paid access. Direct Stripe cancellations and historical changes not captured by the account flow are absent. Initial trial time counts. Cohorts without any captured activity are excluded from action comparisons; other tracked members may still have missing actions. Return means activity on at least two different 24-hour days. Early cancellation reduces the opportunity to engage, so association must not be interpreted as causation.

Run `npm run test:analytics`, `npx tsc --noEmit`, and `npm run build`. Local transactional SQL checks verified deduplication, first-week cutoff, billing mode isolation, and absence of member read/RPC privileges. No test events were left by that transaction.
