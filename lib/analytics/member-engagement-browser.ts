'use client';
import {hasConsent} from './browser';
export function recordMemberEngagement(activity:'visit'|'dashboard'|'opportunity'|'sector_view'|'sector_use'){
 if(!hasConsent()||(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl)return;
 void fetch('/api/analytics/member-engagement',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({activity}),keepalive:true}).catch(()=>{});
}
