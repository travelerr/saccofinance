const fs=require('node:fs'),assert=require('node:assert/strict'),{test}=require('node:test'),{PGlite}=require('@electric-sql/pglite');
test('201 recipients split atomically; retries preserve sent batches and uncertain sends stay locked',async()=>{
 const db=new PGlite();try{
 await db.exec("create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as 'select null::uuid';");
 for(const f of ['202609220001_research_notifications.sql','202609220002_research_safeguards.sql','202610110001_research_email_jobs.sql','202610120001_research_email_paid_plan.sql','202610120002_research_broadcast_batches.sql']){if(f==='202610120002_research_broadcast_batches.sql')await db.exec('alter table research_email_jobs rename constraint research_email_jobs_event_key_mode_key to production_custom_event_unique');await db.exec(fs.readFileSync('supabase/migrations/'+f,'utf8'));}
 const event={key:'batch-test',type:'OPPORTUNITY_PUBLISHED',entityId:'test',subject:'test'};
 const recipients=Array.from({length:201},(_,i)=>({userId:String(i),email:`${i}@example.invalid`}));
 const enqueue=(rows=recipients)=>db.query("select enqueue_research_email($1,$2,'live',null,'https://saccofinancial.com','sender') ok",[JSON.stringify(event),JSON.stringify(rows)]);
 await assert.rejects(enqueue([recipients[0],recipients[0]]),/INVALID_RECIPIENTS/);
 assert.equal((await enqueue()).rows[0].ok,true);assert.equal((await enqueue()).rows[0].ok,false);
 assert.deepEqual((await db.query('select jsonb_array_length(recipients) n from research_email_jobs order by batch_index')).rows.map(r=>r.n),[100,100,1]);
 assert.equal((await db.query('select recipient_count from research_notification_log')).rows[0].recipient_count,201);
 const claim=async()=>(await db.query("select * from claim_research_email('live')")).rows[0];
 const transition=(j,a,ids=[])=>db.query('select transition_research_email($1,$2,$3,$4,null) ok',[j.id,j.lease_token,a,JSON.stringify(ids)]);
 const first=await claim();await transition(first,'dispatch');await transition(first,'sent',first.recipients.map(r=>'id-'+r.userId));
 assert.equal((await db.query('select status from research_notification_log')).rows[0].status,'reserved');
 const second=await claim();await db.exec(`update research_email_jobs set attempts=3 where batch_index=1`);await transition(second,'retry');
 const third=await claim();await transition(third,'dispatch');await transition(third,'sent',['id-200']);
 let log=(await db.query('select * from research_notification_log')).rows[0];assert.equal(log.status,'failed');assert.equal(log.provider_ids.length,101);
 assert.equal((await db.query("select retry_research_email_preparation('batch-test','live') ok")).rows[0].ok,true);
 const retry=await claim();assert.equal(retry.batch_index,1);assert.equal(await claim(),undefined);
 await transition(retry,'dispatch');await transition(retry,'sent',retry.recipients.map(r=>'id-'+r.userId));
 log=(await db.query('select * from research_notification_log')).rows[0];assert.equal(log.status,'sent');assert.equal(log.provider_ids.length,201);assert.equal(new Set(log.provider_ids).size,201);assert.equal(await claim(),undefined);
 const before=(await db.query('select id,provider_ids,status from research_email_jobs order by batch_index')).rows;
 await db.exec(fs.readFileSync('supabase/migrations/202610120002_research_broadcast_batches.sql','utf8'));
 assert.deepEqual((await db.query('select id,provider_ids,status from research_email_jobs order by batch_index')).rows,before);
 assert.equal((await transition(first,'dispatch')).rows[0].ok,false);
 await db.exec("update research_notification_log set created_at=now()-interval '1 hour'");event.key='uncertain';await enqueue(recipients.slice(0,1));const u=await claim();await transition(u,'dispatch');await db.exec("update research_email_jobs set lease_until=now()-interval '1 second' where event_key='uncertain'");assert.equal(await claim(),undefined);assert.equal((await db.query("select retry_research_email_preparation('uncertain','live') ok")).rows[0].ok,false);
 await db.exec('set role authenticated');await assert.rejects(enqueue());await assert.rejects(db.query("select refresh_research_broadcast('batch-test','live')"));
 }finally{await db.close();}
});
