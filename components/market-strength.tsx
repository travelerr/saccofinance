'use client';
import {useEffect,useState} from 'react';
import {formatDate,type StrengthSnapshot} from '@/lib/market-strength';
import './market-strength.css';
import GaugeExplorer from './premium/gauge-explorer';
export default function MarketStrength({initial,memberId}:{initial:StrengthSnapshot|null;memberId:string}){
 const [snapshot,setSnapshot]=useState(initial);
 const [refreshing,setRefreshing]=useState(false);
 const [error,setError]=useState(false);
 const [retry,setRetry]=useState(0);
 useEffect(()=>{
   let stopped=false;let timer:ReturnType<typeof setTimeout>;let checks=0;
   const controller=new AbortController();
   async function check(){
     try{
       const response=await fetch('/api/market-strength',{cache:'no-store',signal:controller.signal});
       if(!response.ok)throw new Error('Unavailable');
       const data=await response.json();if(stopped)return;
       if(data.snapshot)setSnapshot(data.snapshot);
       setRefreshing(data.refreshing);setError(data.refreshFailed||(!data.snapshot&&!data.refreshing));
       if(data.refreshing&&checks++<20)timer=setTimeout(check,10000);
     }catch{if(!stopped){setError(true);setRefreshing(false);}}
   }
   check();return()=>{stopped=true;controller.abort();clearTimeout(timer);};
 },[retry]);
 return <div className="strength-dashboard">
  <div className="strength-heading"><div><p className="sf-eyebrow">SACCO PREMIUM RESEARCH / SECTOR GAUGE</p><h1>Sector Gauge</h1><p>Start with the broad sectors, then explore the industries and themes behind them.</p></div></div>
  <div className="strength-meta" aria-live="polite"><strong>{snapshot?`Data through ${formatDate(snapshot.asOf)}`:'Waiting for the first snapshot'}</strong><span>{snapshot?'Daily adjusted closes · SPY benchmark': 'Free historical data'}</span>{refreshing&&<span>Checking for a newer snapshot…</span>}</div>
  {error&&<div className="strength-warning" role="status">{snapshot?'The latest refresh is unavailable. Showing the last saved snapshot.':'Price history is temporarily unavailable. No rankings are shown until a complete snapshot is available.'}<button onClick={()=>setRetry(v=>v+1)}>Check again</button></div>}
  {snapshot&&<GaugeExplorer snapshot={snapshot} memberId={memberId}/>}
 </div>;
}
