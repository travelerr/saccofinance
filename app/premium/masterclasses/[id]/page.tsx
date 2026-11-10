import Link from 'next/link';
import {notFound} from 'next/navigation';
import {requirePremium} from '@/lib/premium-access';
import {masterclasses,masterclassDate} from '@/lib/masterclasses/catalog';
import '../masterclasses.css';
export const metadata={title:'Masterclass Recording | Sacco Premium',robots:{index:false,follow:false}};
export default async function Recording({params}:{params:Promise<{id:string}>}){await requirePremium();const {id}=await params;const event=masterclasses.find(e=>e.id===id&&e.status==='completed'&&e.recordingId);if(!event)notFound();return <main id="main-content" className="container masterclasses-page"><Link className="masterclass-back" href="/premium/masterclasses">← All Masterclasses</Link><header><p className="eyebrow">MASTERCLASS RECORDING</p><h1>{event.title}</h1><p className="masterclass-time">{masterclassDate(event.startsAt)}</p><p>{event.description}</p></header><div className="masterclass-video"><iframe src={'https://www.youtube.com/embed/'+event.recordingId} title={event.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div></main>;}
