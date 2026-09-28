# Sacco Financial analytics — development branch

Branch: `analytics-tracking`. Main publishing checkout remains `../social-media`.
GA4 production measurement ID: `G-TJ3SYV03LG` (public identifier, not a credential).
No production settings have been changed. No migration is needed for this foundation.

## What is implemented

- Basic opt-in analytics: no Google script or analytics events before permission. Optional cookies can be declined or revoked; Global Privacy Control also disables collection.
- Production requires GA_ANALYTICS_ENABLED=true, canonical HTTPS AUTH_SITE_URL and live Stripe mode. All other environments fail closed. Local preview never sends to Google even with a production ID present.
- Verified research administrators are excluded in production. Authentication, password, unsubscribe, administrator, API, and unknown routes are excluded from page tracking. Existing billing and access controls are unchanged.
- Server checks identity before enabling the client. Verified members use a SHA-256 pseudonym of their Supabase UUID. Names, emails, passwords, tokens, free-form text and full URLs are not collected by our events.
- Explicit page and navigation events; known social/free-guide outbound destinations are categories, not full URLs. Google enhanced measurement MUST be disabled before rollout to avoid duplicate SPA page views and automatic form/link collection.
- First touch and latest non-direct campaign persist for 90 days after consent. Only approved source/medium values and short campaign/content slugs are accepted. Internal/Stripe/Supabase returns never replace attribution. Users without consent or blocked GA are not attributed in GA; Stripe remains the total-payment authority.
- Once per page mount, `research_engaged` requires 30 seconds of active/visible reading and >=50% document depth. It is an engagement estimate, not proof of completion. Only one custom engagement milestone is sent; the one-second timer never emits heartbeat events.
- Email research CTA links receive non-personal UTM tags; unsubscribe URLs and auth links do not. Existing notification event keys and duplicate protections are preserved. Previously sent email links cannot be retroactively tagged.
- Checkout consent/context is attached to Stripe Checkout metadata separately from the idempotent session-create payload. Updating analytics metadata cannot block checkout. It is a checkout-time consent snapshot, not a global cross-device consent registry.
- Live paid `checkout.session.completed` webhooks generate GA `purchase` events using the Stripe amount and checkout session transaction ID. GA uses that transaction ID for purchase deduplication. No success query parameter can generate a purchase.
- Confirmed login, account claim, and saved email preference milestones run after successful actions. These server events require consent context and an optional server measurement secret.
- Telemetry is best effort and never makes billing fail. A provider outage can leave GA conversion gaps; there is no durable analytics retry worker in this version. Do not use GA as financial accounting.

## Events and suggested funnel

| Event | Meaning |
| --- | --- |
| page_view | One explicitly tracked page navigation |
| premium_landing_view | Premium sales page loaded |
| subscribe_click | Link to join clicked; approved monthly/annual plan |
| join_view | Plan selection page loaded |
| checkout_requested | Valid form submitted toward Stripe; not proof Stripe loaded |
| checkout_error | Known checkout error returned |
| checkout_return_canceled | User returned via canceled checkout URL; not definitive permanent abandonment |
| purchase | Stripe confirmed initial paid subscription checkout |
| account_claimed | Purchase attached to a verified login |
| login | Successful password or email-link sign-in |
| research_view | Published Outlook/opportunity rendered after access check |
| research_engaged | Estimated engaged reading milestone |
| chart_open | Full-size research chart clicked |
| navigation_click / outbound_click | Approved navigation destination |
| notification_preference_saved | Authenticated preference successfully saved |

Payment-first funnel: landing -> subscribe click -> join -> checkout requested -> purchase -> account claimed -> research engaged. Some existing members skip steps; use open and closed funnels deliberately. Checkout errors and the canceled return are diagnostic events.

## Local preview

Install dependencies normally with `npm ci` in a fresh checkout. This machine uses an ignored node_modules symlink to the existing identical dependencies.

From this isolated checkout:

```sh
npm run analytics:preview -- ../social-media/.local-development
```

Open http://localhost:3083. The existing main preview on :3082 stays running. The analytics preview reads only the validated local Supabase runtime; it does not copy hosted `.env.local`, use live keys, start a Stripe listener, send research emails, or mutate database schemas. It shares the existing local test database (not an isolated database). Checkout is deliberately unavailable because this preview has no Stripe credentials. The local Auth redirect allowlist may also need :3083 before testing email-link flows; that is not changed here.

Allow/decline analytics, navigate, and expand the Local analytics preview section at the bottom. Its bounded event list is memory-only. `window.__saccoAnalyticsPreview` contains sanitized test payloads for developer inspection. Local preview allows admin browsing so it can be inspected; production excludes research administrators.

## Google setup before enabling production

1. In the production web stream, turn OFF all Enhanced measurement, including automatic page views on browser history changes and form interaction tracking. Our integration owns event dispatch. Do not install a second tag through Tag Manager or paste another script into the site.
2. Keep Google Signals and advertising personalization off; this integration disables advertising consent/signals too.
3. Set event retention to 14 months if desired. Register event-scoped custom dimensions: first_source, first_medium, first_campaign, last_source, last_medium, last_campaign, content_id, content_type, destination, placement, plan, notifications_enabled. Register only what reports will use.
4. Create a separate GA4 test property if live Google DebugView validation is desired. This version intentionally refuses Google collection from localhost; current verification uses the local preview. Production collection must be checked after an approved deploy, with an opted-in non-admin browser.
5. For server purchase/milestone tracking: create a Measurement Protocol API secret inside the production web stream. Store it as GA_MEASUREMENT_API_SECRET inside the existing AWS BILLING_SECRETS_ARN JSON. Do not put it in source, NEXT_PUBLIC variables, chat, or the Amplify build artifact. This is optional for page events, required for server events.
6. Once reviewed and approved, set Amplify GA_ANALYTICS_ENABLED=true and deploy. The default is false. Rollback: set false and redeploy. No paid Google Analytics 360, BigQuery, or paid connector is needed.
7. Verify Realtime with a consented non-admin visit and tagged campaign. Check actual collection payloads for sanitized page URLs; verify one page view per navigation, decline/revocation, production admin exclusion, a real authorized paid checkout and transaction deduplication. Never buy or email users automatically as a test.

## Bio links (ready to use after deployment)

- TikTok: https://saccofinancial.com/premium?utm_source=tiktok&utm_medium=organic_social&utm_campaign=premium_bio&utm_content=bio
- Instagram: https://saccofinancial.com/premium?utm_source=instagram&utm_medium=organic_social&utm_campaign=premium_bio&utm_content=bio
- Facebook: https://saccofinancial.com/premium?utm_source=facebook&utm_medium=organic_social&utm_campaign=premium_bio&utm_content=bio
- YouTube: https://saccofinancial.com/premium?utm_source=youtube&utm_medium=organic_social&utm_campaign=premium_bio&utm_content=channel

For individual videos, use a short campaign slug with no personal information.

## Next reporting stage (not implemented or represented as live data)

The embedded admin Analytics dashboard still needs the numeric GA4 property ID and read-only Google Analytics Data API access (service-account credentials stored server-side, with Viewer access to that property). The G- measurement ID alone cannot authorize reading reports. We will combine GA traffic/content/funnel reports with existing Supabase preferences and Stripe subscription records.

Delivery/open/click metrics need Resend webhook/reporting work beyond the existing bounce/complaint/suppression handler. UTM article visits are implemented now; open rates and delivered counts are not. Email preference counts already exist in the database but are not yet exposed as an analytics dashboard. Renewal, cancellation and retention reports also belong to the next reporting stage. No fake numbers or empty charts are presented as completed reporting.

## Validation on September 28, 2026

- Full existing offline suite: 63 passed; analytics suite: 7 passed (70 total).
- Production Next.js build, TypeScript and lint passed with production analytics disabled and loopback test configuration.
- Safari local preview: zero events before consent, exactly page_view + premium_landing_view after allowing, revocation stopped events on a subsequent About navigation. Preview confirmed no Google delivery.
- Live GA receipt, actual production admin exclusion and a live Stripe conversion remain rollout checks; no production configuration or paid test transaction was performed.

## Admin reporting dashboard

`/premium/admin/analytics` uses the same verified-user UUID allowlist as email administration (`RESEARCH_ADMIN_USER_IDS`). Each data entrypoint checks authorization before reading credentials or cached reports. Links are available from Account and the email administration page. No database migration is required.

Production configuration:

- Amplify runtime setting: `GA_PROPERTY_ID=556204658` (the numeric property ID, not the G- measurement ID). The build whitelist now preserves this setting.
- Existing `BILLING_SECRETS_ARN` secret: `GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON`, whose **string value** is the entire service account JSON document. It is fetched at runtime, never written into the browser bundle or Amplify environment artifact.
- Service account has GA property **Viewer** permission; Google Analytics Data API is enabled in its Cloud project. No Cloud project IAM role is required for report reading.
- `GA_MEASUREMENT_API_SECRET` remains separate and supports server event collection, not report reading. Collection still requires `GA_ANALYTICS_ENABLED=true` with the existing production guards.
- Keep the stream's Enhanced measurement OFF to retain the intentional event allowlist.

Reports use OAuth's `analytics.readonly` scope, fixed Google endpoints, bounded timeouts and an in-process five-minute cache. No new paid service or dependency was introduced. Six small requests fetch overview, session attribution, selected events, research pages, devices and daily sessions. Date filters are 7/28/90 completed days through yesterday in the property's time zone. Top tables are limited to 20 rows and disclose truncation. API failures are unavailable, never zero; partial failures leave other panels usable. This is not realtime reporting.

Membership health uses the existing access rules and unique access owners. It includes manual grants and payment grace, isolates live/test billing, and distinguishes saved ON, saved OFF and missing preferences. These are current snapshots, not historical churn. Email records are the latest ten operations: accepted sends are not delivered messages, and intended recipients are not verified inbox deliveries. There is no email open/click report yet. No member emails or individual browsing histories are exposed.

Local mode never loads Google/AWS reporting credentials. It displays real **local test database** membership and email records with explicit disconnected Google panels. The preview launcher masks both Google credential variables and property configuration. Local browser preview events are not sent to GA and cannot populate these reports.

Validation: `npm run test:analytics` includes report parsing, partial failures, caching, signed read-only OAuth claims, malformed properties, local isolation, authorization before credentials, and deduplicated access/preference counts. `npm run test:offline` and the production build pass. A real Google report request still needs to be verified in the approved production deployment; configuring credentials alone does not prove access.

Reference: [Google Data API schema](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema), [service-account OAuth](https://developers.google.com/identity/protocols/oauth2/service-account).
