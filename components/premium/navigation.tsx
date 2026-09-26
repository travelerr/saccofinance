'use client';
import ThemeToggle from '@/components/theme-toggle';
import Link from 'next/link';
import {logout} from '@/app/premium/auth/actions';
import './auth.css';
import './navigation.css';
import {usePathname} from 'next/navigation';
const destinations=[['Dashboard','/premium/dashboard'],['Weekly Outlook','/premium/weekly-outlook'],['Sector Gauge','/premium/market-strength'],['Opportunities','/premium/opportunities']] as const;
export default function PremiumNavigation({variant='tabs'}:{variant?:'tabs'|'subnav'}){
 const pathname=usePathname();
 return <header className={`premium-product-header premium-product-${variant}`}><div className="premium-product-label"><Link href="/premium/dashboard" aria-label="Sacco Premium home"><strong>SACCO <span>PREMIUM</span></strong></Link><span className="premium-workspace-label">RESEARCH WORKSPACE</span><Link href="/premium/account">Account</Link><form action={logout} className="premium-logout"><button className="premium-logout" type="submit">Log out</button></form><Link href="/" className="premium-return">Sacco Financial ↗</Link><ThemeToggle/></div><nav className={variant==='tabs'?'premium-tabs':'premium-subnav'} aria-label="Sacco Premium product navigation">{destinations.map(([label,href])=><Link key={href} href={href} aria-current={pathname===href||pathname.startsWith(href+'/')||(href==='/premium/weekly-outlook'&&['/premium/issue-001','/premium/issue-002'].includes(pathname))?'page':undefined}>{label}</Link>)}</nav></header>;
}
