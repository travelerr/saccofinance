import WeeklyOutlookResearch from '@/components/premium/weekly-outlook';
import Link from 'next/link';
import {emailDatabase} from '@/lib/email/database';
import {sampleEnabled,sampleHash} from '@/lib/sample/server';
import type {SampleSnapshot} from '@/lib/sample/content';
import {confirmSample} from './actions';
import Submit from '@/components/premium/submit';
import styles from '../../sales.module.css';
export const dynamic='force-dynamic';
export const metadata={title:'Your Premium sample',robots:{index:false,follow:false},referrer:'no-referrer'};
export default async function Sample({params}:{params:Promise<{token:string}>}){
 const {token}=await params;let row;
 try{if(!sampleEnabled())throw Error();const {data,error}=await (await emailDatabase()).from('premium_sample_leads').select('snapshot,confirmed_at,marketing_requested,unsubscribed_at,expires_at').eq('token_hash',sampleHash(token)).maybeSingle();if(error)throw error;row=data;}catch{row=null;}
 if(!row||Date.parse(row.expires_at)<=Date.now())return <main className={`container ${styles.samplePage}`}><h1>This sample link is unavailable.</h1><p>Use the private link from your sample email. Links expire after 30 days.</p><Link href="/premium">Explore Sacco Premium</Link></main>;
 const sample=row.snapshot as SampleSnapshot;
 return <main className={`container ${styles.samplePage}`}><Link href="/premium">← Sacco Premium</Link><p className="eyebrow">Your complete past Weekly Outlook · Week of {sample.weekOf}</p>{!row.confirmed_at?<><h1>{sample.title}</h1><p>Your sample is ready. Confirm your email to open it.</p><p>{row.marketing_requested&&!row.unsubscribed_at?'You also chose occasional Premium updates and offers. You can unsubscribe from any email.':'This does not subscribe you to marketing emails.'}</p><form action={confirmSample}><input type="hidden" name="token" value={token}/><Submit>Confirm email & read my sample</Submit></form></>:<><p className={styles.sampleNotice}>This is a full past issue, preserved when you requested it. Prices, positions, events, and promotions are historical and may have changed. Links to other member research require a subscription.</p><WeeklyOutlookResearch outlook={sample.outlook} sampleOpportunities={sample.opportunities}/><section><h2>Go deeper with Premium.</h2><p>Get each new Weekly Outlook, the archive, Sector Gauge, Opportunity Board with dated updates, and Learning Library.</p><Link className="button" href="/premium#pricing">Choose your Premium plan</Link></section><p className={styles.micro}>This sample reflects the issue date shown above, not live market information. Educational and informational research, not personalized investment advice. Investing involves risk, including loss of principal.</p></>}</main>;
}
