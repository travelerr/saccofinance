// One-recipient developer delivery only. Does not enable live sends in the local web app/worker.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const {localDir,runtime}=require('./local-environment.cjs');
const load=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};return load.call(this,id,...args)};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {validateDeveloperEmailConfig}=require('../lib/email/developer-test-policy.ts');
const {renderAccessReminder}=require('../lib/email/access-reminder-template.ts');
const {resendBatchWithTransport}=require('../lib/email/resend-client.ts');
(async()=>{
 const [command,confirmation,...extra]=process.argv.slice(2);
 if(!['preview','send'].includes(command)||extra.length)throw Error('Use preview, or send --send-to-configured-test-recipient. No recipient overrides.');
 const local=runtime();if(local.apiUrl!=='http://127.0.0.1:54321')throw Error('Loopback database required');
 const file=path.join(localDir,'resend-test.json');if((fs.statSync(file).mode&0o077)!==0)throw Error('Private config must have permissions 600');
 const config=validateDeveloperEmailConfig(JSON.parse(fs.readFileSync(file,'utf8')));
 const evidence=JSON.parse(fs.readFileSync(path.join(localDir,'retention-reminder-evidence.json'),'utf8'));
 if(evidence.mode!=='dry-run'||evidence.resumedSkipped!==true||evidence.receiptCount!==1||!(Date.now()-Date.parse(evidence.checkedAt)<3600000)||Date.parse(evidence.endsAt)<=Date.now())throw Error('Run fresh sandbox reminder checks before testing delivery');
 const rendered=renderAccessReminder('http://localhost:3082',evidence.endsAt);
 const note='LOCAL TEST ONLY — this date belongs to a disposable sandbox subscription. Your actual subscription is unchanged. The button opens localhost on this computer.';
 const email={...rendered,subject:'[LOCAL TEST] '+rendered.subject,text:note+'\n\n'+rendered.text,html:rendered.html.replace('<h1 ',`<p style="padding:12px;border:1px solid #8fd8f2;font-size:14px;line-height:1.6">${note}</p><h1 `)};
 const event='BILLING_ACCESS_ENDING_TEST:'+evidence.checkedAt.slice(0,10);
 const {createClient}=require('@supabase/supabase-js');const db=createClient(local.apiUrl,local.secretKey,{auth:{persistSession:false,autoRefreshToken:false}});
 console.log('Only recipient: '+config.recipient+'\nSubject: '+email.subject+'\nSandbox end: '+evidence.endsAt+'\nCTA: '+email.url);
 fs.writeFileSync(path.join(localDir,'retention-email-preview.html'),email.html,{mode:0o600});
 if(command==='preview'){console.log('Preview saved; no email sent');return;}
 if(confirmation!=='--send-to-configured-test-recipient')throw Error('Explicit send flag required');
 const {data:id,error}=await db.rpc('reserve_developer_email_test',{p_event:event,p_subject:email.subject});
 if(error)throw Error('Could not reserve developer test: '+(['TEST_ALREADY_RESERVED','TEST_DAILY_LIMIT','TEST_MONTHLY_LIMIT','TEST_RATE_LIMIT'].find(x=>error.message.includes(x))||'check local log migration'));
 try{
  const ids=await resendBatchWithTransport({from:config.from,apiKey:config.apiKey,emails:[config.recipient],email,key:'sacco-developer-test/'+id},fetch);
  const receipt=await db.from('developer_email_test_log').update({status:'accepted',provider_ids:ids,completed_at:new Date().toISOString()}).eq('id',id);if(receipt.error)throw Error('LOG_FAILURE');
  console.log('Resend accepted ONE test email. No member audience queried; no automatic resend.');
  const status=await fetch('https://api.resend.com/emails/'+encodeURIComponent(ids[0]),{headers:{Authorization:'Bearer '+config.apiKey},signal:AbortSignal.timeout(10000)}).catch(()=>null);
  if(status?.ok){const result=await status.json();console.log('Provider status: '+(result.last_event||'accepted'));}
 }catch{
  await db.from('developer_email_test_log').update({status:'failed_or_uncertain',completed_at:new Date().toISOString()}).eq('id',id);
  throw Error('Delivery rejected or uncertain; inspect provider before retrying. This test remains reserved.');
 }
})().catch(e=>{console.error(e.message);process.exitCode=1});
