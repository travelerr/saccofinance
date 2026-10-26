import 'server-only';
import {analyticsAllowed,CONSENT_COOKIE} from '../analytics/policy';
import {cookies,headers} from 'next/headers';
import {createHash} from 'node:crypto';
import {emailDatabase} from '../email/database';
/** Optional first-party attribution cannot interrupt checkout. No email is stored in a cookie. */
export async function recordSampleCheckout(){
 try{
  if(!analyticsAllowed((await cookies()).get(CONSENT_COOKIE)?.value,(await headers()).get('sec-gpc')==='1'))return;
  const token=(await cookies()).get('sf_sample')?.value||'';if(!/^[a-f0-9]{64}$/.test(token))return;
  const db=await emailDatabase();await db.from('premium_sample_leads').update({checkout_started_at:new Date().toISOString()}).eq('token_hash',createHash('sha256').update(token).digest('hex')).eq('analytics_allowed',true).not('confirmed_at','is',null).is('checkout_started_at',null).gt('expires_at',new Date().toISOString());
 }catch{/* A sample analytics failure never blocks payment. */}
}
