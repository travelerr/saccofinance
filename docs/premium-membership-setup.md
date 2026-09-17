# Premium membership setup

The site uses Supabase Auth for identity and `premium_memberships` for access. Accounts alone never grant Premium access. No Stripe integration is included yet. No service-role key is needed in the website.

## Supabase project steps

1. Run `supabase/migrations/202609160001_premium_memberships.sql` in SQL Editor once.
2. Authentication → Sign In / Providers → Email: keep email login enabled and disable **Allow new users to sign up**. Keep email confirmation enabled. Set the minimum password length to 12.
3. Authentication → URL Configuration: production Site URL `https://saccofinancial.com`. Allow redirects to `http://127.0.0.1:3082/premium/auth/callback` and `https://saccofinancial.com/premium/auth/callback`. Add exact localhost callbacks if testing there too.
4. Authentication → Email Templates: set the Invite user link to `{{ .SiteURL }}/premium/auth/confirm?token_hash={{ .TokenHash }}&type=invite` and Reset password link to `{{ .SiteURL }}/premium/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`. This token-hash flow works across devices and does not depend on the browser that requested the email. For local testing set Site URL to `http://127.0.0.1:3082`; restore the production origin before inviting real members.
5. Authentication → Users → Invite user: invite your own email. No admin invitations are sent by the site.
6. Copy the invited user UUID. In Table Editor insert a `premium_memberships` row with `user_id` = that UUID, `enabled` = true, `access_source` = manual, and `access_expires_at` = null. Alternatively run the SQL below with the actual UUID. Never enable all users automatically.

```sql
insert into public.premium_memberships (user_id, enabled, access_source)
values ('REPLACE-WITH-INVITED-USER-UUID', true, 'manual')
on conflict (user_id) do update set enabled = true, access_expires_at = null;
```

Disable a member by setting `enabled` false. Access is checked on every protected request; missing tables, failed lookups, missing/expired grants all deny access. Members can only read their own grant and cannot edit access.

## Environment

Local `.env.local` has the supplied public URL/key and the local auth origin. For production configure these in the actual hosting provider's environment before building:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `AUTH_SITE_URL=https://saccofinancial.com`

The repository `amplify.yml` runs `scripts/prepare-amplify-env.cjs` before building to copy only these three variables to `.env.production` for the server runtime. It fails the build when required settings are missing, rather than deploying broken login. Public env values must exist at build time. No database password, secret key, or service-role key should be added. Email delivery to external members requires configuring a custom SMTP provider: Supabase's default sender is intended for testing and has recipient/rate restrictions. Do this before real invitations.

## Acceptance checks before deployment

- Logged out: sales page loads; dashboard, Gauge, board, details and archived Issue 001 redirect to login; Gauge/chart endpoints return 401 with no content.
- Invited account with no grant or disabled/expired grant: member access page; endpoints return 403.
- Enabled invited member: dashboard, Gauge, filters, detail, private chart and archived anchors work.
- Invite and reset emails: open link, set password, then log in; reset works across browsers.
- Logout: revisit a protected URL and confirm it is denied. Members cannot insert/update their own grant via Supabase API.
- Test desktop and mobile login forms and unchanged public pages.

Previously public Premium pages and chart URLs may remain in an existing hosting/CDN cache. Invalidate those paths when deploying this access change and verify private responses are not shared-cacheable. The original chart asset has been removed from public; the new chart route is authenticated and bypasses the image optimizer. Copies previously downloaded cannot be recalled.

Stripe subscriptions, public registration, billing portal and account profile screens are deferred. Content remains in the existing server-only files and saved Gauge snapshots.
