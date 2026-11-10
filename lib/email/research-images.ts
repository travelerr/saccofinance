/** Content URLs are validated by scheme, not by an ever-growing content allowlist. */
export function emailContentUrl(value:string,origin:string){
 const base=new URL(origin);
 if(!value||/[\u0000-\u0020\u007f\\]/.test(value)||value.startsWith('//'))throw Error('INVALID_EMAIL_URL');
 const url=new URL(value,base.origin);
 const local=['localhost','127.0.0.1','[::1]'].includes(base.hostname);
 if(url.username||url.password||(url.protocol!=='https:'&&!(local&&url.origin===base.origin&&url.protocol==='http:')))throw Error('INVALID_EMAIL_URL');
 return url.href;
}
export function researchImageUrl(path:string,origin:string){
 return emailContentUrl(path,origin);
}
