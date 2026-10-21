const fs=require('node:fs'),Module=require('node:module'),ts=require('typescript');
const {test}=require('node:test'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
let state;
const end=Math.floor(Date.now()/1000)+86400;
function reset(){state={sub:{id:'sub_a',customer:'cus_a',livemode:false,status:'active',start_date:1700000000,items:{data:[{quantity:1,price:{id:'price_a'},current_period_end:end}]},cancel_at:null,cancel_at_period_end:false},audit:[],updates:[],sends:0,claimed:false,job:{id:'job',lease_token:'lease',subscription_id:'sub_a',user_id:'u',mode:'test',ends_at:new Date(end*1000).toISOString()},sendMode:'dry-run',user:{email:'member@example.com',email_confirmed_at:'2026-01-01'},customers:['cus_a'],others:[],grant:null};}
const admin={from(table){let op='select',body;const q={select(){return q},eq(){return q},neq(){return q},insert(value){op='insert';body=value;return q},update(value){op='update';body=value;return q},single(){return q},maybeSingle(){return q},then(resolve,reject){return Promise.resolve().then(()=>{
 if(table==='billing_retention_events'){if(state.auditFail)return {data:null,error:{}};if(op==='insert')state.audit.push(body);else Object.assign(state.audit.at(-1),body);return {data:null,error:null};}
 if(table==='billing_access_reminders'){if(state.leaseLost)return {data:null,error:null};Object.assign(state.job,body);return {data:{id:'job'},error:null};}
 if(table==='research_email_limits')return {data:{paused:state.paused},error:null};
 if(table==='premium_memberships')return {data:state.grant,error:null};
 if(table==='billing_subscriptions')return {data:state.wrongOwner?null:{...state.sub,stripe_subscription_id:'sub_a',paid_through:new Date(end*1000).toISOString()},error:null};
 throw Error(table);
 }).then(resolve,reject)}};
 const neq=q.neq;q.neq=()=>{q.then=(resolve)=>Promise.resolve({data:state.others,error:null}).then(resolve);return q};return q;
 },auth:{admin:{getUserById:async()=>({data:{user:state.user},error:null})}},rpc:async()=>{if(state.claimed)return {data:[],error:null};state.claimed=true;return {data:[state.job],error:null}}};
const stripe={subscriptions:{retrieve:async()=>{if(state.missing)throw Object.assign(Error('missing'),{code:'resource_missing'});return structuredClone(state.sub)},update:async(id,body)=>{state.updates.push(body);if(state.stripeFail)throw Error('timeout');if(body.cancel_at_period_end){state.sub.cancel_at_period_end=true;state.sub.cancel_at=end;}else{state.sub.cancel_at_period_end=false;state.sub.cancel_at=null;}return structuredClone(state.sub)}}};
const original=Module._load;Module._load=function(id,parent,...args){
 if(id==='server-only')return {};
 if(id==='./server'||id==='../billing/server')return {billingServices:async()=>({stripe,admin,mode:state.mode||'test'}),priceId:()=> 'price_a',authOrigin:()=> 'https://saccofinancial.com'};
 if(id==='./ownership'||id==='../billing/ownership')return {ownedBillingCustomers:async()=>state.customers};
 if(id==='./secrets')return {emailSecrets:async()=>({RESEND_API_KEY:'re_fake'})};
 if(id==='./policy')return {researchSendMode:()=>state.sendMode,researchPilotRecipient:()=>state.pilot||''};
 if(id==='./suppression')return {excludeSuppressed:async(db,rows)=>state.suppressed?[]:rows};
 if(id==='./resend-client')return {resendPersonalizedWithTransport:async()=>{state.sends++;if(state.sendFail)throw Error('timeout');return ['provider']}};
 return original.call(this,id,parent,...args);
};
const {changeRenewal}=require('../lib/billing/retention.ts');
const {processNextAccessReminder}=require('../lib/email/access-reminders.ts');
process.env.BILLING_REMINDERS_ENABLED='true';
test('cancel saves reason, schedules end, repeat is no-op; keep restores without new invoice or subscription',async()=>{
 reset();await changeRenewal('u','sub_a','cancel','not_enough_research','Not a match');assert.equal(state.audit[0].reason,'not_enough_research');assert.equal(state.audit[0].status,'confirmed');assert.equal(state.updates[0].cancel_at_period_end,true);assert.match(state.updates[0].cancellation_details.comment,/Not enough new research/);
 await changeRenewal('u','sub_a','cancel','other','');assert.equal(state.updates.length,1);
 await changeRenewal('u','sub_a','keep');assert.deepEqual(state.updates[1],{cancel_at_period_end:false,proration_behavior:'none'});assert.equal(state.audit.length,2);
 await changeRenewal('u','sub_a','keep');assert.equal(state.updates.length,2);
});
test('invalid input, failed audit, wrong owner and failed Stripe request never produce false success',async()=>{
 reset();await assert.rejects(changeRenewal('u','sub_a','cancel','',''));assert.equal(state.updates.length,0);
 for(const flag of ['auditFail','wrongOwner']){reset();state[flag]=true;await assert.rejects(changeRenewal('u','sub_a','cancel','other',''));assert.equal(state.updates.length,0);}
 reset();state.stripeFail=true;await assert.rejects(changeRenewal('u','sub_a','cancel','other',''));assert.equal(state.audit[0].status,'requested');
 reset();state.sub.status='canceled';await assert.rejects(changeRenewal('u','sub_a','keep'));assert.equal(state.updates.length,0);
});
test('dry-run reminder renders without sending; only one job is processed',async()=>{
 reset();state.sub.cancel_at=end;assert.equal((await processNextAccessReminder()).status,'dry_run');assert.equal(state.sends,0);assert.equal(await processNextAccessReminder(),null);
});
test('resumed, expired, suppressed, wrong pilot, unverified and alternate-access reminders are skipped',async()=>{
 for(const setup of [()=>{},()=>{state.sub.cancel_at=end;state.missing=true},()=>{state.sub.cancel_at=end-172800},()=>{state.sub.cancel_at=end;state.suppressed=true},()=>{state.sub.cancel_at=end;state.pilot='other@example.com'},()=>{state.sub.cancel_at=end;state.user.email_confirmed_at=null},()=>{state.sub.cancel_at=end;state.grant={enabled:true,access_source:'manual',access_expires_at:null}},()=>{state.sub.cancel_at=end;state.others=[{status:'active',paid_through:new Date((end+86400)*1000).toISOString()}]}]){
 reset();setup();assert.equal((await processNextAccessReminder()).status,'skipped');assert.equal(state.sends,0);
 }
});
test('live delivery records receipt; uncertain transport is never automatically retried',async()=>{
 for(const fail of [false,true]){reset();state.sub.cancel_at=end;state.sub.livemode=true;state.mode='live';state.sendMode='live';state.sendFail=fail;
 if(fail){await assert.rejects(processNextAccessReminder(),/UNCERTAIN/);assert.equal(state.job.status,'uncertain');}else{assert.equal((await processNextAccessReminder()).status,'sent');assert.equal(state.job.provider_id,'provider');}
 assert.equal(state.sends,1);assert.equal(await processNextAccessReminder(),null);assert.equal(state.sends,1);}
});
test('disabled, paused, wrong mode and lost lease cannot send',async()=>{
 reset();process.env.BILLING_REMINDERS_ENABLED='false';assert.equal(await processNextAccessReminder(),null);assert.equal(state.claimed,false);process.env.BILLING_REMINDERS_ENABLED='true';
 reset();state.paused=true;assert.equal(await processNextAccessReminder(),null);assert.equal(state.claimed,false);
 reset();state.sendMode='live';await assert.rejects(processNextAccessReminder(),/MODE_MISMATCH/);assert.equal(state.claimed,false);
 reset();state.sub.cancel_at=end;state.leaseLost=true;await assert.rejects(processNextAccessReminder(),/LEDGER/);assert.equal(state.sends,0);
});

test('all seven required choices are saved exactly and map to supported Stripe feedback',async()=>{
 const {cancellationReasons}=require('../lib/billing/retention-policy.ts');
 for(const [reason,label] of Object.entries(cancellationReasons)){
  reset();await changeRenewal('u','sub_a','cancel',reason,'');
  assert.equal(state.audit[0].reason,reason);assert.equal(state.audit[0].feedback,null);
  assert.equal(state.updates[0].cancellation_details.comment,label);
  assert.ok(['too_expensive','unused','other'].includes(state.updates[0].cancellation_details.feedback));
 }
});
