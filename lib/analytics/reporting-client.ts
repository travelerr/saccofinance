import {createHash,createPrivateKey,sign} from 'node:crypto';
import {parseReport,reportDefinitions,type ReportingDays,type Report,type ReportName} from './reporting-model';
const TOKEN_URL='https://oauth2.googleapis.com/token';
const SCOPE='https://www.googleapis.com/auth/analytics.readonly';
export type Reports=Record<ReportName,Report|null>;
export type GoogleResult={status:'ready'|'unavailable';reports:Reports;checkedAt:string};
export function credentialsFromJson(raw:string){
 const value=JSON.parse(raw);
 if(value?.type!=='service_account'||typeof value.client_email!=='string'||!/^[-a-z0-9]+@[-a-z0-9]+\.iam\.gserviceaccount\.com$/.test(value.client_email)||typeof value.private_key!=='string')throw Error('INVALID_CREDENTIALS');
 const key=createPrivateKey(value.private_key);if(key.asymmetricKeyType!=='rsa')throw Error('INVALID_CREDENTIALS');
 return {email:value.client_email,key};
}
export function tokenAssertion(raw:string,now=Date.now()){
 const {email,key}=credentialsFromJson(raw);const iat=Math.floor(now/1000);
 const encode=(value:unknown)=>Buffer.from(JSON.stringify(value)).toString('base64url');
 const message=encode({alg:'RS256',typ:'JWT'})+'.'+encode({iss:email,scope:SCOPE,aud:TOKEN_URL,iat,exp:iat+3600});
 return message+'.'+sign('RSA-SHA256',Buffer.from(message),key).toString('base64url');
}
/** Injectable transport for offline tests. Never passes provider error bodies to the UI. */
export function createReportingClient(transport:typeof fetch=fetch){
 let token:{key:string;value:string;until:number}|undefined;
 const cache=new Map<string,{until:number;promise:Promise<GoogleResult>}>();
 async function accessToken(raw:string,key:string){
  if(token?.key===key&&token.until>Date.now())return token.value;
  const response=await transport(TOKEN_URL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:tokenAssertion(raw)}),cache:'no-store',signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw Error('REPORT_AUTH_UNAVAILABLE');
  const data=await response.json();if(typeof data.access_token!=='string'||!Number.isFinite(data.expires_in)||data.expires_in<60)throw Error('REPORT_AUTH_UNAVAILABLE');
  token={key,value:data.access_token,until:Date.now()+Math.min(data.expires_in-60,3300)*1000};return token.value;
 }
 return async function load(property:string,raw:string,days:ReportingDays):Promise<GoogleResult>{
  if(!/^\d{1,20}$/.test(property))throw Error('INVALID_PROPERTY');
  const credentialKey=createHash('sha256').update(raw).digest('hex');const key=property+':'+days+':'+credentialKey;
  const previous=cache.get(key);if(previous&&previous.until>Date.now())return previous.promise;
  for(const [id,entry] of cache)if(entry.until<=Date.now())cache.delete(id);
  if(cache.size>=6)cache.delete(cache.keys().next().value!);
  const promise=(async()=>{
   const definitions=reportDefinitions(days);const names=Object.keys(definitions) as ReportName[];
   const results=await (async()=>{try{
    const bearer=await accessToken(raw,credentialKey);
    return await Promise.allSettled(names.map(async name=>{
     const definition=definitions[name];
     const response=await transport(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`,{method:'POST',headers:{Authorization:`Bearer ${bearer}`,'Content-Type':'application/json'},body:JSON.stringify(definition),cache:'no-store',signal:AbortSignal.timeout(8000)});
     if(!response.ok)throw Error('REPORT_UNAVAILABLE');return parseReport(await response.json(),definition.dimensions.length,definition.metrics.length);
    }));
   }catch{return names.map(()=>({status:'rejected' as const,reason:'REPORT_UNAVAILABLE'}));}})();
   const reports=Object.fromEntries(names.map((name,i)=>[name,results[i].status==='fulfilled'?results[i].value:null])) as Reports;
   return {status:results.some(result=>result.status==='fulfilled')?'ready' as const:'unavailable' as const,reports,checkedAt:new Date().toISOString()};
  })();
  cache.set(key,{until:Date.now()+300000,promise});return promise;
 };
}
