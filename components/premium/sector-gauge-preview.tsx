'use client';
import {useEffect,useState} from 'react';
import {formatDate,percent,type StrengthSnapshot} from '@/lib/market-strength';

export default function SectorGaugePreview({initial}:{initial:StrengthSnapshot|null}){
 const [snapshot,setSnapshot]=useState(initial);
 useEffect(()=>{
  const controller=new AbortController();let timer:ReturnType<typeof setTimeout>;let checks=0;
  async function refresh(){try{
   const response=await fetch('/api/market-strength',{cache:'no-store',signal:controller.signal});
   if(!response.ok)return;
   const data=await response.json();if(controller.signal.aborted)return;
   if(data.snapshot)setSnapshot(data.snapshot);
   if(data.refreshing&&checks++<20)timer=setTimeout(refresh,10000);
  }catch{/* Keep the dated saved snapshot when refresh is unavailable. */}}
  refresh();return()=>{controller.abort();clearTimeout(timer);};
 },[]);
 if(!snapshot)return <p>Sector rankings are temporarily unavailable. Open the Sector Gauge to check again.</p>;
 const period=snapshot.periods['1m'];
 return <div className="workspace-sector-preview">
  <header><strong>One month · Top 5</strong><span>SPY {percent(period.benchmarkReturn)}</span></header>
  <p className="workspace-sector-date">{formatDate(period.startDate)} – {formatDate(period.endDate)}</p>
  <table><caption className="workspace-sector-caption">Top five ETF groups by one-month total return</caption><thead><tr><th scope="col">Group / ETF</th><th scope="col">Return</th><th scope="col"><abbr title="Rank change versus the previous week">Δ rank</abbr></th></tr></thead><tbody>{period.rows.slice(0,5).map(row=><tr key={row.ticker}>
   <th scope="row"><span className="workspace-sector-rank">{row.rank.toString().padStart(2,'0')}</span><span>{row.name}<small>{row.ticker}</small></span></th>
   <td className={row.return>=0?'workspace-sector-positive':'workspace-sector-negative'}>{percent(row.return)}</td>
   <td aria-label={row.rankChange>0?`Up ${row.rankChange} places`:row.rankChange<0?`Down ${-row.rankChange} places`:'Unchanged'}>{row.rankChange>0?`↑ ${row.rankChange}`:row.rankChange<0?`↓ ${-row.rankChange}`:'—'}</td>
  </tr>)}</tbody></table>
 </div>;
}
