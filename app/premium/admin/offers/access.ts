import 'server-only';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {isResearchAdmin} from '@/lib/email/policy';
export async function requireOffersAdmin(){
 const client=await createSupabaseServerClient();const result=client?await client.auth.getUser():null;
 if(!isResearchAdmin(result?.data.user||null,process.env.RESEARCH_ADMIN_USER_IDS||''))throw Error('ADMIN_REQUIRED');
 return result!.data.user!;
}
