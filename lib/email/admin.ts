import 'server-only';
import {createSupabaseServerClient} from '../supabase/server';
import {assertResearchInfrastructure,isResearchAdmin} from './policy';
export async function requireResearchAdmin(){
 assertResearchInfrastructure(process.env);
 const client=await createSupabaseServerClient();
 const result=client?await client.auth.getUser():null;
 if(!isResearchAdmin(result?.data.user||null,process.env.RESEARCH_ADMIN_USER_IDS||''))throw new Error('ADMIN_REQUIRED');
 return result!.data.user!;
}
