import 'server-only';
import {Webhook} from 'svix';
import {researchAddressHash} from './suppression';
export function verifyResearchWebhook(body:string,headers:Headers,secret:string){
 const id=headers.get('svix-id')||'';
 new Webhook(secret).verify(body,{'svix-id':id,'svix-timestamp':headers.get('svix-timestamp')||'','svix-signature':headers.get('svix-signature')||''});
 const event=JSON.parse(body) as {type?:string;data?:{to?:unknown}};
 if(!['email.bounced','email.complained','email.suppressed'].includes(event.type||''))return null;
 const addresses=event.data?.to;
 if(!Array.isArray(addresses)||addresses.length===0||addresses.length>100||addresses.some(x=>typeof x!=='string'))throw new Error('INVALID_EVENT');
 return {id,type:event.type!,hashes:[...new Set(addresses.map(researchAddressHash))]};
}
