# Research email safeguards — local implementation

Subscriber broadcasting remains disabled. Production infrastructure and real sending require explicit server flags; these remain unset. The local launcher rejects remote databases and every non-dry-run mode. No production configuration or subscriber email was changed by this work.

## Implemented

- Atomic PostgreSQL reservation serializes competing research jobs. The durable unique event/mode reservation blocks repeat sends even after a timeout or logging failure.
- `research_email_limits` holds shared research budgets: 80 recipient attempts per rolling 24 hours, 2,000 per rolling 30 days, plus two seconds between reservations. Failed and uncertain attempts consume budget. Dry-run and live ledger counts are separate. Missing configuration fails closed.
- The service-only `paused` switch stops new reservations. It does not cancel an already reserved operation. The existing application gate continues to disable all live broadcasts.
- Accepted provider outcomes are not rewritten as empty failure records when completion logging fails. No automatic retries are performed. Provider acceptance is not proof of inbox delivery.
- Local dry runs re-resolve eligible recipients after reservation and prepare individual research unsubscribe links. Tokens contain 256 random bits; only hashes and user IDs are stored in a private table. Templates support individual footer links and List-Unsubscribe headers.
- `/email/unsubscribe` requires no login. GET displays confirmation without changing preferences. POST requires the token and List-Unsubscribe=One-Click, disables only research preferences, and is repeatable. Tokens remain valid so older messages still work. Signing back into the account permits opting in again. Responses are non-cacheable and suppress referrers. The endpoint supports explicitly enabled production infrastructure independently of sending being paused.

## Validation

`npm run test:offline` includes SQL budget, pause, privacy and unsubscribe tests, route tests proving GET does not mutate, and accepted-send persistence failure tests. TypeScript also passes. Migration 202609220002 was applied with `supabase migration up --local` without resetting local accounts.

## Before production rollout

The personalized transport and bounce/complaint suppression have now been implemented, with explicit production gates that remain unset. See [the production rollout guide](research-email-production.md) for exact settings and the restricted single-address test procedure. The local launcher remains dry-run only.

The research budget does not measure Supabase SMTP, developer test sends, or other clients using the same Resend account. Confirm actual provider limits and reserve authentication capacity before rollout. Do not delete reserved/failed log rows to retry an uncertain send; reconcile with provider records first.

Protocol reference: https://www.rfc-editor.org/rfc/rfc8058
