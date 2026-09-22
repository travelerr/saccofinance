/** Pure policy helpers; configuration is supplied only by server code. */
export function isResearchAdmin(user:{id:string;email_confirmed_at?:string|null;is_anonymous?:boolean}|null,allowlist:string){
 const ids=allowlist.split(',').map(id=>id.trim()).filter(id=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
 return Boolean(user&&!user.is_anonymous&&user.email_confirmed_at&&ids.includes(user.id));
}
export function assertLocalEmailEnvironment(env:NodeJS.ProcessEnv){
 if(env.RESEARCH_EMAIL_LOCAL_ENABLED!=='true')throw new Error('EMAIL_DISABLED');
 const url=new URL(env.NEXT_PUBLIC_SUPABASE_URL||'https://invalid');
 if(!['localhost','127.0.0.1','[::1]'].includes(url.hostname)||url.username||url.password)throw new Error('LOCAL_DATABASE_REQUIRED');
 if((env.EMAIL_SEND_MODE||'dry-run')!=='dry-run')throw new Error('LIVE_EMAIL_DISABLED');
}
export function researchEligible(user:{email?:string;email_confirmed_at?:string|null;is_anonymous?:boolean;banned_until?:string|null},enabled:boolean,access:{allowed:boolean;unavailable:boolean}){
 return enabled&&Boolean(user.email&&user.email_confirmed_at&&!user.is_anonymous)&&!(user.banned_until&&Date.parse(user.banned_until)>Date.now())&&access.allowed&&!access.unavailable;
}

/** Production infrastructure is opt-in; local simulation keeps its stricter original gate. */
export function assertResearchInfrastructure(env:NodeJS.ProcessEnv){
 if(env.RESEARCH_EMAIL_LOCAL_ENABLED==='true'||env.SACCO_LOCAL_DEVELOPMENT==='true')return assertLocalEmailEnvironment(env);
 if(env.RESEARCH_EMAIL_ENABLED!=='true')throw new Error('EMAIL_DISABLED');
 const db=new URL(env.NEXT_PUBLIC_SUPABASE_URL||'https://invalid');
 const site=new URL(env.AUTH_SITE_URL||'https://invalid');
 if(db.protocol!=='https:'||!db.hostname.endsWith('.supabase.co')||db.username||db.password||site.origin!=='https://saccofinancial.com')throw new Error('INVALID_PRODUCTION_EMAIL_CONFIG');
}
export function researchSendMode(env:NodeJS.ProcessEnv):'dry-run'|'live'{
 assertResearchInfrastructure(env);
 const mode=env.EMAIL_SEND_MODE||'dry-run';
 if(mode==='dry-run')return mode;
 if(mode!=='live'||(env.RESEARCH_BROADCAST_ENABLED!=='true'&&!researchPilotRecipient(env))||env.RESEARCH_EMAIL_LOCAL_ENABLED==='true'||env.SACCO_LOCAL_DEVELOPMENT==='true')throw new Error('LIVE_EMAIL_DISABLED');
 if(!env.RESEND_API_KEY?.startsWith('re_')||!env.RESEARCH_EMAIL_FROM||/[\r\n]/.test(env.RESEARCH_EMAIL_FROM)||!env.RESEND_WEBHOOK_SECRET?.startsWith('whsec_'))throw new Error('LIVE_EMAIL_CONFIG_REQUIRED');
 return 'live';
}

export function researchPilotRecipient(env:NodeJS.ProcessEnv){
 const email=(env.RESEARCH_TEST_RECIPIENT||'').trim().toLowerCase();
 if(email&&!/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(email))throw new Error('INVALID_TEST_RECIPIENT');
 return email;
}
