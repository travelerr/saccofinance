import {requirePremium} from '@/lib/premium-access';
import type { Metadata } from 'next';
import PremiumNavigation from '@/components/premium/navigation';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import MarketStrength from '@/components/market-strength';
import type {StrengthSnapshot} from '@/lib/market-strength';
import '@/components/sacco-editorial.css';
import styles from './layout.module.css';
export const metadata:Metadata={title:'Sector Gauge | Premium',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default async function Page(){
 await requirePremium();
 let initial:StrengthSnapshot|null=null;
 try{initial=JSON.parse(await readFile(path.join(process.cwd(),'data/market-strength/latest.json'),'utf8'));}catch{}
 return <main id="main-content" className="container"><PremiumNavigation/><section className={`sf-site ${styles.content}`}><MarketStrength initial={initial}/></section></main>;
}
