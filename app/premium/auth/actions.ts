'use server';
import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {safePremiumReturn} from '@/lib/auth-paths';
function field(form:FormData,key:string){return String(form.get(key)||'');}
export async function login(form:FormData){
 const client=await createSupabaseServerClient();
 const next=safePremiumReturn(field(form,'next'));
 if(!client) redirect('/premium/login?error=unavailable');
 const {error}=await client.auth.signInWithPassword({email:field(form,'email').trim(),password:field(form,'password')});
 if(error) redirect('/premium/login?error=invalid&next='+encodeURIComponent(next));
 redirect(next);
}
export async function logout(){
 const client=await createSupabaseServerClient();
 if(client){const {error}=await client.auth.signOut({scope:'local'});if(error) redirect('/premium/access?error=logout');}
 redirect('/premium/login');
}
export async function requestPasswordReset(form:FormData){
 const client=await createSupabaseServerClient();
 if(!client) redirect('/premium/forgot-password?error=unavailable');
 const origin=process.env.AUTH_SITE_URL;
 if(!origin) redirect('/premium/forgot-password?error=unavailable');
 const {error}=await client.auth.resetPasswordForEmail(field(form,'email').trim(),{redirectTo:new URL('/premium/auth/callback?next=/premium/set-password',origin).toString()});
 if(error) redirect('/premium/forgot-password?error=retry');
 redirect('/premium/forgot-password?sent=1');
}
export async function setPassword(form:FormData){
 const password=field(form,'password');
 if(password.length<12 || password.length>256 || password!==field(form,'confirmPassword')) redirect('/premium/set-password?error=password');
 const client=await createSupabaseServerClient();
 if(!client) redirect('/premium/login?error=unavailable');
 const {data:{user}}=await client.auth.getUser();
 if(!user) redirect('/premium/login?error=expired');
 const {error}=await client.auth.updateUser({password});
 if(error) redirect('/premium/set-password?error=retry');
 redirect('/premium/dashboard');
}
