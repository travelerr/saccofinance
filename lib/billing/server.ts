import {localDevelopment,localStripeEnabled} from '../local-development';
import 'server-only';
import Stripe from 'stripe';
import {createClient} from '@supabase/supabase-js';
import {billingSecrets} from './secrets';
import {billingMode,billingEnabled,type BillingPlan} from './model';
export async function billingServices(){
 if(localDevelopment()&&!localStripeEnabled())throw new Error('LOCAL_CHECKOUT_DISABLED');
 if(!billingEnabled())throw new Error('BILLING_DISABLED');
 const secrets=await billingSecrets();const mode=billingMode();
 if(!secrets.STRIPE_SECRET_KEY?.startsWith(mode==='test'?'sk_test_':'sk_live_')||!secrets.SUPABASE_SECRET_KEY||!process.env.NEXT_PUBLIC_SUPABASE_URL)throw new Error('BILLING_UNAVAILABLE');
 const stripe=new Stripe(secrets.STRIPE_SECRET_KEY,{maxNetworkRetries:2,timeout:20000});
 const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,secrets.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 return {stripe,admin,mode,secrets};
}
export function priceId(plan:BillingPlan){const id=process.env[plan==='monthly'?'STRIPE_MONTHLY_PRICE_ID':'STRIPE_ANNUAL_PRICE_ID'];if(!id?.startsWith('price_'))throw new Error('BILLING_UNAVAILABLE');return id;}
export async function checkedPrice(stripe:Stripe,plan:BillingPlan){
 const price=await stripe.prices.retrieve(priceId(plan));
 if(!price.active||price.livemode!==(billingMode()==='live')||price.currency!=='usd'||price.unit_amount!==(plan==='monthly'?1000:10000)||price.recurring?.interval!==(plan==='monthly'?'month':'year')||price.recurring.interval_count!==1)throw new Error('BILLING_UNAVAILABLE');
 return price;
}
export function authOrigin(){const raw=process.env.AUTH_SITE_URL;if(!raw)throw new Error('BILLING_UNAVAILABLE');const url=new URL(raw);if(url.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('BILLING_UNAVAILABLE');return url.origin;}
