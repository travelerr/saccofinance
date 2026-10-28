import Link from 'next/link';
import Image from 'next/image';
import {FileText,Download} from 'lucide-react';
import {requirePremium} from '@/lib/premium-access';
import {learningProgress} from '@/lib/learning/progress';
import {lessons} from '@/lib/learning/catalog';
import './learn.css';
export const metadata={title:'Sacco Premium Learning Library',robots:{index:false,follow:false}};
export default async function LearningLibrary(){const user=await requirePremium();const progress=await learningProgress(user.id);
 return <main id="main-content" className="container learn-page"><header><p className="eyebrow">LEARNING LIBRARY</p><h1>Sacco Premium Learning Library</h1><p>Learn the research, strategies, and risk-management process behind my investment decisions.</p></header><section className="learn-guide" aria-labelledby="stock-strategy-heading"><FileText className="learn-guide-icon" size={30} aria-hidden="true"/><div><p className="learn-guide-label">QUICK REFERENCE · 1-PAGE PDF</p><h2 id="stock-strategy-heading">My Stock Selection Strategy</h2><p>Keep my research process handy: start with the market, find leading sectors, and look for stocks moving from a base into a new uptrend. Includes an annotated Zscaler example and my research checklist.</p></div><a className="button learn-guide-download" href="/api/premium/learning/stock-selection-strategy" download><Download size={17} aria-hidden="true"/>Download PDF</a></section><div className="learn-grid">{lessons.map(lesson=><article className="workspace-panel learn-card" key={lesson.id}><Link href={'/premium/learn/'+lesson.id}><Image src={lesson.thumbnail} alt={`Lesson ${lesson.number}: ${lesson.title}`} width={1672} height={941} sizes="(max-width: 767px) 100vw, 550px"/></Link><p className="learn-meta">Lesson {lesson.number} · {lesson.duration}</p><h2>{lesson.title}</h2><p className="learn-description">{lesson.description.split('\n\n')[0]}</p><p className="learn-status">{progress.completed.includes(lesson.id)?'✓ Completed':progress.available?'Not yet completed':'Completion tracking unavailable'}</p><Link className="button" href={'/premium/learn/'+lesson.id}>Watch Lesson</Link></article>)}</div></main>;
}
