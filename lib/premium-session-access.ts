import type {SupabaseClient} from '@supabase/supabase-js';
import {hasPremiumAccess} from './premium-membership';
import {billingEnabled,billingMode,hasPaidAccess,type SubscriptionRecord} from './billing/model';
export async function sessionPremiumAccess(client:SupabaseClient,userId:string){
 const {data:grant,error:grantError}=await client.from('premium_memberships').select('enabled,access_expires_at,access_source').eq('user_id',userId).maybeSingle();
 const manualAllowed=!grantError&&grant?.access_source==='manual'&&hasPremiumAccess(grant);
 if(!billingEnabled())return {allowed:Boolean(manualAllowed),manualAllowed:Boolean(manualAllowed),grant,subscriptions:[] as SubscriptionRecord[],unavailable:Boolean(grantError)};
 const{data,error}=await client.from('billing_subscriptions').select('*').eq('access_owner_id',userId).eq('mode',billingMode());
 const subscriptions=(data||[]) as SubscriptionRecord[];
 return {allowed:Boolean(manualAllowed)||(!error&&subscriptions.some(record=>hasPaidAccess(record))),manualAllowed:Boolean(manualAllowed),grant,subscriptions,unavailable:Boolean(error||grantError)};
}
