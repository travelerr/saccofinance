import {createSupabaseServerClient} from '@/lib/supabase/server';
import {assertResearchInfrastructure} from '@/lib/email/policy';
import ResearchPreferenceForm from './research-preference-form';
export default async function ResearchPreferences(){
 try{assertResearchInfrastructure(process.env);}catch{return null;}
 const client=await createSupabaseServerClient();if(!client)return null;
 const {data:{user}}=await client.auth.getUser();if(!user||user.is_anonymous)return null;
 const {data,error}=await client.from('research_email_preferences').select('enabled').eq('user_id',user.id).maybeSingle();
 return <section className="section research-preferences" id="research-notifications"><h2>Premium research notifications</h2><p>Email me when a Weekly Outlook, Opportunity, or material Opportunity update is published and Justin chooses to notify members.</p>{error?<p>Preferences are unavailable until the local migration is applied.</p>:<ResearchPreferenceForm initialEnabled={data?.enabled===true}/>}</section>;
}
