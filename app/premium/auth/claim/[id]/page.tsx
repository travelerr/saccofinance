import {redirect} from 'next/navigation';
import AuthShell from '@/components/premium/auth-shell';
import Submit from '@/components/premium/submit';
import {billingServices} from '@/lib/billing/server';
import {savePurchaseLogin} from '@/app/premium/account/setup/actions';
export const dynamic='force-dynamic';
export const metadata={title:'Save your Premium login | Sacco Financial',robots:{index:false,follow:false}};
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{token_hash?:string}>}){
 const {id}=await params;const {token_hash}=await searchParams;
 if(!/^[0-9a-f-]{36}$/i.test(id)||!token_hash||token_hash.length>512)redirect('/premium/login?error=expired');
 let available=false;try{const {admin,mode}=await billingServices();const {data,error}=await admin.from('billing_purchase_claims').select('id').eq('id',id).eq('mode',mode).maybeSingle();available=!error&&Boolean(data);}catch{}
 if(!available)return <AuthShell title="LOGIN LINK UNAVAILABLE." description="We couldn’t open this welcome link. Request a fresh link from Account & Billing or contact Sacco Financial with your receipt.">{null}</AuthShell>;
 // Viewing or prefetching the email link never consumes its token. A POST is required.
 return <AuthShell title="WELCOME TO PREMIUM." description="Save your login, then choose a password for future visits."><form action={savePurchaseLogin} className="premium-auth-form"><input type="hidden" name="purchase" value={id}/><input type="hidden" name="token_hash" value={token_hash}/><Submit>Save my login</Submit></form></AuthShell>;
}
