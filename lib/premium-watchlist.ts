export type WatchlistCandidate={ticker:string;company:string;tentative?:boolean;chart?:{name:string;width:number;height:number};whyWatching?:string;confirmation?:string;invalidation?:string;researchHref?:string};
export type WatchlistEdition={id:string;date:string;title:string;introduction:string;status:'draft'|'published';candidates:WatchlistCandidate[]};
// Append dated editions instead of rewriting prior member/email snapshots.
// Only add technical claims and levels after Justin supplies or approves the research.
export const watchlistEditions:WatchlistEdition[]=[{
 id:'radar-2026-11-20',date:'2026-11-20',title:'On My Radar — November 20',status:'published',
 introduction:"These are the stocks on my research list right now. I’m sharing the names I’m reviewing while I work through the setups. Inclusion here is not an entry signal or a confirmed trade. I’ll add the conditions and levels as the research develops, and publish a fuller Opportunity Board update when appropriate.",
 candidates:[
 {ticker:'JJSF',chart:{name:'jjsf-watchlist-2026-11-20',width:2674,height:1872},company:'J&J Snack Foods'},
 {ticker:'FDS',chart:{name:'fds-watchlist-2026-11-20',width:2674,height:1872},company:'FactSet Research Systems'},
 {ticker:'UHS',chart:{name:'uhs-watchlist-2026-11-20',width:2674,height:1872},company:'Universal Health Services',researchHref:'/premium/opportunities/universal-health-services-015'},
 {ticker:'STZ',chart:{name:'stz-watchlist-2026-11-20',width:2674,height:1872},company:'Constellation Brands',tentative:true},
 {ticker:'COCO',chart:{name:'coco-watchlist-2026-11-20',width:2674,height:1872},company:'The Vita Coco Company'},
 {ticker:'EL',chart:{name:'el-watchlist-2026-11-20',width:2674,height:1872},company:'The Estée Lauder Companies'},
 {ticker:'CASY',chart:{name:'casy-watchlist-2026-11-20',width:3286,height:1872},company:"Casey’s General Stores"},
 {ticker:'BMRN',chart:{name:'bmrn-watchlist-2026-11-20',width:3286,height:1872},company:'BioMarin Pharmaceutical'},
 {ticker:'ALKS',chart:{name:'alks-watchlist-2026-11-20',width:3286,height:1872},company:'Alkermes'},
 {ticker:'GEHC',chart:{name:'gehc-watchlist-2026-11-20',width:3286,height:1872},company:'GE HealthCare Technologies'},
 {ticker:'MDLZ',chart:{name:'mdlz-watchlist-2026-11-20',width:3286,height:1872},company:'Mondelez International'},
 {ticker:'UNFI',chart:{name:'unfi-watchlist-2026-11-20',width:3286,height:1872},company:'United Natural Foods'},
 ],
}];
export const publishedWatchlists=()=>watchlistEditions.filter(e=>e.status==='published'&&e.candidates.length>0).sort((a,b)=>b.date.localeCompare(a.date));
export const watchlistStockHref=(editionId:string,ticker:string)=>'/premium/watchlist/'+encodeURIComponent(editionId)+'/'+encodeURIComponent(ticker.toLowerCase());
export function findWatchlistStock(editionId:string,ticker:string){
 const edition=publishedWatchlists().find(e=>e.id===editionId);
 const stock=edition?.candidates.find(s=>s.ticker.toLowerCase()===ticker.toLowerCase());
 return edition&&stock?{edition,stock}:undefined;
}
