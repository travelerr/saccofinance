import {cancellationScheduled,dateMs,graceEnds,hasPaidAccess,paidAccessEnds,type SubscriptionRecord} from './model';

// Only announce the end of access when no continuing membership supersedes it.
export function cancellationBannerEnd(subscriptions:SubscriptionRecord[],manualAllowed=false,now=Date.now()):string|null{
 if(manualAllowed)return null;
 const accessible=subscriptions.filter(s=>hasPaidAccess(s,now));
 if(!accessible.length||accessible.some(s=>!cancellationScheduled(s)))return null;
 const ends=accessible.map(s=>{
  const end=s.status==='trialing'?dateMs(s.trial_end||null):s.status==='past_due'?dateMs(graceEnds(s)):dateMs(paidAccessEnds(s));
  const cancel=dateMs(s.cancel_at||null);
  return cancel?Math.min(end,cancel):end;
 });
 const end=Math.max(...ends);
 return end>now?new Date(end).toISOString():null;
}
