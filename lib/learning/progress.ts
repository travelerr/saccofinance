import 'server-only';
import {createSupabaseServerClient} from '@/lib/supabase/server';
export async function learningProgress(userId:string){
 const client=await createSupabaseServerClient();
 if(!client)return {completed:[] as string[],available:false};
 const {data,error}=await client.from('premium_lesson_completions').select('lesson_id').eq('user_id',userId);
 return {completed:(data??[]).map(row=>row.lesson_id as string),available:!error};
}
