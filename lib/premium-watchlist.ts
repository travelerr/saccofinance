export type WatchlistCandidate={ticker:string;company:string;tentative?:boolean;whyWatching?:string;confirmation?:string;invalidation?:string;researchHref?:string};
export type WatchlistEdition={id:string;date:string;title:string;introduction:string;status:'draft'|'published';candidates:WatchlistCandidate[]};
// Append dated editions instead of rewriting prior member/email snapshots.
// Only add technical claims and levels after Justin supplies or approves the research.
export const watchlistEditions:WatchlistEdition[]=[{
 id:'radar-2026-11-20',date:'2026-11-20',title:'On My Radar — November 20',status:'published',
 introduction:"These are the stocks on my research list right now. I’m sharing the names I’m reviewing while I work through the setups. Inclusion here is not an entry signal or a confirmed trade. I’ll add the conditions and levels as the research develops, and publish a fuller Opportunity Board update when appropriate.",
 candidates:[
 {ticker:'JJSF',company:'J&J Snack Foods'},
 {ticker:'FDS',company:'FactSet Research Systems'},
 {ticker:'UHS',company:'Universal Health Services',researchHref:'/premium/opportunities/universal-health-services-015'},
 {ticker:'STZ',company:'Constellation Brands',tentative:true},
 {ticker:'COCO',company:'The Vita Coco Company'},
 {ticker:'EL',company:'The Estée Lauder Companies'},
 {ticker:'CASY',company:"Casey’s General Stores"},
 {ticker:'BMRN',company:'BioMarin Pharmaceutical'},
 {ticker:'ALKS',company:'Alkermes'},
 {ticker:'GEHC',company:'GE HealthCare Technologies'},
 {ticker:'MDLZ',company:'Mondelez International'},
 {ticker:'UNFI',company:'United Natural Foods'},
 ],
}];
export const publishedWatchlists=()=>watchlistEditions.filter(e=>e.status==='published'&&e.candidates.length>0).sort((a,b)=>b.date.localeCompare(a.date));
