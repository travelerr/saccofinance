import ResearchPreferences from './research-preferences';
import {isResearchAdmin} from '@/lib/email/policy';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {syncMemberBilling} from '@/lib/billing/sync';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Eyebrow,SectionHeader} from '@/components/brand/editorial';
import Submit from '@/components/premium/submit';
import {premiumAccess} from '@/lib/premium-access';
import {billingEnabled,billingMode,graceEnds,hasPaidAccess,blocksNewSubscription,dateMs,cancellationScheduled,paidAccessEnds,membershipStatus} from '@/lib/billing/model';
import {subscribe,manageSubscription} from './actions';
import '@/components/premium/auth.css';
import './account.css';
export const metadata={title:'Account & Billing | Sacco Premium',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
function displayDate(value:string|null){return value?new Intl.DateTimeFormat('en-US',{dateStyle:'long',timeZone:'UTC'}).format(new Date(value)):'Not available';}
export default async function Page({searchParams}:{searchParams:Promise<{checkout?:string;error?:string;billing?:string}>}){
 const params=await searchParams;const billing=billingEnabled();let syncPending=false;
 if(billing){const client=await createSupabaseServerClient();const result=client?await client.auth.getUser():null;if(result?.data.user){try{await syncMemberBilling(result.data.user.id);}catch{syncPending=true;}}}
 const access=await premiumAccess();if(!access.user)redirect('/premium/login?next=/premium/account');
 const subscription=[...access.subscriptions].sort((a,b)=>Number(hasPaidAccess(b))-Number(hasPaidAccess(a))||Number(blocksNewSubscription(b.status))-Number(blocksNewSubscription(a.status))||dateMs(b.observed_at||null)-dateMs(a.observed_at||null))[0];
 const ongoingSubscriptions=access.subscriptions.filter(s=>blocksNewSubscription(s.status));
 const ongoing=ongoingSubscriptions.length>0;
 const lifetime=access.manualAllowed&&access.grant?.access_expires_at===null;
 return <main id="main-content" className="container premium-account"><header className="account-heading"><Eyebrow>Your membership</Eyebrow><h1>Account settings</h1><p>Manage your membership, login, and email preferences.</p><div className="account-identity"><span className="account-avatar" aria-hidden="true">{(access.user.email||'M').slice(0,1).toUpperCase()}</span><div><strong>{access.user.email||'Your checkout membership'}</strong><span>{access.allowed?'Premium member':'Sacco Financial account'}</span></div></div></header>
 {isResearchAdmin(access.user,process.env.RESEARCH_ADMIN_USER_IDS||'')&&<section className="account-admin-tools" aria-labelledby="admin-tools-heading"><Eyebrow>Administrator</Eyebrow><h2 id="admin-tools-heading">Admin tools</h2><nav aria-label="Administration"><Link className="button" href="/premium/admin/notifications">Manage research notifications</Link><Link className="button" href="/premium/admin/analytics">Analytics</Link></nav></section>}
 {billing&&billingMode()==='test'&&<p className="premium-auth-message">Sandbox billing: checkout uses test payments. No real charges.</p>}
 {syncPending&&<p role="status" className="premium-auth-message">We couldn’t refresh your latest billing changes. The details below show the last verified state. Refresh shortly; do not purchase again.</p>}
 {params.error&&<p role="alert" className="premium-auth-message">{params.error==='pending'?'A previous checkout attempt is pending. Retry the original plan or wait 31 minutes before choosing another plan.':'Billing is temporarily unavailable. Please try again later.'}</p>}
 {params.checkout==='success'&&!access.allowed&&<p role="status" className="premium-auth-message">We’re waiting for payment confirmation. Refresh this page shortly; access begins after payment is verified.</p>}
 {params.checkout==='canceled'&&<p className="premium-auth-message">Checkout was canceled. You can return to it below.</p>}
 <section className="section account-membership"><h2>Membership &amp; billing</h2>{access.user.is_anonymous&&<p>Your access is available in this browser. <Link className="text-link" href="/premium/account/setup">Save your login and set a password</Link> to return from another device.</p>}
 {access.manualAllowed?<><h3>{lifetime?'Complimentary lifetime access':'Complimentary Premium access'}</h3><p>{lifetime?'No subscription required. Your access has no expiration.':`Your access continues until ${displayDate(access.grant?.access_expires_at||null)}. No subscription required.`}</p></>:subscription?<><h3>{subscription.plan==='annual'?'Annual — $100/year':'Monthly — $10/month'}</h3><p>Status: {membershipStatus(subscription)}</p>{subscription.status==='active'&&(cancellationScheduled(subscription)?<><p>Your subscription will not renew. {hasPaidAccess(subscription)?`You can use Premium through ${displayDate(paidAccessEnds(subscription))}.`:'Your Premium access has ended.'}</p><p>Access ends: {displayDate(paidAccessEnds(subscription))}</p></>:<p>Renews: {displayDate(subscription.current_period_end)}</p>)}{subscription.status==='past_due'&&<p>{hasPaidAccess(subscription)?`Your payment needs attention. Update your payment details by ${displayDate(graceEnds(subscription))} to keep access.`:'Your payment needs attention. Premium access is paused until payment is resolved.'}</p>}{subscription.status==='canceled'&&<p>Your subscription has ended.</p>}</>:<p>{access.unavailable?'We couldn’t load your membership details. Please try again later.':'You do not have a Premium subscription yet.'}</p>}
 {access.manualAllowed&&ongoing&&<p>Complimentary access does not cancel an existing paid subscription. Manage it below to stop future billing.</p>}{ongoingSubscriptions.length>1&&<p>You have more than one ongoing subscription. Manage each below to avoid unwanted renewals.</p>}{billing&&ongoingSubscriptions.map(s=><form key={s.stripe_subscription_id} action={manageSubscription} className="premium-auth-form"><input type="hidden" name="subscription" value={s.stripe_subscription_id}/>{ongoingSubscriptions.length>1&&<p>{s.plan==='annual'?'Annual':'Monthly'} · {membershipStatus(s)} · Paid through {displayDate(paidAccessEnds(s))}</p>}<Submit>Manage Subscription</Submit></form>)}
 </section>
 {!access.manualAllowed&&!ongoing&&billing&&!access.unavailable&&<section className="section"><SectionHeader title="Subscribe to Premium"/><div className="property-grid"><article><Eyebrow>Monthly</Eyebrow><h3>$10 / month</h3><p>Recurring monthly membership.</p><form data-analytics-form="checkout" action={subscribe}><input type="hidden" name="plan" value="monthly"/><Submit>Choose monthly</Submit></form></article><article><Eyebrow>Annual</Eyebrow><h3>$100 / year</h3><p>Recurring annual membership. Save $20 compared with twelve monthly payments.</p><form data-analytics-form="checkout" action={subscribe}><input type="hidden" name="plan" value="annual"/><Submit>Choose annual</Submit></form></article></div><p>Subscriptions renew automatically. Cancel through Manage Subscription; access continues through the paid period. Renewal payment failures receive a seven-day grace period.</p><p><Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link></p></section>}
 {!billing&&!access.manualAllowed&&<p>Paid subscriptions are not open yet.</p>}
 <section className="section account-login" aria-labelledby="account-login-heading"><h2 id="account-login-heading">Login &amp; password</h2><p>{access.user.is_anonymous?'Save your login so you can return from another browser or device.':'Manage the password you use to sign in.'}</p><div className="premium-auth-links"><Link className="button" href={access.user.is_anonymous?'/premium/account/setup':'/premium/set-password'}>{access.user.is_anonymous?'Save your login and set a password':'Set or change your password'}</Link></div></section>
 <ResearchPreferences/>
 </main>;
}
