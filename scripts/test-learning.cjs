const fs=require('node:fs'),ts=require('typescript');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {PGlite}=require('@electric-sql/pglite');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {lessons,chapterSeconds}=require('../lib/learning/catalog.ts');
const {renderOnboardingEmail}=require('../lib/email/onboarding-template.ts');
test('lesson chapters and welcome introduction preserve existing email actions',()=>{
 assert.equal(lessons.length,1);assert.equal(lessons[0].videoId,'0mrQeujmpMw');
 const times=lessons[0].chapters.map(([t])=>chapterSeconds(t));assert.equal(times[0],0);assert.equal(times.at(-1),1430);assert.deepEqual(times,[...times].sort((a,b)=>a-b));
 const welcome=renderOnboardingEmail(0,'https://saccofinancial.com');
 assert.match(welcome.html,/href="https:\/\/saccofinancial.com\/premium\/learn\/lesson-1"/);
 assert.ok(welcome.html.indexOf('set a password')<welcome.html.indexOf('START HERE'));
 assert.ok(welcome.html.indexOf('START HERE')<welcome.html.indexOf('First, thank you'));
 assert.match(welcome.text,/WATCH LESSON 1: https:\/\/saccofinancial.com\/premium\/learn\/lesson-1/);
 for(const step of [2,5])assert.doesNotMatch(renderOnboardingEmail(step,'https://saccofinancial.com').html,/START HERE — YOUR FIRST PREMIUM LESSON/);
});
test('completion is idempotent and isolated per account; anonymous users cannot read or write',async()=>{
 const db=new PGlite();await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;insert into auth.users values('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');`);
 await db.exec(fs.readFileSync('supabase/migrations/20261021000100_premium_lesson_completions.sql','utf8'));
 await db.exec("set role authenticated;set request.jwt.claim.sub='11111111-1111-4111-8111-111111111111'");
 const insert="insert into premium_lesson_completions(user_id,lesson_id) values('11111111-1111-4111-8111-111111111111','lesson-1') on conflict (user_id,lesson_id) do nothing";
 await db.exec(insert);const before=(await db.query('select * from premium_lesson_completions')).rows;await db.exec(insert);assert.deepEqual((await db.query('select * from premium_lesson_completions')).rows,before);assert.equal(before.length,1);
 await assert.rejects(db.exec("insert into premium_lesson_completions(user_id,lesson_id) values('22222222-2222-4222-8222-222222222222','lesson-1')"));
 await db.exec("set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222'");assert.equal((await db.query('select * from premium_lesson_completions')).rows.length,0);
 await assert.rejects(db.exec('delete from premium_lesson_completions'));await db.exec('set role anon');await assert.rejects(db.exec('select * from premium_lesson_completions'));await assert.rejects(db.exec(insert));await db.close();
});
test('completion action checks Premium access before writing and rejects unknown lessons',async()=>{
 const Module=require('node:module'),original=Module._load;let allowed=false,writes=0;const invalidations=[];
 Module._load=function(id,...args){
  if(id==='@/lib/premium-access')return {requirePremium:async()=>{if(!allowed)throw Error('MEMBERSHIP_REQUIRED');return {id:'account-a'};}};
  if(id==='@/lib/supabase/server')return {createSupabaseServerClient:async()=>({from:()=>({upsert:async(row,options)=>{assert.equal(row.user_id,'account-a');assert.equal(options.ignoreDuplicates,true);writes++;return {error:null};}})})};
  if(id==='@/lib/learning/catalog')return {lessons};
  if(id==='next/cache')return {revalidatePath:path=>invalidations.push(path)};
  return original.call(this,id,...args);
 };
 try{const {completeLesson}=require('../app/premium/learn/actions.ts');await assert.rejects(completeLesson('lesson-1'),/MEMBERSHIP_REQUIRED/);assert.equal(writes,0);allowed=true;assert.equal((await completeLesson('lesson-999')).error,'Unknown lesson.');assert.equal(writes,0);assert.equal((await completeLesson('lesson-1')).error,null);assert.equal(writes,1);assert.deepEqual(invalidations,['/premium/learn','/premium/learn/lesson-1','/premium/dashboard']);}finally{Module._load=original;}
});
