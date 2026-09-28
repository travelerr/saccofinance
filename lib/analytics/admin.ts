import 'server-only';
import {createSupabaseServerClient} from '../supabase/server';
import {isResearchAdmin} from '../email/policy';
export async function requireAnalyticsAdmin(){
 const client=await createSupabaseServerClient();
 const result=client?await client.auth.getUser():null;
 if(!isResearchAdmin(result?.data.user||null,process.env.RESEARCH_ADMIN_USER_IDS||''))throw Error('ADMIN_REQUIRED');
}
