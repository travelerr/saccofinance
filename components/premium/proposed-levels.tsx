import type {Opportunity} from '@/lib/premium-content';
export default function ProposedLevels({opportunity:o}:{opportunity:Opportunity}){
 if(!o.proposedLevels || o.trade)return null;
 return <aside aria-label="Preliminary trade setup"><p className="opportunity-meta">POTENTIAL SWING TRADE · NOT ENTERED</p><dl className="opportunity-price-grid opportunity-proposed-grid">{o.proposedLevels.map(level=><div key={level.label}><dt>{level.label}</dt><dd>{level.value}</dd></div>)}</dl><p className="opportunity-meta">My preliminary levels may change. No position has been opened.</p></aside>;
}
