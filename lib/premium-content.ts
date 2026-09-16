/** Editorial records only. Statuses are never inferred from prices or scanner results. */
export const opportunityStatuses=['Watching','Developing','Confirmed','Active','Invalidated','Closed'] as const;
export type OpportunityStatus=typeof opportunityStatuses[number];
export type PublicationState='draft'|'published'|'archived';
export type TradeEntry={enteredAt:string;entryPrice:number;documentation:string;quantity?:number};
export type TradeExit={exitedAt:string;exitPrice:number;documentation:string};
type OpportunityLifecycle=
 | {status:'Watching'|'Developing'|'Confirmed'|'Invalidated';trade?:TradeEntry}
 | {status:'Active';trade:TradeEntry}
 | {status:'Closed';trade:TradeEntry & TradeExit};
export type Opportunity={
 id:string;slug:string;ticker:string;company:string;title:string;
 publicationState:PublicationState;publishedAt:string;updatedAt:string;
 sector:string;etfTickers?:string[];stage:string;whySurfaced:string;
 setupThesis:string;nextCondition:string;fundamentalCase:string;
 confirmation?:string;entryFramework?:string;secondaryEntry?:string;
 riskInvalidation?:string;targets?:string[];catalysts?:string[];
 thesisChanges:string;justinsTake:string;chart?:{src:string;asOf:string;alt:string};
} & OpportunityLifecycle;
export type OpportunityUpdate={
 id:string;opportunityId:string;publishedAt:string;publicationState:PublicationState;
 statusBefore:OpportunityStatus;title:string;explanation:string;
} & ({statusAfter:Exclude<OpportunityStatus,'Active'|'Closed'>;trade?:never}
 | {statusAfter:'Active';trade:TradeEntry}
 | {statusAfter:'Closed';trade:TradeEntry & TradeExit});
export type WeeklyOutlook={
 id:string;slug:string;title:string;weekOf:string;publishedAt:string;
 publicationState:PublicationState;marketContext:string;thesisChanges:string;
 sectorFocus:string;gamePlan:string;opportunityIds:string[];videoUrl?:string;
};
const text=(value:unknown):value is string=>typeof value==='string'&&value.trim().length>0;
const date=(value:unknown)=>text(value)&&Number.isFinite(Date.parse(value));
function hasEntry(trade:TradeEntry|undefined){return Boolean(trade&&date(trade.enteredAt)&&Number.isFinite(trade.entryPrice)&&trade.entryPrice>0&&text(trade.documentation));}
function hasExit(trade:(TradeEntry & Partial<TradeExit>)|undefined){return Boolean(hasEntry(trade)&&trade&&date(trade.exitedAt)&&Number.isFinite(trade.exitPrice)&&Number(trade.exitPrice)>0&&Date.parse(trade.exitedAt!)>=Date.parse(trade.enteredAt));}
export function isPublishableOpportunity(record:Opportunity):boolean{
 const required=[record.id,record.slug,record.ticker,record.company,record.title,record.sector,record.stage,record.whySurfaced,record.setupThesis,record.nextCondition,record.fundamentalCase,record.thesisChanges,record.justinsTake];
 return record.publicationState==='published'&&required.every(text)&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)&&date(record.publishedAt)&&date(record.updatedAt)&&Date.parse(record.updatedAt)>=Date.parse(record.publishedAt)&&opportunityStatuses.includes(record.status)&&
  (record.status!=='Active'||hasEntry(record.trade))&&(record.status!=='Closed'||hasExit(record.trade));
}
export function getPublishedOpportunities(records:Opportunity[]){
 return records.filter(isPublishableOpportunity).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
}
export function getPublishedOpportunity(slug:string,records:Opportunity[]){return getPublishedOpportunities(records).find(record=>record.slug===slug);}
export function isCurrentOpportunity(record:Opportunity){return record.status!=='Invalidated'&&record.status!=='Closed';}
export function filterOpportunities(records:Opportunity[],view:'current'|'archive',status:OpportunityStatus|'All'){
 return records.filter(record=>(view==='current'?isCurrentOpportunity(record):!isCurrentOpportunity(record))&&(status==='All'||record.status===status));
}
export function getOpportunityUpdates(id:string,records:OpportunityUpdate[]){
 return records.filter(record=>record.opportunityId===id&&record.publicationState==='published'&&date(record.publishedAt)&&text(record.id)&&text(record.title)&&text(record.explanation)&&opportunityStatuses.includes(record.statusBefore)&&opportunityStatuses.includes(record.statusAfter)&&
  (record.statusAfter!=='Active'||hasEntry(record.trade))&&(record.statusAfter!=='Closed'||hasExit(record.trade)))
  .sort((a,b)=>a.publishedAt.localeCompare(b.publishedAt));
}
export function premiumDate(value:string){return new Date(value.length===10?value+'T12:00:00Z':value).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});}
