# Monthly-to-annual upgrade (local implementation)

No schema migration or Lambda upload is required. The existing subscription webhook and account refresh reconcile the annual price and paid period. The existing required-reason cancellation flow and general billing portal remain unchanged.

## Behavior

My Account offers **Switch to annual — $100/year** for a single active, paid monthly membership that is not scheduled to cancel. Stripe's hosted confirmation shows unused-time credit and the exact charge. The existing subscription item is switched; no new checkout/subscription is created by the button. Annual renewals are $100/year. Trialing, delinquent, scheduled-to-cancel, and already-annual members do not see the upgrade card. Server-side checks repeat authorization and eligibility against live Stripe state, including a paid latest invoice and no pending update.

## Local validation

- `npm run test:annual-upgrade` — authorization, status, cancellation, unpaid invoice, portal configuration and confirmation-session guards.
- `npm run test:annual-upgrade:sandbox` — requires local Supabase and `.local-development/stripe-sandbox.json` with test credentials. Creates isolated test objects, creates a dedicated sandbox upgrade portal configuration if missing, and saves only that configuration ID to the local sandbox file. Deletes its own customer/subscription/user fixtures afterward. Does not send email.
- Restart `npm run dev` after sandbox configuration is created.

Manual browser checks with a real sandbox monthly member (not a `sub_local_` simulated fixture):

1. Open `/premium/account` on desktop and at 390px mobile width. Check spacing, readable copy and full-width mobile button.
2. Click Switch to annual. Confirm Stripe shows $100/year, unused-month credit, and an exact amount due. Back out: membership must remain monthly.
3. Repeat and confirm using sandbox payment details. Return to Account: annual plan, new renewal date, retained Premium access, and no upgrade button. Verify only one Stripe subscription exists.
4. Repeat with a separate sandbox member whose payment fails: no annual access should be granted before payment; verify the original membership's paid access remains available.
5. Check annual, trial, past-due, scheduled-cancellation and complimentary accounts; no upgrade card. Confirm Manage Subscription and required-reason cancellation still work.

The automated integration test exercises Stripe API payment and reconciliation, including declined-payment recovery. It creates a real hosted confirmation session but does not click the hosted payment confirmation. That final browser flow is a separate manual test.

## Future production enablement — approval required

Create a dedicated LIVE Stripe portal configuration with subscription price updates enabled, only the canonical annual price offered, `proration_behavior=always_invoice`, no scheduled-at-period-end conditions, and subscription cancellation disabled. Do not replace the existing general portal configuration. Set `STRIPE_UPGRADE_PORTAL_CONFIGURATION_ID` in Amplify to this configuration ID, then deploy approved code. The upgrade UI stays hidden when this variable is absent. Validate a controlled live change before announcing it. No production settings are changed by the local setup script.

Annual-to-monthly switching is not included in this release.
