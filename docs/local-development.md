# Sacco Financial — dedicated local development

## Open the environment
Docker Desktop must be running. From the website repository:

```
npm run local:start
npm run dev
```

Keep the website terminal running. All services bind to localhost:

| Service | URL |
| --- | --- |
| Website / login | http://localhost:3082/premium/login |
| Administrator notifications | http://localhost:3082/premium/admin/notifications |
| Supabase Studio (LOCAL database management) | http://127.0.0.1:54323 |
| Local authentication email inbox | http://127.0.0.1:54324 |
| Local Supabase API | http://127.0.0.1:54321 |

The website displays a yellow LOCAL TEST SITE banner. Studio is the LOCAL database; it does not show production users. Use localhost:3082 consistently for the website to keep cookies and auth redirects consistent. The database remains at 127.0.0.1:54321.

## Test logins
Login email: `admin@sacco.test`. Its generated password is in `.local-development/credentials.json`, alongside all fixture accounts. Open that file locally; never commit it or copy these identities into production. The same generated LOCAL-only password works for each fixture account. Admin and lifetime users have complimentary grants.

| Email | Membership / purpose | Research notifications after seed |
| --- | --- | --- |
| admin@sacco.test | Local administrator + lifetime Premium | OFF |
| lifetime@sacco.test | Lifetime Premium, not administrator | ON |
| paid@sacco.test | Active paid subscription fixture | ON |
| canceled@sacco.test | Cancellation scheduled; paid access remains | ON |
| grace@sacco.test | Renewal failure within grace period | ON |
| expired@sacco.test | Expired paid access | ON, but ineligible |
| free@sacco.test | No Premium entitlement | ON, but ineligible |
| optout@sacco.test | Active paid subscription fixture | OFF |

After seeding, four recipients qualify. Enabling the administrator's Account preference makes five. No real payment occurred for any fixture. Billing dates are relative to the seed date; reseed to refresh them after time passes. Seeding resets the fixture preferences to this table but does not erase notification logs or unrelated local users.

## Notification walkthrough
1. Log in as admin@sacco.test.
2. Open Account and enable Premium research notifications; save and reload to verify persistence.
3. Open Manage research notifications. Choose a published event and preview it.
4. Check its title, CTA, recipient count and existing log. Run the dry-run.
5. The local log records dry_run; the same event cannot run twice. Material updates need explicit confirmation.
6. A paid member can read research but receives a 404 on the admin page.

Dry-run does NOT produce a delivered email in the inbox. The inbox captures local Supabase AUTH emails (password reset/sign-in), not research dry-runs. Resend remains disabled.

## Lifecycle commands
- `npm run local:setup`: first startup plus fake-user seeding.
- `npm run local:start`: start existing local services; preserve users and data.
- `npm run dev`: start the website with forced local credentials and a separate `.next-local` build directory.
- `npm run local:status`: verify loopback binding; show service links without secrets.
- `npm run local:seed`: restore/refresh the eight fixture accounts and their preferences/dates.
- Ctrl+C in the website terminal: stop the website.
- `npm run local:stop`: stop this project's Supabase containers while preserving their local data.
- `npm run local:reset -- --confirm-local-reset`: delete and rebuild ONLY this project's local test database, apply migrations and seed. Restart the website afterward because user UUIDs change.
- `npm run test:offline`: unit and isolated PostgreSQL tests, no running services needed.
- `npm run test:local`: local Auth/database smoke tests using the generated fake credentials; requires local:start.

## Isolation and production workflow
`supabase/config.toml` identifies `sacco-local`; the Docker bridge `sacco-local-only` defaults published ports to 127.0.0.1. Startup verifies every published Supabase port. The CLI is pinned as a development dependency. No Supabase cloud project is linked. PostgreSQL 17 is the local development version; production server-version parity still needs a read-only check before a release.

The launcher starts with a small OS-environment allowlist, masks keys found in Next dotenv files without copying their values, and supplies generated local keys. Existing .env.local and billing-live files are preserved. Next may still announce that .env.local exists; its values are overridden/blanked in the protected launcher. Keep using npm run dev, not a bare next command.

SACCO_LOCAL_DEVELOPMENT enables only verified local fixture behavior. Canonical Premium-access calculations still read actual local subscription rows. Stripe network operations are rejected; account billing sync and purchase-claim lookup skip external reconciliation only in verified local mode. Stripe webhook forwarding/checkout is disabled until a separate sandbox is configured. `stripe:listen` now fails with an explanation instead of loading the old live environment file. Market Strength uses the saved snapshot without triggering a Yahoo refresh locally. There are no changes to production access rules when the local flag is absent.

Publish code and SQL migrations through a separately approved release. Never promote seed data, local credentials, Supabase test volumes, or .local-development files. No automatic migration/push/deploy workflow was added. Existing production hosting/billing remains separate.

## What's intentionally not enabled
- Real research email delivery, sender DNS verification, and live Resend quota management.
- Stripe sandbox checkout integration (current local memberships are fixtures).
- Hosted staging / a public preview URL.
- Automatic production migrations or deployments.

Local rendering does not prove Amplify behavior or email-client deliverability. Those need their own reviewed staging/delivery tests before production.

## Verified setup results
- Docker Desktop started; pinned Supabase CLI installed; five SQL migrations applied to the new local database.
- All exposed Supabase ports verified loopback-only. Stop/start preserves fixture users and data.
- Eight fake logins tested against local Auth/database; all eight access states also checked through Chrome.
- Administrator preference persistence, five-recipient preview, dry-run log, duplicate blocking, paid-member admin denial, research detail routes and returning session checked in the browser.
- Local password reset captured in Mailpit. No external delivery.
- 36 offline tests, TypeScript check, and local production build passed.
- Standardized the website origin on localhost to prevent Next development redirects from crossing cookie hostnames. Database remains 127.0.0.1.
- Test-created Weekly Outlook dry-run log cleared and admin opt-in restored OFF so the first manual walkthrough is fresh.
- No production data/infrastructure changed; no commit, push, deployment, real payment or subscriber email.
