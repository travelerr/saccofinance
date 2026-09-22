import {createSupabaseServerClient} from '@/lib/supabase/server';
import Link from 'next/link';
import {isResearchAdmin} from '@/lib/email/policy';
import {assertResearchInfrastructure} from '@/lib/email/policy';
import ResearchPreferenceForm from './research-preference-form';
export default async function ResearchPreferences(){
 try{assertResearchInfrastructure(process.env);}catch{return null;}
 const client=await createSupabaseServerClient();if(!client)return null;
 const {data:{user}}=await client.auth.getUser();if(!user||user.is_anonymous)return null;
 const {data,error}=await client.from('research_email_preferences').select('enabled').eq('user_id',user.id).maybeSingle();
 return <section className="section" id="research-notifications"><h2>Premium research notifications</h2>{isResearchAdmin(user,process.env.RESEARCH_ADMIN_USER_IDS||'')&&<p><Link className="text-link" href="/premium/admin/notifications">Manage research notifications</Link></p>}<p>Email me when a Weekly Outlook, Opportunity, or material Opportunity update is published and Justin chooses to notify members.</p>{error?<p>Preferences are unavailable until the local migration is applied.</p>:<ResearchPreferenceForm initialEnabled={data?.enabled===true}/>}</section>;
}
