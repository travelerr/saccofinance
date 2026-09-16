import 'server-only';
import {getPublishedOpportunities as selectPublished,getPublishedOpportunity as selectOpportunity,getOpportunityUpdates as selectUpdates,type Opportunity,type OpportunityUpdate,type WeeklyOutlook} from './premium-content';
// ZS will be added only after separately verified research is approved.
export const opportunities:Opportunity[]=[];
export const opportunityUpdates:OpportunityUpdate[]=[];
export const weeklyOutlooks:WeeklyOutlook[]=[];
export function getPublishedOpportunities(){return selectPublished(opportunities);}
export function getPublishedOpportunity(slug:string){return selectOpportunity(slug,opportunities);}
export function getOpportunityUpdates(id:string){return selectUpdates(id,opportunityUpdates);}
export function getRecentOpportunityUpdates(limit=3){
 return getPublishedOpportunities().flatMap(opportunity=>getOpportunityUpdates(opportunity.id).map(update=>({opportunity,update})))
  .sort((a,b)=>b.update.publishedAt.localeCompare(a.update.publishedAt)).slice(0,limit);
}
