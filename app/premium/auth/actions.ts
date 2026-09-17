'use server';
import {billingEnabled} from '@/lib/billing/model';
import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {claimVerifiedPurchases} from '@/lib/billing/purchases';
import {safePremiumReturn} from '@/lib/auth-paths';
function field(form:FormData,key:string){return String(form.get(key)||'');}
export async function login(form:FormData){
 const client=await createSupabaseServerClient();
 const next=safePremiumReturn(field(form,'next'));
 if(!client) redirect('/premium/login?error=unavailable');
 const {error}=await client.auth.signInWithPassword({email:field(form,'email').trim(),password:field(form,'password')});
 if(error) redirect('/premium/login?error=invalid&next='+encodeURIComponent(next));
 if(billingEnabled()){const {data:{user}}=await client.auth.getUser();if(user){try{await claimVerifiedPurchases(user.id);}catch{redirect('/premium/account/setup?error=claim');}}}
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
 if(user.is_anonymous)redirect('/premium/account/setup');
 const {error}=await client.auth.updateUser({password});
 if(error) redirect('/premium/set-password?error=retry');
 redirect('/premium/dashboard');
}

export async function signup(form:FormData){
 if(!billingEnabled())redirect('/premium/login');
 const password=field(form,'password');const email=field(form,'email').trim();
 if(password.length<12||password.length>256||!form.get('terms')||email.length>254||!email.includes('@'))redirect('/premium/signup?error=details');
 const client=await createSupabaseServerClient();const origin=process.env.AUTH_SITE_URL;
 if(!client||!origin)redirect('/premium/signup?error=unavailable');
 const{data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:new URL('/premium/auth/confirm',origin).toString()}});
 if(error)redirect('/premium/signup?error=details');
 if(data.session)redirect('/premium/account');
 redirect('/premium/signup?sent=1');
}

export async function requestSignInLink(form:FormData){
 const email=field(form,'email').trim();const client=await createSupabaseServerClient();const origin=process.env.AUTH_SITE_URL;
 if(!client||!origin)redirect('/premium/login?error=unavailable');
 const {error}=await client.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:new URL('/premium/auth/sign-in',origin).toString()}});
 // Never reveal whether an email belongs to a member.
 if(error&&![400,422].includes(error.status||0))redirect('/premium/login?error=unavailable');
 redirect('/premium/login?sent=1');
}
export async function completeEmailSignIn(form:FormData){
 const token=field(form,'token_hash');if(!token||token.length>512)redirect('/premium/login?error=expired');
 const client=await createSupabaseServerClient();if(!client)redirect('/premium/login?error=unavailable');
 const {data,error}=await client.auth.verifyOtp({token_hash:token,type:'email'});
 if(error||!data.user)redirect('/premium/login?error=expired');
 if(billingEnabled()){try{await claimVerifiedPurchases(data.user.id);}catch{redirect('/premium/account/setup?error=claim');}}
 redirect('/premium/dashboard');
}
