const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite');
test('paid plan removes daily cap but preserves monthly, duplicate, pause and batch protections',async()=>{
 const db=new PGlite();try{
 await db.exec("create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as 'select null::uuid';");
 for(const f of ['202609220001_research_notifications.sql','202609220002_research_safeguards.sql','202610120001_research_email_paid_plan.sql'])await db.exec(fs.readFileSync('supabase/migrations/'+f,'utf8'));
 const reserve=(key,n=47)=>db.query("select reserve_research_notification($1,'OPPORTUNITY_PUBLISHED','test',null,'test',$2,'live',null) as ok",[key,n]);
 assert.equal((await reserve('first')).rows[0].ok,true);
 await db.exec("update research_notification_log set created_at=now()-interval '1 hour'");
 assert.equal((await reserve('second')).rows[0].ok,true); // 94 exceeds old 90 daily cap
 assert.equal((await reserve('second')).rows[0].ok,false);
 await assert.rejects(reserve('oversize',101),/RECIPIENT_LIMIT/);
 await db.exec("update research_notification_log set created_at=now()-interval '1 hour',recipient_count=100; insert into research_notification_log(event_key,notification_type,entity_id,subject,recipient_count,mode,status,created_at) select 'bulk-'||i,'OPPORTUNITY_PUBLISHED','test','test',100,'live','sent',now()-interval '1 hour' from generate_series(1,498) i");
 await assert.rejects(reserve('monthly'),/MONTHLY_LIMIT/);
 await db.exec('update research_email_limits set paused=true');await assert.rejects(reserve('paused'),/EMAIL_PAUSED/);
 const limits=(await db.query('select * from research_email_limits')).rows[0];assert.equal(limits.daily_limit,null);assert.equal(limits.monthly_limit,50000);
 }finally{await db.close();}
});
