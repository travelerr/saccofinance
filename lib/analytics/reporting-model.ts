import {cancellationScheduled,hasPaidAccess,type SubscriptionRecord} from '../billing/model';
import {hasPremiumAccess,type Membership} from '../premium-membership';
export type ReportingDays=7|28|90;
export function reportingDays(value:unknown):ReportingDays{return value==='7'?7:value==='90'?90:28;}
export const milestoneLabels:Record<string,string>={premium_landing_view:'Premium landing views',subscribe_click:'Subscribe clicks',join_view:'Join page views',checkout_requested:'Checkout requests',checkout_error:'Checkout errors',purchase:'Paid checkouts',account_claimed:'Accounts claimed',research_view:'Research views',research_engaged:'Engaged reads',notification_preference_saved:'Preference changes'};
export function reportDefinitions(days:ReportingDays){
 const base={dateRanges:[{startDate:`${days}daysAgo`,endDate:'yesterday'}],currencyCode:'USD',limit:20};
 const report=(dimensions:string[],metrics:string[],extra:Record<string,unknown>={})=>({...base,dimensions:dimensions.map(name=>({name})),metrics:metrics.map(name=>({name})),...extra});
 return {
  overview:report([],['totalUsers','sessions','screenPageViews','ecommercePurchases']),
  sources:report(['sessionSource','sessionMedium'],['sessions','ecommercePurchases'],{orderBys:[{metric:{metricName:'sessions'},desc:true}]}),
  milestones:report(['eventName'],['eventCount','totalUsers'],{dimensionFilter:{filter:{fieldName:'eventName',inListFilter:{values:Object.keys(milestoneLabels)}}}}),
  content:report(['pagePath'],['screenPageViews','totalUsers'],{dimensionFilter:{filter:{fieldName:'pagePath',stringFilter:{matchType:'FULL_REGEXP',value:'/premium/(issue-[0-9]+|opportunities/[^/]+)'}}},orderBys:[{metric:{metricName:'screenPageViews'},desc:true}]}),
  devices:report(['deviceCategory'],['sessions'],{orderBys:[{metric:{metricName:'sessions'},desc:true}]}),
  daily:report(['date'],['sessions'],{limit:90,orderBys:[{dimension:{dimensionName:'date'}}]})
 };
}
export type ReportName=keyof ReturnType<typeof reportDefinitions>;
export type ReportRow={dimensions:string[];metrics:number[]};
export type Report={rows:ReportRow[];limited:boolean;qualified:boolean};
export function parseReport(value:unknown,dimensions:number,metrics:number):Report{
 if(!value||typeof value!=='object')throw Error('INVALID_REPORT');
 const data=value as {rows?:{dimensionValues?:{value:string}[];metricValues?:{value:string}[]}[];rowCount?:number;metadata?:{subjectToThresholding?:boolean;dataLossFromOtherRow?:boolean;samplingMetadatas?:unknown[]}};
 if(data.rows!==undefined&&!Array.isArray(data.rows))throw Error('INVALID_REPORT');
 const rows=(data.rows||[]).map(row=>{
  const d=row.dimensionValues||[];const m=row.metricValues||[];
  if(d.length!==dimensions||m.length!==metrics||d.some(v=>typeof v.value!=='string')||m.some(v=>typeof v.value!=='string'||!v.value.trim()||!Number.isFinite(Number(v.value))))throw Error('INVALID_REPORT');
  return {dimensions:d.map(v=>v.value),metrics:m.map(v=>Number(v.value))};
 });
 return {rows,limited:(data.rowCount||0)>rows.length,qualified:Boolean(data.metadata?.subjectToThresholding||data.metadata?.dataLossFromOtherRow||data.metadata?.samplingMetadatas?.length)};
}
export type MemberRow=Membership&{user_id:string;access_source:string};
export type SubscriptionRow=SubscriptionRecord&{access_owner_id:string};
export type PreferenceRow={user_id:string;enabled:boolean};
export function memberSummary(members:MemberRow[],subscriptions:SubscriptionRow[],preferences:PreferenceRow[],now=Date.now()){
 const paid=subscriptions.filter(row=>hasPaidAccess(row,now));
 const paidOwners=new Set(paid.map(row=>row.access_owner_id));
 const owners=new Set([...paidOwners,...members.filter(row=>row.access_source==='manual'&&hasPremiumAccess(row,now)).map(row=>row.user_id)]);
 const prefs=new Map(preferences.map(row=>[row.user_id,row.enabled]));
 let on=0,off=0,unset=0;for(const owner of owners){if(!prefs.has(owner))unset++;else if(prefs.get(owner))on++;else off++;}
 return {members:owners.size,paidMembers:paidOwners.size,paidSubscriptions:paid.length,canceling:paid.filter(cancellationScheduled).length,pastDue:subscriptions.filter(row=>row.status==='past_due').length,on,off,unset};
}
