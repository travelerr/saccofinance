import {emailDatabase} from '@/lib/email/database';
import {unsubscribeTokenHash} from '@/lib/email/unsubscribe';
export const dynamic='force-dynamic';
const headers={'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'none'; form-action 'self'; frame-ancestors 'none'"};
const page=(text:string,status=200)=>new Response('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sacco research emails</title><body><h1>Sacco research emails</h1>'+text+'</body></html>',{status,headers});
export async function GET(request:Request){
 const token=new URL(request.url).searchParams.get('token')||'';
 try{unsubscribeTokenHash(token);}catch{return page('<p>This unsubscribe link is invalid.</p>',400);}
 // Link scanners may GET this URL. Only an explicit POST changes preferences.
 return page('<p>Turn off Premium research notifications? Account and billing emails are unaffected.</p><form method="post" action="/email/unsubscribe?token='+token+'"><button name="List-Unsubscribe" value="One-Click">Unsubscribe</button></form>');
}
export async function POST(request:Request){
 let hash:string;
 try{hash=unsubscribeTokenHash(new URL(request.url).searchParams.get('token')||'');}catch{return page('<p>This unsubscribe link is invalid.</p>',400);}
 try{
  const form=await request.formData();
  if(form.get('List-Unsubscribe')!=='One-Click')return page('<p>Please confirm using the unsubscribe button.</p>',400);
  const {data,error}=await emailDatabase().rpc('unsubscribe_research',{p_hash:hash});
  if(error)throw error;
  if(!data)return page('<p>This unsubscribe link is invalid.</p>',400);
  return page('<p>Research notifications are now off. Account and billing emails are unaffected. You can opt back in from your account.</p>');
 }catch{return page('<p>We could not save your preference. Please try again later or use your Account email preferences.</p>',503);}
}
