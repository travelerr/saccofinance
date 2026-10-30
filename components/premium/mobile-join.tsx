'use client';
import {useEffect,useState} from 'react';
import CheckoutButton from './checkout-button';
import styles from '@/app/premium/sales.module.css';
export default function MobileJoin({href,enabled,trial=0}:{href:string;enabled:boolean;trial?:number}){
 const [pastHero,setPastHero]=useState(false);
 useEffect(()=>{const hero=document.getElementById('premium-hero-copy');if(!hero)return;
 const update=()=>setPastHero(hero.getBoundingClientRect().bottom<90);update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};},[]);
 if(!pastHero)return null;
 return <aside className={`${styles.mobileJoin} ${styles.stickyPlans}`} aria-label="Join Sacco Premium">
  <div className={styles.stickyPitch}><strong>Make your next move informed.</strong><span>Full Premium access. Your choice of plan.</span></div>
  <div className={styles.stickyChoices}>
   <div className={styles.stickyAnnual}><span className={styles.stickyValue}>BEST VALUE · 2 MONTHS FREE</span><CheckoutButton trial={trial} className={`button ${styles.stickyAnnualButton}`} href={enabled?'/premium/join?plan=annual':href}>{enabled?<><strong>Join annual</strong><span>$100/year</span></>:'Member sign in'}</CheckoutButton></div>
   {enabled&&<CheckoutButton trial={trial} className={`button ${styles.stickyMonthlyButton}`} href="/premium/join?plan=monthly">{trial?<><strong>Start free trial</strong><span>{trial} days, then $10/month</span></>:<><strong>Join monthly</strong><span>$10/month</span></>}</CheckoutButton>}
  </div>
 </aside>;
}
