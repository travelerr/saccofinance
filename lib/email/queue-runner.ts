export type EmailJob={id:string;event_key:string;mode:'live'|'dry-run';lease_token:string;attempts:number};
export type JobTransition=(action:'dispatch'|'sent'|'dry_run'|'retry'|'cancelled'|'uncertain',ids?:string[],error?:string)=>Promise<boolean>;
/** The dispatch marker is durable BEFORE the provider call; uncertain work is never retried. */
export async function executeEmailJob<T>(job:EmailJob,deps:{prepare:()=>Promise<T>;deliver:(prepared:T)=>Promise<string[]>;transition:JobTransition}){
 let dispatched=false;
 try{
  const prepared=await deps.prepare();
  if(job.mode==='dry-run'){if(!await deps.transition('dry_run'))throw Error('LEASE_LOST');return 'dry_run';}
  if(!await deps.transition('dispatch'))return 'lease_lost';
  dispatched=true;
  const ids=await deps.deliver(prepared);
  // If final persistence fails, the durable sending marker blocks another dispatch.
  if(!await deps.transition('sent',ids))return 'uncertain';
  return 'sent';
 }catch(error){
  const code=error instanceof Error?error.message:'';
  if(dispatched){try{await deps.transition('uncertain',[],'PROVIDER_OR_LOG_UNCERTAIN');}catch{}return 'uncertain';}
  const cancel=['INVALID_EMAIL_SNAPSHOT','PREVIEW_CHANGED','EMAIL_PAUSED','LIVE_EMAIL_DISABLED','LIVE_EMAIL_CONFIG_REQUIRED'].includes(code);
  try{await deps.transition(cancel?'cancelled':'retry',[],cancel?code:'PREPARATION_FAILED');}catch{/* Lease expiry enables safe preparation recovery. */}
  return cancel?'cancelled':'preparation_failed';
 }
}
