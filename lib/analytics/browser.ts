'use client';
import {analyticsAllowed,campaignFromUrl,campaignParams,CONSENT_COOKIE,CONTEXT_COOKIE,MEASUREMENT_ID,parseContext,safePage,updateAttribution,type Attribution} from './policy';
type Params=Record<string,string|number|boolean|null>;
type Gtag=(...args:unknown[])=>void;
declare global {interface Window {dataLayer?:unknown[];gtag?:Gtag;__saccoAnalyticsPreview?:Array<{event:string;params:Params}>;}}
let mode:'disabled'|'preview'|'live'='disabled';
let currentPath:string|null=null;
let attribution:Attribution|undefined;
let scriptStarted=false;
let loadFailed=false;
export function readCookie(name:string){try{return decodeURIComponent(document.cookie.split('; ').find(c=>c.startsWith(name+'='))?.slice(name.length+1)||'');}catch{return '';}}
function writeCookie(name:string,value:string,seconds:number){document.cookie=`${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${seconds}; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;}
export function hasConsent(){return analyticsAllowed(readCookie(CONSENT_COOKIE),Boolean((navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl));}
export function setConsent(granted:boolean){writeCookie(CONSENT_COOKIE,granted?'granted':'denied',15552000);if(!granted)clearAnalytics();}
function disableTag(disabled:boolean){(window as unknown as Record<string,unknown>)[`ga-disable-${MEASUREMENT_ID}`]=disabled;}
export function pauseTracking(){mode='disabled';currentPath=null;disableTag(true);}
export function clearAnalytics(){
 pauseTracking();writeCookie(CONTEXT_COOKIE,'',0);writeCookie('sf_analytics_attribution','',0);
 // GA is configured to use host-only cookies, so revocation can remove them here.
 document.cookie.split('; ').map(c=>c.split('=')[0]).filter(name=>name==='_ga'||name.startsWith('_ga_')).forEach(name=>writeCookie(name,'',0));
 attribution=undefined;
}
export function track(event:string,params:Params={}){
 if(mode==='disabled'||!hasConsent()||!currentPath)return;
 const payload={page_location:'https://saccofinancial.com'+currentPath,page_referrer:'',page_title:currentPath,...(attribution?campaignParams(attribution):{}),...params};
 if(mode==='preview'){window.__saccoAnalyticsPreview=(window.__saccoAnalyticsPreview||[]).concat({event,params:payload}).slice(-100);window.dispatchEvent(new Event('sacco-analytics-preview'));return;}
 window.gtag?.('event',event,payload);
}
function syncCheckoutContext(){
 if(mode!=='live'||!hasConsent()||!attribution)return;
 window.gtag?.('get',MEASUREMENT_ID,'client_id',(clientId:unknown)=>{
  window.gtag?.('get',MEASUREMENT_ID,'session_id',(sessionId:unknown)=>{
   if(mode!=='live'||!hasConsent())return;
   const value=parseContext(JSON.stringify({clientId,sessionId:String(sessionId),attribution}));
   if(value)writeCookie(CONTEXT_COOKIE,JSON.stringify(value),1800);
  });
 });
}
export function startPage(config:{mode:'preview'|'live';userId?:string|null},path:string,landingUrl:string,referrer:string){
 const clean=safePage(path);if(!clean||!hasConsent()){pauseTracking();return;}
 if(config.mode==='live'&&location.origin!=='https://saccofinancial.com'){pauseTracking();return;}
 mode=config.mode;currentPath=clean;disableTag(false);
 let saved:Attribution|undefined;
 try{saved=JSON.parse(readCookie('sf_analytics_attribution')||'null')||undefined;}catch{}
 attribution=updateAttribution(saved,campaignFromUrl(landingUrl,referrer));
 writeCookie('sf_analytics_attribution',JSON.stringify(attribution),7776000);
 if(mode==='live'){
  if(loadFailed){pauseTracking();return;}
  window.dataLayer=window.dataLayer||[];
  // Google distinguishes Arguments commands from ordinary data-layer arrays.
  // eslint-disable-next-line prefer-rest-params -- gtag requires Arguments, not an array.
  window.gtag=window.gtag||function(){window.dataLayer!.push(arguments);};
  const settings={send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_domain:'none',cookie_expires:7776000,user_id:config.userId||null,page_location:'https://saccofinancial.com'+clean,page_referrer:'',page_title:clean,...campaignParams(attribution)};
  // Set sanitized defaults BEFORE loading Google. Enhanced measurement must also be OFF in GA.
  window.gtag('set',settings);
  if(!scriptStarted){
   window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   window.gtag('js',new Date());
   const script=document.createElement('script');script.src=`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;script.async=true;script.referrerPolicy='no-referrer';script.onerror=()=>{loadFailed=true;pauseTracking();};document.head.appendChild(script);scriptStarted=true;
  }
  window.gtag('config',MEASUREMENT_ID,settings);
 }
 track('page_view');
 if(clean==='/premium')track('premium_landing_view');
 if(clean==='/premium/join')track('join_view');
 syncCheckoutContext();
}
