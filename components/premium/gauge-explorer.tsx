'use client';
import {Fragment,useEffect,useRef,useState} from 'react';
import {formatDate,percent,periodKeys,type StrengthSnapshot} from '@/lib/market-strength';
import {groups,sectors,granular,original,ranking,frequentLeaders,periodValues,type Group} from '@/lib/gauge-explorer';
import {recordMemberEngagement} from '@/lib/analytics/member-engagement-browser';
import './gauge-explorer.css';

const views = ['Sectors','Industries & Themes','My Watchlist'] as const;
type View = typeof views[number];
const holdings = (ticker:string) => 'https://stockanalysis.com/etf/'+ticker.toLowerCase()+'/holdings/';
function spread(value:number|null|undefined, benchmark:number|null|undefined) {
  if(value == null || benchmark == null) return 'N/A';
  const delta = value-benchmark;
  return (delta>0?'+':'')+delta.toFixed(2)+' pp';
}

export default function GaugeExplorer({snapshot,memberId}:{snapshot:StrengthSnapshot;memberId:string}) {
  const [view,setView] = useState<View>('Sectors');
  const [measure,setMeasure] = useState('Return');
  const [showAll,setShowAll] = useState(false);
  const leaderSection = useRef<HTMLElement>(null);
  const [parent,setParent] = useState('');
  const [selected,setSelected] = useState('');
  const [reverse,setReverse] = useState(false);
  const [saved,setSaved] = useState(original);
  const [saveError,setSaveError] = useState(false);
  const storageKey = 'sacco-sector-watchlist:'+memberId;
  useEffect(()=>{
    try {
      const value:unknown=JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      setSaved(Array.isArray(value)?groups.filter(g=>value.includes(g.ticker)).map(g=>g.ticker):original);
    } catch {setSaved(original);}
  },[storageKey]);
  function save(tickers:string[]) {
    setSaved(tickers);
    try {localStorage.setItem(storageKey,JSON.stringify(tickers));setSaveError(false);}
    catch {setSaveError(true);}
  }
  function toggle(ticker:string) {save(saved.includes(ticker)?saved.filter(t=>t!==ticker):[...saved,ticker]);}
  function changeView(next:View,sector='') {
    setView(next);
    setParent(sector);
    setSelected('');
    setShowAll(false);
    if(next==='Sectors' && measure==='vs sector') setMeasure('Return');
  }
  const sectorName = sectors.find(g=>g.ticker===parent)?.name;
  const universe = view==='Sectors' ? sectors : view==='My Watchlist'
    ? groups.filter(g=>saved.includes(g.ticker))
    : granular.filter(g=>!parent || g.parents.includes(parent));
  const leaders = frequentLeaders(snapshot,universe);
  function inspect(g:Group, rowKey:string) {
    if(g.kind==='Sector') {
      changeView('Industries & Themes',g.ticker);
      leaderSection.current?.scrollIntoView({block:'start'});
    } else setSelected(selected===rowKey?'':rowKey);
  }
  return <div className="gauge-explorer" onClick={e=>{if(e.target instanceof Element && e.target.closest('button,select,a'))recordMemberEngagement('sector_use');}}>
    <nav className="gx-tabs" aria-label="Gauge views">{views.map(v=><button key={v} aria-pressed={view===v} onClick={()=>changeView(v)}>{v}<small>{v==='Sectors'?11:v==='Industries & Themes'?46:saved.length}</small></button>)}</nav>
    {leaders.length>0 && <section className="gx-lead" ref={leaderSection}><p className="gx-label">Consistent leadership</p><h2>Top {leaders.length}{sectorName ? " in "+sectorName : ""} across six timeframes</h2><p>Most top-seven appearances in {sectorName ? sectorName+' industries and themes' : view==='My Watchlist'?'your watchlist':view.toLowerCase()}. Average rank breaks ties.</p>
      <ol>{leaders.map(({group,periods},i)=><li key={group.ticker}><span className="gx-label">#{i+1} · {group.ticker}</span><strong>{group.name}</strong><small>{periods.length}/6 timeframes · {periods.join(' · ').toUpperCase()}</small></li>)}</ol></section>}
    <section className="gx-board"><div className="gx-head"><div><p className="gx-label">Performance rankings</p><h2>{parent?sectors.find(g=>g.ticker===parent)?.name:view}</h2></div>
    {view==='Industries & Themes'&&<label>Sector filter <select value={parent} onChange={e=>{setParent(e.target.value);setSelected('');}}><option value="">All sectors</option>{sectors.map(g=><option key={g.ticker} value={g.ticker}>{g.name}</option>)}</select></label>}
    {view==='My Watchlist'&&<button onClick={()=>save(original)}>Restore original 24</button>}</div>
    <p>{view==='Sectors'?'Select a sector to see its industries and related themes.':view==='Industries & Themes'?'Select a group for its scope, benchmark and constituent stocks. Ranks and leaders use the selected groups.':'Your selection is saved in this browser. Use the stars to add or remove funds.'}</p>
    {saveError&&<p role="status">Browser storage is unavailable. Your selection will last for this visit.</p>}
    <div className="gx-tools"><label>Compare <select value={measure} onChange={e=>setMeasure(e.target.value)}>
      <option>Return</option><option>vs SPY</option>{view!=='Sectors'&&<option>vs sector</option>}
    </select></label><div><button onClick={()=>setReverse(!reverse)}>{reverse?'Laggards first ↑':'Leaders first ↓'}</button>
    {universe.length>7&&<button aria-pressed={showAll} onClick={()=>setShowAll(!showAll)}>{showAll?'Show seven per card':'Show all '+universe.length}</button>}</div></div>
    {universe.length===0&&<p>Your watchlist is empty. Star a fund in either ranking or restore the original 24.</p>}
    <div className="gx-frames">{universe.length>0&&periodKeys.map(period=>{
  const {current,previous} = periodValues(snapshot,period);
  const ranks = ranking(universe,current);
  const prior = ranking(universe,previous);
  const comparable = ranks.size===prior.size && [...ranks.keys()].every(t=>prior.has(t));
  const rows = [...universe].sort((a,b)=>{
    const ra=ranks.get(a.ticker),rb=ranks.get(b.ticker);
    if(!ra || !rb) return ra?-1:rb?1:a.name.localeCompare(b.name);
    return reverse?rb-ra:ra-rb;
  });
  const frame = snapshot.periods[period];
    return <section key={period} className="gx-frame"><header><h3>{frame.label}</h3><small>SPY {percent(frame.benchmarkReturn)}</small></header>
    <p className="gx-range">{formatDate(frame.startDate)} – {formatDate(frame.endDate)}</p>
    <table><thead><tr><th scope="col">Rank / ETF</th><th scope="col">{measure}</th><th scope="col">Δ rank</th><th scope="col"><span className="sr-only">Watchlist</span></th></tr></thead>
    <tbody>{(showAll?rows:rows.slice(0,7)).map(g=>{
      const rowKey=period+g.ticker;
      const value=current[g.ticker],rank=ranks.get(g.ticker),last=prior.get(g.ticker);
      const change=comparable && rank && last ? last-rank : null;
      const benchmark=parent || g.parents[0];
      const sectorSpread=spread(value,current[benchmark]);
      return <Fragment key={g.ticker}><tr><th scope="row"><button className="gx-name" onClick={()=>inspect(g,rowKey)} aria-expanded={g.kind==='Sector'?undefined:selected===rowKey}><span>{rank??'—'}</span><span>{g.name}<small>{g.ticker} · {g.kind}</small></span></button></th>
      <td className={measure==='Return'&&value!=null?(value>=0?'gx-up':'gx-down'):''}>{measure==='vs SPY'?spread(value,frame.benchmarkReturn):measure==='vs sector'?sectorSpread:value==null?'N/A':percent(value)}</td>
      <td>{change===null?'N/A':change>0?'↑ '+change:change<0?'↓ '+(-change):'—'}</td><td><button className="gx-star" aria-pressed={saved.includes(g.ticker)} aria-label={'Save '+g.ticker+' to watchlist'} onClick={()=>toggle(g.ticker)}>{saved.includes(g.ticker)?'★':'☆'}</button></td></tr>
      {selected===rowKey&&<tr><td colSpan={4} className="gx-detail"><strong>{g.ticker} · {g.scope}</strong><p>{g.note}</p><p>Sector comparison · {benchmark} {sectorSpread}</p><a href={holdings(g.ticker)} target="_blank" rel="noreferrer">View constituent holdings ↗</a>
      {g.ticker==='XAR'&&<p>Alternate ETF · ITA {current.ITA==null?'N/A':percent(current.ITA)} · <a href={holdings('ITA')} target="_blank" rel="noreferrer">ITA holdings ↗</a> · <button onClick={()=>toggle('ITA')}>{saved.includes('ITA')?'Remove ITA from watchlist':'Save ITA'}</button></p>}</td></tr>}</Fragment>;
    })}</tbody></table>
    </section>;})}</div>
    {parent&&<p><a href={holdings(parent)} target="_blank" rel="noreferrer">View {parent} sector holdings ↗</a></p>}
    </section><details className="strength-method"><summary>How the gauge works</summary><div><p>Sector returns come directly from each S&amp;P 500 sector ETF. Industry and theme funds can overlap sectors or invest globally. Open a group for its scope and holdings.</p><p>Returns use Yahoo Finance adjusted closes over six calendar lookbacks. Benchmark differences are in percentage points. Each group uses its first listed sector unless you select another linked sector. Global funds can reflect currency and overseas market effects.</p><p>Rank change compares the same peer set with the week ending {formatDate(snapshot.previousAsOf)}. Missing history is shown as N/A. The gauge measures price performance including distributions. It does not measure ETF cash flows.</p></div></details>
  </div>;
}
