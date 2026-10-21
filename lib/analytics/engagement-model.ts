import type {RetentionEvent} from './retention-model';
export type EngagementCohort={user_id:string;subscription_id:string;started_at:string;eligible:boolean};
export type EngagementDay={user_id:string;day_index:number;activity:string};
export function engagementSummary(cohorts:EngagementCohort[],days:EngagementDay[],events:RetentionEvent[],trackingStart:string,now=Date.now()){
 const eligible=cohorts.filter(c=>c.eligible&&Date.parse(c.started_at)>=Date.parse(trackingStart)&&Date.parse(c.started_at)<=now);
 const mature=eligible.filter(c=>now-Date.parse(c.started_at)>=30*86400000);
 const records=mature.map(c=>{const activity=days.filter(d=>d.user_id===c.user_id);return {activity,observed:activity.length>0,canceled:events.some(e=>e.subscription_id===c.subscription_id&&e.action==='cancel'&&e.status==='confirmed'&&Date.parse(e.requested_at)>=Date.parse(c.started_at)&&Date.parse(e.requested_at)<=Date.parse(c.started_at)+30*86400000)};});
 const actions=[['Opened dashboard',(d:EngagementDay[])=>d.some(e=>e.activity==='dashboard')],['Viewed an Opportunity',(d:EngagementDay[])=>d.some(e=>e.activity==='opportunity')],['Viewed Sector Gauge',(d:EngagementDay[])=>d.some(e=>e.activity==='sector_view')],['Used Sector Gauge controls',(d:EngagementDay[])=>d.some(e=>e.activity==='sector_use')],['Returned on another day',(d:EngagementDay[])=>new Set(d.map(e=>e.day_index)).size>=2]] as const;
 const firstWeek=eligible.filter(c=>now-Date.parse(c.started_at)>=7*86400000);
 const firstWeekObserved=firstWeek.filter(c=>days.some(d=>d.user_id===c.user_id));
 const firstWeekActions=actions.map(([label,test])=>({label,count:firstWeekObserved.filter(c=>test(days.filter(d=>d.user_id===c.user_id))).length}));
 const group=(r:typeof records)=>({members:r.length,cancellations:r.filter(e=>e.canceled).length});
 return {firstWeekComplete:firstWeek.length,firstWeekObserved:firstWeekObserved.length,firstWeekActions,trackingStart,enrolled:eligible.length,pending:eligible.length-mature.length,mature:mature.length,unobserved:records.filter(r=>!r.observed).length,comparisons:actions.map(([label,test])=>({label,withAction:group(records.filter(r=>r.observed&&test(r.activity))),withoutAction:group(records.filter(r=>r.observed&&!test(r.activity)))}))};
}
