# Research email rollout

The personalized sending path and signed suppression webhook are implemented locally. Production has not been configured or deployed. Local startup always strips real email keys and production flags, and runs dry-run only.

## Production settings to prepare

Use Amplify environment variables for the non-secret settings below. Credentials belong in AWS Secrets Manager, not Amplify variables or committed files:

- RESEARCH_EMAIL_ENABLED=true enables preferences, unsubscribe handling and webhook persistence. Keep this enabled once messages have been sent, even when sending is paused.
- EMAIL_SEND_MODE=dry-run initially.
- RESEARCH_BROADCAST_ENABLED=false initially.
- RESEARCH_TEST_RECIPIENT=justin@saccofinancial.com restricts the resolved audience to this address. It still requires a verified account, eligible Premium access, opt-in and no suppression. This restriction applies even if broadcasting is enabled.
- RESEARCH_ADMIN_USER_IDS=the production administrator's Supabase user UUID. The local test admin UUID is different.
- AUTH_SITE_URL=https://saccofinancial.com and the production Supabase URL/service key must already be correct.
- RESEARCH_EMAIL_FROM=the verified Resend sender, such as noreply@saccofinancial.com.

In AWS Secrets Manager, edit the existing JSON secret identified by Amplify's BILLING_SECRETS_ARN. Preserve every existing key and add RESEND_API_KEY and RESEND_WEBHOOK_SECRET. SUPABASE_SECRET_KEY must also be present (already used by billing). The email reader falls back to BILLING_SECRETS_ARN and BILLING_AWS_REGION and returns only these three email-related keys. It caches them for up to 60 seconds. Billing logic is unchanged.

Alternatively, set EMAIL_SECRETS_ARN and EMAIL_AWS_REGION in Amplify to a separate JSON secret containing those three keys; the Amplify SSR compute role then needs secretsmanager:GetSecretValue permission for that secret and kms:Decrypt if using a customer-managed KMS key. Reusing the existing secret avoids changing the current access policy.

The build exports only the non-secret email flags, test address, admin IDs, sender, ARN and region to the server environment. Raw Resend/Supabase secret values are never copied by the build script. Production email has no fallback to plain environment credentials. Local simulation uses only its local database key and never calls AWS.

Deploy the reviewed code with sending disabled and apply migrations 202609220001, 202609220002 and 202609220003 to the correct production database after checking which are already present. Local migrations have been applied; no production migration has been run.

Create a Resend webhook targeting https://saccofinancial.com/api/email/resend-webhook and subscribe to email.bounced, email.complained and email.suppressed. Add its signing secret as RESEND_WEBHOOK_SECRET in the Secrets Manager JSON entry. The handler verifies the raw body's Svix signature and timestamp before writing. It acknowledges only after the transaction succeeds; database failures return 503 for provider retry. Signed unrelated events are ignored. It never stores raw payloads or recipient addresses in webhook logs.

Suppression hashes use normalized addresses and are shared across all research sends. Duplicate webhook deliveries are harmless. Opting back into preferences does not clear a bounce/complaint suppression. Suppressions do not alter billing or authentication settings. Events from authentication emails using the same Resend account can also suppress that address from future research mail.

## Controlled production test

Keep RESEARCH_BROADCAST_ENABLED=false and RESEARCH_TEST_RECIPIENT set to Justin. Verify the production account is opted in and has Premium access. Switch EMAIL_SEND_MODE to live only for the controlled test; the admin preview must show one eligible recipient. Review the preview and send once. Validate the email, authenticated research link, unsubscribe footer and mailbox one-click behavior. Verify DKIM covers the unsubscribe headers. Repeating the event must be blocked by its durable live reservation.

A pilot consumes the event's live reservation; that event cannot subsequently be broadcast to everyone. Use a different genuinely published event for the eventual subscriber rollout. Do not remove logs to resend.

Before broad sending, confirm the business contact/footer details, real account quota headroom for SMTP, sender DNS, and webhook delivery. Enable RESEARCH_BROADCAST_ENABLED and remove RESEARCH_TEST_RECIPIENT only in an explicitly approved rollout. Pausing the research_email_limits row blocks new reservations and is checked again just before dispatch; it cannot recall an in-flight provider request. Keep RESEARCH_EMAIL_ENABLED on to preserve unsubscribe and webhook processing.

## Validation and limits

51 automated tests cover existing functionality and the added safeguards. They include real signed fixture verification, tampering and stale signatures, suppression persistence/privacy/replay, fail-closed lookup errors, individualized payloads and default-off gates. No real email is sent by these tests.

`sent` in the notification log means provider acceptance, not inbox delivery. Ambiguous outcomes remain reserved with no automatic retry. Budget accounting covers research sends, not external SMTP/developer sends. A suppression or opt-out arriving after the final eligibility check cannot recall a request already sent to Resend.

Protocol/provider references:
- https://resend.com/changelog/managing-webhooks-via-api
- https://www.rfc-editor.org/rfc/rfc8058

## Member enrollment and signup

The administrator page offers an enrollment preview and button for verified, eligible existing members with no preference row. It excludes saved ON/OFF preferences and suppressed addresses, and never overwrites a preference created after preview. A changed candidate list requires a refreshed preview. Enrollment sends no email and applies to all eligible members even with the test-recipient sending restriction active. No new database migration is required.

New members can opt in with an unchecked optional checkbox in the welcome-link “Save your login” step. The verified POST saves their choice after the purchase is claimed. An unchecked choice creates OFF for a new member without overriding an existing preference; a checked choice explicitly enables notifications. Suppressions remain independent. If saving the preference fails, account creation continues and displays a message linking to Account settings.
