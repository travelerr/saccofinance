export type RetentionEvent={id:string;user_id:string;subscription_id:string;action:'cancel'|'keep';reason:string|null;feedback:string|null;subscription_started_at:string;requested_at:string;effective_end:string|null;status:string};
export function retentionSummary(events:RetentionEvent[]){
 const ordered=events.filter(e=>e.status==='confirmed').sort((a,b)=>Date.parse(a.requested_at)-Date.parse(b.requested_at)||a.id.localeCompare(b.id));
 const first=new Map<string,RetentionEvent>();const recovered=new Set<string>();
 for(const e of ordered){if(e.action==='cancel'&&!first.has(e.subscription_id))first.set(e.subscription_id,e);if(e.action==='keep'&&first.has(e.subscription_id))recovered.add(e.subscription_id);}
 const cancellations=[...first.values()];
 const elapsed=(e:RetentionEvent)=>{const n=(Date.parse(e.requested_at)-Date.parse(e.subscription_started_at))/86400000;return Number.isFinite(n)&&n>=0?n:null;};
 const ages=cancellations.map(elapsed).filter((v):v is number=>v!==null).sort((a,b)=>a-b);
 const buckets=[{label:'Under 24 hours',count:0},{label:'1–7 days',count:0},{label:'8–30 days',count:0},{label:'Over 30 days',count:0}];
 for(const age of ages)buckets[age<1?0:age<8?1:age<=30?2:3].count++;
 const reasons:Record<string,number>={};for(const e of cancellations){const key=e.reason||'unknown';reasons[key]=(reasons[key]||0)+1;}
 const median=ages.length?(ages[Math.floor((ages.length-1)/2)]+ages[Math.floor(ages.length/2)])/2:null;
 return {count:cancellations.length,median,buckets,recovered:recovered.size,unknownTiming:cancellations.length-ages.length,reasons,details:cancellations.reverse().slice(0,100).map(e=>({...e,days:elapsed(e),recovered:recovered.has(e.subscription_id)}))};
}
