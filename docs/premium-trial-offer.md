# Admin-controlled 30-day trial

Local implementation only. Production settings are not changed. Migration defaults both test and live offers OFF. Review at `/premium/admin/offers` (Account → Membership offers), using the existing admin UUID allowlist. The allowlist is reused independently of the research-email enable switch.

## Behavior

- Monthly plan only: card required, 30 free days, then $10/month. Annual remains $100/year.
- The offer is read server-side on each new checkout; no deploy is required to toggle it.
- Checkout reservation stores the offer and email, so retries and open checkouts retain their terms when the toggle changes. New sessions expire approximately 31 minutes after reservation; existing pre-release sessions keep their existing expiry.
- Signed-in email takes precedence over form input. Guest buyers enter their email before Stripe; Stripe receives it as the customer email. Verified email ownership is still required to claim the browser membership permanently.
- Per-mode account, normalized email, previous purchase, manual membership and Stripe customer history checks restrict repeat offers. The private reservation ledger serializes matching emails and permanently records completed trials. Abandoned reservations release after expiration plus ten minutes. This does not identify the same person using different email addresses/cards; do not advertise perfect abuse prevention.
- Trial access is based on verified Stripe trial status and trial_end, independently of the admin toggle. Cancellation/expiry end access. Failed first payment has no renewal grace. Zero-dollar trial invoices are not paid-through evidence. Paid subscribers retain existing renewal grace behavior.
- Trial members participate in the existing opted-in notification eligibility checks; no preferences are automatically enabled.
- Email reminder delivery is not added to the research system. Configure Stripe's customer trial-reminder email settings before offering trials publicly.

## Validation

`node --test scripts/test-premium-trials.cjs` covers policy, SQL settings, fixed reservations, duplicate eligibility, ownership claim, webhook ordering, and role isolation. Included in `npm run test:offline`.

`node scripts/test-trial-checkout-sandbox.cjs --sandbox` explicitly uses local Supabase and sk_test credentials, creates a synthetic test user and checkout, checks card collection and retained checkout terms after disabling the offer, then expires the Stripe checkout and restores the original toggle. It does not submit payment or send email. Test user/customer remain as test audit records.

Before production activation, complete a sandbox checkout with a test card and exercise trial → successful first charge, failed first charge, cancellation, account claiming, and notification eligibility. Use Stripe test clocks where supported for time advancement. Automated policy/SQL checks do not prove real webhook delivery or inbox delivery.

## Later production rollout (not authorized by this local build)

1. Apply `202610110002_premium_trials.sql` after existing billing migrations. Keep live setting OFF.
2. Deploy the website and update the research Lambda once, because its membership eligibility code now recognizes trials. This is a worker logic change, not a return to uploading it for each article.
3. Verify Stripe portal cancellation works during trials and enable/configure trial reminders. Verify current supported subscription/invoice webhooks reach the production endpoint.
4. Perform the approved production rollout and use the admin setting to enable the offer when desired. Turning OFF does not revoke existing trials.

No Stripe price changes, discounts or separate trial products are needed.
