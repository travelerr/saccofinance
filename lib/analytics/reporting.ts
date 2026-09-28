import 'server-only';
import {billingSecrets} from '../billing/secrets';
import {requireAnalyticsAdmin} from './admin';
import {createReportingClient} from './reporting-client';
import type {ReportingDays} from './reporting-model';
const load=createReportingClient();
export async function googleReporting(days:ReportingDays){
 await requireAnalyticsAdmin();
 // Local work never retrieves cloud credentials or sends reporting requests.
 if(process.env.SACCO_LOCAL_DEVELOPMENT==='true')return {status:'local' as const};
 if(process.env.AUTH_SITE_URL!=='https://saccofinancial.com')return {status:'unconfigured' as const};
 const property=process.env.GA_PROPERTY_ID?.trim();if(!property||!/^\d{1,20}$/.test(property))return {status:'unconfigured' as const};
 try{
  const raw=(await billingSecrets()).GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON;
  if(!raw)return {status:'unconfigured' as const};
  return await load(property,raw,days);
 }catch{return {status:'unavailable' as const};}
}
