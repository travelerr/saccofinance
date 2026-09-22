const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const localDir=path.join(root,'.local-development');
function safeBaseEnv(){
 const env={};for(const key of ['PATH','HOME','USER','TMPDIR','LANG','TERM','SHELL','DOCKER_HOST','DOCKER_CONTEXT'])if(process.env[key])env[key]=process.env[key];
 // Next loads dotenv files by default: explicitly shadow every key without copying its value.
 for(const name of ['.env','.env.local','.env.development','.env.development.local','.env.production','.env.production.local','.env.test','.env.test.local']){
  const file=path.join(root,name);if(fs.existsSync(file))for(const match of fs.readFileSync(file,'utf8').matchAll(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/gm))env[match[1]]='';
 }
 for(const key of ['STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','STRIPE_MONTHLY_PRICE_ID','STRIPE_ANNUAL_PRICE_ID','STRIPE_PORTAL_CONFIGURATION_ID','BILLING_SECRETS_ARN','BILLING_AWS_REGION','AWS_ACCESS_KEY_ID','AWS_SECRET_ACCESS_KEY','AWS_SESSION_TOKEN','AWS_PROFILE','RESEND_API_KEY','RESEND_WEBHOOK_SECRET','RESEARCH_EMAIL_ENABLED','RESEARCH_BROADCAST_ENABLED','RESEARCH_TEST_RECIPIENT','RESEARCH_EMAIL_FROM','SUPABASE_ACCESS_TOKEN','SUPABASE_DB_PASSWORD','OPENAI_API_KEY'])env[key]='';
 return {...env,SUPABASE_TELEMETRY_DISABLED:'1',DO_NOT_TRACK:'1',NEXT_TELEMETRY_DISABLED:'1'};
}
function assertRuntime(config){
 if(config.apiUrl!=='http://127.0.0.1:54321'||!config.publishableKey||!config.secretKey||!config.adminId)throw Error('Invalid local runtime. Run npm run local:setup.');
}
function appEnv(config){assertRuntime(config);return {...safeBaseEnv(),SACCO_LOCAL_DEVELOPMENT:'true',NEXT_PUBLIC_SUPABASE_URL:config.apiUrl,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:config.publishableKey,SUPABASE_SECRET_KEY:config.secretKey,AUTH_SITE_URL:'http://localhost:3082',NEXT_PUBLIC_SITE_URL:'http://localhost:3082',STRIPE_MODE:'test',STRIPE_BILLING_ENABLED:'true',RESEARCH_EMAIL_LOCAL_ENABLED:'true',EMAIL_SEND_MODE:'dry-run',RESEARCH_ADMIN_USER_IDS:config.adminId};}
function runtime(){const config=JSON.parse(fs.readFileSync(path.join(localDir,'runtime.json'),'utf8'));assertRuntime(config);return config;}
module.exports={root,localDir,safeBaseEnv,appEnv,runtime};
