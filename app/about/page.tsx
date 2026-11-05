import ThemedHeadshot from '@/components/brand/themed-headshot';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {Eyebrow,SectionHeader,SocialProof,PremiumBand} from '@/components/brand/editorial';
import {pageMetadata} from '@/lib/page-metadata';
export const metadata=pageMetadata('About Justin Sacco','Meet Justin Sacco, investor, finance educator, and founder of Sacco Financial.','/about');
export default function About(){return <main id="main-content" className="container"><section className="about-hero"><div><Eyebrow>The person behind Sacco Financial</Eyebrow><h1>JUSTIN<br/><span>SACCO.</span></h1><p className="hero-second-line">Curiosity comes first.</p><p>I’m an investor, finance educator, and the founder of Sacco Financial. I like looking closely at a company, questioning the obvious story, and figuring out where I stand.</p><a className="text-link" href="https://www.youtube.com/@saccofinancial">Watch the conversations <ArrowUpRight size={18}/></a></div><figure><ThemedHeadshot alt="Justin Sacco" width={1200} height={900} sizes="(max-width: 700px) 100vw, 50vw" priority/><figcaption>Justin Sacco / Founder, Sacco Financial</figcaption></figure></section>
<section className="section split-copy">
  <div><h2>From Self-Taught Investor to Sacco Financial</h2></div>
  <div>
    <p>My interest in the stock market started when I was 20 years old.</p>
    <p>At the time, I knew absolutely nothing about investing. I didn’t have a background in finance, didn’t know where to start, and had no real roadmap to follow. But I was fascinated by how the markets worked, so I started teaching myself everything I could.</p>
    <p>What began as a personal interest quickly became something much bigger.</p>
    <p>Within a few years, I landed a job in banking and decided to pursue a degree in Finance and Economics, working full-time while attending school full-time.</p>
    <p>I went on to spend roughly <strong>nine years in banking and finance</strong>, including management roles and working with higher-net-worth clients. That experience gave me a deeper understanding of financial markets, investments, and the broader financial system.</p>
    <p>Eventually, my career took another turn.</p>
    <p>I transitioned into software development, teaching myself to code and eventually moving into leadership roles managing development teams.</p>
    <p>Looking back, those two career paths couldn’t have complemented each other better.</p>
    <p><strong>Sacco Financial is where my background in finance, my experience in technology, and my passion for investing all come together.</strong></p>
    <p>Today, I create market analysis, research individual companies, and share my own investing and trading experiences with an audience across YouTube, TikTok, Facebook, and Instagram.</p>
    <p>I also built <Link href="/premium">Sacco Premium</Link>, a research and education platform where I share my market outlooks, sector analysis, stock opportunities, actual trades, and the strategy I use to find them.</p>
    <p>But my philosophy hasn’t changed much since I was 20.</p>
    <p>I don’t believe successful investing requires predicting every market move or being right on every trade. It requires a repeatable process, disciplined risk management, and a willingness to learn when things don’t go according to plan.</p>
    <p>That’s what I try to bring to Sacco Financial.</p>
    <p><strong>My goal is to help everyday investors better understand the markets, make sense of the opportunities in front of them, and develop a more disciplined approach to investing.</strong></p>
    <p>I’m not here to pretend I have all the answers. I’m here to share what I’ve learned, show the research behind my decisions, and continue learning along the way.</p>
  </div>
</section>
<section className="section"><SectionHeader label="The approach" title="Have a view. Keep asking questions."/><div className="philosophy-grid">{[['Look at the business.','A ticker is the start of the investigation. The company, its economics, and its prospects are the work.'],['Challenge the story.','A compelling idea still needs a bear case. I want to know where the market might be right.'],['Make the thinking visible.','What interests me, what I’m watching, and what would change my mind should be clear.']].map(([t,d])=><article key={t}><h3>{t}</h3><p>{d}</p></article>)}</div></section><section className="section about-pullquote"><blockquote>“I found something interesting in the market.<br/><span>Come look at this with me.”</span></blockquote><p>THE IDEA BEHIND SACCO FINANCIAL</p></section><section className="section split-copy"><div><Eyebrow>In the conversation</Eyebrow><h2>Markets are better<br/>when we talk about them.</h2></div><div><p>My market commentary has been featured by CNBC and tastylive. I’ve also appeared with Mizkif, bringing the investor’s perspective into a different kind of conversation.</p><Link className="text-link" href="/media#press">Explore appearances &amp; coverage <ArrowUpRight size={18}/></Link></div></section><SocialProof/><PremiumBand/></main>}
