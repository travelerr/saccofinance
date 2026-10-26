export type SampleLeadMetric={analytics_allowed:boolean;created_at:string;email_status:string;confirmed_at:string|null;marketing_requested:boolean;unsubscribed_at:string|null;checkout_started_at:string|null;subscriber_at:string|null;paid_at:string|null;preexisting_member:boolean;conversion_checked_at:string|null};
export function sampleReport(leads:SampleLeadMetric[],now=Date.now()){
 const prospects=leads.filter(l=>!l.preexisting_member&&l.analytics_allowed);
 const mature=prospects.filter(l=>now-Date.parse(l.created_at)>=14*86400000);
 const within14=(l:SampleLeadMetric)=>l.paid_at&&Date.parse(l.paid_at)>=Date.parse(l.created_at)&&Date.parse(l.paid_at)-Date.parse(l.created_at)<=14*86400000;
 return {requested:leads.length,sent:leads.filter(l=>l.email_status==='sent').length,confirmed:leads.filter(l=>l.confirmed_at).length,subscribed:prospects.filter(l=>l.subscriber_at).length,paid:prospects.filter(l=>l.paid_at).length,checkout:prospects.filter(l=>l.checkout_started_at).length,optedIn:leads.filter(l=>l.confirmed_at&&l.marketing_requested&&!l.unsubscribed_at).length,preexisting:leads.filter(l=>l.preexisting_member).length,tracking:prospects.length,mature:mature.length,converted14:mature.filter(within14).length,rate14:mature.length?100*mature.filter(within14).length/mature.length:null,unverified:prospects.filter(l=>!l.conversion_checked_at).length};
}
