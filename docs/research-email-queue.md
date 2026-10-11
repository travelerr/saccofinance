# Durable research email queue — local rollout

## Local use

`npm run dev` starts the website, existing local Stripe listener, and the research email worker. The worker inherits the protected local environment: loopback Supabase only, dry-run only, no Resend credentials or AWS calls. `npm run email:worker -- --once` runs one local claim for diagnostics. Do not start another dev server if one is already running.

Open `/premium/admin/notifications`, select an event and preview it. The template renders while the audience is resolved. Enrollment is checked only on request. Queue a dry-run and watch status update without refreshing. Closing the browser does not stop the worker.

Migration `202610110001_research_email_jobs.sql` is applied locally. The previously pending local 90-recipient limit migration was also applied. No production migrations or data were changed.

## Design and safeguards

- Memberships/subscriptions are loaded in batches, using the existing manual-grant and billing eligibility functions. Auth identity lookups have concurrency six. OFF, unverified, banned, expired, grace-period and suppression rules remain enforced.
- Template rendering makes no audience queries. Preview and enqueue fingerprints cover content, mode and exact user/email pairs. Enqueue checks eligibility once; the background worker rechecks before preparation and again before dispatch.
- Reservation and job insertion are one transaction. Existing event/mode uniqueness and budget limits remain authoritative. One send remains limited to 100 recipients; reservations remain charged through retries.
- Jobs snapshot the approved event, audience, sender and origin. Content/config/audience changes cancel preparation; they do not silently broaden the send.
- Unsubscribe links use one insert for the batch; raw tokens are not stored in jobs/logs. The service-only queue contains audience addresses, so keep RLS and restricted grants intact. A production retention policy for terminal job snapshots should be agreed before rollout.
- Atomic claim with row locking and a five-minute lease prevents competing workers. Dispatch requires the current unexpired lease. An old worker cannot send after reclamation.
- A crash before dispatch can reclaim preparation, up to three attempts. Ordinary preparation failures wait 30 seconds before retry. After three failures, the administrator can retry preparation only if dispatch never started. Neither this action nor automatic retries create another budget reservation.
- The dispatch marker is persisted before calling Resend. Timeout, process loss or an uncertain response after that marker blocks retries and requires provider reconciliation. The stable existing provider idempotency key remains unchanged, but we do not rely on its retention window for durable duplicate protection.
- Provider acceptance and inbox delivery are distinct. Accepted IDs are saved atomically with completion. A lost completion response does not enable another send.
- Historical `reserved` logs have no queue job and stay locked. This migration never unlocks the stuck production Outlook.
- Admin-only status polling reads job/log status, not the entire audience. No API keys, recipient addresses, raw provider errors or tokens are returned to the browser.

## Production is NOT enabled by this local work

Do not deploy only the website and expect background processing. Production requires the migration plus a separately supervised worker running this release and supplied with the existing approved server configuration/Secrets Manager access. `node scripts/research-email-worker.cjs --configured` consumes that supplied environment; it does not load dotenv files. Run a single process or multiple processes using the database claim protocol. Monitor process health and delayed/uncertain jobs.

A Lambda package is now available; see [Lambda deployment](research-email-lambda.md). Building it does not deploy or enable production.

Before production rollout: verify graceful shutdown/restart and alarms, agree retention, apply the migration, start the worker, then deploy the UI/queue changes. Keep live dispatch disabled until a controlled pilot is authorized. Test with the actual production timeout/runtime constraints; local timings do not establish production timings.

## Existing stuck production Outlook

Still untouched. Reconcile the historical reservation against Resend account/API records and request logs before a separately authorized recovery. Do not delete the log or manufacture a new event key to bypass duplicate protection. The new safe preparation retry applies only to new jobs with proof that dispatch never began.
