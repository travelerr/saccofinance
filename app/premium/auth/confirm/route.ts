import {NextResponse,type NextRequest} from 'next/server';
import {createSupabaseServerClient} from '@/lib/supabase/server';
export async function GET(request:NextRequest){
 const token_hash=request.nextUrl.searchParams.get('token_hash');const type=request.nextUrl.searchParams.get('type');
 const client=await createSupabaseServerClient();
 if(token_hash&&client&&(type==='invite'||type==='recovery'||type==='signup')){const{error}=await client.auth.verifyOtp({token_hash,type});if(!error)return NextResponse.redirect(new URL(type==='signup'?'/premium/account':'/premium/set-password',process.env.AUTH_SITE_URL||request.url),{headers:{'Cache-Control':'private, no-store'}});}
 return NextResponse.redirect(new URL('/premium/login?error=expired',process.env.AUTH_SITE_URL||request.url),{headers:{'Cache-Control':'private, no-store'}});
}
