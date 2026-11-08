'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';

export default function OnboardingPreviewToggle({userId}:{userId:string}){
 const [enabled,setEnabled]=useState(false);
 const [ready,setReady]=useState(false);
 const [error,setError]=useState('');
 const key='sacco-premium-admin-start-here-preview:'+userId;
 useEffect(()=>{try{setEnabled(localStorage.getItem(key)==='on');}catch{setError('Browser storage is unavailable.');}setReady(true);},[key]);
 function toggle(){
  try{const next=!enabled;localStorage.setItem(key,next?'on':'off');setEnabled(next);setError('');window.dispatchEvent(new Event('premium-onboarding-preview'));}
  catch{setError('Could not save your preview preference. Allow browser storage and try again.');}
 }
 return <div className="account-onboarding-preview">
  <h3>Dashboard onboarding preview</h3>
  <p>Show or hide “New to Premium? Start Here” for your admin account in this browser, even after completing or dismissing it. Member visibility and your completed steps stay unchanged.</p>
  <button className="button" type="button" role="switch" aria-checked={enabled} disabled={!ready} onClick={toggle}>Show Start Here for me: {enabled?'On':'Off'}</button>
  <Link className="text-link" href="/premium/dashboard">View dashboard →</Link>
  {error&&<p role="alert">{error}</p>}
 </div>;
}
