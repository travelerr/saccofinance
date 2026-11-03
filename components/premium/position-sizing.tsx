'use client';

import {useState} from 'react';

const dollars = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'});
const formatMoney = (cents:number) => dollars.format(cents / 100);
const examples = {balance:'10000',percent:'0.5',amount:'50',entry:'40',stop:'38',cash:'',target:'46'};
type Field = keyof typeof examples;
const empty = {balance:'',percent:'',amount:'',entry:'',stop:'',cash:'',target:''};

function cents(text:string) {
  if (!/^\d*(?:\.\d{1,2})?$/.test(text) || !text) return NaN;
  const number = Math.round(Number(text) * 100);
  return Number.isSafeInteger(number) ? number : NaN;
}

export default function PositionSizing() {
  const [values,setValues] = useState(empty);
  const [percentMode,setPercentMode] = useState(true);
  const balance=cents(values.balance), entry=cents(values.entry), stop=cents(values.stop);
  const cash=values.cash ? cents(values.cash) : balance;
  const riskPct=cents(values.percent);
  const budget=percentMode ? Math.floor(balance*riskPct/10000) : cents(values.amount);
  const target=cents(values.target);
  const required=[values.balance,percentMode?values.percent:values.amount,values.entry,values.stop];
  let problem='';
  if (required.every(Boolean)) {
    if (![balance,entry,stop,budget].every(x=>Number.isSafeInteger(x)&&x>0) || !Number.isSafeInteger(cash) || cash<0)
      problem='Enter positive amounts with up to two decimal places. Available cash can be zero.';
    else if ((percentMode && riskPct>10000) || budget>balance) problem='Risk budget must fit within the account balance.';
    else if (cash>balance) problem='Available cash cannot exceed the account balance for this cash-only calculation.';
    else if (stop>=entry) problem='For a long position, enter a stop below your entry.';
    else if (values.target && !(target>entry)) problem='Enter a target above the entry, or leave it blank.';
  }
  const ready=required.every(Boolean)&&!problem;
  const distance=entry-stop;
  const riskShares=Math.floor(budget/distance),cashShares=Math.floor(cash/entry);
  const shares=Math.min(riskShares,cashShares);
  function field(key:Field,label:string,hint?:string) {
    return <label className="sizing-field">{label}
      <input type="text" inputMode="decimal" autoComplete="off" placeholder={key==='cash'?'Account balance':examples[key]} value={values[key]} onChange={e=>setValues({...values,[key]:e.target.value})}/>
      {hint&&<small>{hint}</small>}
    </label>;
  }
  return <section className="sizing" aria-labelledby="sizing-title">
    <p className="sizing-kicker">Trade planning · Long stocks</p>
    <h2 id="sizing-title">Position sizing calculator</h2>
    <p>Enter your risk budget, planned entry and stop to size a whole-share position in USD.</p>
    <div className="sizing-layout"><div>
      <div className="sizing-switch" role="group" aria-label="Risk budget units">{['Percent of account','Dollar amount'].map((label,i)=><button key={label} type="button" aria-pressed={percentMode===(i===0)} onClick={()=>setPercentMode(i===0)}>{label}</button>)}</div>
      <div className="sizing-fields">
        {field('balance','Account balance ($)')}
        {percentMode?field('percent','Risk per trade (%)'):field('amount','Risk per trade ($)')}
        {field('entry','Entry price ($)')}{field('stop','Stop price ($)')}
        {field('cash','Available cash ($) · optional','Defaults to your account balance.')}
        {field('target','Target price ($) · optional','Adds potential reward and reward-to-risk.')}
      </div>
      <div className="sizing-actions"><button type="button" onClick={()=>{setValues(examples);setPercentMode(true);}}>Try an example</button><button type="button" onClick={()=>setValues(empty)}>Clear</button></div>
    </div>
    <div className="sizing-result" aria-live="polite" aria-atomic="true">
      <span className="sizing-kicker">Position size</span>
      <strong>{ready?shares.toLocaleString('en-US'):'—'} <small>shares</small></strong>
      {ready?<><dl>{[
        ['Risk budget',formatMoney(budget)],['Risk per share',formatMoney(distance)],['Position cost',formatMoney(shares*entry)],['Planned loss at stop',formatMoney(shares*distance)],
        ...(values.target?[['Potential gain at target',formatMoney(shares*(target-entry))],['Reward-to-risk',((target-entry)/distance).toFixed(2)+':1']]:[])
      ].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p>{shares===0?'One share exceeds your cash or risk budget.':cashShares<riskShares?'Available cash limits this position.':'Sized to fit your risk budget, rounded down to whole shares.'}</p></>:<p>{problem || 'Fill in the four required fields, or try the example to see how sizing works.'}</p>}
    </div></div>
    <details><summary>How the math works</summary><p>Subtract the stop from the entry to get risk per share. Divide the risk budget by that distance, then round down. Available cash divided by the entry caps the share count. The planned loss assumes a fill at the stop price. Gaps, slippage and fees can increase the actual loss.</p></details>
  </section>;
}
