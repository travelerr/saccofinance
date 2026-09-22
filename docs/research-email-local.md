# Sacco Premium research notifications — local review

The dedicated local stack is now installed and verified. Use [local-development.md](local-development.md) for current startup commands, test credentials, localhost URLs and validation results. The original configuration examples below describe the earlier implementation stage.

This implementation cannot broadcast real email. No production rollout is authorized.

## Architecture
Next.js App Router / React server components and server actions; Supabase Auth stores identity and email. There is no separate profile/member directory or existing editorial admin role. `premium_memberships` holds manual grants; billing subscriptions are owned via `access_owner_id`. Recipient resolution calls the existing `sessionPremiumAccess`, preserving paid-through scheduled cancellation, seven-day renewal grace, manual expiry, and lifetime grants. Unavailable access data aborts the operation.

Research is published in `lib/premium-opportunities.ts`, validated by `lib/premium-content.ts`. Publication does not invoke email code. Updates are documented records with stable IDs. A material-update notification requires an explicit checkbox; edits do not generate events or sends automatically. Supabase continues to send existing authentication/purchase welcome messages; Stripe integration is untouched.

Amplify currently runs Next.js builds and explicitly whitelists runtime variables in `scripts/prepare-amplify-env.cjs`; billing secrets come from AWS Secrets Manager. This task changes neither workflow nor secret provisioning.

## Local configuration and administrator setup
Use a disposable local Supabase project, with local auth users only. Do not copy a production database or subscriber list.

Set these in an ignored local environment file (the existing `.env.example` is itself ignored by this repository):

```
RESEARCH_EMAIL_LOCAL_ENABLED=true
EMAIL_SEND_MODE=dry-run
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local publishable key>
SUPABASE_SECRET_KEY=<local service key>
RESEARCH_ADMIN_USER_IDS=<verified local auth user UUID>
AUTH_SITE_URL=http://127.0.0.1:3082
STRIPE_BILLING_ENABLED=false
```

Look up the intended administrator's UUID in the LOCAL Auth users list. Put that UUID in `RESEARCH_ADMIN_USER_IDS`; never infer admin status from a client-editable role, email, or Premium membership. Multiple UUIDs may be comma-separated. Empty/malformed IDs deny access. Removing an ID revokes access on the next request. No user has been enrolled or given production admin rights by this task. No admin self-enrollment endpoint exists.

Apply existing migrations and `202609220001_research_notifications.sql` to that disposable local database only. Set a local user's manual membership and opt in using Account. For paid-access fixtures, set `STRIPE_MODE=test` and `STRIPE_BILLING_ENABLED=true` only in an isolated test environment; the automated tests mock the canonical access database and do not call Stripe.

Visit `/premium/admin/notifications` while logged in as the local administrator. Select a published event, preview subject/body/CTA, count, and existing log. Explicitly confirm material updates. Run the dry-run. Status is `dry_run`, never `sent`. Review logs in the LOCAL database. A recorded event cannot be retried through the UI, even if it failed. There is no resend feature.

## Schema and safety
`research_email_preferences`: one row per auth user, OFF by default (missing also means OFF). RLS allows only self-read/create/update. Research preference never changes transactional email or Premium access. Users without current access can opt out; access is checked at notification time.

`research_notification_log`: service-only, event key/type/entity/update, subject, count, status, actor, timestamps and provider IDs. Unique `(event_key, mode)` is an atomic reservation, independent of Resend's temporary idempotency cache. Failure/uncertain outcomes remain reserved for investigation. No recipient list or duplicate email body is stored. Dry-run history is separate from any future live history.

Every admin page, preview and send action validates a verified non-anonymous Supabase session against the server allowlist. Next server actions supply same-origin protections; authorization is not based on a hidden button. Member preference actions derive the user ID from the verified session. Recipient addresses never leave server code; previews return count and a content/audience hash only.

The local gate rejects every hosted Supabase hostname BEFORE recipient queries. `EMAIL_SEND_MODE` accepts only dry-run. The app never invokes a network email transport. The isolated Resend batch adapter requires an explicitly injected transport; tests inject mocks. No real provider key is required for validation. It sends individual `to` arrays, never a shared TO/CC list. Provider errors are sanitized; provider acceptance would not establish inbox delivery.

Max 100 recipients per operation: larger audiences fail before reservation/delivery, never truncate. This matches Resend's batch size and free daily ceiling, but is not a future aggregate quota tracker. Before live rollout, implement a persistent daily/monthly budget and account for ALL sends on the Resend account, plus provider throttling. Dry-run uses no provider quota. Do not enable live merely by removing a guard.

## Email templates
Three canonical-content HTML/plain-text templates: Weekly Outlook, Opportunity, Material Opportunity Update. Charcoal background, cyan accent, single CTA, no external fonts/images/scripts. Dynamic text is HTML-escaped; optional technical stage is omitted when missing. No generated trade values. Weekly Outlook uses the existing issue route; Opportunity/update use the existing slug detail route. New issue publication still needs its canonical detail route, as it did before this feature.

Account preference link is authenticated. Before production, confirm unsubscribe requirements for the audience/jurisdictions, assess a secure one-click unsubscribe mechanism and any required sender mailing address. No blanket legal compliance claim is made by this local implementation.

## Validation
`node --test scripts/test-research-email.cjs`: isolated mocked clients and in-memory PGlite, no `.env` loading and no external DB.
`npx tsc --noEmit --incremental false`
Existing offline regression tests: `node --test scripts/test-premium-access.cjs scripts/test-billing.cjs scripts/test-payment-first.cjs scripts/test-opportunities.cjs scripts/test-weekly-outlook.cjs scripts/test-theme.cjs`.
Do NOT run `test-stripe-integration.cjs` for this task; it uses external services.

## Before any production rollout
1. Justin reviews local behavior and grants separate rollout authorization.
2. Apply migration via approved production workflow; explicitly review opt-in copy/default OFF and unsubscribe requirements.
3. Enroll Justin's verified PRODUCTION Supabase UUID in server-only configuration; never reuse a local UUID by assumption.
4. Implement/review live transport wiring, durable quota budgets and provider failure reconciliation. Keep uncertain sends blocked until checked against Resend; no automatic resend.
5. Configure `RESEND_API_KEY` securely server-side and `RESEARCH_EMAIL_FROM` using a verified sender. `Sacco Premium <research@saccofinancial.com>` is an example only, not an asserted existing mailbox.
6. Verify the chosen domain/subdomain in Resend with its issued DKIM/SPF records; review DMARC and preserve existing mail records. No DNS was changed. Confirm reply handling/sender address and any required postal footer.
7. Add reviewed Amplify runtime/Secrets Manager configuration, not public-prefixed variables. Existing build whitelist deliberately remains untouched.
8. Validate with a developer-only recipient, then a separately authorized first member notification. Check real-client desktop/mobile rendering and operational quota monitoring.

Official references checked September 22, 2026:
- https://resend.com/docs/api-reference/emails/send-batch-emails
- https://resend.com/docs/api-reference/introduction
- https://resend.com/pricing
- https://resend.com/docs/dashboard/domains/introduction

## Completed validation — September 22, 2026
- Typecheck passed (`tsc --noEmit --incremental false`).
- 34 offline tests passed, including 8 new research-email tests with multiple eligibility/security assertions.
- Local `next build` passed, including lint/type validation and generation of 26 static pages. Billing was disabled and the Supabase URL was explicitly overridden to localhost for this build.
- Three canonical templates rendered at 375px and 720px in isolated Chrome with network blocked; no horizontal overflow. Screenshots visually inspected. This is browser rendering, not proof of Gmail/Outlook client compatibility.
- New migration executed only inside disposable in-memory PGlite tests. During the later authorized local-environment setup, this migration was applied to localhost Supabase and eight fake users were enrolled. Signed-in browser testing is now complete; hosted Supabase remains untouched.
- Source diff confirms Stripe, authentication, billing/access rules, Weekly Outlook and Opportunities records/routes remain unchanged. Only Account imports/renders the gated preference section; other implementation files are new.
- No commit, push, deployment, production database operation, DNS change, Stripe change, Resend account creation, or real email send occurred.

## File manifest
- Existing `app/premium/account/page.tsx`: gated preference section.
- `app/premium/account/research-preferences.tsx`, `research-actions.ts`: own-preference UI and authenticated save.
- `app/premium/admin/notifications/page.tsx`, `actions.ts`: administrator preview and manual dry-run.
- `lib/email/policy.ts`, `admin.ts`, `database.ts`: local safety and server-only administration.
- `lib/email/events.ts`, `templates.ts`: canonical event mapping and HTML/plain-text rendering.
- `lib/email/recipient-resolution.ts`: canonical access-based audience resolution.
- `lib/email/research-notifications.ts`, `notification-run.ts`: preview fingerprint, reservation, operation logging.
- `lib/email/resend-client.ts`: dry-run delivery and isolated mock-tested Resend adapter.
- `supabase/migrations/202609220001_research_notifications.sql`: preference and notification log schema/RLS.
- `scripts/test-research-email.cjs`: local tests.
- `.env.example` (already ignored): placeholder-only local configuration; no real keys.
- This document: setup, design, validation, rollout prerequisites.
