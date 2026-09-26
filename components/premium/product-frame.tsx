'use client';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import Link from 'next/link';
import './research.css';
const memberRoots=['/premium/dashboard','/premium/issue-001','/premium/issue-002','/premium/weekly-outlook','/premium/market-strength','/premium/opportunities','/premium/account'];
export default function PremiumProductFrame({children,publicHeader,publicFooter}:{children:ReactNode;publicHeader:ReactNode;publicFooter:ReactNode}){
 const pathname=usePathname();
 const member=memberRoots.some(root=>pathname===root||pathname.startsWith(root+'/'));
 if(!member)return <>{publicHeader}{children}{publicFooter}</>;
 return <div className="premium-workspace"><a className="skip-link" href="#main-content">Skip to research</a>{children}<footer className="container premium-workspace-footer"><span>SACCO PREMIUM / RESEARCH BY JUSTIN SACCO</span><p>Educational and informational research. Investing involves risk, including loss of principal.</p><div><Link href="/disclosures">Disclosures</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link></div></footer></div>;
}
