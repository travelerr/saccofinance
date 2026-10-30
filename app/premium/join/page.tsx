import PaymentMethods from '@/components/premium/payment-methods';
import {trialOfferDays} from '@/lib/billing/trial-offer';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import PlanForm from './plan-form';
import styles from './join.module.css';
import {Eyebrow} from '@/components/brand/editorial';
import {billingEnabled,billingMode} from '@/lib/billing/model';
export const dynamic='force-dynamic';
export const metadata={title:'Join Premium | Sacco Financial',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{error?:string;checkout?:string;plan?:string}>}){
 if(!billingEnabled())redirect('/premium/login');const params=await searchParams;const trial=await trialOfferDays();
 const errors:Record<string,string>={trial:'This email cannot claim another trial, or a checkout is already pending. Sign in to manage your account or retry the original checkout.',details:'Choose a plan and accept the Terms to continue.',guest:'Checkout is temporarily unavailable. Please try again shortly.',busy:'Another checkout request is finishing. Please try again in a moment.',pending:'Your checkout could not switch plans yet. Please try again.',billing:'Checkout is temporarily unavailable. Please try again.'};
 return <main id="main-content" className={`container ${styles.page}`}><header className={styles.header}><Eyebrow>Sacco Premium / Membership</Eyebrow><h1>Your research starts here.</h1><p>Choose the billing option that works for you. Both plans include the complete Premium research library and tools.</p></header>
 {billingMode()==='test'&&<p className={styles.message}>Sandbox checkout. Test payments only; no real charges.</p>}
 {params.error&&<p role="alert" className={styles.message}>{errors[params.error]||errors.billing}</p>}
 {params.checkout==='canceled'&&<p className={styles.message}>Payment wasn’t completed. You can return to checkout below.</p>}
 <div className={styles.layout}><PlanForm initialPlan={params.plan==='annual'?'annual':'monthly'} trial={trial}/><aside className={styles.aside}><h2>Everything is included.</h2><ul><li>Weekly Outlook and research archive</li><li>Sector Gauge: 24 ETF proxies across six timeframes</li><li>Opportunity Board, dated updates, and closed trades</li><li>Learning Library and your member dashboard</li></ul><h3>What happens next</h3><ol><li><strong>Secure checkout.</strong> Review the final amount and confirm through Stripe.</li><li><strong>Access in this browser.</strong> Once Stripe verifies your checkout, open Premium.</li><li><strong>Save your login.</strong> Your welcome email helps connect your purchase to an account for access on other devices.</li><li><strong>Start with the dashboard.</strong> Read the latest Outlook, explore the Gauge, and follow an Opportunity.</li></ol><h3>You’re in control.</h3><p className={styles.note}>Cancel anytime through Account &amp; Billing. Paid access continues through your paid period{trial?' or, for a trial, until its scheduled end':''}. Payments are generally non-refundable under the existing Terms.</p><PaymentMethods/><p className={styles.note}>Secure payments through Stripe.</p><p className={styles.note}>Educational and informational research, not personalized investment advice. Investing involves risk, including loss of principal.</p></aside></div>
 <p className={styles.login}>Already a member? <Link href="/premium/login?next=/premium/account">Log in →</Link></p></main>;
}
