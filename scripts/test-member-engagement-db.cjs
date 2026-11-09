const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
const {PGlite}=require('@electric-sql/pglite');
const m={exports:{}};new Function('exports',ts.transpileModule(fs.readFileSync('lib/analytics/engagement-model.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m.exports);
test('actual recording SQL deduplicates eligible activity and feeds first-week report; excludes old, guest and ineligible members',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon; create role authenticated; create role service_role; create schema auth;
   create table auth.users(id uuid primary key,is_anonymous boolean);
   create table member_onboarding(user_id uuid,mode text,started_at timestamptz,eligible boolean);`);
  await db.exec(fs.readFileSync('supabase/migrations/202610200005_member_engagement.sql','utf8'));
  await db.exec(`update member_engagement_config set started_at=now()-interval '20 days';
   insert into auth.users values
   ('00000000-0000-0000-0000-000000000001',false),
   ('00000000-0000-0000-0000-000000000002',false),
   ('00000000-0000-0000-0000-000000000003',true),
   ('00000000-0000-0000-0000-000000000004',false),
   ('00000000-0000-0000-0000-000000000005',false);
   insert into member_onboarding select id,'test',now()-interval '2 days',true from auth.users;
   update member_onboarding set started_at=now()-interval '7 days' where user_id::text like '%002';
   update member_onboarding set eligible=false where user_id::text like '%004';
   update member_onboarding set started_at=now()-interval '21 days' where user_id::text like '%005';`);
  const user='00000000-0000-0000-0000-000000000001';
  for(const activity of ['visit','dashboard','opportunity','sector_view','sector_use','dashboard']){
   await db.query('select record_member_engagement($1,$2,$3)',[user,'test',activity]);
  }
  for(const suffix of ['002','003','004','005'])await db.query('select record_member_engagement($1,$2,$3)',['00000000-0000-0000-0000-000000000'+suffix,'test','dashboard']);
  await db.query('select record_member_engagement($1,$2,$3)',[user,'live','dashboard']);
  let days=(await db.query('select user_id,day_index,activity from member_engagement_days')).rows;
  assert.equal(days.length,5);assert.ok(days.every(d=>d.user_id===user&&d.day_index===2));
  // Advance the synthetic member's day index without waiting a day; no production data used.
  await db.query("update member_onboarding set started_at=now()-interval '3 days' where user_id=$1",[user]);
  await db.query('select record_member_engagement($1,$2,$3)',[user,'test','visit']);
  days=(await db.query('select user_id,day_index,activity from member_engagement_days')).rows;
  const cohort=(await db.query('select user_id,started_at,eligible from member_onboarding where user_id=$1',[user])).rows[0];
  cohort.subscription_id='test-subscription';
  const tracking=(await db.query('select started_at from member_engagement_config')).rows[0].started_at;
  const report=m.exports.engagementSummary([cohort],days,[],tracking,Date.parse(cohort.started_at)+8*86400000);
  assert.equal(report.firstWeekObserved,1);assert.deepEqual(report.firstWeekActions.map(a=>a.count),[1,1,1,1,1]);
  assert.equal(report.mature,0);
  const permissions=(await db.query("select has_function_privilege('authenticated','record_member_engagement(uuid,text,text)','execute') as browser,has_function_privilege('service_role','record_member_engagement(uuid,text,text)','execute') as server")).rows[0];
  assert.equal(permissions.browser,false);assert.equal(permissions.server,true);
 }finally{await db.close();}
});
