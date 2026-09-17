import Link from 'next/link';
import AuthShell from '@/components/premium/auth-shell';
import Submit from '@/components/premium/submit';
import {login} from '@/app/premium/auth/actions';
import {safePremiumReturn} from '@/lib/auth-paths';
export const metadata={title:'Member login | Sacco Premium',robots:{index:false,follow:false}};
const errors:Record<string,string>={invalid:'Unable to sign in. Check your email and password.',unavailable:'Member login is temporarily unavailable. Please try again later.',expired:'This link has expired. Request a new password reset link.'};
export default async function Page({searchParams}:{searchParams:Promise<{error?:string;next?:string}>}){
 const params=await searchParams;
 return <AuthShell title="MEMBER LOGIN." description="Log in to access your Premium dashboard."><form action={login} className="premium-auth-form">{params.error&&<p role="alert" className="premium-auth-message">{errors[params.error]||errors.invalid}</p>}<input type="hidden" name="next" value={safePremiumReturn(params.next)}/><label>Email<input type="email" name="email" autoComplete="username" required maxLength={254}/></label><label>Password<input type="password" name="password" autoComplete="current-password" required maxLength={256}/></label><Submit>Log into the Dashboard</Submit></form><div className="premium-auth-links"><Link className="text-link" href="/premium/forgot-password">Forgot password?</Link></div><p>Premium access is currently by invitation.</p></AuthShell>;
}
