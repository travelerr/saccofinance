export type Masterclass={id:string;title:string;description:string;startsAt:string;status:'scheduled'|'live'|'completed'|'canceled';videoId?:string;thumbnail:string;recordingId?:string;recordingStartSeconds?:number};
// Add future sessions here. Mark completed and supply recordingId once the replay is ready.
// Keep the scheduled stream visible for four hours after its start, even before a manual status update.
// Store ISO timestamps with an explicit offset; display always uses America/New_York.
export const masterclasses:Masterclass[]=[{
 id:'how-i-find-my-next-stock-trade',title:'How I Find My Next Stock Trade',
 description:"Watch the replay of our first Sacco Premium Live Masterclass. I walk through my process for finding potential stock trades, from identifying leading sectors to researching individual companies, evaluating technical setups, and managing risk.",
 startsAt:'2026-11-18T19:00:00-05:00',status:'completed',videoId:'TvkPU-F4Xv0',recordingId:'TvkPU-F4Xv0',recordingStartSeconds:120,
 thumbnail:'/images/premium/masterclasses/finding-my-next-trade-nov18.png',
},{
 id:'december-2026-live-masterclass',title:'December Live Masterclass',
 description:'Join me for our next Sacco Premium live masterclass. Topic and livestream link coming soon.',
 startsAt:'2026-12-17T19:00:00-05:00',status:'scheduled',thumbnail:'',
}];
export const masterclassDate=(value:string)=>new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'long',month:'long',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(value));
export function masterclassLibrary(events:Masterclass[],now=Date.now()){
 const upcoming=events.filter(e=>e.status==='live'||e.status==='scheduled'&&Date.parse(e.startsAt)+4*60*60*1000>=now).sort((a,b)=>Number(b.status==='live')-Number(a.status==='live')||Date.parse(a.startsAt)-Date.parse(b.startsAt))[0];
 const recordings=events.filter(e=>e.status==='completed'&&e.recordingId).sort((a,b)=>Date.parse(b.startsAt)-Date.parse(a.startsAt));
 return {upcoming,recordings};
}
