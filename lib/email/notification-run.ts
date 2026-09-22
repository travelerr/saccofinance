import type {ResearchEvent} from './events';
export type RunStore={reserve:(event:ResearchEvent,count:number)=>Promise<boolean>;finish:(key:string,status:string,ids:string[],error:string|null)=>Promise<void>};
export async function executeNotification(event:ResearchEvent,recipients:string[],store:RunStore,deliver:()=>Promise<{status:string;providerIds:string[]}>){
 if(recipients.length===0)throw new Error('NO_RECIPIENTS');
 if(recipients.length>100)throw new Error('RECIPIENT_LIMIT');
 if(!await store.reserve(event,recipients.length))throw new Error('ALREADY_RECORDED');
 let result:{status:string;providerIds:string[]};
 try{result=await deliver();}catch{
  // Retain the reservation and budget even when provider acceptance is unknown.
  try{await store.finish(event.key,'failed',[],'SEND_FAILED_OR_UNCERTAIN');}catch{/* The durable reservation still blocks repeats. */}
  throw new Error('SEND_FAILED_OR_UNCERTAIN');
 }
 // Never overwrite accepted provider IDs with an empty failure record if logging fails.
 try{await store.finish(event.key,result.status,result.providerIds,null);}catch{throw new Error('ACCEPTED_LOG_UNCERTAIN');}
 return result.status;
}
