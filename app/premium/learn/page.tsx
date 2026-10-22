import Link from 'next/link';
import Image from 'next/image';
import {requirePremium} from '@/lib/premium-access';
import {learningProgress} from '@/lib/learning/progress';
import {lessons} from '@/lib/learning/catalog';
import './learn.css';
export const metadata={title:'Sacco Premium Learning Library',robots:{index:false,follow:false}};
export default async function LearningLibrary(){const user=await requirePremium();const progress=await learningProgress(user.id);
 return <main id="main-content" className="container learn-page"><header><p className="eyebrow">LEARNING LIBRARY</p><h1>Sacco Premium Learning Library</h1><p>Learn the research, strategies, and risk-management process behind my investment decisions.</p></header><div className="learn-grid">{lessons.map(lesson=><article className="workspace-panel learn-card" key={lesson.id}><Link href={'/premium/learn/'+lesson.id}><Image unoptimized src={`https://i.ytimg.com/vi/${lesson.videoId}/hqdefault.jpg`} alt={`Lesson ${lesson.number}: ${lesson.title}`} width={480} height={360}/></Link><p>Lesson {lesson.number} · {lesson.duration}</p><h2>{lesson.title}</h2><p>{lesson.description}</p><p>{progress.completed.includes(lesson.id)?'✓ Completed':progress.available?'Not yet completed':'Completion tracking unavailable'}</p><Link className="button" href={'/premium/learn/'+lesson.id}>Watch Lesson</Link></article>)}</div></main>;
}
