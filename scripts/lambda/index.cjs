const {createHandler} = require('./handler-core.cjs');
const {processNextResearchEmail} = require('../../lib/email/queue-worker.ts');
const {processNextOnboardingEmail} = require('../../lib/email/onboarding.ts');
const {processNextAccessReminder} = require('../../lib/email/access-reminders.ts');
const {billingServices, checkedPrice} = require('../../lib/billing/server.ts');
const {emailDatabase} = require('../../lib/email/database.ts');
const {emailSecrets} = require('../../lib/email/secrets.ts');
const {researchSendMode} = require('../../lib/email/policy.ts');
exports.handler = createHandler({
  processNext: async () => {
    const research = await processNextResearchEmail();
    // Keep existing broadcast work bounded; reminders run on idle schedule ticks.
    return research || await processNextAccessReminder() || await processNextOnboardingEmail();
  },
  check: async () => {
    try {
      const mode = researchSendMode({...process.env, ...await emailSecrets()});
      const db = await emailDatabase();
      const {error} = await db.from('research_email_jobs').select('id').limit(1);
      if (error) throw new Error();
      if (process.env.BILLING_REMINDERS_ENABLED === 'true' || process.env.MEMBER_ONBOARDING_ENABLED === 'true') {
        const billing = await billingServices();
        await checkedPrice(billing.stripe, 'monthly');
        await checkedPrice(billing.stripe, 'annual');
        const {error: reminderError} = await billing.admin.from('billing_access_reminders').select('id').limit(1);
        if (reminderError) throw new Error();
        if (process.env.MEMBER_ONBOARDING_ENABLED === 'true') {
          const {error: onboardingError} = await billing.admin.from('member_onboarding_emails').select('id').limit(1);
          if (onboardingError) throw new Error();
        }
      }
      return {status: 'ready', mode, processingEnabled: process.env.RESEARCH_WORKER_ENABLED === 'true'};
    } catch { throw new Error('WORKER_CHECK_FAILED_VERIFY_SECRET_ENV_AND_MIGRATION'); }
  }
});
