/** Editorial records only. Statuses are never inferred from prices or scanner results. */
export const opportunityStatuses=['Watching','Developing','Confirmed','Active','Invalidated','Closed'] as const;
export type OpportunityStatus=typeof opportunityStatuses[number];
export type PublicationState='draft'|'published'|'archived';
export type TradeEntry={enteredAt:string;entryPrice?:number;entryType?:'accumulation';documentation:string;quantity?:number;stopPrice?:number;firstTargetPrice?:number};
export type TradeExit={exitedAt:string;exitPrice:number;documentation:string};
type OpportunityLifecycle=
 | {tradeStatus:'Watching'|'Developing'|'Confirmed'|'Invalidated';trade?:TradeEntry}
 | {tradeStatus:'Active';trade:TradeEntry}
 | {tradeStatus:'Closed';trade:TradeEntry & TradeExit};
export type OpportunityChart={src:string;asOf?:string;alt:string;caption?:string;width?:number;height?:number;placement?:'origin'|'setup'|'framework'|'confirmation';source?:string};
export type Opportunity={
 id:string;slug:string;ticker:string;company:string;title:string;
 publicationState:PublicationState;publishedAt:string;updatedAt:string;addedToArchiveAt?:string;researchPublishedAt?:string;
 sector:string;etfTickers?:string[];technicalStage:string|null;whySurfaced:string;
 setupThesis:string;nextCondition:string;fundamentalCase:string;
 companyNote?:string;discoveryLabel?:string;preferredAddZone?:string;fundamentalHeading?:string;technicalConfirmation?:string;
 summary?:string;nextStepSummary?:string;discoveryChain?:string[];primaryRisks?:{title:string;explanation:string}[];
 confirmation?:string;entryFramework?:string;secondaryEntry?:string;
 setupRange?:string;nextAreaToWatch?:string;riskInvalidation?:string;targets?:string[];catalysts?:string[];
 thesisChanges:string;justinsTake:string;chart?:OpportunityChart;charts?:OpportunityChart[];
} & OpportunityLifecycle;
export type OpportunityUpdate={
 id:string;opportunityId:string;publishedAt:string;publicationState:PublicationState;
 eventDate?:string;tradeStatusBefore:OpportunityStatus|null;title:string;explanation:string;technicalStage?:string;
} & ({tradeStatusAfter:Exclude<OpportunityStatus,'Active'|'Closed'>;trade?:never}
 | {tradeStatusAfter:'Active';trade:TradeEntry}
 | {tradeStatusAfter:'Closed';trade:TradeEntry & TradeExit});
export type WeeklyOutlook={
 id:string;slug:string;title:string;weekOf:string;publishedAt:string;
 publicationState:PublicationState;marketContext:string;thesisChanges?:string;
 sectorFocus:string;gamePlan:string;opportunityIds:string[];videoUrl?:string;perspectiveDate?:string;summary?:string;
 weekEnd?:string;read?:string;marketPosture?:string;
 marketLevels?:{index:string;support:number}[];
 sectorAreas?:{classification:string;area:string}[];
 opportunityCommentary?:{opportunityId:string;body:string}[];
 historicalContext?:string;events?:{day:string;title:string;description:string;relevance?:string}[];
 sources?:{label:string;url:string}[];
};
const text=(value:unknown):value is string=>typeof value==='string'&&value.trim().length>0;
const date=(value:unknown)=>text(value)&&Number.isFinite(Date.parse(value));
function hasEntry(trade:TradeEntry|undefined){return Boolean(trade&&date(trade.enteredAt)&&((typeof trade.entryPrice==='number'&&Number.isFinite(trade.entryPrice)&&trade.entryPrice>0)||(trade.entryType==='accumulation'&&trade.entryPrice===undefined))&&text(trade.documentation));}
function hasExit(trade:(TradeEntry & Partial<TradeExit>)|undefined){return Boolean(hasEntry(trade)&&trade&&date(trade.exitedAt)&&Number.isFinite(trade.exitPrice)&&Number(trade.exitPrice)>0&&Date.parse(trade.exitedAt!)>=Date.parse(trade.enteredAt));}
export function isPublishableOpportunity(record:Opportunity):boolean{
 const required=[record.id,record.slug,record.ticker,record.company,record.title,record.sector,record.whySurfaced,record.setupThesis,record.nextCondition,record.fundamentalCase,record.thesisChanges,record.justinsTake];
 return record.publicationState==='published'&&required.every(text)&&(record.technicalStage===null||text(record.technicalStage))&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)&&date(record.publishedAt)&&date(record.updatedAt)&&Date.parse(record.updatedAt)>=Date.parse(record.publishedAt)&&opportunityStatuses.includes(record.tradeStatus)&&
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
 return records.filter(record=>record.opportunityId===id&&record.publicationState==='published'&&date(record.publishedAt)&&(record.eventDate===undefined||(date(record.eventDate)&&Date.parse(record.eventDate)<=Date.parse(record.publishedAt)))&&text(record.id)&&text(record.title)&&text(record.explanation)&&(record.tradeStatusBefore===null||opportunityStatuses.includes(record.tradeStatusBefore))&&opportunityStatuses.includes(record.tradeStatusAfter)&&
  (record.tradeStatusAfter!=='Active'||hasEntry(record.trade))&&(record.tradeStatusAfter!=='Closed'||hasExit(record.trade)))
  .sort((a,b)=>(a.eventDate||a.publishedAt).localeCompare(b.eventDate||b.publishedAt));
}
export function premiumDate(value:string){return new Date(value.length===10?value+'T12:00:00Z':value).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});}

export function weeklyOutlookHref(outlook:WeeklyOutlook){
 const issue=outlook.id.match(/-(\d+)$/)?.[1];
 return issue?`/premium/issue-${issue}`:'/premium/weekly-outlook';
}
