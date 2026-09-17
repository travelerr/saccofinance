import {redirect} from 'next/navigation';
import AuthShell from '@/components/premium/auth-shell';
import {premiumAccess} from '@/lib/premium-access';
import {logout} from '@/app/premium/auth/actions';
export const metadata={title:'Member access | Sacco Premium',robots:{index:false,follow:false}};
export default async function Page(){const access=await premiumAccess();if(!access.user)redirect('/premium/login');if(access.allowed)redirect('/premium/dashboard');return <AuthShell title="MEMBER ACCESS." description={access.unavailable?'We couldn’t verify your Premium access. Please try again later.':'Your account is signed in, but Premium access has not been enabled. Access is currently by invitation.'}><form action={logout}><button className="button" type="submit">Log out</button></form></AuthShell>;}
