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


## Private 30-day invitation (November 17, 2026)

The unlisted `/premium/join?offer=…` link offers 30 free days on the monthly plan only. It requires a card and renews at $10/month unless canceled. It does not turn on or change the public trial setting. Do not add this link to navigation or public marketing. Anyone who receives or is forwarded the link can use it, subject to the existing new-member eligibility checks; it is not bound to a recipient.

The invitation token and its independent enabled flag are stored in the service-role-only `premium_trial_settings` table. Admins can copy the link and turn it On or Off at `/premium/admin/offers`. The existing link is preserved when toggling. The page, checkout submission, and checkout service read the current private setting; the reservation function also rejects private requests while disabled. No deployment is needed to toggle it. Already-created Stripe checkouts retain their promised terms until they expire; existing subscriptions are unaffected. Query strings are excluded from analytics, and the join page suppresses referrers.

Before deploying the private-link code, apply `supabase/migrations/202611170001_private_trial_invitation.sql`. It adds a service-role-only function overload, preserves the existing public checkout function, and changes no tables or public offer settings. Invitations fail closed if the migration is missing. The server validates the invitation again on submission, restricts it to monthly, and rejects a reservation unless it contains 30 trial days. A conflicting paid checkout must expire successfully before its reservation can be replaced.

Validation: `node --test scripts/test-premium-trials.cjs scripts/test-checkout-switch.cjs`. Exercise the private checkout in Stripe test mode before rollout and verify that ordinary `/premium/join` retains its public terms. Never submit a live test payment or send the invitation automatically.


### Admin controls rollout

Apply `202611170002_private_offer_controls.sql` before deploying the admin controls. It adds two columns to the existing protected settings table and checks the private flag in the reservation function. Populate `private_offer_token` with the existing invitation token using service-role access (never commit the token to source). Keep the public `enabled` setting unchanged. The new private enabled flag defaults to true to preserve the existing invitation during rollout, while missing tokens fail closed.

Checks: `node --test scripts/test-private-offer-controls.cjs scripts/test-premium-trials.cjs scripts/test-checkout-switch.cjs`. The private Stripe sandbox script also verifies disabling blocks checkout and re-enabling restores the existing session. No payments or emails are submitted.
