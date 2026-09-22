import 'server-only';
import type {SupabaseClient,User} from '@supabase/supabase-js';
import {assertResearchInfrastructure} from './policy';
/** Only an explicit choice from the verified welcome-link POST opts a member in. */
export async function saveSignupResearchPreference(client:SupabaseClient,user:User,chosen:boolean,offered:boolean){
 if(!offered)return;
 assertResearchInfrastructure(process.env);
 if(user.is_anonymous||!user.email_confirmed_at)throw new Error('VERIFIED_EMAIL_REQUIRED');
 const {error}=await client.from('research_email_preferences').upsert({user_id:user.id,enabled:chosen,updated_at:new Date().toISOString()},{onConflict:'user_id',ignoreDuplicates:!chosen});
 if(error)throw new Error('PREFERENCE_SAVE_FAILED');
}
