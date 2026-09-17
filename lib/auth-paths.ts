export function safePremiumReturn(value:string|null|undefined):string{
 if(!value || !value.startsWith('/premium/') || value.includes('\\') || /[\r\n]/.test(value)) return '/premium/dashboard';
 try{
  const url=new URL(value,'https://return.invalid');
  if(url.origin!=='https://return.invalid' || !url.pathname.startsWith('/premium/') || /^\/premium\/(login|access|forgot-password|set-password|auth)(\/|$)/.test(url.pathname)) return '/premium/dashboard';
  return url.pathname+url.search+url.hash;
 }catch{return '/premium/dashboard';}
}
