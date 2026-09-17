import {redirect} from 'next/navigation';
import AuthShell from '@/components/premium/auth-shell';
import Submit from '@/components/premium/submit';
import {setPassword} from '@/app/premium/auth/actions';
import {createSupabaseServerClient} from '@/lib/supabase/server';
export const metadata={title:'Set password | Sacco Premium',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{error?:string}>}){
 const client=await createSupabaseServerClient();const result=client?await client.auth.getUser():null;
 if(!result?.data.user) redirect('/premium/login?error=expired');
 if(result.data.user.is_anonymous)redirect('/premium/account/setup');
 const params=await searchParams;
 return <AuthShell title="SET YOUR PASSWORD." description="Choose a password of at least 12 characters."><form action={setPassword} className="premium-auth-form">{params.error&&<p role="alert">Unable to save your password. Use at least 12 characters and make sure both fields match.</p>}<label>New password<input type="password" name="password" autoComplete="new-password" minLength={12} maxLength={256} required/></label><label>Confirm password<input type="password" name="confirmPassword" autoComplete="new-password" minLength={12} maxLength={256} required/></label><Submit>Save password</Submit></form><div className="premium-auth-links"><a className="text-link" href="/premium/dashboard">Set it later — open Dashboard</a></div></AuthShell>;
}
