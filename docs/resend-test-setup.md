# Resend developer-only delivery test

This is a separate local CLI, not a subscriber broadcast endpoint. The website stays dry-run. Production Supabase SMTP and local Mailpit remain unchanged.

## Fill in the private configuration
Open `.local-development/resend-test.json` in your editor. It is ignored by Git and owner-readable only. Enter:

```json
{
  "apiKey": "YOUR_RESEND_SENDING_KEY",
  "from": "Sacco Premium <YOUR_VERIFIED_SENDER_ADDRESS>",
  "recipient": "YOUR_OWN_EMAIL_ADDRESS"
}
```

Create a sending-access API key in Resend, restricted to the verified sending domain if available. This is the research-test key; do not replace your existing authentication SMTP password. Do not paste the key into chat. No restart is required: the CLI reads this file on each invocation. It is NOT loaded by the website.

The sender must use a domain verified in your Resend account. Use Resend's issued DNS records; no live DNS or SMTP change was performed here. The recipient must be exactly one address, preferably your own. No CLI recipient override is accepted.

## Preview and send
From the website repository, with Docker and local Supabase running:

```
npm run email:test -- list
npm run email:test -- preview WEEKLY_OUTLOOK_PUBLISHED:weekly-outlook-001
```

Preview prints the sender, sole recipient, subject, CTA and previous attempt status. It saves HTML in `.local-development/resend-test-preview.html`. It sends nothing.

When ready to send one REAL email to that configured address:

```
npm run email:test -- send WEEKLY_OUTLOOK_PUBLISHED:weekly-outlook-001 --send-to-configured-test-recipient
```

Use keys from `list` to test one Opportunity and one material update too. Selecting a material-update key for this explicit send is the operator's choice; no edits trigger messages. Subjects are marked LOCAL TEST. Once attempted, each event is locked even on failure/uncertain timeout. There is no resend command. Resend idempotency keys provide additional protection; accepted means accepted by provider, not verified inbox delivery.

Recipient selection NEVER reads Premium membership lists: it uses only the single configured address. Logs are in the LOCAL `developer_email_test_log`, separate from research dry-runs. Atomic database reservations cap these tests at 10 per rolling 24 hours, 100 per rolling 30 days and one reservation per two seconds. Failed/uncertain attempts consume the budget. Other sends on your Resend account also consume provider quota; these local limits cannot reserve capacity used by other applications. Provider errors stop the operation without retries.

Links intentionally point to localhost:3082. Inspect the email appearance on your phone, but open its links on the computer running the development site. Phone localhost is the phone, not this computer. Full remote-device navigation needs a separately approved staging URL; no production links or public tunnel are substituted.

## Reinitialization and remaining rollout
`npm run email:test -- init` reapplies the idempotent local schema and preserves configuration/logs. Run it after a local database reset. The schema is under `supabase/local`, outside production migrations.

Still required before subscriber rollout: production secret provisioning, production administrator assignment, production migrations and live send wiring, shared-account quota policy, unsubscribe review, approved sender DNS and delivery testing. Authentication can later be moved to Resend SMTP using a separate key after testing signup/reset/login links; no authentication change is needed for these research tests.
