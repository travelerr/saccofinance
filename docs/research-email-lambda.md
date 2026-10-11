# Research email Lambda deployment

This worker is packaged locally; production has not been migrated, deployed or enabled by building it. The existing stuck reservation is not unlocked by this setup.

## Build and upload

Run `npm run email:lambda:build` from the repository. Upload `build/research-email-lambda.zip` under Lambda Code → Upload from → .zip file. The archive contains only the bundled code and dependencies, no dotenv files or credentials. Handler: `index.handler`. Runtime: Node.js 22.x; architecture: x86_64; memory: 512 MB; timeout: 120 seconds. No VPC or Function URL required. Logs use the basic execution role. Set CloudWatch log retention to 14 days.

The execution role needs `secretsmanager:GetSecretValue` on the existing secret ARN. If that secret uses a customer-managed KMS key, it also needs `kms:Decrypt` on that key and the key policy must permit access. The existing code reads one JSON secret containing SUPABASE_SECRET_KEY, RESEND_API_KEY and RESEND_WEBHOOK_SECRET. Live-mode policy requires all three. Do not put secret values in the ZIP, public variables or test event.

## Lambda environment variables

Copy matching production values from the website; Lambda does not inherit Amplify settings.

| Variable | Initial value |
| --- | --- |
| RESEARCH_WORKER_ENABLED | false |
| RESEARCH_EMAIL_ENABLED | true |
| EMAIL_SEND_MODE | dry-run |
| RESEARCH_BROADCAST_ENABLED | false |
| EMAIL_SECRETS_ARN | Existing secret ARN |
| EMAIL_AWS_REGION | Region containing the secret |
| NEXT_PUBLIC_SUPABASE_URL | Production Supabase project URL |
| AUTH_SITE_URL | https://saccofinancial.com |
| RESEARCH_EMAIL_FROM | Exact sender used by the website |
| STRIPE_BILLING_ENABLED | true, matching production |
| STRIPE_MODE | live, matching production |

Do not set local-development flags. Do not configure AWS access-key variables: Lambda uses its execution role. If the website has a RESEARCH_TEST_RECIPIENT restriction, match it when processing its jobs. Billing flags only control membership reads; this worker does not make Stripe charges.

## Initial connection check

Apply `supabase/migrations/202610110001_research_email_jobs.sql` in production before checking the worker. Verify earlier research-email migrations are already applied; do not reset the database. Migration is additive and does not recover historical reserved sends.

Create a Lambda test event containing `{"action":"check"}` (an empty event is also a check). Expected response: `{"status":"ready","mode":"dry-run","processingEnabled":false}`. This checks secret access, environment policy and queue-table access, without claiming a job, writing tokens or sending email. It does not prove live Resend delivery or validate all queue RPCs.

## Schedule and controlled enablement

Create an EventBridge Scheduler recurring rate of 1 minute, flexible window OFF, with Lambda Invoke target and input `{"action":"process"}`. Its execution role needs lambda:InvokeFunction on this function ARN. Keep the schedule DISABLED during setup. Limit Scheduler retries to zero initially; the next scheduled invocation and database leases handle preparation recovery. Monitor Scheduler target errors and Lambda Errors/Throttles. Returned failed/uncertain statuses are business outcomes, not Lambda exceptions; monitor the admin queue and logs as well.

A process invocation returns disabled until RESEARCH_WORKER_ENABLED=true. It handles at most one job, then returns. A dry-run worker only claims dry-run jobs; it will not test or process the website's live queue. A controlled pilot must align worker and website send mode, sender, origin, content and recipient restriction. Do not broaden the approved audience during a pilot. Enable EMAIL_SEND_MODE=live and RESEARCH_BROADCAST_ENABLED=true only for an authorized full-audience rollout, after pilot and database/UI deployment validation. Keep the five-minute database lease longer than the two-minute Lambda timeout.

Historical reserved logs without a job remain locked. Reconcile the old Outlook with Resend before separately authorized recovery; do not delete its reservation or create a replacement event key.

## Every research release

The worker bundles the canonical research content and rejects changed snapshots. Rebuild and upload the Lambda ZIP from the same release as the website whenever Outlooks, Opportunities or notification content change, before queueing new notifications. This is currently a MANUAL deployment step; Amplify does not update Lambda automatically. Do not enable an old worker against new content. The SHA256 sidecar identifies the exact uploaded package.

Agree queue audience-snapshot retention and operational alert ownership before full production rollout. No automatic retention deletion is included.
