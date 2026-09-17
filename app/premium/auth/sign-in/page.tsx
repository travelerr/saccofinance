import {redirect} from 'next/navigation';
import AuthShell from '@/components/premium/auth-shell';
import Submit from '@/components/premium/submit';
import {completeEmailSignIn} from '@/app/premium/auth/actions';
export const dynamic='force-dynamic';
export const metadata={title:'Member sign-in | Sacco Premium',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{token_hash?:string}>}){
 const {token_hash}=await searchParams;if(!token_hash||token_hash.length>512)redirect('/premium/login?error=expired');
 return <AuthShell title="MEMBER SIGN-IN." description="Continue to securely sign into your membership."><form action={completeEmailSignIn} className="premium-auth-form"><input type="hidden" name="token_hash" value={token_hash}/><Submit>Sign in</Submit></form></AuthShell>;
}
