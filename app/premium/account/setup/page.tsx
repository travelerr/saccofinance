import Link from 'next/link';
import {redirect} from 'next/navigation';
import AuthShell from '@/components/premium/auth-shell';
import Submit from '@/components/premium/submit';
import {premiumAccess} from '@/lib/premium-access';
import {purchaseForBrowser} from '@/lib/billing/purchases';
import {resendWelcome,changeWelcomeEmail} from './actions';
export const dynamic='force-dynamic';
export const metadata={title:'Save your Premium login | Sacco Financial',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{sent?:string;error?:string}>}){
 const access=await premiumAccess();if(!access.user)redirect('/premium/login');const params=await searchParams;
 if(!access.user.is_anonymous&&!params.error)redirect('/premium/set-password');
 let email:string|null=null;try{email=(await purchaseForBrowser(access.user.id))?.email||null;}catch{}
 return <AuthShell title="SAVE YOUR LOGIN." description="Your paid access is already available in this browser. Save your login so you can return from any device.">
 {params.error==='claim'?<p role="alert">We couldn’t attach this purchase to your verified login. Contact Sacco Financial with your Stripe receipt so we can help; do not purchase again.</p>:params.error&&<p role="alert">We couldn’t send your welcome link. Please try again shortly.</p>}
 <p>{email?`Use the welcome link sent to ${email} to confirm your email and choose a password.`:'Your welcome link will arrive at the email address entered in Checkout.'}</p>
 <p>You can keep exploring Premium while the email arrives. Until you save your login, avoid logging out or clearing your browser data.</p>
 {access.user.is_anonymous&&<form action={resendWelcome} className="premium-auth-form"><Submit>Resend welcome link</Submit></form>}
 {access.user.is_anonymous&&<details><summary>Entered the wrong email in Checkout?</summary><p>You can correct the welcome address while you still have your paid browser session. The new address must be verified before it can own this membership.</p><form action={changeWelcomeEmail} className="premium-auth-form"><label>Welcome email<input type="email" name="email" defaultValue={email||''} required maxLength={254}/></label><Submit>Send to this email</Submit></form></details>}
 {params.sent&&<p role="status">Check your inbox and spam folder. Use the newest welcome link.</p>}
 <div className="premium-auth-links"><Link className="text-link" href="/premium/dashboard">Continue to the Dashboard</Link></div>
 </AuthShell>;
}
