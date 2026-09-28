import {parseContext,campaignParams,type AnalyticsContext} from './policy';
/** Stripe metadata is server-written but still validated before use in analytics. */
export function purchaseEvent(session:{id:string;livemode:boolean;mode:string|null;status:string|null;payment_status:string;amount_total:number|null;currency:string|null;metadata:Record<string,string>|null}){
 if(!session.livemode||session.mode!=='subscription'||session.status!=='complete'||session.payment_status!=='paid'||session.currency!=='usd'||!Number.isSafeInteger(session.amount_total)||session.amount_total!<0||!/^cs_live_[A-Za-z0-9]+$/.test(session.id))return null;
 let context:AnalyticsContext|null=null;
 try{context=parseContext(session.metadata?.sf_ga_context);}catch{}
 if(!context)return null;
 return {client_id:context.clientId,consent:{ad_user_data:'DENIED',ad_personalization:'DENIED'},events:[{name:'purchase',params:{transaction_id:session.id,currency:'USD',value:session.amount_total!/100,session_id:Number(context.sessionId),...campaignParams(context.attribution),items:[{item_id:'sacco_premium',item_name:'Sacco Premium',quantity:1,price:session.amount_total!/100}]}}]};
}
