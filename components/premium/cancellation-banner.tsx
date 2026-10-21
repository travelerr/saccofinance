'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';

export default function CancellationBanner(){
 const pathname=usePathname();
 const [endsAt,setEndsAt]=useState<string|null>(null);
 // Memory only: dismissal survives navigation, but a new page visit shows it again.
 const [dismissed,setDismissed]=useState(false);
 useEffect(()=>{
  const controller=new AbortController();
  const refresh=()=>fetch('/api/premium/cancellation-banner',{cache:'no-store',signal:controller.signal})
   .then(r=>r.ok?r.json():null).then(data=>setEndsAt(data?.endsAt||null)).catch(()=>{});
  void refresh();
  const onVisible=()=>{if(document.visibilityState==='visible')void refresh();};
  document.addEventListener('visibilitychange',onVisible);
  return ()=>{controller.abort();document.removeEventListener('visibilitychange',onVisible);};
 },[pathname]);
 if(!endsAt||dismissed)return null;
 const date=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/New_York'}).format(new Date(endsAt));
 return <aside className="premium-cancellation-banner" aria-label="Subscription cancellation reminder">
  <div><strong>Your subscription is scheduled to cancel.</strong><span>Your access ends {date}. Visit My Account to continue your membership.</span></div>
  <Link href="/premium/account">Keep my subscription →</Link>
  <button type="button" aria-label="Dismiss subscription reminder for this visit" onClick={()=>setDismissed(true)}>×</button>
 </aside>;
}
