# One-time Premium sample (local implementation)

The landing-page form emails a private link to the full published Weekly Outlook from the most recently completed New York market week. The issue and its referenced opportunity data are saved on first request. Existing members-only routes remain protected.

One normalized email address receives one sample. Repeat submissions cannot change the assigned issue, renew the 30-day expiry, change marketing consent, or send another email. Different email addresses cannot reliably be identified as the same person. Requests have a honeypot, bounded body, same-origin check, atomic five-per-IP/hour and 100-global/hour limits, and existing suppression checks. Confirm that hosting supplies trustworthy client-IP headers; optionally put a hosting/WAF rate limit ahead of the endpoint.

New sample signups include Premium updates and offers, explained beside the submit button without a checkbox. Existing opt-outs and unrequested preferences are preserved. Clicking the email confirmation button activates the requested preference; GET requests do not confirm or unsubscribe. Prospect leads are separate from member notifications. The admin leads page shows delivery and consent state. The follow-up worker remains disabled until explicitly configured. Its Day 2 / Day 4 sequence checks confirmed consent, unsubscribe state, current suppression, and subscriber status at send time.

## Production steps — not performed

1. Apply `supabase/migrations/202610260001_premium_samples.sql`, then `supabase/migrations/202610260002_sample_followups.sql`, before enabling samples. Tables and RPCs are service-role-only with RLS and explicit grants.
2. Use the existing email configuration: `RESEARCH_EMAIL_ENABLED=true`, `EMAIL_SEND_MODE=live`, `RESEARCH_EMAIL_FROM`, and existing email secret configuration containing the Resend API key. Existing email infrastructure validation, suppression and pause controls still apply. A configured `RESEARCH_TEST_RECIPIENT` restricts requests to that address.
3. Set `PREMIUM_SAMPLE_ENABLED=true` only when ready to expose the form. It defaults off outside local development. No new Lambda ZIP or schedule is required: the server sends the requested sample through the existing Resend adapter.
4. Submit a controlled real address, verify receipt, confirmation, correct prior issue, and unsubscribe. Re-submit that address and verify no additional send. Then remove any test-recipient restriction when approved for public requests.

If a delivery is uncertain, the reservation remains consumed to prevent duplicate sends. Inspect provider logs before resolving manually; there is no automatic retry or resend. Do not delete real lead records to retry without considering their existing unsubscribe state and one-sample limit.

## Local validation

- Migration applied to local Supabase only.
- Local mail is captured in Mailpit at http://127.0.0.1:54324; no external email is sent.
- Request a unique test address from `/premium#sample`, open its local inbox link and confirm. The current Oct 26 week yields the full Oct 19–23 issue.
- Re-submit with different case: no second email, unchanged saved issue and expiry.
- GET the unsubscribe URL: no preference change. Confirm POST: prospect opt-out recorded, member preferences unaffected.
- Canonical `/premium/issue-005` stays gated even though the private sample is readable.
- Automated coverage: `node --test scripts/test-premium-sample.cjs` checks week boundaries, frozen content, duplicate reservations, rate limits, suppression, expiry, grants, opt-out preservation and prospect email footer.

## Day 2 / Day 4 follow-ups and conversion reporting

The added migration `202610260002_sample_followups.sql` enables the follow-up ledger, separate unsubscribe tokens, billing reconciliation fields and private RPCs. Apply it after the first sample migration. The website now expects both migrations.

- Day 2 explains the Sector Gauge; Day 4 explains the Opportunity Board and invites the reader to see plans. Preview both under `/premium/admin/leads`.
- Timing starts at confirmation. Day 2 is eligible from 48–96 hours; Day 4 from 96 hours to day 8. Stale messages are skipped, with at least 24 hours between reservations. Restarting a worker does not replay the sequence.
- Only confirmed marketing opt-ins qualify. Suppression, opt-out, manual membership and Stripe subscription state are rechecked. Trial subscribers and prior subscribers stop this sequence too. Uncertain sends remain held for review; they are not retried automatically.
- The existing email worker processes a bounded batch of billing matches and one eligible follow-up on idle ticks. Set `PREMIUM_SAMPLE_FOLLOWUPS_ENABLED=true` in its environment after approval. Keep existing worker mode, pause, test-recipient and send controls. This new scheduled functionality **does require updating the existing Lambda worker bundle** (unlike the immediate sample email alone). No additional Lambda or EventBridge schedule is needed.
- Build the replacement using `npm run email:lambda:build` on the supported Node version. Upload only when deployment is approved, then use the existing worker check before enabling the flag. No deployment was performed during local implementation.
- `/premium/admin/analytics` shows all-time requests, sent samples, confirmations, attributed checkout starts, new subscriptions/trials, paid conversions, 14-day mature-cohort conversion and follow-up send states.
- Conversion metrics use the analytics preference at request time. Checkout attribution additionally checks current browser preference/GPC, uses an HttpOnly 30-day token cookie, and cannot interrupt checkout. The request, preference and delivery ledger remains operational even when analytics is declined.
- Paid conversion requires the same normalized billing email, a new supported subscription after the request, and a positive USD paid invoice. A free trial/zero-dollar invoice is not a paid conversion. Prior subscribers are excluded. Different billing emails are not matched; refunds are not deducted from these acquisition counts. This is association, not proof of marketing causation.
- Worker reconciliation is eventual (up to five pending leads per tick; completed checks wait an hour). Report counters are read from the database, not GA or email opens. A migration/configuration failure renders an unavailable state, never misleading zeros.

Validation commands:

```
node --test scripts/test-sample-followups.cjs scripts/test-premium-sample.cjs
node scripts/test-sample-followups-local.cjs --run
npx tsc --noEmit
npm run build
npm run email:lambda:build
```

The integration command is guarded to local Supabase, Stripe test mode and Mailpit. It creates dated fake sample leads, captures both follow-ups locally, and checks duplicate worker ticks. It does not send external email or charge a card.
