import Link from 'next/link';
import {redirect} from 'next/navigation';
import AuthShell from '@/components/premium/auth-shell';
import Submit from '@/components/premium/submit';
import {billingEnabled,billingMode} from '@/lib/billing/model';
import {beginCheckout} from './actions';
export const dynamic='force-dynamic';
export const metadata={title:'Join Premium | Sacco Financial',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{error?:string;checkout?:string}>}){
 if(!billingEnabled())redirect('/premium/login');const params=await searchParams;
 const errors:Record<string,string>={details:'Choose a plan and accept the Terms to continue.',guest:'Checkout is temporarily unavailable. Please try again shortly.',pending:'Your previous checkout is pending. Retry the original plan or wait 31 minutes before choosing another.',billing:'Checkout is temporarily unavailable. Please try again.'};
 return <AuthShell title="JOIN PREMIUM." description="Choose your plan, pay securely, and start exploring Premium. Save your login afterward.">
 {billingMode()==='test'&&<p className="premium-auth-message">Sandbox checkout. Test payments only; no real charges.</p>}
 {params.error&&<p role="alert" className="premium-auth-message">{errors[params.error]||errors.billing}</p>}
 {params.checkout==='canceled'&&<p>Payment wasn’t completed. You can return to checkout below.</p>}
 <form action={beginCheckout} className="premium-auth-form">
 <label>Membership<select name="plan" defaultValue="monthly"><option value="monthly">Monthly — $10 / month</option><option value="annual">Annual — $100 / year (save $20)</option></select></label>
 <label><span><input type="checkbox" name="terms" required style={{width:'auto'}}/> I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</span></label>
 <Submit>Continue to secure checkout</Submit>
 </form>
 <p>Renews automatically. Cancel through Account & Billing; access continues through your paid period.</p>
 <div className="premium-auth-links"><Link className="text-link" href="/premium/login?next=/premium/account">Already a member? Log in</Link></div>
 </AuthShell>;
}
