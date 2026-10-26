import type {WeeklyOutlook,Opportunity} from '../premium-content';
export type SampleSnapshot={issueId:string;title:string;weekOf:string;outlook:WeeklyOutlook;opportunities:Opportunity[]};
/** Use a completed market week in New York. Never unlock the current week's issue. */
export function latestSample(issues:WeeklyOutlook[],now=Date.now()):SampleSnapshot{
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 const issue=issues.filter(i=>i.publicationState==='published'&&Date.parse(i.publishedAt)<=now&&(i.weekEnd||new Date(Date.parse(i.weekOf+'T12:00:00Z')+4*86400000).toISOString().slice(0,10))<today).sort((a,b)=>b.weekOf.localeCompare(a.weekOf))[0];
 if(!issue)throw Error('SAMPLE_UNAVAILABLE');
 return {issueId:issue.id,title:issue.title,weekOf:issue.weekOf,outlook:structuredClone(issue),opportunities:[]};
}
export function normalizeSampleEmail(value:unknown){const email=typeof value==='string'?value.trim().toLowerCase():'';if(email.length>254||!/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(email))throw Error('INVALID_EMAIL');return email;}
