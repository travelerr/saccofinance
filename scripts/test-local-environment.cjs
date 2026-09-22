const fs=require('node:fs');const ts=require('typescript');const assert=require('node:assert/strict');const {test}=require('node:test');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);
const {safeBaseEnv,appEnv}=require('./local-environment.cjs');const {localDevelopment}=require('../lib/local-development.ts');
test('local launcher drops inherited production secrets and overrides Next dotenv values',()=>{
 const old=process.env.STRIPE_SECRET_KEY;process.env.STRIPE_SECRET_KEY='sk_live_TEST_SENTINEL';process.env.UNEXPECTED_SECRET='TEST_SENTINEL';
 try{const base=safeBaseEnv();assert.equal(base.STRIPE_SECRET_KEY,'');assert.ok(!base.UNEXPECTED_SECRET);const env=appEnv({apiUrl:'http://127.0.0.1:54321',publishableKey:'local-public',secretKey:'local-secret',adminId:'fixture'});assert.equal(env.SUPABASE_SECRET_KEY,'local-secret');assert.equal(env.STRIPE_MODE,'test');assert.equal(env.EMAIL_SEND_MODE,'dry-run');assert.equal(env.BILLING_SECRETS_ARN,'');assert.throws(()=>appEnv({apiUrl:'https://production.supabase.co',publishableKey:'x',secretKey:'x',adminId:'x'}));}finally{if(old===undefined)delete process.env.STRIPE_SECRET_KEY;else process.env.STRIPE_SECRET_KEY=old;delete process.env.UNEXPECTED_SECRET;}
});
test('local simulation flag fails closed for remote credentials; unset preserves production behavior',()=>{
 const original={...process.env};try{
 delete process.env.SACCO_LOCAL_DEVELOPMENT;assert.equal(localDevelopment(),false);
 Object.assign(process.env,{SACCO_LOCAL_DEVELOPMENT:'true',NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54321',AUTH_SITE_URL:'http://localhost:3082',STRIPE_MODE:'test',STRIPE_SECRET_KEY:'',BILLING_SECRETS_ARN:'',RESEND_API_KEY:''});assert.equal(localDevelopment(),true);
 for(const [key,value] of Object.entries({NEXT_PUBLIC_SUPABASE_URL:'https://remote.supabase.co',STRIPE_MODE:'live',STRIPE_SECRET_KEY:'sk_test_example',RESEND_API_KEY:'anything',BILLING_SECRETS_ARN:'arn:aws:example'})){const prior=process.env[key];process.env[key]=value;assert.throws(()=>localDevelopment(),/UNSAFE_LOCAL_CONFIGURATION/);process.env[key]=prior;}
 }finally{for(const key of Object.keys(process.env))if(!(key in original))delete process.env[key];Object.assign(process.env,original);}
});
