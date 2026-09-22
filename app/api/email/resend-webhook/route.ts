import {emailDatabase} from '@/lib/email/database';
import {verifyResearchWebhook} from '@/lib/email/resend-webhook';
export const runtime='nodejs';
export async function POST(request:Request){
 const secret=process.env.RESEND_WEBHOOK_SECRET;
 if(!secret)return new Response('Webhook unavailable',{status:503});
 // Bound the raw payload before signature verification; never log payloads or addresses.
 const reader=request.body?.getReader();if(!reader)return new Response('Invalid webhook',{status:400});
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>65536){await reader.cancel();return new Response('Payload too large',{status:413});}chunks.push(value);}
 let event;
 try{event=verifyResearchWebhook(Buffer.concat(chunks).toString('utf8'),request.headers,secret);}catch{return new Response('Invalid webhook',{status:400});}
 if(!event)return new Response('OK');
 try{
  const {error}=await emailDatabase().rpc('record_research_suppression',{p_event:event.id,p_type:event.type,p_hashes:event.hashes});
  if(error)throw error;
  return new Response('OK');
 }catch{return new Response('Please retry',{status:503});}
}
