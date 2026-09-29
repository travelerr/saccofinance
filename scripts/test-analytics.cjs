const fs=require('node:fs');const ts=require('typescript');const assert=require('node:assert/strict');const {test}=require('node:test');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);
const p=require('../lib/analytics/policy.ts');const {purchaseEvent}=require('../lib/analytics/purchase.ts');
const campaign={source:'youtube',medium:'organic_social',campaign:'premium_launch',content:'bio'};
const context={clientId:'12345.67890',sessionId:'123456',attribution:{first:campaign,last:campaign}};
test('analytics is disabled unless explicitly production-enabled; local can never send to Google',()=>{
 assert.equal(p.analyticsMode({}),'disabled');
 const live={GA_ANALYTICS_ENABLED:'true',AUTH_SITE_URL:'https://saccofinancial.com',STRIPE_MODE:'live'};assert.equal(p.analyticsMode(live),'live');
 for(const change of [{AUTH_SITE_URL:'http://localhost:3082'},{STRIPE_MODE:'test'},{SACCO_LOCAL_DEVELOPMENT:'true'}])assert.equal(p.analyticsMode({...live,...change}),'disabled');
 assert.equal(p.analyticsMode({...live,SACCO_LOCAL_DEVELOPMENT:'true',ANALYTICS_PREVIEW:'true'}),'preview');
});
test('campaigns retain first touch and latest non-direct touch; Stripe and internal returns do not steal credit',()=>{
 const first=p.campaignFromUrl('https://saccofinancial.com/premium?utm_source=youtube&utm_medium=organic_social&utm_campaign=premium_launch&utm_content=bio');assert.deepEqual(first,campaign);
 const initial=p.updateAttribution(undefined,first);const email=p.campaignFromUrl('https://saccofinancial.com/premium/issue-002?utm_source=newsletter&utm_medium=email&utm_campaign=weekly-outlook-002');
 const updated=p.updateAttribution(initial,email);assert.equal(updated.first.source,'youtube');assert.equal(updated.last.source,'newsletter');
 for(const referrer of ['https://checkout.stripe.com/c/pay','https://saccofinancial.com/','https://abc.supabase.co/auth/v1/verify'])assert.deepEqual(p.updateAttribution(updated,p.campaignFromUrl('https://saccofinancial.com/premium',referrer)),updated);
 assert.equal(p.campaignFromUrl('https://saccofinancial.com','https://m.facebook.com/test').source,'facebook');
 assert.equal(p.campaignFromUrl('https://saccofinancial.com','https://facebook.com.evil.invalid/test').source,'referral');
});
test('PII, query tokens and arbitrary event data are not forwarded',()=>{
 const dirty=p.campaignFromUrl('https://saccofinancial.com/premium?utm_source=youtube&utm_medium=email&utm_campaign=person%40example.com&utm_content=https://secret&token_hash=secret&email=person@example.com');
 assert.equal(dirty.campaign,'');assert.equal(dirty.content,'');assert.ok(!JSON.stringify(dirty).includes('secret'));
 for(const route of ['/premium/auth/claim/abc','/premium/set-password','/premium/login','/premium/admin/notifications','/email/unsubscribe','/api/test','/unknown'])assert.equal(p.safePage(route),null);
 assert.equal(p.safePage('/premium/opportunities/strategy-005'),'/premium/opportunities/strategy-005');
 assert.equal(p.parseContext('bad'),null);assert.equal(p.parseContext(JSON.stringify({...context,clientId:['123.456']})),null);
 assert.deepEqual(p.parseContext(JSON.stringify({...context,email:'secret@example.com'})),context);
});
test('purchase requires signed-webhook-compatible live paid data and consent context; amount and transaction ID come from Stripe',()=>{
 const session={id:'cs_live_fixture',livemode:true,mode:'subscription',status:'complete',payment_status:'paid',amount_total:1000,currency:'usd',metadata:{sf_ga_context:JSON.stringify(context),email:'not-for-google@example.com'}};
 const event=purchaseEvent(session);assert.equal(event.events[0].params.value,10);assert.equal(event.events[0].params.transaction_id,session.id);assert.equal(event.client_id,context.clientId);assert.ok(!JSON.stringify(event).includes('@'));assert.deepEqual(purchaseEvent(session),event);
 for(const change of [{livemode:false},{payment_status:'unpaid'},{status:'open'},{amount_total:-1},{amount_total:1.5},{currency:'eur'},{metadata:null},{id:'fake'}])assert.equal(purchaseEvent({...session,...change}),null);
});
test('engagement requires active reading time plus depth, not a page open alone',()=>{
 assert.equal(p.engagementReached(0,100),false);assert.equal(p.engagementReached(60000,20),false);assert.equal(p.engagementReached(30000,50),true);
});
test('local preview shares no production secrets even when they exist in parent environment',()=>{
 const {safeBaseEnv}=require('./local-environment.cjs');const old=process.env.GA_MEASUREMENT_API_SECRET;process.env.GA_MEASUREMENT_API_SECRET='SENTINEL';try{assert.equal(safeBaseEnv().GA_MEASUREMENT_API_SECRET,'');assert.equal(safeBaseEnv().GA_ANALYTICS_ENABLED,'');}finally{if(old===undefined)delete process.env.GA_MEASUREMENT_API_SECRET;else process.env.GA_MEASUREMENT_API_SECRET=old;}
});

test('browser consent gates scripts and events; preview sends nothing; revocation clears tracking',()=>{
 const vm=require('node:vm');const jar=new Map();const scripts=[];const events=[];
 const document={head:{appendChild:script=>scripts.push(script)},createElement:()=>({})};
 Object.defineProperty(document,'cookie',{get:()=>[...jar].map(([k,v])=>k+'='+v).join('; '),set:raw=>{const [pair,...options]=raw.split('; ');const split=pair.indexOf('=');const key=pair.slice(0,split),value=pair.slice(split+1);if(options.includes('Max-Age=0'))jar.delete(key);else jar.set(key,value);}});
 const window={dispatchEvent:event=>events.push(event)};const sandbox={exports:{},require:id=>{if(id==='./policy')return p;throw Error(id);},document,window,navigator:{},location:{protocol:'http:',origin:'http://localhost:3083'},Event};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(require.resolve('../lib/analytics/browser.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,sandbox);
 const b=sandbox.exports;b.startPage({mode:'preview'},'/premium','https://saccofinancial.com/premium?utm_source=youtube&utm_medium=organic_social','');assert.equal(window.__saccoAnalyticsPreview,undefined);assert.equal(scripts.length,0);
 b.setConsent(true);b.startPage({mode:'preview'},'/premium','https://saccofinancial.com/premium?utm_source=youtube&utm_medium=organic_social&email=private@example.com','');assert.equal(window.__saccoAnalyticsPreview.length,2);assert.equal(window.__saccoAnalyticsPreview[0].params.first_source,'youtube');assert.ok(!JSON.stringify(window.__saccoAnalyticsPreview).includes('@'));assert.equal(scripts.length,0);
 b.setConsent(false);const count=window.__saccoAnalyticsPreview.length;b.track('research_view');assert.equal(window.__saccoAnalyticsPreview.length,count);assert.ok(!jar.has('sf_analytics_attribution'));
 b.setConsent(true);b.startPage({mode:'live'},'/premium','https://saccofinancial.com/premium','');assert.equal(scripts.length,0,'localhost cannot load live GA even if configured accidentally');
 sandbox.location={protocol:'https:',origin:'https://saccofinancial.com'};b.startPage({mode:'live'},'/premium/auth/claim/private','https://saccofinancial.com/premium/auth/claim/private?token_hash=secret','');assert.equal(scripts.length,0);
 b.startPage({mode:'live'},'/premium','https://saccofinancial.com/premium?token_hash=secret','https://other.invalid?email=secret');assert.equal(scripts.length,1);assert.equal(scripts[0].referrerPolicy,'no-referrer');assert.ok(!JSON.stringify(window.dataLayer).includes('token_hash'));assert.ok(!JSON.stringify(window.dataLayer).includes('other.invalid'));
 sandbox.navigator.globalPrivacyControl=true;assert.equal(b.hasConsent(),false);const size=window.dataLayer.length;b.track('research_view');assert.equal(window.dataLayer.length,size);
});

test('affiliate clicks preserve exact partner URLs and expose only fixed reporting labels',()=>{
 const {affiliateTools,affiliateClickParams}=require('../lib/affiliate-tools.ts');
 assert.deepEqual(affiliateTools.map(t=>t.url),['https://trendspider.com?_go=justin-4f7fc2','https://link.seekingalpha.com/5FNXWBJ/4G6SHH/']);
 for(const tool of affiliateTools){assert.deepEqual(affiliateClickParams(new URL(tool.url).href,'premium_tools'),{affiliate_partner:tool.id,placement:'premium_tools',destination:tool.destination});assert.equal(affiliateClickParams(tool.url+'?email=private@example.com','premium_tools'),null);}
 assert.equal(affiliateClickParams('https://example.com','premium_tools'),null);assert.equal(affiliateClickParams(new URL(affiliateTools[0].url).href,'unknown'),null);
});
