const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function actionHarness(failAnalytics=false){const calls=[];const exports={};const mocks={
 '@/lib/sample/attribution':{recordSampleCheckout:async()=>{if(failAnalytics)throw Error('Analytics unavailable');}},
 'next/navigation':{redirect:url=>{throw Object.assign(new Error('redirect'),{url});}},
 '@/lib/supabase/server':{createSupabaseServerClient:async()=>({auth:{signInAnonymously:async()=>({data:{user:{id:'guest',is_anonymous:true}}})}})},
 '@/lib/premium-access':{premiumAccess:async()=>({allowed:false,user:null})},
 '@/lib/billing/model':{billingEnabled:()=>true},
 '@/lib/billing/server':{billingServices:async()=>({stripe:{},admin:{from:()=>({select:()=>({limit:async()=>({error:null})})})}}),checkedPrice:async()=>{}},
 '@/lib/billing/checkout':{checkoutUrl:async(...args)=>{calls.push(args);return 'https://checkout.stripe.com/test';}}
 };vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/premium/join/actions.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,require:id=>mocks[id],Error,String});return {actions:exports,calls};}
test('direct checkout selects Stripe consent without pretending the visitor accepted terms',async()=>{for(const plan of ['monthly','annual']){const {actions,calls}=actionHarness();const form=new FormData();form.set('plan',plan);await assert.rejects(actions.beginDirectCheckout(form),e=>e.url==='https://checkout.stripe.com/test');assert.equal(calls[0][1],plan);assert.equal(calls[0][3],true);}});
test('legacy join still requires explicit terms and direct checkout rejects invalid plans',async()=>{const {actions,calls}=actionHarness();const form=new FormData();form.set('plan','monthly');await assert.rejects(actions.beginCheckout(form),e=>e.url==='/premium/join?error=details');form.set('plan','invalid');await assert.rejects(actions.beginDirectCheckout(form),e=>e.url==='/premium/join?error=details');assert.equal(calls.length,0);});

test('failed sample attribution never blocks a successful checkout redirect',async()=>{const {actions}=actionHarness(true);const form=new FormData();form.set('plan','annual');await assert.rejects(actions.beginDirectCheckout(form),e=>e.url==='https://checkout.stripe.com/test');});
