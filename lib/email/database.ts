import 'server-only';
import {createClient} from '@supabase/supabase-js';
import {emailSecrets} from './secrets';
import {assertResearchInfrastructure} from './policy';
export async function emailDatabase(){
 assertResearchInfrastructure(process.env);
 const secrets=await emailSecrets();
 if(!secrets.SUPABASE_SECRET_KEY)throw new Error('EMAIL_SERVICE_KEY_REQUIRED');
 return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,secrets.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
}
