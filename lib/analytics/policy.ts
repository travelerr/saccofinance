/** Only purpose-built fields enter analytics; never forward URLs, text or form values. */
export const MEASUREMENT_ID = 'G-TJ3SYV03LG';
export const CONSENT_COOKIE = 'sf_analytics_consent';
export const CONTEXT_COOKIE = 'sf_analytics_context';
export type Campaign = {source:string;medium:string;campaign:string;content:string};
export type Attribution = {first:Campaign;last:Campaign};
export type AnalyticsContext = {clientId:string;sessionId:string;attribution:Attribution};
const sources = new Set(['tiktok','instagram','facebook','youtube','newsletter','resend','google','bing','direct','referral']);
const media = new Set(['organic_social','social','email','organic','referral','none','paid_social']);
function label(value:unknown){return typeof value==='string'&&/^[a-z][a-z0-9_-]{0,63}$/.test(value)?value:'';}
export function campaignFromUrl(raw:string,referrer=''):Campaign {
 const direct={source:'direct',medium:'none',campaign:'',content:''};
 try{
  const url=new URL(raw);const source=url.searchParams.get('utm_source')?.toLowerCase()||'';
  if(sources.has(source))return {source,medium:media.has(url.searchParams.get('utm_medium')||'')?url.searchParams.get('utm_medium')!:'referral',campaign:label(url.searchParams.get('utm_campaign')),content:label(url.searchParams.get('utm_content'))};
  if(!referrer)return direct;
  const host=new URL(referrer).hostname.toLowerCase();
  if(host===url.hostname||host==='checkout.stripe.com'||host==='billing.stripe.com'||host.endsWith('.supabase.co'))return direct;
  for(const [domain,name] of [['tiktok.com','tiktok'],['instagram.com','instagram'],['facebook.com','facebook'],['youtube.com','youtube'],['youtu.be','youtube'],['google.com','google'],['bing.com','bing']])if(host===domain||host.endsWith('.'+domain))return {...direct,source:name,medium:['google','bing'].includes(name)?'organic':'organic_social'};
  return {...direct,source:'referral',medium:'referral'};
 }catch{return direct;}
}
export function validCampaign(value:unknown):value is Campaign {
 if(!value||typeof value!=='object')return false;const c=value as Campaign;
 return sources.has(c.source)&&media.has(c.medium)&&typeof c.campaign==='string'&&typeof c.content==='string'&&(!c.campaign||label(c.campaign)===c.campaign)&&(!c.content||label(c.content)===c.content);
}
export function updateAttribution(previous:Attribution|undefined,current:Campaign):Attribution {
 if(!previous||!validCampaign(previous.first)||!validCampaign(previous.last))return {first:current,last:current};
 return {first:previous.first,last:current.source==='direct'?previous.last:current};
}
export function parseContext(raw:string|undefined):AnalyticsContext|null {
 try{
  if(!raw||raw.length>1800)return null;const value=JSON.parse(raw);
  if(typeof value.clientId!=='string'||typeof value.sessionId!=='string'||!/^\d{1,20}\.\d{1,20}$/.test(value.clientId)||!/^\d{1,16}$/.test(value.sessionId)||!validCampaign(value.attribution?.first)||!validCampaign(value.attribution?.last))return null;
  const pick=(c:Campaign)=>({source:c.source,medium:c.medium,campaign:c.campaign,content:c.content});
  return {clientId:value.clientId,sessionId:value.sessionId,attribution:{first:pick(value.attribution.first),last:pick(value.attribution.last)}};
 }catch{return null;}
}
export function analyticsMode(env:Record<string,string|undefined>):'disabled'|'preview'|'live' {
 if(env.SACCO_LOCAL_DEVELOPMENT==='true')return env.ANALYTICS_PREVIEW==='true'?'preview':'disabled';
 return env.GA_ANALYTICS_ENABLED==='true'&&env.AUTH_SITE_URL==='https://saccofinancial.com'&&env.STRIPE_MODE==='live'?'live':'disabled';
}
export function safePage(path:string):string|null {
 if(['/','/about','/contact','/media','/research','/link-tree','/financial-blueprint','/financial-blueprint-free-pdf','/privacy','/terms','/disclosures','/premium','/premium/join','/premium/dashboard','/premium/weekly-outlook','/premium/opportunities','/premium/market-strength','/premium/account','/premium/access'].includes(path))return path;
 if(/^\/premium\/issue-\d{3}$/.test(path)||/^\/premium\/opportunities\/[a-z][a-z0-9-]{0,70}$/.test(path))return path;
 // Authentication, unsubscribe, admin, API and unknown routes are deliberately excluded.
 return null;
}
export function campaignParams(attribution:Attribution){return {first_source:attribution.first.source,first_medium:attribution.first.medium,first_campaign:attribution.first.campaign,last_source:attribution.last.source,last_medium:attribution.last.medium,last_campaign:attribution.last.campaign,campaign_source:attribution.last.source,campaign_medium:attribution.last.medium,campaign_name:attribution.last.campaign,campaign_content:attribution.last.content};}
export function engagementReached(activeMs:number,depth:number){return activeMs>=30000&&depth>=50;}
