/** Versioned, server-rendered email content. No research catalog or template dependency. */
export const unsubscribePlaceholderToken='0'.repeat(64);
export type EmailSnapshot={version:1;subject:string;html:string;text:string;url:string;preferences:string};
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export const unsubscribePlaceholder=(origin:string)=>new URL('/email/unsubscribe?token='+unsubscribePlaceholderToken,origin).href;
export function validateEmailSnapshot(value:unknown,origin:string):asserts value is EmailSnapshot{
 const fail=()=>{throw Error('INVALID_EMAIL_SNAPSHOT');};
 if(!value||typeof value!=='object')return fail();
 const s=value as EmailSnapshot;
 if(s.version!==1||!['subject','html','text','url','preferences'].every(k=>typeof s[k as keyof EmailSnapshot]==='string'))return fail();
 if(!s.subject.trim()||s.subject.length>998||/[\r\n]/.test(s.subject)||s.html.length>250000||s.text.length>100000)return fail();
 let base:URL,destination:URL;
 try{base=new URL(origin);destination=new URL(s.url);}catch{return fail();}
 if(!['http:','https:'].includes(base.protocol)||base.username||base.password)return fail();
 if(destination.origin!==base.origin||destination.username||destination.password||!/^\/premium\/[a-z0-9/#-]+$/.test(destination.pathname))return fail();
 if(s.preferences!==new URL('/premium/account#research-notifications',origin).href)return fail();
 const placeholder=unsubscribePlaceholder(origin);
 if(!s.html.includes(escape(placeholder))||!s.text.includes(placeholder))return fail();
 // Internal links and the exact approved TrendSpider affiliate destination are accepted. Content is produced by the trusted server renderer.
 const allowed=[s.url,s.preferences,placeholder,'https://trendspider.com?_go=justin-4f7fc2'].map(escape);
 const links=[...s.html.matchAll(/\bhref="([^"]*)"/gi)];
 if(!links.length||links.some(m=>!allowed.includes(m[1])))return fail();
 if(/<(script|iframe|form|object|embed|base)\b|\bon\w+\s*=|\bsrc\s*=|javascript:|url\s*\(/i.test(s.html))return fail();
}
export function personalizeEmailSnapshot(value:unknown,origin:string,unsubscribe:string){
 validateEmailSnapshot(value,origin);
 const link=new URL(unsubscribe);
 if(link.origin!==new URL(origin).origin||link.pathname!=='/email/unsubscribe'||!/^[a-f0-9]{64}$/.test(link.searchParams.get('token')||'')||link.username||link.password||link.hash||[...link.searchParams].length!==1)throw Error('INVALID_UNSUBSCRIBE_URL');
 const placeholder=unsubscribePlaceholder(origin);
 return {subject:value.subject,html:value.html.split(escape(placeholder)).join(escape(unsubscribe)),text:value.text.split(placeholder).join(unsubscribe),url:value.url,preferences:value.preferences,headers:{'List-Unsubscribe':'<'+unsubscribe+'>','List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}};
}
