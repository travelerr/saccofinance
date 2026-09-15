import {Eyebrow} from '@/components/brand/editorial';
import {INTERVIEW_TOPICS} from '@/lib/media';
import {brandLinks} from '@/lib/editorial';
import {pageMetadata} from '@/lib/page-metadata';
export const metadata=pageMetadata('Contact & Press','Contact Sacco Financial for media appearances, interviews, and enquiries.','/contact');
export default function Contact(){return <main id="main-content" className="container"><section className="page-hero"><Eyebrow>Contact / Sacco Financial</Eyebrow><h1>LET’S HAVE<br/><span>A CONVERSATION.</span></h1><p>For interviews, media appearances, and enquiries about Sacco Financial.</p><a className="button" href={`mailto:${brandLinks.email}`}>Email Sacco Financial ↗</a><p className="contact-email">{brandLinks.email}</p></section><section className="section"><Eyebrow>Topics for the conversation</Eyebrow><div className="contact-topics">{INTERVIEW_TOPICS.map(t=><span key={t}>{t}</span>)}</div></section></main>}
