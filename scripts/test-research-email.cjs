const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');const assert=require('node:assert/strict');const {test}=require('node:test');const Module=require('node:module');const {PGlite}=require('@electric-sql/pglite');
let authUser=null;
const original=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};if(id==='../supabase/server')return {createSupabaseServerClient:async()=>({auth:{getUser:async()=>({data:{user:authUser}})}})};return original.call(this,id,...args);};
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename);
const policy=require('../lib/email/policy.ts');const {sessionPremiumAccess}=require('../lib/premium-session-access.ts');const {researchEvents}=require('../lib/email/events.ts');const records=require('../lib/premium-opportunities.ts');const {renderResearchEmail}=require('../lib/email/templates.ts');const {executeNotification}=require('../lib/email/notification-run.ts');const {deliverResearchBatch,resendBatchWithTransport}=require('../lib/email/resend-client.ts');
const events=researchEvents(records.weeklyOutlooks,records.opportunities,records.opportunityUpdates);
const id='11111111-1111-4111-8111-111111111111';const member={id,email:'member@example.invalid',email_confirmed_at:'2026-01-01',is_anonymous:false};
const paid={stripe_subscription_id:'sub_test',mode:'test',status:'active',plan:'monthly',paid_through:'2099-01-01',current_period_end:'2099-01-01',cancel_at_period_end:false,first_failure_at:null,failed_invoice_id:null};
function accessClient(grant,subscriptions,error=null){return {from(table){const chain={select(){return chain},eq(){return chain},maybeSingle:async()=>({data:grant,error}),then(resolve){return Promise.resolve({data:subscriptions,error}).then(resolve)}};return chain;}};}
test('administrator allowlist denies members, anonymous users, unverified users and self-asserted metadata',()=>{
 assert.equal(policy.isResearchAdmin(member,id),true);
 for(const [user,list] of [[null,id],[member,''],[member,'member@example.invalid'],[{...member,id:'22222222-2222-4222-8222-222222222222',user_metadata:{role:'admin'}},id],[{...member,is_anonymous:true},id],[{...member,email_confirmed_at:null},id]])assert.equal(policy.isResearchAdmin(user,list),false);
});
test('local safety rejects hosted databases and every non-dry-run mode before queries',()=>{
 const env={RESEARCH_EMAIL_LOCAL_ENABLED:'true',NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54321'};
 assert.doesNotThrow(()=>policy.assertLocalEmailEnvironment(env));
 for(const change of [{RESEARCH_EMAIL_LOCAL_ENABLED:'false'},{NEXT_PUBLIC_SUPABASE_URL:'https://production.supabase.co'},{NEXT_PUBLIC_SUPABASE_URL:'http://localhost.evil.test'},{EMAIL_SEND_MODE:'live'},{EMAIL_SEND_MODE:'test'}])assert.throws(()=>policy.assertLocalEmailEnvironment({...env,...change}));
});
test('recipient eligibility reuses actual canonical access: active, cancellation, grace, lifetime, expired, OFF',async()=>{
 process.env.STRIPE_BILLING_ENABLED='true';process.env.STRIPE_MODE='test';
 for(const sub of [paid,{...paid,cancel_at_period_end:true},{...paid,status:'past_due',first_failure_at:new Date().toISOString()}]){
 const access=await sessionPremiumAccess(accessClient(null,[sub]),id);assert.equal(policy.researchEligible(member,true,access),true);assert.equal(policy.researchEligible(member,false,access),false);
 }
 const lifetime=await sessionPremiumAccess(accessClient({enabled:true,access_source:'manual',access_expires_at:null},[]),id);assert.equal(policy.researchEligible(member,true,lifetime),true);
 for(const sub of [{...paid,status:'canceled'},{...paid,paid_through:'2000-01-01'},{...paid,status:'past_due',first_failure_at:'2000-01-01'}])assert.equal(policy.researchEligible(member,true,await sessionPremiumAccess(accessClient(null,[sub]),id)),false);
 for(const u of [{...member,is_anonymous:true},{...member,email_confirmed_at:null},{...member,email:undefined},{...member,banned_until:'2099-01-01'}])assert.equal(policy.researchEligible(u,true,lifetime),false);
 assert.equal(policy.researchEligible(member,true,{allowed:true,unavailable:true}),false);
 // Preference is never an input to authentication, billing, or canonical access.
 assert.equal((await sessionPremiumAccess(accessClient(null,[paid]),id)).allowed,true);
});
test('all three templates use canonical published content and authenticated routes, with escaped HTML',()=>{
 for(const type of ['WEEKLY_OUTLOOK_PUBLISHED','OPPORTUNITY_PUBLISHED','OPPORTUNITY_MATERIAL_UPDATE']){
 const event=events.find(e=>e.type===type);assert.ok(event);const email=renderResearchEmail(event,'https://saccofinancial.com');
 assert.ok(email.html.includes(event.cta));assert.ok(email.text.includes(event.summary));assert.ok(email.url.startsWith('https://saccofinancial.com/premium/'));assert.ok(email.preferences.endsWith('/premium/account#research-notifications'));
 assert.match(email.html,/max-width:600px/);assert.match(email.html,/width=device-width/);
 }
 assert.equal(events.find(e=>e.type==='WEEKLY_OUTLOOK_PUBLISHED').path,'/premium/issue-001');
 const noStage=events.find(e=>e.entityId==='opportunity-002'&&e.type==='OPPORTUNITY_PUBLISHED');assert.deepEqual(noStage.details,['Active']);
 const sample=renderResearchEmail({...events[0],headline:'<script>alert("x")</script>',summary:''},'http://localhost:3000');assert.ok(!sample.html.includes('<script>'));assert.ok(!sample.text.includes('undefined'));assert.ok(!sample.text.includes('Target:'));
 assert.equal(researchEvents(records.weeklyOutlooks.map(o=>({...o,publicationState:'draft'})),[],[]).length,0);
 for(const e of events){const route=e.path.split('#')[0];const file=route.startsWith('/premium/opportunities/')?'app/premium/opportunities/[slug]/page.tsx':'app'+route+'/page.tsx';assert.ok(fs.existsSync(path.join(__dirname,'..',file)),file);}
});
function store(){const rows=new Map();return {rows,async reserve(event,count){if(rows.has(event.key))return false;rows.set(event.key,{status:'reserved',count});return true},async finish(key,status,ids,error){rows.set(key,{...rows.get(key),status,ids,error})}};}
test('simultaneous sends reserve once; failures are logged and cannot be retried',async()=>{
 const db=store();let sends=0;const deliver=async()=>{sends++;return {status:'dry_run',providerIds:[]}};
 const results=await Promise.allSettled([executeNotification(events[0],['a@example.invalid'],db,deliver),executeNotification(events[0],['a@example.invalid'],db,deliver)]);assert.equal(sends,1);assert.equal(results.filter(x=>x.status==='fulfilled').length,1);
 const failed=store();await assert.rejects(executeNotification(events[0],['a@example.invalid'],failed,async()=>{throw Error('sensitive provider response')}),/SEND_FAILED_OR_UNCERTAIN/);assert.equal(failed.rows.get(events[0].key).status,'failed');assert.ok(!JSON.stringify([...failed.rows]).includes('sensitive'));await assert.rejects(executeNotification(events[0],['a@example.invalid'],failed,deliver),/ALREADY_RECORDED/);
 await assert.rejects(executeNotification(events[0],[],store(),deliver),/NO_RECIPIENTS/);await assert.rejects(executeNotification(events[0],Array(101).fill('x'),store(),deliver),/RECIPIENT_LIMIT/);
});
test('dry-run cannot invoke network; injected Resend mock sends individually and logs provider IDs',async()=>{
 const email=renderResearchEmail(events[0],'http://localhost:3000');const old=global.fetch;global.fetch=()=>{throw Error('NETWORK_FORBIDDEN')};
 try{assert.equal((await deliverResearchBatch({mode:'dry-run',emails:['a@example.invalid'],email,key:'test'})).status,'dry_run');await assert.rejects(deliverResearchBatch({mode:'live',emails:[],email,key:'test'}),/LIVE_EMAIL_DISABLED/);}finally{global.fetch=old;}
 const input={from:'Sacco Premium <research@example.invalid>',apiKey:'mock-not-a-key',emails:['a@example.invalid','b@example.invalid'],email,key:'test'};
 const ids=await resendBatchWithTransport(input,async(url,request)=>{assert.equal(url,'https://api.resend.com/emails/batch');assert.equal(request.headers['Idempotency-Key'],'test');const body=JSON.parse(request.body);assert.equal(body.length,2);assert.deepEqual(body[0].to,['a@example.invalid']);assert.deepEqual(body[1].to,['b@example.invalid']);assert.ok(!body[0].html.includes('b@example.invalid'));assert.ok(!('cc' in body[0]));return {ok:true,json:async()=>({data:[{id:'mock-a'},{id:'mock-b'}]})}});assert.deepEqual(ids,['mock-a','mock-b']);
 await assert.rejects(resendBatchWithTransport(input,async()=>({ok:false})),/RESEND_REJECTED/);
 await assert.rejects(resendBatchWithTransport(input,async()=>({ok:true,json:async()=>({data:[]})})),/RESEND_RESPONSE_UNCERTAIN/);
});
test('local PostgreSQL migration enforces preference RLS, defaults, log privacy and unique events',async()=>{
 const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;insert into auth.users values('${id}'),('22222222-2222-4222-8222-222222222222');`);
 await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations/202609220001_research_notifications.sql'),'utf8'));
 await db.exec(`set role authenticated;select set_config('request.jwt.claim.sub','${id}',false);insert into research_email_preferences(user_id) values('${id}');`);
 assert.equal((await db.query('select enabled from research_email_preferences')).rows[0].enabled,false);
 await assert.rejects(db.exec("insert into research_email_preferences(user_id,enabled) values('22222222-2222-4222-8222-222222222222',true)"));
 await assert.rejects(db.query('select * from research_notification_log'));
 await db.exec('reset role');
 const insert="insert into research_notification_log(event_key,notification_type,entity_id,subject,recipient_count,mode,status) values('event','WEEKLY_OUTLOOK_PUBLISHED','issue','subject',1,'dry-run','reserved')";
 await db.exec(insert);await assert.rejects(db.exec(insert),/unique/);
 await db.exec("set role anon");await assert.rejects(db.query('select * from research_email_preferences'));
 }finally{await db.close();}
});

test('server administrator guard rejects unauthorized authenticated sessions',async()=>{
 process.env.RESEARCH_EMAIL_LOCAL_ENABLED='true';process.env.NEXT_PUBLIC_SUPABASE_URL='http://127.0.0.1:54321';process.env.EMAIL_SEND_MODE='dry-run';process.env.RESEARCH_ADMIN_USER_IDS=id;
 const {requireResearchAdmin}=require('../lib/email/admin.ts');
 for(const user of [null,{...member,id:'22222222-2222-4222-8222-222222222222'},{...member,email_confirmed_at:null}]){authUser=user;await assert.rejects(requireResearchAdmin(),/ADMIN_REQUIRED/);}
 authUser=member;assert.equal((await requireResearchAdmin()).id,id);
});
