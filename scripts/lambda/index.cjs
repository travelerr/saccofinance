const {createHandler} = require('./handler-core.cjs');
const {processNextResearchEmail} = require('../../lib/email/queue-worker.ts');
const {emailDatabase} = require('../../lib/email/database.ts');
const {emailSecrets} = require('../../lib/email/secrets.ts');
const {researchSendMode} = require('../../lib/email/policy.ts');
exports.handler = createHandler({
  processNext: processNextResearchEmail,
  check: async () => {
    try {
      const mode = researchSendMode({...process.env, ...await emailSecrets()});
      const db = await emailDatabase();
      const {error} = await db.from('research_email_jobs').select('id').limit(1);
      if (error) throw new Error();
      return {status: 'ready', mode, processingEnabled: process.env.RESEARCH_WORKER_ENABLED === 'true'};
    } catch { throw new Error('WORKER_CHECK_FAILED_VERIFY_SECRET_ENV_AND_MIGRATION'); }
  }
});
