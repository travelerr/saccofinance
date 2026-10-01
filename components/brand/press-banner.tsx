'use client';
import {useRef} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import './press-banner.css';
export default function PressBanner(){
 const rail=useRef<HTMLDivElement>(null);
 const scroll=(direction:number)=>rail.current?.scrollBy({left:direction*260,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 return <section className="featured-banner" aria-label="Featured in the conversation"><div className="featured-banner-heading"><span className="eyebrow">Featured in the conversation</span><div className="featured-banner-controls"><button type="button" aria-label="Scroll appearances left" onClick={()=>scroll(-1)}><ArrowLeft size={18}/></button><button type="button" aria-label="Scroll appearances right" onClick={()=>scroll(1)}><ArrowRight size={18}/></button></div></div><div className="featured-banner-rail" ref={rail} tabIndex={0} role="region" aria-label="Media appearances; scroll horizontally"><Link href="/media#press">CNBC</Link><Link href="/media#television-heading">tastylive</Link><Link href="/media#mizkif-feature-heading">Mizkif</Link><Link href="/media#trendspider-appearance" aria-label="TrendSpider media appearance"><Image className="featured-logo-light" src="/images/tools/trendspider-light.png" alt="TrendSpider" width={2379} height={304}/><Image className="featured-logo-dark" src="/images/tools/trendspider-dark.png" alt="TrendSpider" width={2379} height={304}/></Link></div></section>;
}
