'use client';
import ThemeToggle from '@/components/theme-toggle';
import Link from 'next/link';
import {logout} from '@/app/premium/auth/actions';
import './auth.css';
import './navigation.css';
import {useState} from 'react';
import {Menu,ChevronDown,LayoutDashboard,Newspaper,ChartNoAxesCombined,Compass,UserRound} from 'lucide-react';
import {usePathname} from 'next/navigation';
const destinations=[['Dashboard','/premium/dashboard'],['Weekly Outlook','/premium/weekly-outlook'],['Sector Gauge','/premium/market-strength'],['Opportunities','/premium/opportunities'],['Account','/premium/account']] as const;
export default function PremiumNavigation({variant='tabs',fullWidth=false}:{variant?:'tabs'|'subnav';fullWidth?:boolean}){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const icons=[LayoutDashboard,Newspaper,ChartNoAxesCombined,Compass,UserRound];
 const current=destinations.find(([,href])=>pathname===href||pathname.startsWith(href+'/'))?.[0]||(pathname.startsWith('/premium/issue-')?'Weekly Outlook':'Premium menu');
 return <header className={`premium-product-header premium-product-${variant}`}><div className={fullWidth?'container':undefined}><div className="premium-product-label"><Link href="/premium/dashboard" aria-label="Sacco Premium home"><strong>SACCO <span>PREMIUM</span></strong></Link><form action={logout} className="premium-logout"><button className="premium-logout" type="submit">Log out</button></form><Link href="/" className="premium-return">Sacco Financial ↗</Link><ThemeToggle/></div><button type="button" className="premium-menu-toggle" aria-expanded={open} aria-controls="premium-member-menu" onClick={()=>setOpen(!open)}><span><Menu size={18}/>{current}</span><span>Menu <ChevronDown size={16}/></span></button><nav id="premium-member-menu" data-open={open} className={variant==='tabs'?'premium-tabs':'premium-subnav'} aria-label="Sacco Premium product navigation">{destinations.map(([label,href],index)=>{const Icon=icons[index];return <Link onClick={()=>setOpen(false)} key={href} href={href} aria-current={pathname===href||pathname.startsWith(href+'/')||(href==='/premium/weekly-outlook'&&['/premium/issue-001','/premium/issue-002','/premium/issue-003'].includes(pathname))?'page':undefined}><Icon size={18} aria-hidden="true"/>{label}</Link>})}</nav></div></header>;
}
