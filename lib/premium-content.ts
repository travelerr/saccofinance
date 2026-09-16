/** Editorial records only. Statuses are never inferred from prices or scanner results. */
export const opportunityStatuses=['Watching','Developing','Confirmed','Active','Invalidated','Closed'] as const;
export type OpportunityStatus=typeof opportunityStatuses[number];
export type PublicationState='draft'|'published'|'archived';
export type TradeEntry={enteredAt:string;entryPrice:number;documentation:string;quantity?:number;stopPrice?:number;firstTargetPrice?:number};
export type TradeExit={exitedAt:string;exitPrice:number;documentation:string};
type OpportunityLifecycle=
 | {tradeStatus:'Watching'|'Developing'|'Confirmed'|'Invalidated';trade?:TradeEntry}
 | {tradeStatus:'Active';trade:TradeEntry}
 | {tradeStatus:'Closed';trade:TradeEntry & TradeExit};
export type Opportunity={
 id:string;slug:string;ticker:string;company:string;title:string;
 publicationState:PublicationState;publishedAt:string;updatedAt:string;
 sector:string;etfTickers?:string[];technicalStage:string;whySurfaced:string;
 setupThesis:string;nextCondition:string;fundamentalCase:string;
 summary?:string;nextStepSummary?:string;discoveryChain?:string[];primaryRisks?:{title:string;explanation:string}[];
 confirmation?:string;entryFramework?:string;secondaryEntry?:string;
 riskInvalidation?:string;targets?:string[];catalysts?:string[];
 thesisChanges:string;justinsTake:string;chart?:{src:string;asOf:string;alt:string};
} & OpportunityLifecycle;
export type OpportunityUpdate={
 id:string;opportunityId:string;publishedAt:string;publicationState:PublicationState;
 tradeStatusBefore:OpportunityStatus|null;title:string;explanation:string;technicalStage?:string;
} & ({tradeStatusAfter:Exclude<OpportunityStatus,'Active'|'Closed'>;trade?:never}
 | {tradeStatusAfter:'Active';trade:TradeEntry}
 | {tradeStatusAfter:'Closed';trade:TradeEntry & TradeExit});
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
 const required=[record.id,record.slug,record.ticker,record.company,record.title,record.sector,record.technicalStage,record.whySurfaced,record.setupThesis,record.nextCondition,record.fundamentalCase,record.thesisChanges,record.justinsTake];
 return record.publicationState==='published'&&required.every(text)&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)&&date(record.publishedAt)&&date(record.updatedAt)&&Date.parse(record.updatedAt)>=Date.parse(record.publishedAt)&&opportunityStatuses.includes(record.tradeStatus)&&
  (record.tradeStatus!=='Active'||hasEntry(record.trade))&&(record.tradeStatus!=='Closed'||hasExit(record.trade));
}
export function getPublishedOpportunities(records:Opportunity[]){
 return records.filter(isPublishableOpportunity).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
}
export function getPublishedOpportunity(slug:string,records:Opportunity[]){return getPublishedOpportunities(records).find(record=>record.slug===slug);}
export function isCurrentOpportunity(record:Opportunity){return record.tradeStatus!=='Invalidated'&&record.tradeStatus!=='Closed';}
export function filterOpportunities(records:Opportunity[],view:'current'|'archive',tradeStatus:OpportunityStatus|'All'){
 return records.filter(record=>(view==='current'?isCurrentOpportunity(record):!isCurrentOpportunity(record))&&(tradeStatus==='All'||record.tradeStatus===tradeStatus));
}
export function getOpportunityUpdates(id:string,records:OpportunityUpdate[]){
 return records.filter(record=>record.opportunityId===id&&record.publicationState==='published'&&date(record.publishedAt)&&text(record.id)&&text(record.title)&&text(record.explanation)&&(record.tradeStatusBefore===null||opportunityStatuses.includes(record.tradeStatusBefore))&&opportunityStatuses.includes(record.tradeStatusAfter)&&
  (record.tradeStatusAfter!=='Active'||hasEntry(record.trade))&&(record.tradeStatusAfter!=='Closed'||hasExit(record.trade)))
  .sort((a,b)=>a.publishedAt.localeCompare(b.publishedAt));
}
export function premiumDate(value:string){return new Date(value.length===10?value+'T12:00:00Z':value).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});}
