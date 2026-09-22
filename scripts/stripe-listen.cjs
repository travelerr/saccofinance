// Uses only the isolated sandbox configuration. Never loads or edits .env.local.
const fs=require('node:fs');const path=require('node:path');const{spawn}=require('node:child_process');
const {appEnv,runtime,localDir}=require('./local-environment.cjs');
const env=appEnv(runtime());
if(!env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))throw new Error('A sandbox secret key is required.');
const script=require.resolve('@stripe/cli/bin/shim.js');
const events='checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,customer.subscription.paused,customer.subscription.resumed,invoice.paid,invoice.payment_failed,invoice.payment_action_required';
const child=spawn(process.execPath,[script,'listen','--events',events,'--forward-to','http://127.0.0.1:3082/api/stripe/webhook'],{env:{...env,STRIPE_API_KEY:env.STRIPE_SECRET_KEY},stdio:['ignore','pipe','pipe'],detached:true});
let ready=false,buffer='';
function output(chunk){
 buffer+=chunk.toString();
 const match=buffer.match(/whsec_[A-Za-z0-9]+/);
 if(match&&!ready){
  const file=path.join(localDir,'stripe-sandbox.json');const config=JSON.parse(fs.readFileSync(file,'utf8'));config.STRIPE_WEBHOOK_SECRET=match[0];
  fs.writeFileSync(file,JSON.stringify(config,null,2)+'\n',{mode:0o600});fs.chmodSync(file,0o600);ready=true;console.log('Stripe sandbox listener ready; forwarding only to localhost.');if(process.send)process.send({ready:true});
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
