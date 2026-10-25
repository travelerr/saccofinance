'use client';
import {useRef} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import type {ClosedTradePreview} from '@/lib/public-closed-trades';
import {premiumDate} from '@/lib/premium-content';
import styles from './closed-trades-preview.module.css';
export default function ClosedTradesPreview({trades,join}:{trades:ClosedTradePreview[];join:string}){
 const rail=useRef<HTMLUListElement>(null);
 if(!trades.length)return null;
 function move(direction:number){const el=rail.current;if(el)el.scrollBy({left:direction*(el.firstElementChild?.getBoundingClientRect().width||280)+direction*16,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
 return <section className={`section ${styles.section}`} aria-labelledby="closed-trades-heading">
  <p className={styles.eyebrow}>A look inside my closed trades</p>
  <h2 id="closed-trades-heading">Real Trades. Real Results. Full Transparency.</h2>
  <p className={styles.intro}>Follow my documented trades from research to final outcome. Not every trade is a winner, and that’s part of the process.</p>
  <div className={styles.toolbar}><p>{trades.length<10?`All ${trades.length} documented closed trades`:'Latest 10 closed trades'} · Newest first</p><div><button type="button" aria-label="Previous closed trades" onClick={()=>move(-1)}><ArrowLeft size={20}/></button><button type="button" aria-label="Next closed trades" onClick={()=>move(1)}><ArrowRight size={20}/></button></div></div>
  <ul ref={rail} className={styles.rail} tabIndex={0} aria-label="Closed trades; scroll horizontally for more">
   {trades.map(t=><li key={t.id} className={styles.card}><div className={styles.top}><h3>{t.ticker}</h3><span>Closed</span></div><p className={styles.company}>{t.company}</p><p className={`${styles.result} ${t.returnPct===null?'':t.returnPct>=0?styles.gain:styles.loss}`}>{t.returnPct===null?'Not available':`${t.approximate?'≈ ':''}${t.returnPct>0?'+':''}${t.returnPct.toFixed(2)}%`}</p><p className={styles.basis}>{t.basis}</p><p className={styles.date}>Closed {premiumDate(t.closedAt)}</p></li>)}
  </ul>
  <p className={styles.note}>My personal results, before fees and taxes—not subscriber performance. Past results do not guarantee future returns. Full research and trade histories are available to members.</p>
  <Link className="button" href={join}>Explore Sacco Premium <ArrowRight size={18}/></Link>
 </section>;
}
