"""Check calendar boundaries, adjusted-return math, common dates, and the saved universe."""
import datetime as dt
import importlib.util
import json
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('strength',Path(__file__).with_name('refresh-market-strength.py'))
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
class CalculationTests(unittest.TestCase):
    def test_month_end_and_leap_year(self):
        self.assertEqual(m.lookback(dt.date(2024,3,31),1),dt.date(2024,2,29))
        self.assertEqual(m.lookback(dt.date(2025,3,31),1),dt.date(2025,2,28))
        self.assertEqual(m.lookback(dt.date(2026,1,15),3),dt.date(2025,10,15))
    def test_return_and_weekend_baseline(self):
        start=dt.date(2024,1,1);end=dt.date(2026,9,11)
        days=[start+dt.timedelta(days=i) for i in range((end-start).days+1) if (start+dt.timedelta(days=i)).weekday()<5]
        histories={t:{d:100.0 for d in days} for t,_ in m.GROUPS}
        histories['SPY']={d:100.0 for d in days}
        histories['SMH'][end]=112.0;histories['SPY'][end]=105.0
        result=m.calculate(histories,end)
        for period in result.values():
            self.assertEqual(period['rows'][0]['ticker'],'SMH')
            self.assertAlmostEqual(period['rows'][0]['return'],12)
            self.assertAlmostEqual(period['rows'][0]['relative'],7)
        self.assertEqual(result['6m']['startDate'],'2026-03-11')
        self.assertEqual(m.calculate(histories,dt.date(2026,8,31))['3m']['startDate'],'2026-05-29')
    def test_snapshot_integrity(self):
        data=json.loads(m.DEST.read_text())
        self.assertEqual(data['fundCount'],24)
        expected={t for t,_ in m.GROUPS}
        for period in data['periods'].values():
            rows=period['rows']
            self.assertEqual({r['ticker'] for r in rows},expected)
            self.assertEqual([r['rank'] for r in rows],list(range(1,25)))
            self.assertEqual([r['return'] for r in rows],sorted([r['return'] for r in rows],reverse=True))
            for row in rows:self.assertAlmostEqual(row['relative'],row['return']-period['benchmarkReturn'])
        self.assertLess(data['asOf'],data['checkedDate'])
if __name__=='__main__':unittest.main()
