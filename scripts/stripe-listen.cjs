// Loads secrets privately from .env.local (via node --env-file). Never prints keys.
const fs=require('node:fs');const path=require('node:path');const{spawn}=require('node:child_process');
if(!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))throw new Error('A sandbox secret key is required.');
const script=require.resolve('@stripe/cli/bin/shim.js');
const events='checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,customer.subscription.paused,customer.subscription.resumed,invoice.paid,invoice.payment_failed,invoice.payment_action_required';
const child=spawn(process.execPath,[script,'listen','--events',events,'--forward-to','http://127.0.0.1:3082/api/stripe/webhook'],{env:{...process.env,STRIPE_API_KEY:process.env.STRIPE_SECRET_KEY},stdio:['ignore','pipe','pipe'],detached:true});
let ready=false,buffer='';
function output(chunk){
 buffer+=chunk.toString();
 const match=buffer.match(/whsec_[A-Za-z0-9]+/);
 if(match&&!ready){
  const file=path.join(process.cwd(),'.env.local');let text=fs.readFileSync(file,'utf8');
  text=/^STRIPE_WEBHOOK_SECRET=.*$/m.test(text)?text.replace(/^STRIPE_WEBHOOK_SECRET=.*$/m,'STRIPE_WEBHOOK_SECRET='+match[0]):text+'\nSTRIPE_WEBHOOK_SECRET='+match[0]+'\n';
  text=text.replace(/^STRIPE_BILLING_ENABLED=.*$/m,'STRIPE_BILLING_ENABLED=true');
  fs.writeFileSync(file,text,{mode:0o600});ready=true;console.log('Sandbox webhook listener ready. Signing secret saved privately; local test billing enabled. Restart the local app to load it.');
 }
 for(const line of buffer.split(/\r?\n/).slice(0,-1)){if(/\[\d{3}\]/.test(line))console.log('Sandbox webhook delivery: '+(line.match(/\[\d{3}\]/)||[''])[0]);}
 buffer=buffer.split(/\r?\n/).pop()||'';
 if(buffer.length>8192)buffer=buffer.slice(-4096);
}
child.stdout.on('data',output);child.stderr.on('data',output);
child.on('error',()=>{console.error('Unable to start the Stripe CLI.');process.exitCode=1;});
child.on('exit',code=>{if(!ready)console.error('Webhook listener failed to start. Check sandbox credentials and network access.');process.exitCode=code||0;});
function stop(){try{process.kill(-child.pid,'SIGTERM');}catch{}process.exit(0);}
process.on('SIGINT',stop);process.on('SIGTERM',stop);process.on('exit',()=>{try{process.kill(-child.pid,'SIGTERM');}catch{}});
