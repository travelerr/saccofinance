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
 const {admin,mode}=await billingServices();const {data,error}=await admin.from('premium_trial_settings').select('enabled,trial_days,updated_at').eq('mode',mode).single();
 if(error||!data)return <main className="container section"><h1>Membership offers</h1><p>Offer settings are unavailable. Apply the trial migration before using this page.</p></main>;
 const params=await searchParams;
 return <main className="container section" style={{maxWidth:760,paddingTop:48,paddingBottom:64}}><Link href="/premium/account">← Account</Link><h1 style={{marginTop:24}}>Membership offers</h1><p>{mode==='test'?'Stripe sandbox — production offers are unaffected.':'Production — changes affect new website checkouts.'}</p>{params.saved&&<p role="status">Offer settings saved.</p>}<section className="section"><h2>Introductory trial offer</h2><p>Choose one offer for new monthly members. Card required; then $10/month unless canceled before billing. Annual memberships remain $100/year.</p><form action={saveTrialOffer} className="premium-auth-form" style={{marginTop:24}}><label>Active offer<select name="offer" defaultValue={data.enabled?String(data.trial_days):'0'} style={{marginTop:8,padding:12}}><option value="0">Off — standard paid checkout</option><option value="7">7 days free — then $10/month</option><option value="30">30 days free — then $10/month</option></select></label><p>Currently: {data.enabled?`${data.trial_days} days free`:'Off'}. Changes apply to new checkouts. Existing trials and previously opened checkouts keep their original offer until they expire (about 31 minutes for an open checkout).</p><Submit>Save offer settings</Submit></form><p style={{marginTop:24}}>The offer is limited by account and email history. Alternate identities cannot be completely prevented. Before enabling publicly, configure Stripe’s trial reminder emails and complete sandbox lifecycle tests.</p></section></main>;
}
