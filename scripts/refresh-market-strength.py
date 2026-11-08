"""Free Yahoo chart history for the private Premium prototype. Atomic all-or-nothing refresh."""
import calendar
import concurrent.futures
import datetime as dt
import json
import math
import os
from pathlib import Path
import time
import subprocess
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'data/market-strength/latest.json'
ET = ZoneInfo('America/New_York')
GROUPS = [
 ('SMH','Semiconductors'),('IGV','Software'),('CIBR','Cybersecurity'),
 ('BOTZ','Robotics & AI'),('URA','Uranium'),('NLR','Nuclear & Uranium'),
 ('GDX','Gold Miners'),('COPX','Copper Miners'),('REMX','Rare Earths & Strategic Metals'),
 ('LIT','Lithium & Batteries'),('TAN','Solar'),('ICLN','Clean Energy'),
 ('UFO','Space'),('ITA','Aerospace & Defense · ITA'),('XAR','Aerospace & Defense · XAR'),
 ('SLX','Steel'),('XLE','Energy'),('FCG','Natural Gas Equities'),
 ('SEA','Shipping & Air Cargo'),('KBE','Banks'),('KRE','Regional Banks'),
 ('XBI','Biotech'),('XHB','Homebuilders & Suppliers'),('XLP','Consumer Staples')]
PERIODS = [('1m','1 month',1),('2m','2 months',2),('3m','3 months',3),('6m','6 months',6),('9m','9 months',9),('12m','12 months',12)]

def lookback(day, months):
    if not months:
        return day - dt.timedelta(days=7)
    m = day.year * 12 + day.month - 1 - months
    year, month = divmod(m,12)
    return dt.date(year,month+1,min(day.day,calendar.monthrange(year,month+1)[1]))

def fetch(ticker, cutoff):
    url = f'https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?range=2y&interval=1d&events=div%2Csplits'
    for attempt in range(2):
        try:
            response=subprocess.run(['curl','--fail','--silent','--show-error','--max-time','25','-A','Mozilla/5.0',url],capture_output=True,text=True,check=True)
            payload=json.loads(response.stdout)
            result=payload['chart']['result'][0]
            prices=result['indicators']['adjclose'][0]['adjclose']
            history={}
            for timestamp,price in zip(result['timestamp'],prices):
                day=dt.datetime.fromtimestamp(timestamp,ET).date()
                if day <= cutoff and isinstance(price,(int,float)) and math.isfinite(price) and price>0:
                    history[day]=price
            if not history:
                raise ValueError(f'Insufficient adjusted history for {ticker}')
            return ticker,history
        except Exception:
            if attempt: raise
            time.sleep(1)

def calculate(histories, asof):
    common=sorted(set.intersection(*(set(h) for h in histories.values())))
    output={}
    for key,label,months in PERIODS:
        target=lookback(asof,months)
        dates=[d for d in common if d <= target]
        if not dates or (target-dates[-1]).days>7:
            raise ValueError(f'Missing common baseline for {label}')
        start=dates[-1]
        values={ticker:(h[asof]/h[start]-1)*100 for ticker,h in histories.items()}
        ranked=sorted(GROUPS,key=lambda g:(-values[g[0]],g[0]))
        output[key]={'label':label,'startDate':str(start),'endDate':str(asof),'benchmarkReturn':values['SPY'],
          'rows':[{'ticker':t,'name':n,'return':values[t],'relative':values[t]-values['SPY'],'rank':rank+1} for rank,(t,n) in enumerate(ranked)]}
    return output

def completed_session_cutoff(now):
    """Allow today's daily bar only after 6 p.m. Eastern (two hours after close).

    Yahoo's actual common history determines the session on holidays/weekends;
    this date ceiling prevents intraday refreshes from using an unfinished bar.
    """
    local=now.astimezone(ET)
    return local.date() if local.hour >= 18 else local.date()-dt.timedelta(days=1)

def main():
    now=dt.datetime.now(ET)
    cutoff=completed_session_cutoff(now)
    catalog=json.loads((DEST.parent/'catalog.json').read_text())
    tickers=[g['ticker'] for g in catalog]+['SPY']
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        histories=dict(pool.map(lambda t:fetch(t,cutoff),tickers))
    legacy={t:histories[t] for t in ['SPY']+[t for t,_ in GROUPS]}
    common=sorted(set.intersection(*(set(h) for h in legacy.values())))
    if not common: raise ValueError('No common trading date')
    asof=common[-1]
    if (cutoff-asof).days>5: raise ValueError('Source history is stale; keeping previous snapshot')
    prior=max(d for d in common if d<=asof-dt.timedelta(days=7))
    periods=calculate(legacy,asof)
    previous=calculate(legacy,prior)
    for key in periods:
        ranks={r['ticker']:r['rank'] for r in previous[key]['rows']}
        for row in periods[key]['rows']:
            row['rankChange']=ranks[row['ticker']]-row['rank']
    def returns(period):
        start=dt.date.fromisoformat(period['startDate'])
        end=dt.date.fromisoformat(period['endDate'])
        return {t:(h[end]/h[start]-1)*100 if start in h and end in h else None
                for t,h in histories.items() if t!='SPY'}
    expanded={key:{'current':returns(periods[key]),'previous':returns(previous[key])} for key in periods}
    snapshot={'expanded':expanded,'schemaVersion':2,'source':'Yahoo Finance','generatedAt':now.isoformat(),
      'checkedDate':str(now.date()),'asOf':str(asof),'previousAsOf':str(prior),'fundCount':len(GROUPS),
      'benchmark':'SPY','periods':periods}
    DEST.parent.mkdir(parents=True,exist_ok=True)
    temp=DEST.with_suffix('.tmp')
    temp.write_text(json.dumps(snapshot,indent=2,allow_nan=False)+'\n')
    os.replace(temp,DEST)
    print(f'Saved {len(catalog)} ETFs + SPY through {asof}; all six periods validated.')

if __name__=='__main__': main()
