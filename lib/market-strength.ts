export type PeriodKey = '1w' | '1m' | '3m' | '6m' | '9m' | '12m';
export type StrengthRow = {ticker:string;name:string;return:number;relative:number;rank:number;rankChange:number};
export type StrengthPeriod = {label:string;startDate:string;endDate:string;benchmarkReturn:number;rows:StrengthRow[]};
export type StrengthSnapshot = {schemaVersion:number;source:string;generatedAt:string;checkedDate:string;asOf:string;previousAsOf:string;fundCount:number;benchmark:string;periods:Record<PeriodKey,StrengthPeriod>};
export const periodKeys:PeriodKey[]=['1w','1m','3m','6m','9m','12m'];
export function formatDate(value:string){return new Date(value+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});}
export function percent(value:number){return `${value>0?'+':''}${value.toFixed(2)}%`;}

export function recurringLeaders(snapshot:StrengthSnapshot){
 const leaders=new Map<string,{ticker:string;name:string;periods:PeriodKey[];rankTotal:number;averageRank:number}>();
 for(const key of periodKeys){
  for(const row of [...snapshot.periods[key].rows].sort((a,b)=>a.rank-b.rank).slice(0,7)){
   const leader=leaders.get(row.ticker)??{ticker:row.ticker,name:row.name,periods:[],rankTotal:0,averageRank:0};
   leader.periods.push(key);
   leader.rankTotal+=row.rank;
   leader.averageRank=leader.rankTotal/leader.periods.length;
   leaders.set(row.ticker,leader);
  }
 }
 return [...leaders.values()].sort((a,b)=>b.periods.length-a.periods.length||a.averageRank-b.averageRank||a.ticker.localeCompare(b.ticker)).slice(0,3);
}
