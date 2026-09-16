'use client';
import {useState} from 'react';
import {filterOpportunities,opportunityStatuses,type Opportunity,type OpportunityStatus} from '@/lib/premium-content';
import OpportunityCard,{OpportunityEmptyState} from './opportunity-card';
export default function OpportunityBoard({opportunities}:{opportunities:Opportunity[]}){
 const[view,setView]=useState<'current'|'archive'>('current');const[status,setStatus]=useState<OpportunityStatus|'All'>('All');
 const shown=filterOpportunities(opportunities,view,status);
 const statuses=opportunityStatuses.filter(s=>view==='archive'?s==='Invalidated'||s==='Closed':s!=='Invalidated'&&s!=='Closed');
 return <><div className="opportunity-controls"><div className="actions" role="group" aria-label="Opportunity collection">{(['current','archive'] as const).map(v=><button key={v} className="text-link" aria-pressed={view===v} onClick={()=>{setView(v);setStatus('All');}}>{v==='current'?'Current Opportunities':'Archive'}</button>)}</div><label>Status <select value={status} onChange={e=>setStatus(e.target.value as OpportunityStatus|'All')}><option value="All">All statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></label></div><div aria-live="polite"><p className="opportunity-meta">{shown.length} {view==='archive'?'archived':'current'} {shown.length===1?'opportunity':'opportunities'}</p>{shown.length?<div className="editorial-grid">{shown.map(o=><OpportunityCard key={o.id} opportunity={o}/>)}</div>:!opportunities.length?<OpportunityEmptyState/>:<div className="opportunity-empty"><h3>{status!=='All'?'No opportunities with this status.':view==='archive'?'No archived opportunities yet.':'No current published opportunities.'}</h3><p>{status!=='All'?'Choose another status to explore the reviewed setups.':'Published setups remain accessible in the archive after invalidation or a documented close.'}</p></div>}</div></>;
}
