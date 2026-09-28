// Read ONLY validated loopback runtime credentials; never copy .env.local or live keys.
const fs=require('node:fs');const path=require('node:path');const {spawn}=require('node:child_process');
const {appEnv}=require('./local-environment.cjs');
const directory=process.argv[2]||path.join(__dirname,'..','.local-development');
const runtime=JSON.parse(fs.readFileSync(path.join(directory,'runtime.json'),'utf8'));
const env={...appEnv(runtime),ANALYTICS_PREVIEW:'true',AUTH_SITE_URL:'http://localhost:3083',NEXT_PUBLIC_SITE_URL:'http://localhost:3083',SACCO_LOCAL_STRIPE:'false',STRIPE_SECRET_KEY:'',STRIPE_WEBHOOK_SECRET:'',STRIPE_BILLING_ENABLED:'true'};
console.log('Analytics preview: http://localhost:3083 — no Google requests, payments or real emails.');
const child=spawn(process.execPath,[path.join(__dirname,'../node_modules/next/dist/bin/next'),'dev','--hostname','127.0.0.1','--port','3083'],{cwd:path.join(__dirname,'..'),env,stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));child.on('exit',code=>process.exit(code||0));
