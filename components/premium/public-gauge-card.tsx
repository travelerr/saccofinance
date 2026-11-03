'use client';

import {useState} from 'react';
import {formatDate, percent, type PeriodKey} from '@/lib/market-strength';
import styles from '@/app/premium/sales.module.css';

export type GaugeSample = {
  key: PeriodKey;
  label: string;
  ticker: string;
  sector: string;
  gain: number;
  benchmark: number;
};

export default function PublicGaugeCard({samples,asOf}:{samples:GaugeSample[];asOf:string}) {
  const [selected,setSelected] = useState<PeriodKey>('1m');
  const sample = samples.find(row => row.key === selected) ?? samples[0];
  if (!sample) return null;
  const difference = sample.gain - sample.benchmark;
  return <>
    <div className={styles.periods} role="group" aria-label="Sector preview timeframe">
      {samples.map(row => <button type="button" key={row.key} aria-label={row.label} aria-pressed={row.key===sample.key} onClick={()=>setSelected(row.key)}>{row.key.toUpperCase()}</button>)}
    </div>
    <div className={styles.gaugeRows} aria-live="polite" aria-atomic="true">
      <div><strong>{sample.label} leader</strong><span>{sample.sector} · {sample.ticker}</span></div>
      <div><strong>Sector return</strong><span>{percent(sample.gain)}</span></div>
      <div><strong>Versus SPY</strong><span>{difference>0?'+':''}{difference.toFixed(2)} pp</span></div>
    </div>
    <small className={styles.micro}>Through {formatDate(asOf)} · Adjusted closes</small>
  </>;
}
