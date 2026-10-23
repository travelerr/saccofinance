import Link from 'next/link';
import {notFound} from 'next/navigation';
import {requirePremium} from '@/lib/premium-access';
import {learningProgress} from '@/lib/learning/progress';
import {lessons} from '@/lib/learning/catalog';
import LessonPlayer from '@/components/premium/lesson-player';
import '../learn.css';
export async function generateMetadata({params}:{params:Promise<{lessonId:string}>}){
 const {lessonId}=await params;const lesson=lessons.find(item=>item.id===lessonId);
 return {title:lesson?`Lesson ${lesson.number}: ${lesson.title}`:'Lesson not found',robots:{index:false,follow:false}};
}
export default async function Lesson({params}:{params:Promise<{lessonId:string}>}){
 const user=await requirePremium();const {lessonId}=await params;const lesson=lessons.find(item=>item.id===lessonId);if(!lesson)notFound();const progress=await learningProgress(user.id);
 return <main id="main-content" className="container learn-page"><Link className="text-link learn-back" href="/premium/learn">← Back to Learning Library</Link><h1>Lesson {lesson.number}: {lesson.title}</h1><p className="learn-meta">{lesson.duration}</p><div className="learn-description">{lesson.description.split('\n\n').map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div><LessonPlayer key={lesson.id} {...lesson} completed={progress.completed.includes(lesson.id)} available={progress.available}/></main>;
}
