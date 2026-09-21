import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {billingEnabled} from '@/lib/billing/model';
import Link from 'next/link';
import AuthShell from '@/components/premium/auth-shell';
import Submit from '@/components/premium/submit';
import {login,requestSignInLink} from '@/app/premium/auth/actions';
import {safePremiumReturn} from '@/lib/auth-paths';
export const metadata={title:'Member login | Sacco Premium',robots:{index:false,follow:false}};
const errors:Record<string,string>={invalid:'Unable to sign in. Check your email and password.',unavailable:'Member login is temporarily unavailable. Please try again later.',expired:'This link has expired. Request a new password reset link.'};
export default async function Page({searchParams}:{searchParams:Promise<{error?:string;next?:string;sent?:string}>}){
 const params=await searchParams;
 const client=await createSupabaseServerClient();
 if(client){
  const {data:{user},error}=await client.auth.getUser();
  if(user&&!error)redirect(safePremiumReturn(params.next));
 }
 return <AuthShell title="MEMBER LOGIN." description="Log in to access your Premium dashboard.">{params.sent&&<p role="status" className="premium-auth-message">If an account exists for that email, a sign-in link is on its way. Check your inbox and spam folder.</p>}<form action={login} className="premium-auth-form">{params.error&&<p role="alert" className="premium-auth-message">{errors[params.error]||errors.invalid}</p>}<input type="hidden" name="next" value={safePremiumReturn(params.next)}/><label>Email<input type="email" name="email" autoComplete="username" required maxLength={254}/></label><label>Password<input type="password" name="password" autoComplete="current-password" required maxLength={256}/></label><Submit>Log into the Dashboard</Submit></form><form action={requestSignInLink} className="premium-auth-form"><label>No password yet? Enter your email<input type="email" name="email" autoComplete="email" required maxLength={254}/></label><Submit>Email me a sign-in link</Submit></form><div className="premium-auth-links"><Link className="text-link" href="/premium/forgot-password">Forgot password?</Link></div>{billingEnabled()?<p>New to Premium? <Link href="/premium/join" className="text-link">Join Premium</Link></p>:<p>Premium access is currently by invitation.</p>}</AuthShell>;
}
