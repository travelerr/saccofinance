const fs=require('node:fs');const ts=require('typescript');const assert=require('node:assert/strict');const {test}=require('node:test');const {generateKeyPairSync,verify}=require('node:crypto');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const model=require('../lib/analytics/reporting-model.ts');const {tokenAssertion,createReportingClient}=require('../lib/analytics/reporting-client.ts');
const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});const raw=JSON.stringify({type:'service_account',client_email:'reader@test-project.iam.gserviceaccount.com',private_key:privateKey.export({format:'pem',type:'pkcs8'}),token_uri:'https://untrusted.invalid'});
test('report periods are bounded, exclude today, and use standard Google dimensions',()=>{
 for(const input of [undefined,'oops','365','7 OR 1=1'])assert.equal(model.reportingDays(input),28);
 assert.equal(model.reportingDays('7'),7);assert.equal(model.reportingDays('90'),90);
 const defs=model.reportDefinitions(7);assert.deepEqual(defs.overview.dateRanges,[{startDate:'7daysAgo',endDate:'yesterday'}]);assert.equal(defs.daily.limit,90);assert.ok(!JSON.stringify(defs).includes('customEvent:'));
});
test('empty report is distinct from bad data and includes data quality flags',()=>{
 assert.deepEqual(model.parseReport({},1,1),{rows:[],limited:false,qualified:false});
 const response={rows:[{dimensionValues:[{value:'youtube'}],metricValues:[{value:'12'}]}],rowCount:25,metadata:{subjectToThresholding:true}};
 const parsed=model.parseReport(response,1,1);assert.equal(parsed.rows[0].metrics[0],12);assert.equal(parsed.limited,true);assert.equal(parsed.qualified,true);
 assert.throws(()=>model.parseReport({rows:[{metricValues:[{value:'NaN'}]}]},0,1));assert.throws(()=>model.parseReport(null,0,1));
});
test('OAuth assertion is signed, read-only, and ignores credential-provided endpoints',()=>{
 const jwt=tokenAssertion(raw,Date.parse('2026-09-28T00:00:00Z'));const [header,payload,sig]=jwt.split('.');const claims=JSON.parse(Buffer.from(payload,'base64url'));
 assert.equal(claims.aud,'https://oauth2.googleapis.com/token');assert.equal(claims.scope,'https://www.googleapis.com/auth/analytics.readonly');assert.equal(claims.exp-claims.iat,3600);assert.ok(verify('RSA-SHA256',Buffer.from(header+'.'+payload),publicKey,Buffer.from(sig,'base64url')));
 assert.throws(()=>tokenAssertion('{}'));
});
test('Google transport caches reports, isolates partial failures and never exposes provider errors',async()=>{
 const calls=[];const client=createReportingClient(async(url,init)=>{
  calls.push(url);if(url.endsWith('/token'))return Response.json({access_token:'TEST_TOKEN',expires_in:3600});
  assert.equal(init.headers.Authorization,'Bearer TEST_TOKEN');const body=JSON.parse(init.body);
  if(body.dimensions[0]?.name==='sessionSource')return Response.json({error:'PRIVATE'}, {status:403});
  return Response.json({});
 });
 const result=await client('556204658',raw,28);assert.equal(result.status,'ready');assert.equal(result.reports.sources,null);assert.deepEqual(result.reports.overview.rows,[]);assert.ok(!JSON.stringify(result).includes('PRIVATE'));
 await client('556204658',raw,28);assert.equal(calls.length,7);assert.ok(calls.every(url=>url.startsWith('https://analyticsdata.googleapis.com/')||url==='https://oauth2.googleapis.com/token'));
 await assert.rejects(()=>client('../evil',raw,28));assert.equal(calls.length,7);
});
test('auth failure becomes unavailable, never false zero activity',async()=>{
 const client=createReportingClient(async()=>Response.json({error:'PRIVATE_KEY'}, {status:401}));const result=await client('556204658',raw,7);
 assert.equal(result.status,'unavailable');assert.ok(Object.values(result.reports).every(report=>report===null));assert.ok(!JSON.stringify(result).includes('PRIVATE_KEY'));
});
test('membership counts deduplicate owners and preserve off and unset choices',()=>{
 const now=Date.parse('2026-09-28T00:00:00Z');const sub={stripe_subscription_id:'a',access_owner_id:'paid',mode:'live',status:'active',plan:'monthly',paid_through:'2026-10-17',cancel_at_period_end:false,current_period_end:'2026-10-17',first_failure_at:null,failed_invoice_id:null};
 const memberships=[{user_id:'paid',enabled:true,access_source:'manual',access_expires_at:null},{user_id:'manual',enabled:true,access_source:'manual',access_expires_at:null},{user_id:'expired',enabled:true,access_source:'manual',access_expires_at:'2026-09-01'},{user_id:'stale-stripe',enabled:true,access_source:'stripe',access_expires_at:null}];
 const result=model.memberSummary(memberships,[sub,{...sub,stripe_subscription_id:'b',cancel_at_period_end:true},{...sub,stripe_subscription_id:'c',access_owner_id:'grace',status:'past_due',first_failure_at:'2026-09-27'}],[{user_id:'paid',enabled:false},{user_id:'manual',enabled:true},{user_id:'expired',enabled:true}],now);
 assert.deepEqual(result,{members:3,paidMembers:2,paidSubscriptions:3,canceling:1,pastDue:1,on:1,off:1,unset:1});
});
test('report entrypoint authenticates before credentials and blocks cloud calls in local mode',async()=>{
 const vm=require('node:vm');let authorized=true,secretCalls=0,reportCalls=0,authCalls=0;
 const sandbox={exports:{},process:{env:{SACCO_LOCAL_DEVELOPMENT:'true',AUTH_SITE_URL:'https://saccofinancial.com',GA_PROPERTY_ID:'556204658'}},require:id=>{
  if(id==='server-only')return {};
  if(id==='./admin')return {requireAnalyticsAdmin:async()=>{authCalls++;if(!authorized)throw Error('ADMIN_REQUIRED');}};
  if(id==='../billing/secrets')return {billingSecrets:async()=>{secretCalls++;return {GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON:raw};}};
  if(id==='./reporting-client')return {createReportingClient:()=>async()=>{reportCalls++;return {status:'ready'};}};
  throw Error(id);
 }};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(require.resolve('../lib/analytics/reporting.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,sandbox);
 assert.equal((await sandbox.exports.googleReporting(28)).status,'local');assert.equal(authCalls,1);assert.equal(secretCalls,0);assert.equal(reportCalls,0);
 sandbox.process.env.SACCO_LOCAL_DEVELOPMENT='false';authorized=false;await assert.rejects(()=>sandbox.exports.googleReporting(28),/ADMIN_REQUIRED/);assert.equal(secretCalls,0);
 authorized=true;assert.equal((await sandbox.exports.googleReporting(28)).status,'ready');assert.equal(secretCalls,1);assert.equal(reportCalls,1);
});
test('local launcher strips reporting credentials and Amplify whitelists only the property id',()=>{
 const {safeBaseEnv}=require('./local-environment.cjs');assert.equal(safeBaseEnv().GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON,'');assert.equal(safeBaseEnv().GA_PROPERTY_ID,'');
 const source=fs.readFileSync(require.resolve('./prepare-amplify-env.cjs'),'utf8');assert.ok(source.includes("values.push(['GA_PROPERTY_ID',propertyId])"));assert.ok(!source.includes('GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON'));
});
