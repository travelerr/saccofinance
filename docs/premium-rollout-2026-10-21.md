# Premium rollout — October 21, 2026

The Git push deploys the website through Amplify. It does not apply Supabase migrations, change Stripe's hosted portal, install hosted authentication email templates, or replace/configure Lambda. Complete the steps below for the full release. New cancellation actions need migration 001; email onboarding needs migrations 003–004; engagement needs migration 005.

## 1. Pause the existing EventBridge schedule

Disable the existing research-email schedule while updating Lambda and its settings. This pauses scheduled research broadcasts too; do not queue a broadcast during the change. Do not delete or create a second schedule.

## 2. Apply the five migrations to PRODUCTION Supabase, in order

Confirm the project URL is `https://fikktskcjseveokpkemt.supabase.co`, matching production Amplify and Lambda. Do not use localhost/Supabase Studio.

These files have only been applied locally by this work. If you have independently applied any to production, do not rerun it. This read-only query checks the main new tables and signup trigger function:

```sql
select
 to_regclass('public.billing_retention_events') as retention,
 to_regclass('public.billing_access_reminders') as reminders,
 to_regclass('public.member_onboarding') as onboarding,
 to_regclass('public.member_onboarding_emails') as onboarding_emails,
 to_regprocedure('public.default_signup_email_preference()') as default_signup,
 to_regclass('public.member_engagement_days') as engagement,
 to_regclass('public.member_engagement_config') as engagement_config;
```

For an untouched production database, all these new objects should be NULL. Non-NULL values mean some work already exists: inspect the migration history/definitions before rerunning anything. Migration 002 only changes a constraint, so object existence does not establish whether it ran.

Run each complete file separately in SQL Editor, waiting for success before proceeding:

1. `supabase/migrations/202610200001_billing_retention.sql`
2. `supabase/migrations/202610200002_billing_cancellation_reasons.sql`
3. `supabase/migrations/202610200003_member_onboarding.sql`
4. `supabase/migrations/202610200004_signup_welcome.sql`
5. `supabase/migrations/202610200005_member_engagement.sql`

Do not run a migration twice or remove statements to bypass an error. These add private tables/functions and triggers; 002 replaces the cancellation-reason constraint while preserving historical reason values. Existing subscriptions and documented trades are not rewritten. Existing members are not bulk-enrolled in onboarding or opted back in.

## 3. Configure Stripe's LIVE customer portal

Use the configuration whose ID matches Amplify's `STRIPE_PORTAL_CONFIGURATION_ID`. Disable subscription cancellation in that portal, retaining payment-method updates and invoice access. The website now has the required-reason cancellation flow and Keep my subscription control. If portal cancellation is still enabled, the website intentionally refuses to open that portal.

No new Stripe product, price, webhook endpoint, or subscription is needed. Existing portal sessions may remain usable until they expire. Direct Stripe/support changes are not captured as website cancellation feedback.

## 4. Install the combined welcome template in hosted Supabase

Under Authentication email templates, paste the complete contents of `supabase/templates/premium-signin.html` into BOTH **Confirm signup** and **Magic Link**. Preserve all Go template expressions, including the token hash and conditional branches.

Suggested subject: `Welcome to Sacco Premium — save your login`.

Keep the existing SMTP configuration. Confirm Site URL is exactly `https://saccofinancial.com` without a trailing slash, and preserve the existing auth redirect allowlist. Website deployment does not update these hosted templates.

The purchase flow sends one combined setup/welcome email. Regular login/confirmation redirects receive the secure-login body. Day 2 and Day 5 come from the worker, not these templates.

## 5. Let Amplify finish deploying the pushed commit

Retain the existing production settings. `GA_ANALYTICS_ENABLED=true` must already be enabled for engagement collection; `GA_PROPERTY_ID` is used for Google reports. Keep `STRIPE_MODE=live`, the production database URL, and existing billing/email secret references.

Do not add local-only variables (`SACCO_LOCAL_DEVELOPMENT`, `ANALYTICS_PREVIEW`, `LOCAL_ONBOARDING_INBOX`, or `RESEARCH_EMAIL_LOCAL_ENABLED`) to production.

## 6. Upload the replacement Lambda package

Use `build/research-email-lambda.zip`, not a source folder or an earlier ZIP. Keep handler `index.handler`, Node.js 22, timeout at least 120 seconds, and existing concurrency/schedule settings.

Retain existing database/site/email settings, including `AUTH_SITE_URL=https://saccofinancial.com`, `EMAIL_SEND_MODE=live`, `RESEARCH_EMAIL_ENABLED=true`, `RESEARCH_WORKER_ENABLED=true`, `RESEARCH_EMAIL_FROM`, email secret ARN/region and current broadcast/test-recipient settings.

Add/copy these from the production website to Lambda:

- `BILLING_SECRETS_ARN`
- `BILLING_AWS_REGION`
- `STRIPE_BILLING_ENABLED=true`
- `STRIPE_MODE=live`
- `STRIPE_MONTHLY_PRICE_ID`
- `STRIPE_ANNUAL_PRICE_ID`

The referenced billing secret must contain the existing LIVE `STRIPE_SECRET_KEY` and production `SUPABASE_SECRET_KEY`. Keep secrets in Secrets Manager, never in the ZIP. The Lambda execution role needs `secretsmanager:GetSecretValue` for that billing secret in addition to its existing email secret; a customer-managed encryption key may also require its existing decrypt permission.

Set `BILLING_REMINDERS_ENABLED=true` and `MEMBER_ONBOARDING_ENABLED=true` when ready to activate the two new sequences. These flags belong on Lambda, not Amplify. The existing pause switch and any test-recipient restriction still apply. Research jobs take priority, followed by access reminders, then onboarding.

## 7. Run the non-sending Lambda check

With the schedule still disabled, run a synchronous Lambda console test:

```json
{"action":"check"}
```

Expected: `status: ready`, `mode: live`, `processingEnabled: true`. With the new flags enabled, this validates the relevant database tables, billing secret and configured Stripe prices. It does **not** send an email or prove inbox delivery. If it fails, keep the schedule disabled and resolve the settings before processing.

## 8. Re-enable the existing schedule

Keep its existing `{"action":"process"}` payload. Enabling it permits eligible production messages to be sent, including access-ending reminders for existing cancellations inside 72 hours and onboarding messages for new members. No new broadcast is automatically queued by this deployment. Do not use the process test as a harmless connectivity check: it may send real email.

## 9. Verify the website and monitor

- On mobile, check intro video above the research preview; all subscription CTAs remain.
- Review the dashboard guide, compact one-month gauge, and highlighted market posture.
- Review Workiva's $70 stop and $89 target. Its updates are excluded from research email events.
- Open Account: required cancellation reason, optional text, and Keep my subscription when scheduled. Do not cancel a real member for testing. Local Stripe sandbox checks already exercised these flows.
- Confirm Manage billing opens payment/invoice management after the Stripe portal setting is updated.
- Open admin Analytics: cancellation report and engagement report should show data or honest empty states, not database errors. First-week totals require seven days; day-30 comparisons require 30 days from new enrollments after tracking activation. Nothing is backfilled as historical activity.
- For the next legitimate signup, check that one combined welcome arrives and its link saves the account/password. Follow-ups remain subject to preferences, verified identity, suppression, timing and cancellation checks.
- Monitor Lambda logs and private `billing_access_reminders` / `member_onboarding_emails` records. `sent` means provider accepted; inspect Resend for delivery. Do not reset `dispatching` or `uncertain` rows to retry without checking the provider.

Rollback for the new scheduled sequences: set `BILLING_REMINDERS_ENABLED=false` and `MEMBER_ONBOARDING_ENABLED=false`. This leaves research broadcasts running. Disabling EventBridge pauses all scheduled email work. Keep additive migrations in place; do not drop tables as rollback.
