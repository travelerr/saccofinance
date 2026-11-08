const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite');
test('getting-started progress is durable, idempotent, account-isolated and not anonymous',async()=>{
 const db=new PGlite();
 try{
 await db.exec("create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;insert into auth.users values('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');");
 await db.exec(fs.readFileSync('supabase/migrations/20261022000200_premium_start_here_progress.sql','utf8'));
 await db.exec(fs.readFileSync('supabase/migrations/202611070001_learning_library_start_here.sql','utf8'));
 await db.exec("set role authenticated;set request.jwt.claim.sub='11111111-1111-4111-8111-111111111111'");
 for(const step of ['learning-library','sector-gauge','opportunity','outlook']){
 const sql="insert into premium_start_here_progress(user_id,step) values('11111111-1111-4111-8111-111111111111','"+step+"') on conflict(user_id,step) do nothing";
 await db.exec(sql);const before=(await db.query('select * from premium_start_here_progress order by step')).rows;await db.exec(sql);assert.deepEqual((await db.query('select * from premium_start_here_progress order by step')).rows,before);
 }
 assert.equal((await db.query('select * from premium_start_here_progress')).rows.length,4);
 await assert.rejects(db.exec("insert into premium_start_here_progress(user_id,step) values('22222222-2222-4222-8222-222222222222','outlook')"));
 await assert.rejects(db.exec("insert into premium_start_here_progress(user_id,step) values('11111111-1111-4111-8111-111111111111','invalid')"));
 await db.exec("set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222'");assert.equal((await db.query('select * from premium_start_here_progress')).rows.length,0);
 await db.exec('set role anon');await assert.rejects(db.exec('select * from premium_start_here_progress'));
 }finally{await db.close();}
});
test('banner requires all four actions; automatic tracking is mounted on actual detail content',()=>{
 const source=fs.readFileSync('components/premium/start-here.tsx','utf8');
 const ts=require('typescript'),Module=require('node:module'),original=Module._load;
 let state=false,previewState=null,hookIndex=0;
 Module._load=function(id,...args){if(id==='react/jsx-runtime')return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};if(id==='react')return {useState:()=>[hookIndex++===0?state:previewState,()=>{}],useEffect:()=>{}};if(id==='next/link')return ()=>null;if(id==='lucide-react')return {X:()=>null};return original.call(this,id,...args);};
 try{
 const m=new Module('start-here',module);m.filename=__filename;m.paths=module.paths;
 m._compile(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,__filename);
 const render=props=>{hookIndex=0;return m.exports.default(props);};state=true;
 for(let mask=0;mask<16;mask++){
 const props={userId:'a',completedSteps:['learning-library','sector-gauge','opportunity','outlook'].filter((_,i)=>mask&(1<<i))};
 assert.equal(render(props)===null,mask===15);
 }
 state=false;assert.equal(render({userId:'a'}),null);
 previewState='on';
 const complete={userId:'a',completedSteps:['learning-library','sector-gauge','opportunity','outlook']};
 assert.notEqual(render({...complete,adminPreviewAllowed:true}),null);
 assert.equal(render({...complete,adminPreviewAllowed:false}),null);
 previewState='off';state=true;
 assert.equal(render({userId:'a',adminPreviewAllowed:true}),null);
 assert.notEqual(render({userId:'a',adminPreviewAllowed:false}),null);
 }finally{Module._load=original;}
 assert.match(fs.readFileSync('components/premium/start-here-visit.tsx','utf8'),/useEffect/);
 assert.doesNotMatch(fs.readFileSync('app/premium/opportunities/page.tsx','utf8'),/StartHereVisit/);
});
