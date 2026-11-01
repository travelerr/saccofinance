const fs=require('node:fs'),Module=require('node:module'),ts=require('typescript');
const {test}=require('node:test'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,f);
let state;
const original=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};if(id==='./server')return {billingServices:async()=>state.services,priceId:p=>p==='annual'?'price_year':'price_month',checkedPrice:async()=>{},authOrigin:()=> 'http://localhost:3082'};if(id==='./ownership')return {ownedBillingCustomers:async()=>['cus_owned']};return original.call(this,id,...args)};
const {assertAnnualUpgrade,assertUpgradePortal,annualUpgradeUrl}=require('../lib/billing/annual-upgrade.ts');
function reset(){const sub={id:'sub_owned',customer:'cus_owned',livemode:false,status:'active',latest_invoice:{status:'paid'},items:{data:[{id:'si_original',quantity:1,price:{id:'price_month'}}]}};const portal={active:true,livemode:false,features:{subscription_cancel:{enabled:false},subscription_update:{enabled:true,default_allowed_updates:['price'],proration_behavior:'always_invoice',products:[{prices:['price_year']}],schedule_at_period_end:{conditions:[]}}}};state={sub,portal,created:[],owner:true};const q={select(){return q},eq(){return q},async maybeSingle(){return {data:state.owner?{stripe_subscription_id:'sub_owned'}:null}}};state.services={mode:'test',admin:{from:()=>q},stripe:{subscriptions:{retrieve:async()=>state.sub},billingPortal:{configurations:{retrieve:async()=>state.portal},sessions:{create:async p=>{state.created.push(p);return {url:'https://billing.stripe.com/session/test'}}}}}};process.env.STRIPE_UPGRADE_PORTAL_CONFIGURATION_ID='bpc_test';return state;}
test('only settled active monthly memberships can upgrade',()=>{
 reset();assertAnnualUpgrade(state.sub,false,'price_month',['cus_owned']);
 for(const patch of [{status:'trialing'},{status:'past_due'},{status:'canceled'},{cancel_at_period_end:true},{cancel_at:2000000000},{pending_update:{}},{schedule:'sched'},{pause_collection:{}},{livemode:true},{customer:'cus_other'},{latest_invoice:{status:'open'}},{latest_invoice:null},{items:{data:[{quantity:1,price:{id:'price_year'}}]}}])assert.throws(()=>assertAnnualUpgrade({...state.sub,...patch},false,'price_month',['cus_owned']));
});
test('portal must credit unused time, invoice immediately and preserve required cancellation flow',()=>{
 reset();assertUpgradePortal(state.portal,false,'price_year');
 for(const change of [{proration_behavior:'none'},{proration_behavior:'create_prorations'},{enabled:false},{products:[]},{default_allowed_updates:[]},{schedule_at_period_end:{conditions:[{type:'decreasing_item_amount'}]}}])assert.throws(()=>assertUpgradePortal({...state.portal,features:{...state.portal.features,subscription_update:{...state.portal.features.subscription_update,...change}}},false,'price_year'));
 assert.throws(()=>assertUpgradePortal({...state.portal,livemode:true},false,'price_year'));
 assert.throws(()=>assertUpgradePortal({...state.portal,features:{...state.portal.features,subscription_cancel:{enabled:true}}},false,'price_year'));
});
test('creates confirmation for existing item; never creates or updates a subscription on click',async()=>{
 reset();await annualUpgradeUrl('user','sub_owned');const p=state.created[0];assert.equal(p.customer,'cus_owned');assert.deepEqual(p.flow_data.subscription_update_confirm,{subscription:'sub_owned',items:[{id:'si_original',price:'price_year',quantity:1}]});assert.equal(p.flow_data.type,'subscription_update_confirm');assert.equal(p.flow_data.after_completion.redirect.return_url,'http://localhost:3082/premium/account?billing=return');
});
test('wrong ledger owner, stale eligibility and invalid config fail before portal creation',async()=>{
 for(const mutate of [()=>state.owner=false,()=>state.sub.status='past_due',()=>state.portal.active=false,()=>delete process.env.STRIPE_UPGRADE_PORTAL_CONFIGURATION_ID]){reset();mutate();await assert.rejects(annualUpgradeUrl('user','sub_owned'));assert.equal(state.created.length,0);}
});
