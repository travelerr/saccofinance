import {NextRequest,NextResponse} from 'next/server';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {analyticsAllowed,analyticsMode,CONSENT_COOKIE} from '@/lib/analytics/policy';
import {isResearchAdmin} from '@/lib/email/policy';
import {billingServices} from '@/lib/billing/server';
export async function POST(request:NextRequest){
 const done=()=>new NextResponse(null,{status:204,headers:{'Cache-Control':'private, no-store'}});
 if(request.headers.get('origin')!==new URL(request.url).origin)return new NextResponse(null,{status:403});
 if(analyticsMode(process.env)==='disabled'||!analyticsAllowed(request.cookies.get(CONSENT_COOKIE)?.value,request.headers.get('sec-gpc')==='1'))return done();
 try{
  const raw=await request.text();if(raw.length>100)return new NextResponse(null,{status:400});
  const {activity}=JSON.parse(raw);if(!['visit','dashboard','opportunity','sector_view','sector_use'].includes(activity))return new NextResponse(null,{status:400});
  const client=await createSupabaseServerClient();const result=await client?.auth.getUser();const user=result?.data.user;
  if(!user||user.is_anonymous||isResearchAdmin(user,process.env.RESEARCH_ADMIN_USER_IDS||''))return done();
  const {admin,mode}=await billingServices();
  const {error}=await admin.rpc('record_member_engagement',{p_user:user.id,p_mode:mode,p_activity:activity});
  if(error)console.warn('Member engagement unavailable');
 }catch{/* Optional analytics never blocks member access. */}
 return done();
}
