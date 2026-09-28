import type {WeeklyOutlook,Opportunity,OpportunityUpdate} from '../premium-content';
import {weeklyOutlookHref,getPublishedOpportunities,getOpportunityUpdates} from '../premium-content';
export const notificationTypes=['WEEKLY_OUTLOOK_PUBLISHED','OPPORTUNITY_PUBLISHED','OPPORTUNITY_MATERIAL_UPDATE'] as const;
export type ResearchEvent={publishedAt:string;key:string;type:typeof notificationTypes[number];entityId:string;updateId:string|null;subject:string;headline:string;summary:string;label:string;cta:string;path:string;details:string[]};
export function researchEvents(outlooks:WeeklyOutlook[],opportunities:Opportunity[],updates:OpportunityUpdate[]):ResearchEvent[]{
 const events:ResearchEvent[]=outlooks.filter(o=>o.publicationState==='published').map(o=>({publishedAt:o.publishedAt,key:'WEEKLY_OUTLOOK_PUBLISHED:'+o.id,type:'WEEKLY_OUTLOOK_PUBLISHED',entityId:o.id,updateId:null,subject:'New Weekly Outlook: '+o.title,headline:o.title,summary:o.notificationSummary||o.summary||'',label:'NEW WEEKLY OUTLOOK',cta:'READ THE WEEKLY OUTLOOK',path:weeklyOutlookHref(o),details:[]}));
 for(const o of getPublishedOpportunities(opportunities)){
  if(o.positionOrigin!=='Legacy')events.push({publishedAt:o.publishedAt,key:'OPPORTUNITY_PUBLISHED:'+o.id,type:'OPPORTUNITY_PUBLISHED',entityId:o.id,updateId:null,subject:'New Sacco Premium Opportunity: '+o.ticker,headline:o.company+' / '+o.ticker,summary:o.summary||'',label:'NEW OPPORTUNITY',cta:'VIEW THE OPPORTUNITY',path:'/premium/opportunities/'+o.slug,details:[o.tradeStatus,...(o.technicalStage?[o.technicalStage]:[])]});
  for(const u of getOpportunityUpdates(o.id,updates).filter(u=>!u.suppressNotification))events.push({publishedAt:u.publishedAt,key:'OPPORTUNITY_MATERIAL_UPDATE:'+o.id+':'+u.id,type:'OPPORTUNITY_MATERIAL_UPDATE',entityId:o.id,updateId:u.id,subject:u.notification?.subject||'Opportunity Update: '+o.ticker,headline:u.notification?.headline||o.company+' / '+o.ticker,summary:u.notification?.summary||u.explanation,label:'OPPORTUNITY UPDATE',cta:u.notification?.cta||'VIEW FULL UPDATE',path:'/premium/opportunities/'+o.slug,details:[u.title]});
 }
 return events.sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)||a.key.localeCompare(b.key));
}
