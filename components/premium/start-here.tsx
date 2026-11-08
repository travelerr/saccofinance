'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {X} from 'lucide-react';
export default function StartHere({userId,lessonComplete=false,completedSteps=[]}:{userId:string;lessonComplete?:boolean;completedSteps?:string[]}){
 const [visible,setVisible]=useState(false);
 const key='sacco-premium-start-here-v1:'+userId;
 useEffect(()=>{try{setVisible(localStorage.getItem(key)!=='dismissed');}catch{setVisible(true);}},[key]);
 const libraryComplete=lessonComplete||completedSteps.includes('learning-library');
 if(!visible||(libraryComplete&&['sector-gauge','opportunity','outlook'].every(step=>completedSteps.includes(step))))return null;
 return <section className="workspace-start-here" aria-labelledby="start-here-heading">
  <div className="workspace-start-intro"><p className="workspace-start-label">NEW TO PREMIUM? START HERE</p><h2 id="start-here-heading">New to Premium? Start Here.</h2><p>Welcome to Sacco Premium! Take some time to explore the research, tools, and lessons while you get settled in.</p></div>
  <div className="workspace-start-expectations">
   <h3>IMPORTANT</h3>
   <p><strong>Welcome aboard! New opportunities are published when I find setups that meet my criteria, so there’s no set schedule. Take time to explore Premium while you wait for the next one.</strong></p>
   <p><strong>My focus is quality over quantity.</strong> I won’t fill the Opportunity Board with trades just to make it look busy. I share my research and actual decisions, including when I choose to wait. Sacco Premium isn’t a signal service promising a steady stream of trades; patience and disciplined risk management are part of my process.</p>
   <p><strong>Make sure opportunity email notifications are enabled so you hear when the next setup is published.</strong> Earlier alerts aren’t resent when you join; existing research and trade history are available on the Opportunity Board.</p>
   <Link href="/premium/account">Check my email preferences →</Link>
  </div>
  <nav aria-label="Getting started"><Link href="/premium/learn">1. Explore the Learning Library {libraryComplete?<span className="workspace-start-completed">✓ Completed</span>:'→'}<small>Explore videos and guides covering my research process.</small></Link><Link href="/premium/weekly-outlook">2. Read the Latest Weekly Outlook {completedSteps.includes('outlook')?<span className="workspace-start-completed">✓ Completed</span>:'→'}<small>Understand the current market conditions and upcoming catalysts.</small></Link><Link href="/premium/market-strength">3. Explore the Sector Gauge {completedSteps.includes('sector-gauge')?<span className="workspace-start-completed">✓ Completed</span>:'→'}<small>See which areas of the market are showing strength.</small></Link><Link href="/premium/opportunities">4. Open Your First Opportunity {completedSteps.includes('opportunity')?<span className="workspace-start-completed">✓ Completed</span>:'→'}<small>See how research becomes a potential setup or actual trade.</small></Link></nav><p className="workspace-start-dismiss-note">You can dismiss this notice with the × when you’re ready.</p>
  <button type="button" aria-label="Dismiss getting started guide" onClick={()=>{try{localStorage.setItem(key,'dismissed');}catch{}setVisible(false);}}><X size={20} aria-hidden="true"/></button>
 </section>;
}
