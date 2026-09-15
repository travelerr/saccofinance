'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {Menu,X,ArrowUpRight} from 'lucide-react';
const navigation=[['Media','/media'],['Research','/research'],['Premium','/premium'],['About','/about']];
export default function SiteHeader(){
 const pathname=usePathname();const[open,setOpen]=useState(false);const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{setOpen(false);},[pathname]);
 return <><a className="skip-link" href="#main-content">Skip to content</a><header className="brand-header" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}}}><div className="brand-header-inner"><Link href="/" className="wordmark" aria-label="Sacco Financial home">SACCO<span>FINANCIAL</span></Link><nav className="desktop-navigation" aria-label="Main navigation">{navigation.map(([name,url])=><Link key={url} href={url} aria-current={pathname===url||pathname.startsWith(url+'/')?'page':undefined}>{name}</Link>)}</nav><Link href="/premium" className="button button-small header-cta">Explore Premium <ArrowUpRight size={16}/></Link><button ref={trigger} className="menu-trigger" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div><nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-navigation" hidden={!open}>{navigation.map(([name,url],i)=><Link key={url} href={url} aria-current={pathname===url?'page':undefined} onClick={()=>setOpen(false)}><span>0{i+1}</span>{name}<ArrowUpRight size={22}/></Link>)}<Link href="/financial-blueprint">The Financial Base Blueprint</Link><Link href="/link-tree">Socials &amp; resources</Link></nav></header></>;
}
