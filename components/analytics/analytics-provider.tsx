'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {usePathname} from 'next/navigation';
import {clearAnalytics,hasConsent,pauseTracking,readCookie,setConsent,startPage,track} from '@/lib/analytics/browser';
import {CONSENT_COOKIE,engagementReached,safePage} from '@/lib/analytics/policy';
import './analytics.css';
type Config={mode:'disabled'|'preview'|'live';userId?:string|null};
export default function AnalyticsProvider(){
 const pathname=usePathname();
 const [settingsTarget,setSettingsTarget]=useState<HTMLElement|null>(null);
 useEffect(()=>{setSettingsTarget(document.getElementById('analytics-preferences-slot'));},[pathname]);
 const [gpcActive,setGpcActive]=useState(false);
 const [choice,setChoice]=useState(0);const [show,setShow]=useState(false);const [available,setAvailable]=useState(false);const [preview,setPreview]=useState(false);const [events,setEvents]=useState<string[]>([]);
 const landing=useRef<{url:string;referrer:string}|null>(null);
 useEffect(()=>{
  landing.current??={url:location.href,referrer:document.referrer};
  pauseTracking();let canceled=false;let cleanup=()=>{};
  const gpc=Boolean((navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl);
  setGpcActive(gpc);if(gpc)clearAnalytics();
  fetch('/api/analytics/context',{cache:'no-store',credentials:'same-origin'})
   .then(r=>r.ok?r.json():{mode:'disabled'}).then((config:Config)=>{
    if(canceled)return;
    const enabled=config.mode==='live'||config.mode==='preview';setAvailable(enabled);setPreview(config.mode==='preview');
    if(!enabled){clearAnalytics();setShow(false);return;}
    setShow(!readCookie(CONSENT_COOKIE)&&!gpc);
    if(!hasConsent()||!safePage(pathname))return;
    startPage(config as Config&{mode:'live'|'preview'},pathname,landing.current!.url,landing.current!.referrer);
    let activeMs=0,maxDepth=0,lastActivity=Date.now(),lastTick=Date.now(),engaged=false;
    const marker=document.querySelector<HTMLElement>('[data-research-id]');
    const contentId=marker?.dataset.researchId;const type=marker?.dataset.researchType;
    const research=contentId&&/^[a-z]+(?:-[a-z]+)*-\d{3}$/.test(contentId)&&['weekly_outlook','opportunity'].includes(type||'')?{content_id:contentId,content_type:type!}:null;
    if(research)track('research_view',research);
    const depth=()=>{const root=document.documentElement;maxDepth=Math.max(maxDepth,Math.min(100,Math.round((scrollY+innerHeight)/Math.max(root.scrollHeight,1)*100)));};depth();
    const activity=()=>{lastActivity=Date.now();depth();};
    const click=(event:MouseEvent)=>{
     activity();const a=event.target instanceof Element?event.target.closest('a'):null;if(!a)return;
     try{
      const url=new URL(a.href);if(url.origin!==location.origin){const destinations:Record<string,string>={'youtube.com':'youtube','www.youtube.com':'youtube','youtu.be':'youtube','instagram.com':'instagram','www.instagram.com':'instagram','tiktok.com':'tiktok','www.tiktok.com':'tiktok','facebook.com':'facebook','www.facebook.com':'facebook','join.saccofinancial.com':'free_guide'};const destination=destinations[url.hostname];if(destination)track('outbound_click',{destination});return;}
      if(url.pathname==='/premium/join')track('subscribe_click',{placement:pathname,plan:url.searchParams.get('plan')==='annual'?'annual':'monthly'});
      else if(url.pathname.startsWith('/api/premium/chart/')&&research)track('chart_open',research);
      else {const destination=safePage(url.pathname);if(destination)track('navigation_click',{destination});}
     }catch{}
    };
    const submit=(event:Event)=>{
     const form=event.target;if(!(form instanceof HTMLFormElement))return;
     const name=form.dataset.analyticsForm;
     if(name==='checkout'){
      const plan=new FormData(form).get('plan');if(plan==='monthly'||plan==='annual')track('checkout_requested',{plan});
     }else if(name==='research_preference')track('notification_preference_requested');
    };
    const params=new URLSearchParams(location.search);
    if(pathname==='/premium/join'&&['details','guest','pending','billing'].includes(params.get('error')||''))track('checkout_error',{reason:params.get('error')!});
    if(['/premium/join','/premium/account'].includes(pathname)&&params.get('checkout')==='canceled')track('checkout_return_canceled');
    const timer=window.setInterval(()=>{
     const now=Date.now();if(document.visibilityState==='visible'&&document.hasFocus()&&now-lastActivity<60000)activeMs+=Math.min(now-lastTick,2000);lastTick=now;
     if(research&&!engaged&&engagementReached(activeMs,maxDepth)){engaged=true;track('research_engaged',{...research,active_seconds:Math.floor(activeMs/1000),scroll_percent:maxDepth});}
    },1000);
    document.addEventListener('click',click);document.addEventListener('submit',submit);window.addEventListener('scroll',activity,{passive:true});window.addEventListener('keydown',activity);
    cleanup=()=>{clearInterval(timer);document.removeEventListener('click',click);document.removeEventListener('submit',submit);window.removeEventListener('scroll',activity);window.removeEventListener('keydown',activity);};
   }).catch(()=>{if(!canceled){pauseTracking();setAvailable(false);}});
  return()=>{canceled=true;cleanup();pauseTracking();};
 },[pathname,choice]);
 useEffect(()=>{const update=()=>setEvents((window.__saccoAnalyticsPreview||[]).map(e=>e.event));window.addEventListener('sacco-analytics-preview',update);return()=>window.removeEventListener('sacco-analytics-preview',update);},[]);
 function choose(granted:boolean){setConsent(granted);setShow(false);setChoice(n=>n+1);}
 if(!available)return null;
 return <>
 {show&&<aside className="analytics-choice" aria-label="Optional analytics"><strong>Help us improve Sacco Financial</strong><p>Allow optional analytics to help us understand visits, subscriptions, and which research gets read. Your choice won’t affect your account or email preferences. <a href="/privacy">Privacy policy</a></p>{gpcActive&&<p>Your browser’s Global Privacy Control keeps analytics disabled.</p>}<div><button onClick={()=>choose(false)}>Decline</button><button disabled={gpcActive} onClick={()=>choose(true)}>Allow analytics</button><button onClick={()=>setShow(false)} aria-label="Close analytics choices">Close</button></div></aside>}
 {settingsTarget&&createPortal(<button className="analytics-settings" onClick={()=>setShow(true)}>Analytics preferences</button>,settingsTarget)}
 {preview&&<details className="analytics-preview"><summary>Local analytics preview · {events.length} events</summary><p>Nothing is sent to Google. {hasConsent()?'Analytics allowed in this browser.':'Allow analytics to preview events.'}</p><ol>{events.slice(-12).map((event,index)=><li key={index}>{event}</li>)}</ol></details>}
 </>;
}
