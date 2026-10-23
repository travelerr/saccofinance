import 'server-only';
import {createSupabaseServerClient} from '@/lib/supabase/server';
export async function startHereProgress(userId:string){
 const client=await createSupabaseServerClient();
 if(!client)return [];
 const {data,error}=await client.from('premium_start_here_progress').select('step').eq('user_id',userId);
 return error?[]:(data??[]).map(row=>String(row.step));
}
