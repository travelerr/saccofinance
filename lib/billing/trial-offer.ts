import 'server-only';
import {billingServices} from './server';
/** No caching: each new checkout sees the current mode's setting. */
export async function trialOfferEnabled(){
 try{const {admin,mode}=await billingServices();const {data,error}=await admin.from('premium_trial_settings').select('enabled').eq('mode',mode).single();if(error)throw Error('OFFER_UNAVAILABLE');return data.enabled===true;}catch{return false;}
}
