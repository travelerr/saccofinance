import {createServerClient} from '@supabase/ssr';
import {NextResponse,type NextRequest} from 'next/server';
import {sessionPremiumAccess} from '@/lib/premium-session-access';
import {authConfig} from '@/lib/supabase/config';
const publicPaths=new Set(['/premium','/premium/login','/premium/forgot-password','/premium/set-password','/premium/access','/premium/auth/callback','/premium/auth/confirm','/premium/auth/sign-in','/premium/account','/premium/signup','/premium/join','/premium/welcome','/premium/account/setup']);
export async function middleware(request:NextRequest){
 let response=NextResponse.next({request});
 const config=authConfig();
 const pathname=request.nextUrl.pathname.replace(/\/$/,'');
 const protectedPath=!publicPaths.has(pathname)&&!/^\/premium\/auth\/claim\/[0-9a-f-]{36}$/i.test(pathname);
 if((pathname.startsWith('/premium/auth/claim/')||pathname==='/premium/auth/sign-in'))response.headers.set('Referrer-Policy','no-referrer');
 const origin=process.env.AUTH_SITE_URL||request.url;
 const api=pathname.startsWith('/api/') || pathname.startsWith('/images/opportunities/');
 function deny(status:number){
  const denied=api?NextResponse.json({error:status===401?'Authentication required':'Premium access required'},{status}):NextResponse.redirect(new URL(status===401?'/premium/login':'/premium/access',origin));
  if(!api&&status===401) denied.headers.set('Location',new URL('/premium/login?next='+encodeURIComponent(request.nextUrl.pathname+request.nextUrl.search),origin).toString());
  response.cookies.getAll().forEach(cookie=>denied.cookies.set(cookie));
  denied.headers.set('Cache-Control','private, no-store');return denied;
 }
 if(!config) return protectedPath?deny(401):response;
 const client=createServerClient(config.url,config.key,{cookies:{getAll:()=>request.cookies.getAll(),setAll(values){values.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});values.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
 const {data:{user}}=await client.auth.getUser();
 if(protectedPath){
  if(!user) return deny(401);
  const access=await sessionPremiumAccess(client,user.id);
  if(!access.allowed) return deny(403);
 }
 response.headers.set('Cache-Control','private, no-store');
 if((pathname.startsWith('/premium/auth/claim/')||pathname==='/premium/auth/sign-in'))response.headers.set('Referrer-Policy','no-referrer');
 return response;
}
export const config={matcher:['/premium/:path*','/api/market-strength','/api/premium/:path*','/images/opportunities/:path*']};
