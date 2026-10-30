import 'server-only';
import {billingServices} from './server';
/** No caching: each new checkout sees the current mode's setting. */
export async function trialOfferDays(){
 try{const {admin,mode}=await billingServices();const {data,error}=await admin.from('premium_trial_settings').select('enabled,trial_days').eq('mode',mode).single();if(error)throw Error('OFFER_UNAVAILABLE');return data.enabled===true&&(data.trial_days===7||data.trial_days===30)?data.trial_days:0;}catch{return 0;}
}
