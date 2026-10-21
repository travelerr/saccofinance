# Cancellation and access-ending reminders

Local implementation only. Do not deploy or enable production reminders until the checks below are approved.

## What members see

Account & Billing has a dedicated cancellation form with a required choice: Too expensive, Not using it, Research doesn’t fit my needs, or Something else. Feedback is optional for every choice (1,000 characters maximum). The server validates this independently of browser validation. Cancellation schedules the existing subscription to end; it does not cancel access immediately or refund past charges.

Members whose active subscription or trial is scheduled to end see Keep my subscription. They must confirm automatic renewal before submitting. This removes the cancellation on the same Stripe subscription, without changing the plan or creating a new checkout. Past-due members must resolve payment first; ended subscriptions cannot be resumed.

A factual account notice runs within the final 72 hours, once per subscription/end date. Late cancellations inside that window are eligible on the next worker pass. The link opens Account & Billing and never restores renewal by itself. These are account notices, independent of research opt-in, as described in the existing preferences screen. Bounced/complained/suppressed addresses, unverified accounts and pilot-recipient restrictions are respected. Notices are skipped when another paid subscription or a manual grant continues access beyond the date.

## Automated tests

From `social-media`:

```sh
npm run test:retention
npm run test:offline
npx tsc --noEmit
npm run build
npm run email:lambda:build
```

`test:retention` covers required/invalid reasons, optional text, server-side ownership/mode/price/status restrictions, monthly/trial timing, resumption, repeated actions, uncertain provider responses, suppression, alternate access, disabled mode, lost leases, database deduplication and private table permissions.

With local Supabase and the existing `.local-development/stripe-sandbox.json` configured:

```sh
npm run test:retention:sandbox
```

This script rejects non-loopback databases and non-test Stripe keys. It creates its own disposable test customer, local member and monthly/annual/trial subscriptions, exercises the actual cancellation/resumption functions against Stripe, verifies no new invoice or changed renewal date, runs a reminder dry-run, then removes its fixtures. It sends no emails. Existing seeded fake Stripe IDs are for visual previews only, not real cancellation API tests.

## Persistent local account for hands-on testing

Run `node scripts/setup-retention-sandbox.cjs` once, then restart `npm run dev`. Sign in as **billing@sacco.test** using the shared password in `.local-development/credentials.json`. This account has a real Stripe **test** monthly subscription and a dedicated sandbox portal with cancellation disabled. It is intentionally kept for manual tests; the automated sandbox test uses separate disposable fixtures. Rerunning setup reuses the subscription unless it has fully ended.

The older `paid@sacco.test` and `canceled@sacco.test` accounts are visual fixtures with simulated Stripe IDs. They cannot execute actual Stripe billing changes.

## Hands-on acceptance checklist

1. Start the local site with `npm run dev`. Use a member with a real Stripe **sandbox** subscription (not `sub_local_*`). Open `/premium/account`.
2. Expand Cancel subscription and submit with no reason. Submission must be blocked. Select each choice in turn; choose Something else and leave feedback empty. No text must be required. Confirm cancellation once.
3. Verify the account still has Premium access, displays the scheduled end date, and now offers Keep my subscription. In Stripe sandbox, verify cancellation at period end on the same subscription. Reload and repeat cancellation requests: no second subscription or extended end date.
4. Leave the renewal confirmation unchecked and try Keep my subscription: submission must be blocked. Check it and submit. Verify renewal is restored, the cancellation date is cleared, and price, billing date and latest invoice are unchanged. Repeat the keep request: no additional charge or subscription.
5. Repeat for annual and trial subscriptions. A trial must retain its original end date and future charge terms. An ended subscription must not offer keep; a forged request must fail. An unrelated member’s subscription ID must fail.
6. Verify Manage Subscription still opens payment/invoice management after the dedicated sandbox portal configuration has cancellation disabled. There must be no alternate cancellation path in that portal.
7. For reminders, use a canceled sandbox trial ending within 72 hours. Run the sandbox test above or an explicitly configured dry-run worker with `BILLING_REMINDERS_ENABLED=true`. Check `billing_access_reminders`: exactly one `dry_run` for that subscription/end date. Invoke again: no second row. Dry-run receipts never consume live delivery eligibility.
8. Repeat with renewal restored before worker execution, an end date over 72 hours away, expired access, an unverified email, suppression, and another subscription/grant retaining access. No notice should be dispatched.
9. Inspect the reminder HTML/text on mobile and desktop: correct Eastern Time end date, clear no-action explanation, Account link, no promotions, no link that changes billing.
10. A controlled developer email was accepted by Resend on October 20, 2026, addressed only to the configured developer recipient, with subject `[LOCAL TEST] Your Sacco Premium access ends soon`. User inbox confirmation is still required. The normal local web app and worker remain dry-run only.

For a future explicitly authorized developer send, run the sandbox checks first, then `node scripts/test-retention-email.cjs preview`. Sending requires `send --send-to-configured-test-recipient`. This isolated CLI uses the existing private developer-send configuration and test ledger, accepts no recipient overrides, and permits only one reminder test attempt per UTC date. The template uses a disposable sandbox end date, clearly labels itself as a test, and links to localhost. It does not test production EventBridge/Lambda deployment or prove inbox placement.

## Production rollout requirements — not performed

1. Apply `supabase/migrations/202610200001_billing_retention.sql` to the correct production Supabase project. It is additive and contains no trade/access edits. This migration has been applied only to the local database during implementation.
2. In the Stripe portal configuration identified by `STRIPE_PORTAL_CONFIGURATION_ID`, disable subscription cancellation; preserve payment-method and invoice management. The app refuses to open a portal that still offers bypass cancellation. Previously created portal sessions may remain usable until Stripe expires them. Dashboard/support cancellations remain possible and will not have a website reason.
3. Deploy the site after explicit approval. Exercise a sandbox end-to-end flow first. Existing Stripe webhooks continue reconciling actual membership access; no new webhook endpoint is needed.
4. Replace the existing research-email Lambda ZIP with the newly built package. Keep `BILLING_REMINDERS_ENABLED` unset/false initially. No second email provider, schedule or Lambda is needed.
5. The Lambda now also needs read access to the billing secret containing `STRIPE_SECRET_KEY` and `SUPABASE_SECRET_KEY`: configure `BILLING_SECRETS_ARN`, `BILLING_AWS_REGION`, `STRIPE_BILLING_ENABLED=true`, `STRIPE_MODE=live`, and the same monthly/annual price IDs as the website. Grant only the necessary Secrets Manager read permission if its role does not already have it. Existing email secrets/sender/site URL and send-mode safeguards still apply. Never embed secrets in the ZIP.
6. After approved validation, set `BILLING_REMINDERS_ENABLED=true`. Existing `{ "action": "process" }` schedule ticks process one reminder when the research queue is idle. Existing worker enable/pause gates continue to apply. Keep the schedule running regularly; a disabled worker cannot send reminders.

## Audit and operational checks

These service-role-only tables intentionally are not readable or writable by members. No analytics dashboard redesign was included. Example admin SQL:

```sql
select subscription_id, action, reason, feedback, requested_at,
       requested_at - subscription_started_at as time_since_subscription_start,
       status, effective_end
from billing_retention_events
order by requested_at desc;

select subscription_id, mode, send_mode, ends_at, status, provider_id, created_at
from billing_access_reminders
order by created_at desc;
```

Time since subscription start is not account age and may include a trial. `requested` audit rows are attempts whose confirmation did not finish; recheck Stripe before counting them as completed cancellations. Reasons remain in the audit even after renewal is restored.

Reminder workers use unique subscription/mode/end-date receipts. A failed pre-send check can retry after a five-minute lease expires. `dispatching` or `uncertain` rows are deliberately never automatically resent: inspect Resend before any manual recovery. This favors avoiding duplicate messages when a provider response is lost. `sent` means provider accepted, not guaranteed inbox delivery. Dry-run and live receipts are isolated.

Because cancellation can change concurrently with an external send, there is a small unavoidable race after the final Stripe read. The worker checks as late as practical and sends no promotional claims. Scheduled notices are not sent after the recorded access end.

## First-week onboarding and revised cancellation choices (local, October 20)

The required choices are: Too expensive; Not using it enough; Not enough new research or opportunities; Not what I expected; Technical or website issues; Other; Prefer not to say. No choice is preselected. Optional feedback remains optional for every choice. Historical `research_fit` audit values are preserved.

New migrations, in order after `202610200001_billing_retention.sql`:

1. `202610200002_billing_cancellation_reasons.sql`
2. `202610200003_member_onboarding.sql`

Both have been applied to local Supabase only. Do not reapply manually to a database where they already ran. The onboarding migration excludes existing members, then enrolls each new member once when the billing ledger first confirms paid or trial access. Renewals, duplicate webhooks, and plan changes do not restart it. A subscription pending first payment does not start it.

The existing worker now supports `MEMBER_ONBOARDING_ENABLED=true`, default off. It uses the same Stripe configuration, email configuration, pause switch, verified identity, opt-in, suppressions, unsubscribe links and pilot-recipient restrictions as research notifications. No independent scheduler is needed. Welcome runs on the first available worker tick after eligibility, Day 2 and Day 5 after enrollment. Busy broadcast/reminder work takes priority. Missed messages expire at the next step (and Day 5 expires after Day 7), avoiding a delayed burst. Canceled memberships skip onboarding even if they still have access. Uncertain delivery is held for review and never automatically retried.

### Local review

1. Log in to a local paid fixture and open `/premium/dashboard`. Review Start Here and its three destinations. Dismiss it and reload: it stays dismissed for that member in this browser. A different browser/device has its own dismissal. This guide is not a mandatory tutorial.
2. Open Account, expand cancellation, and submit without choosing a reason. Browser validation should block submission. Server validation also rejects missing/unknown reasons. Test the actual Stripe action with `billing@sacco.test`; seeded `paid@sacco.test` is only a visual fixture.
3. Confirm every reason works without feedback text, including Other and Prefer not to say. The saved reason is retained privately in the audit ledger; Stripe receives its supported feedback category plus the exact selected label.
4. For scheduled cancellations, review the banner on member pages. It appears regardless of days remaining, can be dismissed during navigation, and returns on reload/new visit. Keeping the subscription removes it on the next page load. The separate email reminder remains within 72 hours.
5. Run `npm run test:retention`. Covers timing, private database access, new-member enrollment, existing-member exclusion, one sequence per member, duplicate claims, lease recovery, unsafe retry prevention, cancellation/opt-out skips, and required reasons.
6. Run `npm run test:retention:sandbox`. It creates disposable Stripe TEST subscriptions and a local member, moves only that fixture’s onboarding timestamps through Day 0/2/5, verifies exactly three dry-run receipts, then cleans up. It also checks cancellation/resumption and the access-ending reminder. It never sends email or changes the existing November 20 test subscription.
7. Preview files can be generated locally from `renderOnboardingEmail` and `renderAccessReminder`. An actual delivered-email check requires a separately authorized single-recipient developer test; local automated workers cannot send live email.

### Later production activation — not performed

Deploy the migrations before enabling the updated worker. Upload the rebuilt Lambda package and supply the billing settings documented above. Enable `MEMBER_ONBOARDING_ENABLED=true` only when ready for new-member onboarding; enable `BILLING_REMINDERS_ENABLED=true` for cancellation reminders. Run the worker check and a restricted test before allowing normal processing. No emails were sent as part of this implementation.

Existing page/research analytics and email UTM attribution are preserved. The attachment’s Phase 2 engagement correlation/reporting remains a follow-up once data is available; this change does not add a new tracking system. Cancellation reasons and onboarding delivery receipts are stored for that analysis.

## Combined welcome and default enrollment — supersedes earlier opt-in/Day 0 notes

New non-anonymous signups now receive an ON preference automatically via `202610200004_signup_welcome.sql`. The migration does not backfill or overwrite existing users. Explicit opt-outs remain OFF, including when a member claims another purchase. The claim screen describes the default and links the member to account preferences; it no longer requires a separate opt-in checkbox.

Guest checkout uses ONE Supabase authentication email, now containing the password-setup instructions and complete welcome content. The setup button leads through the existing verified claim POST to the password page. Email scanners cannot claim a purchase by visiting the link. The worker excludes guest purchases from Day 0, both before and after claim. The first-week clock stays anchored to the original paid/trial access instead of restarting on claim. Authenticated, non-guest subscriptions can still receive the worker welcome, with account/password instructions.

Local onboarding is enabled through `scripts/local-environment.cjs`. The dry-run worker captures onboarding messages in the fixed loopback Mailpit inbox at `http://127.0.0.1:54324`; it cannot redirect that delivery to an external server. No live Resend sending is enabled. Day 2 and Day 5 retain their actual timing and unsubscribe checks. Local test scripts may disable inbox capture when only timing/ledger verification is needed.

Full-flow test: `node scripts/test-signup-welcome.cjs --run`. It creates disposable local identities and a Stripe TEST subscription, receives the real combined Supabase email, verifies the claim token, sets a temporary password, signs in again, checks default enrollment, verifies no duplicate welcome, advances only its own cohort to Day 2, receives that email in Mailpit, exercises the real unsubscribe endpoint, and confirms Day 5 is blocked. It cleans up its own fixtures. It never sends outside the local inbox.

Verified October 20: full-flow checks passed, including cleanup. The Start Here notice now uses a prominent amber background, border, action links, and explicit dismissal guidance.

Before any later production launch, in addition to the website, ordered migrations and Lambda update, install `supabase/templates/premium-signin.html` into BOTH Supabase Authentication email templates: Confirm signup and Magic Link. The template distinguishes ordinary sign-in/confirmation redirects from purchase welcome redirects. Use the production Site URL `https://saccofinancial.com` (no trailing slash). Suggested initial-email subject: “Welcome to Sacco Premium — save your login.” This template update is necessary; deploying website code alone does not update hosted Supabase templates. Local config already uses the new template. No production changes have been made.
