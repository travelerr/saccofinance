import 'server-only';
import {createClient} from '@supabase/supabase-js';
import {assertResearchInfrastructure} from './policy';
export function emailDatabase(){
 assertResearchInfrastructure(process.env);
 if(!process.env.SUPABASE_SECRET_KEY)throw new Error('EMAIL_SERVICE_KEY_REQUIRED');
 return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
}
