import catalog from '@/data/market-strength/catalog.json';
import {periodKeys, type PeriodKey, type StrengthSnapshot} from './market-strength';

export const groups = catalog;
export type Group = typeof groups[number];
export const sectors = groups.filter(g => g.kind === 'Sector');
export const granular = groups.filter(g => g.kind === 'Industry' || g.kind === 'Theme');
export const original = groups.filter(g => g.original).map(g => g.ticker);

export function periodValues(snapshot: StrengthSnapshot, key: PeriodKey) {
  const saved = snapshot.expanded?.[key];
  if (saved) return saved;
  const current: Record<string,number|null> = Object.fromEntries(snapshot.periods[key].rows.map(r => [r.ticker,r.return]));
  return {current, previous: {} as Record<string,number|null>};
}

export function ranking(universe: Group[], values: Record<string,number|null>) {
  const eligible = universe.filter(g => Number.isFinite(values[g.ticker]));
  eligible.sort((a,b) => Number(values[b.ticker])-Number(values[a.ticker]) || a.ticker.localeCompare(b.ticker));
  return new Map(eligible.map((g,i) => [g.ticker,i+1]));
}

export function frequentLeaders(snapshot: StrengthSnapshot, universe: Group[]) {
  const hits = new Map<string,{group:Group; periods:PeriodKey[]; total:number}>();
  for (const key of periodKeys) {
    const ranks = ranking(universe,periodValues(snapshot,key).current);
    for (const group of universe) {
      const rank = ranks.get(group.ticker);
      if (!rank || rank > 7) continue;
      const hit = hits.get(group.ticker) ?? {group,periods:[],total:0};
      hit.periods.push(key);
      hit.total += rank;
      hits.set(group.ticker,hit);
    }
  }
  return [...hits.values()].sort((a,b) => b.periods.length-a.periods.length || a.total/a.periods.length-b.total/b.periods.length || a.group.ticker.localeCompare(b.group.ticker)).slice(0,3);
}
