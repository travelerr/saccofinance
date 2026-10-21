const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function renderAccessReminder(origin:string,endsAt:string){
 const base=new URL(origin);if(!['https:','http:'].includes(base.protocol)||base.username||base.password)throw Error('INVALID_ORIGIN');
 const date=new Intl.DateTimeFormat('en-US',{dateStyle:'long',timeStyle:'short',timeZone:'America/New_York'}).format(new Date(endsAt))+' Eastern Time';
 const url=new URL('/premium/account',base.origin).href;
 const subject='Your Sacco Premium access ends soon';
 const paragraphs=[`Hey! Just a quick reminder that your Sacco Premium access is scheduled to end on ${date}.`,
 'Until then, you still have full access to the Weekly Market Outlook, Sector Gauge, Opportunity Board, and my ongoing investment research.',
 'I’m continuing to research new companies, monitor market conditions, and document my personal trading decisions — including the trades that don’t work out.',
 'If you’d like to stick around, open your account and choose “Keep my subscription” before that time. Your existing plan will resume renewing at its current price and billing date.',
 'And if you’ve decided Premium isn’t for you right now, no problem. Your cancellation is already scheduled, and no action is needed.',
 'I appreciate you giving Premium a try! — Justin, Sacco Financial'];
 const footer='This is an account notice about your scheduled cancellation. Your research email preferences have not changed.';
 return {subject,url,preferences:url,headers:undefined,text:['SACCO PREMIUM',subject,...paragraphs,'Keep My Subscription: '+url,footer].join('\n\n'),html:`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head><body style="margin:0;background:#11151b;color:#f3f4f6;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%"><tr><td style="padding:24px 12px" align="center"><table role="presentation" width="100%" style="max-width:600px;background:#1b222c;border-top:3px solid #68c5e8"><tr><td style="padding:28px 24px;overflow-wrap:anywhere"><p style="font-weight:bold;letter-spacing:2px">SACCO PREMIUM</p><h1 style="font-size:26px">Your access ends soon</h1>${paragraphs.map(p=>`<p style="font-size:16px;line-height:1.7">${escape(p)}</p>`).join('')}<p style="margin:28px 0"><a href="${escape(url)}" style="display:inline-block;padding:16px 18px;background:#8fd8f2;color:#11151b;font-weight:bold;text-decoration:none">Keep My Subscription</a></p><p style="font-size:13px;line-height:1.6;color:#cbd5e1">${footer}</p></td></tr></table></td></tr></table></body></html>`};
}
