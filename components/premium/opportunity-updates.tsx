import {premiumDate,type OpportunityUpdate} from '@/lib/premium-content';
export default function OpportunityUpdates({updates}:{updates:OpportunityUpdate[]}){
 return updates.length?<ol className="opportunity-update-list">{updates.map(u=><li key={u.id}><p className="opportunity-meta"><time dateTime={u.publishedAt}>{premiumDate(u.publishedAt)}</time> · {u.statusBefore} → {u.statusAfter}</p><h3>{u.title}</h3><p>{u.explanation}</p></li>)}</ol>:<p>No published opportunity updates yet.</p>;
}
