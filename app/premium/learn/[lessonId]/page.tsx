import Link from 'next/link';
import {notFound} from 'next/navigation';
import {requirePremium} from '@/lib/premium-access';
import {learningProgress} from '@/lib/learning/progress';
import {lessons} from '@/lib/learning/catalog';
import LessonPlayer from '@/components/premium/lesson-player';
import '../learn.css';
export const metadata={title:'Lesson 1: How I Find Stocks — My Complete Process',robots:{index:false,follow:false}};
export default async function Lesson({params}:{params:Promise<{lessonId:string}>}){
 const user=await requirePremium();const {lessonId}=await params;const lesson=lessons.find(item=>item.id===lessonId);if(!lesson)notFound();const progress=await learningProgress(user.id);
 return <main id="main-content" className="container learn-page"><Link className="text-link" href="/premium/learn">← Back to Learning Library</Link><h1>Lesson {lesson.number}: {lesson.title}</h1><p>{lesson.duration}</p><p>{lesson.description}</p><LessonPlayer {...lesson} completed={progress.completed.includes(lesson.id)} available={progress.available}/></main>;
}
