import 'server-only';
import {sessionPremiumAccess} from './premium-session-access';
import {cache} from 'react';
import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from './supabase/server';
export const premiumAccess=cache(async()=>{
 const client=await createSupabaseServerClient();
 if(!client) return {user:null,allowed:false,manualAllowed:false,grant:null,subscriptions:[],unavailable:true};
 const {data:{user},error}=await client.auth.getUser();
 if(error||!user) return {user:null,allowed:false,manualAllowed:false,grant:null,subscriptions:[],unavailable:false};
 const access=await sessionPremiumAccess(client,user.id);
 return {user,...access};
});
export async function requirePremium(){
 const access=await premiumAccess();
 if(!access.user) redirect('/premium/login');
 if(!access.allowed) redirect('/premium/access');
 return access.user;
}
