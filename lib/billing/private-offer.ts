import 'server-only';
import {timingSafeEqual} from 'node:crypto';
import {billingServices} from './server';

export async function validPrivateOffer(token: unknown): Promise<boolean> {
 if(typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token))return false;
 try {
  const {admin,mode}=await billingServices();
  const {data,error}=await admin.from('premium_trial_settings').select('private_offer_enabled,private_offer_token').eq('mode',mode).single();
  const expected=data?.private_offer_token;
  return !error && data?.private_offer_enabled===true && typeof expected==='string' && expected.length===43 && timingSafeEqual(Buffer.from(token),Buffer.from(expected));
 } catch { return false; }
}
