'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
export default function StartHere({userId}:{userId:string}){
 const [visible,setVisible]=useState(false);
 const key='sacco-premium-start-here-v1:'+userId;
 useEffect(()=>{try{setVisible(localStorage.getItem(key)!=='dismissed');}catch{setVisible(true);}},[key]);
 if(!visible)return null;
 return <section className="workspace-start-here" aria-labelledby="start-here-heading">
  <div><p className="workspace-start-label">NEW TO PREMIUM? START HERE</p><h2 id="start-here-heading">Your first three steps in Premium</h2><p>Welcome! These three steps will help you get the most out of Premium. Start with the market, explore sector strength, then open an Opportunity.</p></div>
  <nav aria-label="Getting started"><Link href="/premium/weekly-outlook">1. Read the latest Weekly Outlook →</Link><Link href="/premium/market-strength">2. Explore the Sector Gauge →</Link><Link href="/premium/opportunities">3. Open your first Opportunity →</Link></nav><p className="workspace-start-dismiss-note">You can dismiss this notice with the × when you’re ready.</p>
  <button type="button" aria-label="Dismiss getting started guide" onClick={()=>{try{localStorage.setItem(key,'dismissed');}catch{}setVisible(false);}}>×</button>
 </section>;
}
