# Research broadcast batches

One preview/queue action snapshots all eligible recipients (up to the 50,000-recipient monthly application budget). SQL reserves the total once and atomically creates jobs with at most 100 recipients each. The unique event/mode/batch index prevents duplicate jobs. Each worker invocation processes one batch; the existing schedule processes subsequent batches.

The worker rechecks eligibility for that batch's original recipient IDs before dispatch. Changes cancel that batch for review rather than sending to unsubscribed or newly ineligible members; new members are not silently added. Preparation retries never revisit sent batches. Provider dispatch uncertainty remains locked, without automatic resend. Each batch has a distinct provider idempotency key. The parent log aggregates provider receipts and completes only when all batches finish; the admin UI shows accepted-recipient and completed-batch counts.

Research budgets: no daily cap, 50,000 recipients per rolling 30 days. This does not meter authentication or other email clients, and is not the provider's billing-period counter. Reservations, including failed attempts, count against the application budget.

## Production rollout

1. Disable the EventBridge schedule and allow any active Lambda invocation to finish. Avoid queuing new notifications during rollout.
2. Apply `202610120001_research_email_paid_plan.sql` if not already applied, then `202610120002_research_broadcast_batches.sql` in production Supabase. The batching migration supports reruns and preserves existing jobs and provider receipts.
3. Deploy the website and upload `build/research-email-lambda.zip` to the existing Lambda. Existing environment variables remain unchanged. The old worker must not process new multibatch broadcasts: its whole-audience comparison would cancel them.
4. Confirm deployment, then enable the EventBridge schedule. Review a dry-run before sending a real broadcast.

No email is sent by the migrations or build. Historical reservations are not unlocked. Existing single-batch jobs retain their IDs, snapshots, and provider receipts. No weekly content-related Lambda upload is needed after this worker update.

Validation: `scripts/test-email-batches.cjs` exercises 201 recipients, unique audiences, atomic duplicate prevention, batch completion, partial preparation failure/retry, receipt aggregation, expired dispatch leases, and unauthorized SQL access. Existing queue tests cover preparation fencing and provider uncertainty. No test sends real email.
