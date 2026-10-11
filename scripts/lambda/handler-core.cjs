// Keep the Lambda invocation finite. An empty console test only checks connectivity.
exports.createHandler = ({check, processNext, env = process.env}) => async (event = {}, context = {}) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const action = event?.action || 'check';
  if (!['check', 'process'].includes(action)) throw new Error('INVALID_WORKER_ACTION');
  if (action === 'check') return check();
  if (env.RESEARCH_WORKER_ENABLED !== 'true') return {status: 'disabled'};
  if (context.getRemainingTimeInMillis && context.getRemainingTimeInMillis() < 110000) {
    throw new Error('WORKER_TIMEOUT_MUST_BE_120_SECONDS');
  }
  // One job per invocation; database leases and dispatch markers prevent duplicate sends.
  try { return await processNext() || {status: 'idle'}; }
  catch { throw new Error('RESEARCH_WORKER_UNAVAILABLE'); }
};
