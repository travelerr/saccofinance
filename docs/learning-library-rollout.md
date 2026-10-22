# Learning Library — local implementation

Routes: `/premium/learn` and `/premium/learn/lesson-1`.

Lesson 1 uses the supplied YouTube video, with no autoplay. Chapter buttons reload the embedded player at the selected timestamp; press Play to resume. Completion is manual, stored once per authenticated account, and reflected on the lesson, library and dashboard. Existing Start Here dismissal storage is unchanged.

Changed areas: lesson catalog/progress helper, protected learning pages and player, member navigation/product frame, dashboard/Start Here, both existing welcome templates, completion migration, and learning tests.

## Local validation

- Migration applied only to Docker `supabase_db_sacco-local`.
- Auth template cache refreshed only in local Docker Auth.
- Video playback and 4:51 chapter checked in the browser.
- Completion saved using the local test account; verified after refresh, on the library, and on the dashboard.
- Mobile layout checked at 390px, with no horizontal overflow.
- Unauthenticated lesson request redirects to login. Access tests cover disabled/expired memberships; action tests deny completion before Premium authorization.
- Database tests cover account isolation, anonymous denial, and duplicate completion without resetting the timestamp.
- Welcome tests cover lesson links, account instructions before the lesson, and unchanged Day 2/Day 5 emails.
- TypeScript check, applicable tests and production build passed.

## Later production rollout (requires explicit authorization)

1. Apply `supabase/migrations/20261021000100_premium_lesson_completions.sql` to the production database.
2. Deploy website code.
3. Replace the existing Supabase welcome/sign-in template with `supabase/templates/premium-signin.html`.
4. Build and upload the email-worker Lambda package for the existing-member Day 0 welcome change.

No production migration, deployment, Lambda replacement, or email send was performed. Do not send a separate lesson announcement automatically.
