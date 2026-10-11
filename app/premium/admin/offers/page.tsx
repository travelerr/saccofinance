import Link from 'next/link';
import {notFound} from 'next/navigation';
import {billingServices} from '@/lib/billing/server';
import {requireOffersAdmin} from './access';
import {saveTrialOffer} from './actions';
import Submit from '@/components/premium/submit';
import '@/components/premium/auth.css';
export const dynamic='force-dynamic';
export const metadata={title:'Membership offers | Sacco Premium',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{saved?:string}>}){
 try{await requireOffersAdmin();}catch{notFound();}
 const {admin,mode}=await billingServices();const {data,error}=await admin.from('premium_trial_settings').select('enabled,updated_at').eq('mode',mode).single();
 if(error||!data)return <main className="container section"><h1>Membership offers</h1><p>Offer settings are unavailable. Apply the trial migration before using this page.</p></main>;
 const params=await searchParams;
 return <main className="container section" style={{maxWidth:760,paddingTop:48,paddingBottom:64}}><Link href="/premium/account">← Account</Link><h1 style={{marginTop:24}}>Membership offers</h1><p>{mode==='test'?'Stripe sandbox — production offers are unaffected.':'Production — changes affect new website checkouts.'}</p>{params.saved&&<p role="status">Offer settings saved.</p>}<section className="section"><h2>30-day free trial</h2><p>New monthly members only. Card required. $10/month after 30 days unless canceled. Annual memberships remain $100/year.</p><form action={saveTrialOffer} className="premium-auth-form" style={{marginTop:24}}><label style={{display:'flex',gap:12,alignItems:'center'}}><input type="checkbox" name="enabled" defaultChecked={data.enabled} style={{width:'auto'}}/> Offer new members a 30-day free trial</label><p>Currently {data.enabled?'ON':'OFF'}. Turning this off preserves existing trials and previously opened checkouts until they expire (about 31 minutes).</p><Submit>Save offer settings</Submit></form><p style={{marginTop:24}}>The offer is limited by account and email history. Alternate identities cannot be completely prevented. Before enabling publicly, configure Stripe’s trial reminder emails and complete sandbox lifecycle tests.</p></section></main>;
}
