import {NextResponse,type NextRequest} from 'next/server';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {safePremiumReturn} from '@/lib/auth-paths';
export async function GET(request:NextRequest){
 const code=request.nextUrl.searchParams.get('code');const client=await createSupabaseServerClient();
 const raw=request.nextUrl.searchParams.get('next');const next=raw==='/premium/set-password'?raw:safePremiumReturn(raw);
 if(code&&client){const{error}=await client.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL(next,process.env.AUTH_SITE_URL||request.url),{headers:{'Cache-Control':'private, no-store'}});}
 return NextResponse.redirect(new URL('/premium/login?error=expired',process.env.AUTH_SITE_URL||request.url),{headers:{'Cache-Control':'private, no-store'}});
}
