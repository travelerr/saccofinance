// Separate local-only CLI. The web app remains dry-run and never loads this key.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const {spawnSync}=require('node:child_process');const {root,localDir,runtime,safeBaseEnv}=require('./local-environment.cjs');
const original=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};return original.call(this,id,...args);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {validateDeveloperEmailConfig}=require('../lib/email/developer-test-policy.ts');
const {researchEvents}=require('../lib/email/events.ts');const {renderResearchEmail}=require('../lib/email/templates.ts');
const {resendBatchWithTransport}=require('../lib/email/resend-client.ts');
const records=require('../lib/premium-opportunities.ts');const events=researchEvents(records.weeklyOutlooks,records.opportunities,records.opportunityUpdates);
async function main(){
 const [command,key,confirmation,...extra]=process.argv.slice(2);
 if(extra.length)throw Error('Unexpected arguments. Recipient overrides are not supported.');
 if(command==='list'){for(const e of events)console.log(e.key+'\n  '+e.subject);return;}
 const local=runtime();if(local.apiUrl!=='http://127.0.0.1:54321')throw Error('Local database required.');
 if(command==='init'){
  const result=spawnSync('docker',['exec','-i','supabase_db_sacco-local','psql','-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1'],{env:safeBaseEnv(),input:fs.readFileSync(path.join(root,'supabase/local/research-email-test.sql')),encoding:'utf8'});
  if(result.status!==0)throw Error('Start the sacco-local database before initializing test email logs.');
  const file=path.join(localDir,'resend-test.json');if(!fs.existsSync(file))fs.writeFileSync(file,JSON.stringify({apiKey:'',from:'',recipient:''},null,2)+'\n',{mode:0o600});fs.chmodSync(file,0o600);
  console.log('Private configuration ready: .local-development/resend-test.json\nNo email sent.');return;
 }
 if(!['preview','send'].includes(command))throw Error('Use list, init, preview EVENT_KEY, or send EVENT_KEY --send-to-configured-test-recipient');
 const event=events.find(e=>e.key===key);if(!event)throw Error('Choose a published event from npm run email:test -- list.');
 const file=path.join(localDir,'resend-test.json');if((fs.statSync(file).mode&0o077)!==0)throw Error('Private configuration permissions must be 600.');
 const config=validateDeveloperEmailConfig(JSON.parse(fs.readFileSync(file,'utf8')));
 const {createClient}=require('@supabase/supabase-js');const db=createClient(local.apiUrl,local.secretKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const identity=await db.auth.admin.getUserById(local.adminId);const {isResearchAdmin}=require('../lib/email/policy.ts');if(identity.error||!isResearchAdmin(identity.data.user,local.adminId))throw Error('Configured local administrator is unavailable.');
 const rendered=renderResearchEmail(event,'http://localhost:3082');
 const email={...rendered,subject:'[LOCAL TEST] '+rendered.subject,text:'LOCAL TEST — links open the development site on this computer.\n\n'+rendered.text,html:rendered.html.replace('<body ', '<body ').replace('SACCO PREMIUM</p>','SACCO PREMIUM / LOCAL TEST</p>')};
 const {data:prior,error:logError}=await db.from('developer_email_test_log').select('status,created_at,provider_ids').eq('event_key',event.key).maybeSingle();if(logError)throw Error('Run npm run email:test -- init to prepare local test logs.');
 console.log('Type: '+event.type+'\nFrom: '+config.from+'\nOnly recipient: '+config.recipient+'\nSubject: '+email.subject+'\nCTA: '+email.url+'\nExisting attempt: '+(prior?prior.status:'none'));
 if(command==='preview'){fs.writeFileSync(path.join(localDir,'resend-test-preview.html'),email.html,{mode:0o600});console.log('Preview: .local-development/resend-test-preview.html\nNo email sent.');return;}
 if(confirmation!=='--send-to-configured-test-recipient')throw Error('To send ONE real test email, add --send-to-configured-test-recipient.');
 if(prior)throw Error('This event was already attempted. No automatic resend is allowed.');
 const {data:id,error:reserveError}=await db.rpc('reserve_developer_email_test',{p_event:event.key,p_subject:email.subject});
 if(reserveError){const message=reserveError.message||'';throw Error(['TEST_ALREADY_RESERVED','TEST_DAILY_LIMIT','TEST_MONTHLY_LIMIT','TEST_RATE_LIMIT'].find(x=>message.includes(x))||'Could not reserve the local send log. No email sent.');}
 try{
  // Recipient originates ONLY from the private config. Never query member/preferences tables.
  const ids=await resendBatchWithTransport({from:config.from,apiKey:config.apiKey,emails:[config.recipient],email,key:'sacco-developer-test/'+id},fetch);
  const {error}=await db.from('developer_email_test_log').update({status:'accepted',provider_ids:ids,completed_at:new Date().toISOString()}).eq('id',id);if(error)throw Error('LOG_FAILURE');
  console.log('Resend accepted the test email. Check the recipient inbox and Resend delivery status.');
 }catch{
  await db.from('developer_email_test_log').update({status:'failed_or_uncertain',completed_at:new Date().toISOString()}).eq('id',id);
  throw Error('Provider rejected the send or the outcome is uncertain. Check Resend logs before any further action; this event remains blocked.');
 }
}
main().catch(error=>{console.error(error.code==='ENOENT'?'Run npm run email:test -- init first.':error instanceof SyntaxError?'Invalid JSON in the private configuration.':error.message);process.exitCode=1;});
