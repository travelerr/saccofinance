'use client';
import {useState} from 'react';
import Link from 'next/link';
import Submit from '@/components/premium/submit';
import {beginCheckout} from './actions';
import styles from './join.module.css';
export default function PlanForm({initialPlan,trial}:{initialPlan:'monthly'|'annual';trial:number}){
 const [plan,setPlan]=useState(initialPlan);const monthly=plan==='monthly';const free=monthly&&trial>0;
 return <form action={beginCheckout} data-analytics-form="checkout" className={styles.form}>
 <fieldset><legend>Choose your membership</legend><div className={styles.options}>{(['monthly','annual'] as const).map(value=><label key={value} className={`${styles.option} ${plan===value?styles.selected:''}`}><input type="radio" name="plan" value={value} checked={plan===value} onChange={()=>setPlan(value)}/><span><strong>{value==='monthly'?'Monthly':'Annual · Best value'}</strong><b>{value==='monthly'?'$10/month':'$100/year'}</b><small>{value==='monthly'?(trial?`${trial} days free, then $10/month.`:'Billed monthly. Same full access.'):'$8.33/month · Save $20/year.'}</small></span></label>)}</div></fieldset>
 <div className={styles.summary} aria-live="polite"><h2>Your membership summary</h2><div><span>{monthly?'Monthly membership':'Annual membership'}</span><strong>{monthly?'$10/month':'$100/year'}</strong></div>{free&&<div><span>Introductory trial</span><strong>{trial} days free</strong></div>}<div className={styles.total}><span>Plan price due today</span><strong>{free?'$0':monthly?'$10':'$100'}</strong></div><p>{free?'Card required. Then $10/month unless canceled before the trial ends. New monthly members only.':`Renews at ${monthly?'$10/month':'$100/year'} until canceled.`} Any applicable tax and your final total are shown at Stripe before confirmation.</p></div>
 {trial>0&&<label className={styles.email}>Email for your membership<input type="email" name="email" autoComplete="email" required maxLength={254}/><small>Use the email you want connected to your membership. Previous subscribers are not eligible for the monthly trial.</small></label>}
 <label className={styles.terms}><input type="checkbox" name="terms" required/><span>I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</span></label>
 <Submit>Continue to secure checkout</Submit><p className={styles.fine}>No separate registration before checkout. Save your login afterward.</p>
 </form>;
}
