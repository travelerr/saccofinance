import {NextRequest,NextResponse} from 'next/server';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {analyticsAllowed,analyticsMode,CONSENT_COOKIE} from '@/lib/analytics/policy';
import {isResearchAdmin} from '@/lib/email/policy';
import {billingServices} from '@/lib/billing/server';
export async function POST(request:NextRequest){
 const response=(status=204)=>new NextResponse(null,{status,headers:{'Cache-Control':'private, no-store'}});
 // Amplify can expose an internal origin in request.url. Only trust our configured
 // public origin, never request-supplied Host or forwarded headers.
 let expectedOrigin:string;
 try{
  const configured=process.env.AUTH_SITE_URL;
  if(!configured)throw new Error('Missing site origin');
  expectedOrigin=new URL(configured).origin;
 }catch{
  console.warn('Member engagement unavailable: origin configuration');
  return response(503);
 }
 if(request.headers.get('origin')!==expectedOrigin){
  console.warn('Member engagement rejected: origin mismatch');
  return response(403);
 }
 if(analyticsMode(process.env)==='disabled'||!analyticsAllowed(request.cookies.get(CONSENT_COOKIE)?.value,request.headers.get('sec-gpc')==='1'))return response();
 let activity:unknown;
 try{
  const raw=await request.text();if(raw.length>100)return response(400);
  activity=JSON.parse(raw)?.activity;
  if(typeof activity!=='string'||!['visit','dashboard','opportunity','sector_view','sector_use'].includes(activity))return response(400);
 }catch{return response(400);}
 try{
  const client=await createSupabaseServerClient();const result=await client?.auth.getUser();
  if(result?.error?.name==='AuthSessionMissingError')return response();
  if(!client||result?.error){
   console.warn('Member engagement unavailable: authentication lookup');
   return response(503);
  }
  const user=result?.data.user;
  if(!user||user.is_anonymous||isResearchAdmin(user,process.env.RESEARCH_ADMIN_USER_IDS||''))return response();
  const {admin,mode}=await billingServices();
  const {error}=await admin.rpc('record_member_engagement',{p_user:user.id,p_mode:mode,p_activity:activity});
  if(error){
   console.warn('Member engagement unavailable: database write');
   return response(503);
  }
 }catch{
  // Log only the failure category, never member identity, tokens or provider errors.
  console.warn('Member engagement unavailable: recording failed');
  return response(503);
 }
 return response();
}
