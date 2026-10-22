'use server';
import {requirePremium} from '@/lib/premium-access';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {lessons} from '@/lib/learning/catalog';
import {revalidatePath} from 'next/cache';
export async function completeLesson(lessonId:string){
 const user=await requirePremium();
 if(!lessons.some(lesson=>lesson.id===lessonId))return {error:'Unknown lesson.'};
 const client=await createSupabaseServerClient();
 if(!client)return {error:'Completion could not be saved. Please try again.'};
 const {error}=await client.from('premium_lesson_completions').upsert({user_id:user.id,lesson_id:lessonId},{onConflict:'user_id,lesson_id',ignoreDuplicates:true});
 if(error)return {error:'Completion could not be saved. Please try again.'};
 for(const path of ['/premium/learn','/premium/learn/'+lessonId,'/premium/dashboard'])revalidatePath(path);
 return {error:null};
}
