const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createHandler} = require('./lambda/handler-core.cjs');
test('empty Lambda console test checks connections without claiming a job', async () => {
  let checks = 0, claims = 0;
  const handler = createHandler({check: async () => {checks++; return {status:'ready'};}, processNext: async () => {claims++;}, env:{RESEARCH_WORKER_ENABLED:'true'}});
  assert.deepEqual(await handler({}), {status:'ready'}); assert.equal(checks,1); assert.equal(claims,0);
  await assert.rejects(handler({action:'send'}), /INVALID_WORKER_ACTION/);
});
test('processing is off by default and requires sufficient invocation time', async () => {
  let claims = 0; const deps = {check:async()=>{}, processNext:async()=>{claims++;}};
  assert.deepEqual(await createHandler({...deps,env:{}})({action:'process'}),{status:'disabled'});
  await assert.rejects(createHandler({...deps,env:{RESEARCH_WORKER_ENABLED:'true'}})({action:'process'},{getRemainingTimeInMillis:()=>3000}),/TIMEOUT/);
  assert.equal(claims,0);
});
test('enabled invocation handles exactly one job; infrastructure failures are sanitized', async () => {
  let claims=0; const env={RESEARCH_WORKER_ENABLED:'true'};
  const handler=createHandler({env,check:async()=>{},processNext:async()=>{claims++;return {id:'test',status:'dry_run'};}});
  assert.deepEqual(await handler({action:'process'}),{id:'test',status:'dry_run'}); assert.equal(claims,1);
  assert.deepEqual(await createHandler({env,processNext:async()=>null})({action:'process'}),{status:'idle'});
  await assert.rejects(createHandler({env,processNext:async()=>{throw Error('secret data');}})({action:'process'}), e=>e.message==='RESEARCH_WORKER_UNAVAILABLE');
});
