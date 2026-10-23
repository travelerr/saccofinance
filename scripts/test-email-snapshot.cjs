const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module'),assert=require('node:assert/strict'),{test}=require('node:test');
const load=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};return load.call(this,id,...args);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {renderResearchEmail}=require('../lib/email/templates.ts');
const {unsubscribePlaceholder,validateEmailSnapshot,personalizeEmailSnapshot}=require('../lib/email/snapshot.ts');
const origin='https://saccofinancial.com';
const event={key:'WEEKLY_OUTLOOK_PUBLISHED:future-999',type:'WEEKLY_OUTLOOK_PUBLISHED',entityId:'future-999',subject:'A future issue',headline:'Approved headline',details:[],summary:'Approved copy',label:'OUTLOOK',cta:'READ',path:'/premium/issue-999'};
const snapshot=()=>({version:1,...renderResearchEmail(event,origin,unsubscribePlaceholder(origin))});
test('future content and template remain frozen; unsubscribe links and headers are personalized',()=>{
 const s=snapshot();s.html=s.html.replace('Approved headline','A later template design');
 const first=origin+'/email/unsubscribe?token='+'a'.repeat(64),second=origin+'/email/unsubscribe?token='+'b'.repeat(64);
 const a=personalizeEmailSnapshot(s,origin,first),b=personalizeEmailSnapshot(s,origin,second);
 assert.ok(a.html.includes('A later template design'));assert.ok(a.html.includes(first));assert.ok(!a.html.includes(second));assert.ok(b.text.includes(second));assert.equal(a.headers['List-Unsubscribe'],'<'+first+'>');assert.equal(a.headers['List-Unsubscribe-Post'],'List-Unsubscribe=One-Click');assert.ok(s.html.includes(unsubscribePlaceholder(origin)));
});
test('invalid versions, foreign links, missing opt-out and executable markup fail closed',()=>{
 for(const change of [{version:2},{subject:'Injected\r\nBcc: x'},{url:'https://evil.example/premium/issue-999'},{html:'<p>No unsubscribe</p>'}])assert.throws(()=>validateEmailSnapshot({...snapshot(),...change},origin),/INVALID_EMAIL_SNAPSHOT/);
 for(const extra of ['<a href="https://evil.example">click</a>','<script>alert(1)</script>','<img src="https://evil.example">'])assert.throws(()=>validateEmailSnapshot({...snapshot(),html:snapshot().html+extra},origin),/INVALID_EMAIL_SNAPSHOT/);
 assert.throws(()=>personalizeEmailSnapshot(snapshot(),origin,'https://evil.example/email/unsubscribe?token='+'a'.repeat(64)),/INVALID_UNSUBSCRIBE_URL/);
 assert.throws(()=>validateEmailSnapshot(undefined,origin),/INVALID_EMAIL_SNAPSHOT/);
});
test('worker processes an unpublished future snapshot without loading catalog or renderer',async()=>{
 const workerPath=require.resolve('../lib/email/queue-worker.ts');delete require.cache[workerPath];
 const transitions=[];const recipients=[{userId:'test',email:'member@example.invalid'}];
 const job={id:'job',event_key:event.key,mode:'dry-run',lease_token:'lease',event_snapshot:{...event,delivery:snapshot()},recipients,origin,sender:'Sacco <test@example.invalid>'};
 const db={rpc:async(name,args)=>{if(name==='claim_research_email')return {data:[job]};transitions.push(args.p_action);return {data:true};},from:()=>({select:()=>({eq:()=>({single:async()=>({data:{paused:false}})})})})};
 const previous=Module._load;const oldOrigin=process.env.AUTH_SITE_URL,oldSender=process.env.RESEARCH_EMAIL_FROM;process.env.AUTH_SITE_URL=origin;process.env.RESEARCH_EMAIL_FROM=job.sender;
 Module._load=function(id,parent,...args){if(parent?.filename===workerPath){if(id.includes('premium-opportunities')||id==='./templates'||id==='./events')throw Error('Catalog/template dependency forbidden');if(id==='./database')return {emailDatabase:async()=>db};if(id==='./secrets')return {emailSecrets:async()=>({})};if(id==='./policy')return {researchSendMode:()=> 'dry-run'};if(id==='./recipient-resolution')return {resolveResearchRecipientRecords:async()=>recipients};if(id==='./unsubscribe')return {createResearchUnsubscribeBatch:async()=>[origin+'/email/unsubscribe?token='+'a'.repeat(64)]};if(id==='./resend-client')return {resendPersonalizedWithTransport:()=>{throw Error('Dry run must not send')}};}return previous.call(this,id,parent,...args);};
 try{const worker=require(workerPath);assert.equal((await worker.processNextResearchEmail()).status,'dry_run');assert.deepEqual(transitions,['dry_run']);delete job.event_snapshot.delivery;assert.equal((await worker.processNextResearchEmail()).status,'cancelled');assert.equal(transitions.at(-1),'cancelled');}finally{Module._load=previous;delete require.cache[workerPath];for(const [k,v] of [['AUTH_SITE_URL',oldOrigin],['RESEARCH_EMAIL_FROM',oldSender]])if(v===undefined)delete process.env[k];else process.env[k]=v;}
});

test('approved affiliate snapshot accepts only the exact referral URL and retains personal unsubscribe',()=>{
 const {weeklyOutlooks,opportunities,opportunityUpdates}=require('../lib/premium-opportunities.ts');
 const e=require('../lib/email/events.ts').researchEvents(weeklyOutlooks,opportunities,opportunityUpdates).find(e=>e.entityId==='weekly-outlook-005');
 const s={version:1,...renderResearchEmail(e,origin,unsubscribePlaceholder(origin))};validateEmailSnapshot(s,origin);
 const exact='https://trendspider.com?_go=justin-4f7fc2';assert.ok(s.html.includes(exact));
 for(const bad of ['https://trendspider.com','https://trendspider.com?_go=another','https://trendspider.com?_go=justin-4f7fc2&redirect=evil'])assert.throws(()=>validateEmailSnapshot({...s,html:s.html.replace(exact,bad)},origin),/INVALID_EMAIL_SNAPSHOT/);
 assert.ok(personalizeEmailSnapshot(s,origin,origin+'/email/unsubscribe?token='+'a'.repeat(64)).html.includes(exact));
});

test('Learning Library announcement uses the current worker snapshot contract and existing opt-out links',()=>{
 const announcement=require('../lib/email/learning-announcement.ts').learningLibraryAnnouncement;
 assert.equal(announcement.key,'LEARNING_LIBRARY_ANNOUNCEMENT:learning-library-launch');
 assert.equal(announcement.updateId,null);
 const s={version:1,...renderResearchEmail(announcement,origin,unsubscribePlaceholder(origin))};
 validateEmailSnapshot(s,origin);
 const personalized=personalizeEmailSnapshot(s,origin,origin+'/email/unsubscribe?token='+'c'.repeat(64));
 assert.equal(new URL(s.url).pathname,'/premium/learn');
 for(const text of ['Lesson 1','Lesson 2','More videos are coming','Manage Email Preferences','Unsubscribe'])assert.ok(personalized.text.includes(text));
 assert.ok(!personalized.html.includes(unsubscribePlaceholder(origin)));
});

test('announcement migration is repeatable, preserves records, and keeps event validation',async()=>{
 const {PGlite}=require('@electric-sql/pglite');const db=new PGlite();
 try{
 await db.exec("create table research_notification_log(notification_type text not null check(notification_type in ('WEEKLY_OUTLOOK_PUBLISHED','OPPORTUNITY_PUBLISHED','OPPORTUNITY_MATERIAL_UPDATE')),update_id text,check ((notification_type='OPPORTUNITY_MATERIAL_UPDATE')=(update_id is not null)));insert into research_notification_log values('WEEKLY_OUTLOOK_PUBLISHED',null)");
 const sql=fs.readFileSync('supabase/migrations/20261022000100_learning_library_announcement.sql','utf8');
 await db.exec(sql);await db.exec(sql);
 await db.exec("insert into research_notification_log values('LEARNING_LIBRARY_ANNOUNCEMENT',null)");
 assert.equal((await db.query('select * from research_notification_log')).rows.length,2);
 await assert.rejects(db.exec("insert into research_notification_log values('UNKNOWN',null)"));
 await assert.rejects(db.exec("insert into research_notification_log values('OPPORTUNITY_MATERIAL_UPDATE',null)"));
 }finally{await db.close();}
});
