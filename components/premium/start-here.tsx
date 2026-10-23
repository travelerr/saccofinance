'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
export default function StartHere({userId,lessonComplete=false,completedSteps=[]}:{userId:string;lessonComplete?:boolean;completedSteps?:string[]}){
 const [visible,setVisible]=useState(false);
 const key='sacco-premium-start-here-v1:'+userId;
 useEffect(()=>{try{setVisible(localStorage.getItem(key)!=='dismissed');}catch{setVisible(true);}},[key]);
 if(!visible||(lessonComplete&&['sector-gauge','opportunity','outlook'].every(step=>completedSteps.includes(step))))return null;
 return <section className="workspace-start-here" aria-labelledby="start-here-heading">
  <div><p className="workspace-start-label">NEW TO PREMIUM? START HERE</p><h2 id="start-here-heading">New to Premium? Start Here.</h2><p>Start with my complete research walkthrough, then explore the tools and research inside Premium.</p></div>
  <nav aria-label="Getting started"><Link href="/premium/learn/lesson-1">1. Watch Lesson 1: How I Find Stocks {lessonComplete?'✓ Completed':'→'}<small>Learn my complete research process and how everything inside Premium connects.</small></Link><Link href="/premium/market-strength">2. Explore the Sector Gauge {completedSteps.includes('sector-gauge')?'✓ Completed':'→'}<small>See which areas of the market are showing strength.</small></Link><Link href="/premium/opportunities">3. Open Your First Opportunity {completedSteps.includes('opportunity')?'✓ Completed':'→'}<small>See how research becomes a potential setup or actual trade.</small></Link><Link href="/premium/weekly-outlook">4. Read the Latest Weekly Outlook {completedSteps.includes('outlook')?'✓ Completed':'→'}<small>Understand the current market conditions and upcoming catalysts.</small></Link></nav><p className="workspace-start-dismiss-note">You can dismiss this notice with the × when you’re ready.</p>
  <button type="button" aria-label="Dismiss getting started guide" onClick={()=>{try{localStorage.setItem(key,'dismissed');}catch{}setVisible(false);}}>×</button>
 </section>;
}
