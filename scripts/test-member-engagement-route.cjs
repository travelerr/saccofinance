const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
const {NextRequest,NextResponse}=require('next/server');
function compile(file,imports,globals={}){
 const module={exports:{}};
 const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 new Function('require','module','exports',...Object.keys(globals),source)(id=>{if(id in imports)return imports[id];throw Error('Unexpected import '+id);},module,module.exports,...Object.values(globals));
 return module.exports;
}
const policy=compile('lib/analytics/policy.ts',{});
function harness(overrides={}){
 const calls=[],logs=[];
 const env={AUTH_SITE_URL:'https://saccofinancial.com',GA_ANALYTICS_ENABLED:'true',STRIPE_MODE:'live',...overrides.env};
 const route=compile('app/api/analytics/member-engagement/route.ts',{
  'next/server':{NextResponse},'@/lib/analytics/policy':policy,
  '@/lib/supabase/server':{createSupabaseServerClient:async()=>({auth:{getUser:async()=>({data:{user:overrides.user===undefined?{id:'member',is_anonymous:false}:overrides.user},error:overrides.authError})}})},
  '@/lib/email/policy':{isResearchAdmin:()=>Boolean(overrides.isAdmin)},
  '@/lib/billing/server':{billingServices:async()=>{if(overrides.throw)throw Error('private provider details');return {mode:env.STRIPE_MODE,admin:{rpc:async(name,args)=>{calls.push({name,args});return {error:overrides.dbError};}}};}},
 },{process:{env},console:{warn:message=>logs.push(message)}});
 const request=(body='{"activity":"dashboard"}',headers={})=>new NextRequest('https://internal.amplify.invalid/api/analytics/member-engagement',{method:'POST',headers:{origin:'https://saccofinancial.com','content-type':'application/json',...headers},body});
 return {...route,calls,logs,request};
}
test('Amplify internal request URL accepts the configured public origin and authenticated identity',async()=>{
 const h=harness();const r=await h.POST(h.request('{"activity":"dashboard","user_id":"forged"}'));
 assert.equal(r.status,204);assert.equal(r.headers.get('cache-control'),'private, no-store');
 assert.deepEqual(h.calls,[{name:'record_member_engagement',args:{p_user:'member',p_mode:'live',p_activity:'dashboard'}}]);
});
test('missing, null, foreign and prefix-spoofed origins cannot write, even with forwarded headers',async()=>{
 for(const origin of ['','null','https://evil.example','https://saccofinancial.com.evil.example']){
  const h=harness();assert.equal((await h.POST(h.request(undefined,{origin,'x-forwarded-host':'saccofinancial.com'}))).status,403);assert.equal(h.calls.length,0);
 }
});
test('local configured origin works and missing or malformed configuration fails closed',async()=>{
 const h=harness({env:{AUTH_SITE_URL:'http://localhost:3082',SACCO_LOCAL_DEVELOPMENT:'true',ANALYTICS_PREVIEW:'true',STRIPE_MODE:'test'}});
 assert.equal((await h.POST(h.request(undefined,{origin:'http://localhost:3082'}))).status,204);assert.equal(h.calls[0].args.p_mode,'test');
 for(const value of [undefined,'not-a-url']){const h=harness({env:{AUTH_SITE_URL:value}});assert.equal((await h.POST(h.request())).status,503);assert.equal(h.calls.length,0);}
});
test('privacy preferences, disabled analytics, anonymous accounts and admins stay excluded',async()=>{
 for(const settings of [{env:{GA_ANALYTICS_ENABLED:'false'}},{user:null},{authError:{name:'AuthSessionMissingError'}},{user:{id:'guest',is_anonymous:true}},{isAdmin:true}]){
  const h=harness(settings);assert.equal((await h.POST(h.request())).status,204);assert.equal(h.calls.length,0);
 }
 for(const headers of [{cookie:'sf_analytics_consent=denied'},{'sec-gpc':'1'}]){
  const h=harness();assert.equal((await h.POST(h.request(undefined,headers))).status,204);assert.equal(h.calls.length,0);
 }
});
test('only supported activities reach the database; malformed or oversized bodies do not',async()=>{
 for(const activity of ['visit','dashboard','opportunity','sector_view','sector_use']){
  const h=harness();assert.equal((await h.POST(h.request(JSON.stringify({activity})))).status,204);assert.equal(h.calls[0].args.p_activity,activity);
 }
 for(const body of ['null','{}','invalid','{"activity":"other"}','x'.repeat(101)]){
  const h=harness();assert.equal((await h.POST(h.request(body))).status,400);assert.equal(h.calls.length,0);
 }
});
test('database and service failures report failure without leaking provider or member details',async()=>{
 for(const settings of [{dbError:{message:'private details'}},{throw:true},{authError:{message:'secret'}}]){
  const h=harness(settings);assert.equal((await h.POST(h.request())).status,503);assert.equal(h.logs.length,1);assert.doesNotMatch(h.logs.join(' '),/private details|secret|member@/);
 }
});
test('browser reports failed HTTP and network requests without blocking navigation',async()=>{
 for(const outcome of ['ok','403','network']){
  const logs=[];
  const client=compile('lib/analytics/member-engagement-browser.ts',{'./browser':{hasConsent:()=>true}},{navigator:{},console:{warn:m=>logs.push(m)},fetch:async()=>{if(outcome==='network')throw Error('private');return {ok:outcome==='ok',status:403};}});
  assert.equal(client.recordMemberEngagement('dashboard'),undefined);
  await new Promise(resolve=>setImmediate(resolve));assert.equal(logs.length,outcome==='ok'?0:1);
 }
});
