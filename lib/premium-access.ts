import 'server-only';
import {hasPremiumAccess} from './premium-membership';
import {cache} from 'react';
import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from './supabase/server';
export const premiumAccess=cache(async()=>{
 const client=await createSupabaseServerClient();
 if(!client) return {user:null,allowed:false,unavailable:true};
 const {data:{user},error}=await client.auth.getUser();
 if(error||!user) return {user:null,allowed:false,unavailable:false};
 const {data,error:accessError}=await client.from('premium_memberships').select('enabled,access_expires_at').eq('user_id',user.id).maybeSingle();
 const allowed=!accessError && hasPremiumAccess(data);
 return {user,allowed:Boolean(allowed),unavailable:Boolean(accessError)};
});
export async function requirePremium(){
 const access=await premiumAccess();
 if(!access.user) redirect('/premium/login');
 if(!access.allowed) redirect('/premium/access');
 return access.user;
}
