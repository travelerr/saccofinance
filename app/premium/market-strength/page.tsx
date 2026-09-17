import {requirePremium} from '@/lib/premium-access';
import type { Metadata } from 'next';
import Link from 'next/link';
import PremiumNavigation from '@/components/premium/navigation';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import MarketStrength from '@/components/market-strength';
import type {StrengthSnapshot} from '@/lib/market-strength';
import '@/components/sacco-editorial.css';
export const metadata:Metadata={title:'Sector Gauge | Premium',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default async function Page(){
 await requirePremium();
 let initial:StrengthSnapshot|null=null;
 try{initial=JSON.parse(await readFile(path.join(process.cwd(),'data/market-strength/latest.json'),'utf8'));}catch{}
 return <div className="sf-site"><PremiumNavigation variant="subnav"/><main id="main-content" className="strength-wrap"><MarketStrength initial={initial}/></main><footer className="sf-footer sf-wrap"><span>SACCO FINANCIAL / PREMIUM</span><Link href="/premium/issue-001">Archived prototype · Issue 001 →</Link></footer></div>;
}
