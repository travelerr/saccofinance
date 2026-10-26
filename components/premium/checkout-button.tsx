'use client';
import type {ReactNode} from 'react';
import Link from 'next/link';
import {useFormStatus} from 'react-dom';
import {usePremiumPlan} from './plan-choice';
import {beginDirectCheckout} from '@/app/premium/join/actions';
function Button({children,className}:{children:ReactNode;className:string}){const {pending}=useFormStatus();return <button type="submit" className={className} disabled={pending} aria-busy={pending}>{pending?'Opening secure checkout…':children}</button>;}
export default function CheckoutButton({href,children,className='button',trial=false}:{href:string;children:ReactNode;className?:string;trial?:boolean}){
 const {plan:selectedPlan}=usePremiumPlan();
 if(!href.startsWith('/premium/join'))return <Link href={href} className={className}>{children}</Link>;
 const explicit=href.includes('plan=');
 const plan=explicit?(href.includes('plan=annual')?'annual':'monthly'):selectedPlan;
 return <form action={beginDirectCheckout} data-analytics-form="checkout" style={{margin:0}}><input type="hidden" name="plan" value={plan}/>{trial&&plan==='monthly'&&<label style={{display:'grid',gap:8,marginBottom:12}}>Email for your trial<input type="email" name="email" autoComplete="email" required maxLength={254}/></label>}<Button className={className}>{explicit?children:plan==='annual'?'Join annual — $100/year':trial?'Start your 30-day trial':'Join monthly — $10/month'}</Button></form>;
}
