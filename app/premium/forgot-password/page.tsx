import Link from 'next/link';
import AuthShell from '@/components/premium/auth-shell';
import Submit from '@/components/premium/submit';
import {requestPasswordReset} from '@/app/premium/auth/actions';
export const metadata={title:'Reset password | Sacco Premium',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{sent?:string;error?:string}>}){const params=await searchParams;return <AuthShell title="RESET PASSWORD." description="Request a link to reset your member password.">{params.sent?<p role="status" className="premium-auth-message">If an account exists for that email, a reset link will be sent. Check your inbox.</p>:<form action={requestPasswordReset} className="premium-auth-form">{params.error&&<p role="alert">Unable to send a reset request right now. Please try again later.</p>}<label>Email<input type="email" name="email" autoComplete="email" required maxLength={254}/></label><Submit>Send reset link</Submit></form>}<div className="premium-auth-links"><Link className="text-link" href="/premium/login">Return to login</Link></div></AuthShell>;}
