'use client';
import {useEffect,useState} from 'react';
import {formatDate,percent,periodKeys,type StrengthSnapshot} from '@/lib/market-strength';
import './market-strength.css';
export default function MarketStrength({initial}:{initial:StrengthSnapshot|null}){
 const [snapshot,setSnapshot]=useState(initial);
 const [relative,setRelative]=useState(false);
 const [direction,setDirection]=useState<'leaders'|'laggards'>('leaders');
 const [all,setAll]=useState(false);
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
  <div className="strength-heading"><div><p className="sf-eyebrow">PREMIUM / SECTOR GAUGE</p><h1>Sector Gauge</h1><p>Where leadership is holding. Where it’s changing.</p></div><span className="strength-private">RESEARCH PREVIEW</span></div>
  <div className="strength-meta" aria-live="polite"><strong>{snapshot?`Data through ${formatDate(snapshot.asOf)}`:'Waiting for the first snapshot'}</strong><span>{snapshot?`${snapshot.fundCount} ETFs · Daily closes · SPY benchmark`: 'Free historical data'}</span>{refreshing&&<span>Checking for a newer snapshot…</span>}</div>
  {error&&<div className="strength-warning" role="status">{snapshot?'The latest refresh is unavailable. Showing the last saved snapshot.':'Price history is temporarily unavailable. No rankings are shown until a complete snapshot is available.'}<button onClick={()=>setRetry(v=>v+1)}>Check again</button></div>}
  <div className="strength-controls"><div className="strength-toggle" role="group" aria-label="Performance measure"><button aria-pressed={!relative} onClick={()=>setRelative(false)}>Total return</button><button aria-pressed={relative} onClick={()=>setRelative(true)}>Versus S&amp;P 500</button></div><div className="strength-toggle" role="group" aria-label="Ranking direction"><button aria-pressed={direction==='leaders'} onClick={()=>setDirection('leaders')}>Leaders</button><button aria-pressed={direction==='laggards'} onClick={()=>setDirection('laggards')}>Laggards</button></div><button className="strength-expand" aria-pressed={all} onClick={()=>setAll(v=>!v)}>{all?'Show seven per panel':'Show all 24'}</button></div>
  <p className="strength-legend">{relative?'Percentage points ahead of or behind SPY.':'Returns include split and distribution adjustments.'} Rank change compares with {snapshot?formatDate(snapshot.previousAsOf):'the previous week'}. ↑ improved · ↓ slipped.</p>
  {snapshot?<div className="strength-grid">{periodKeys.map(key=>{
   const period=snapshot.periods[key];const rows=direction==='leaders'?period.rows:[...period.rows].reverse();
   return <section className="strength-panel" key={key} aria-labelledby={`period-${key}`}><header><h2 id={`period-${key}`}>{period.label}</h2><span>SPY {percent(period.benchmarkReturn)}</span></header><div className="strength-range">{formatDate(period.startDate)} – {formatDate(period.endDate)}</div><table><thead><tr><th scope="col">Group / ETF</th><th scope="col">{relative?'vs. SPY':'Return'}</th><th scope="col"><abbr title="Rank change versus the previous week">Δ rank</abbr></th></tr></thead><tbody>{rows.slice(0,all?24:7).map(row=>{
     const value=relative?row.relative:row.return;
     return <tr key={row.ticker}><th scope="row"><span className="strength-rank">{row.rank.toString().padStart(2,'0')}</span><span className="strength-group">{row.name}<small>{row.ticker}</small></span></th><td className={value>=0?'strength-positive':'strength-negative'} style={{backgroundColor:value>=0?`rgba(73,139,91,${.08+Math.min(Math.abs(value)/70,.24)})`:`rgba(178,79,52,${.08+Math.min(Math.abs(value)/70,.24)})`}}>{relative?`${value>0?'+':''}${value.toFixed(2)} pp`:percent(value)}</td><td className="strength-change" aria-label={row.rankChange>0?`Up ${row.rankChange} places`:row.rankChange<0?`Down ${-row.rankChange} places`:'Unchanged'}>{row.rankChange>0?`↑ ${row.rankChange}`:row.rankChange<0?`↓ ${-row.rankChange}`:'—'}</td></tr>;
   })}</tbody></table></section>;
  })}</div>:<div className="strength-empty"><h2>{refreshing?'Preparing the rankings':'Snapshot unavailable'}</h2><p>{refreshing?'Fetching historical prices and checking that every ETF uses the same closing date.':'A complete, validated set of prices is required before we can rank the groups.'}</p></div>}
  <details className="strength-method"><summary>How to read these rankings</summary><div><p>All funds use the same closing date. Calendar-month returns use the last common trading session on or before the lookback date; one week means seven calendar days. Today’s trading session is excluded.</p><p>Total returns are calculated from Yahoo Finance adjusted closes. “Versus S&amp;P 500” subtracts SPY’s return for the same period, in percentage points. The rankings are identical in both modes because every ETF is compared with the same benchmark.</p><p>Rank changes compare each rolling period’s current ranking with its ranking a week earlier. The universe stays fixed at your 24 selected ETFs. ITA and XAR both represent aerospace and defense; several other groups overlap. These are fund proxies, not pure industry indexes or direct commodity prices.</p><p>Data is checked on the first dashboard visit each day. The previous complete snapshot stays available if a refresh fails. This evolving dashboard is separate from Issue 001’s dated market view. Free Yahoo data is used for this private prototype; subscriber display rights have not been established.</p></div></details>
 </div>;
}
