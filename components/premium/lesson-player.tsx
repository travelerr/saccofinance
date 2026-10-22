'use client';
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {completeLesson} from '@/app/premium/learn/actions';
import {chapterSeconds} from '@/lib/learning/catalog';
export default function LessonPlayer({id,videoId,title,chapters,completed,available}:{id:string;videoId:string;title:string;chapters:readonly (readonly [string,string])[];completed:boolean;available:boolean}){
 const [start,setStart]=useState(0),[error,setError]=useState<string|null>(null);
 const [pending,transition]=useTransition();const router=useRouter();
 return <><div className="learn-video"><iframe key={start} src={`https://www.youtube.com/embed/${videoId}?start=${start}&autoplay=0&rel=0`} title={title} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div>
 <div className="learn-completion"><button className="button" disabled={completed||pending||!available} onClick={()=>transition(async()=>{const result=await completeLesson(id);setError(result.error);if(!result.error)router.refresh();})}>{completed?'✓ Lesson completed':pending?'Saving…':'Mark as Complete'}</button><p>Mark this lesson complete when you’re ready. Watching or opening it does not mark it automatically.</p>{!available&&<p role="status">Completion tracking is temporarily unavailable.</p>}{error&&<p role="alert">{error}</p>}</div>
 <section><h2>Lesson chapters</h2><p>Select a chapter, then press play to watch from that point.</p><ol className="learn-chapters">{chapters.map(([time,label])=><li key={time}><button type="button" aria-pressed={start===chapterSeconds(time)} onClick={()=>setStart(chapterSeconds(time))}><span>{time}</span>{label}</button></li>)}</ol></section></>;
}
