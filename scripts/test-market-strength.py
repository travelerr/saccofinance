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
    def test_completed_session_cutoff(self):
        for hour in (9, 15, 16, 17):
            self.assertEqual(m.completed_session_cutoff(dt.datetime(2026,11,6,hour,59,tzinfo=m.ET)),dt.date(2026,11,5))
        self.assertEqual(m.completed_session_cutoff(dt.datetime(2026,11,6,18,tzinfo=m.ET)),dt.date(2026,11,6))
        # Scheduled UTC runs remain after the cutoff in both DST and standard time.
        for month, day in ((7,6),(11,6)):
            self.assertEqual(m.completed_session_cutoff(dt.datetime(2026,month,day,23,30,tzinfo=dt.timezone.utc)),dt.date(2026,month,day))
        self.assertEqual(m.completed_session_cutoff(dt.datetime(2026,11,7,9,tzinfo=m.ET)),dt.date(2026,11,6))
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
        self.assertLessEqual(data['asOf'],data['checkedDate'])
    def test_expanded_peers_and_comparison_dates(self):
        catalog=json.loads((m.DEST.parent/'catalog.json').read_text())
        snapshot=json.loads(m.DEST.read_text())
        self.assertEqual([sum(g['kind']==kind for g in catalog) for kind in ('Sector','Industry','Theme','Alternate')],[11,31,15,1])
        self.assertEqual({g['ticker'] for g in catalog if g['original']},{t for t,_ in m.GROUPS})
        for key, period in snapshot['expanded'].items():
            for side in ('current','previous'):
                self.assertEqual(set(period[side]),{g['ticker'] for g in catalog})
            old_rows=snapshot['periods'][key]['rows']
            previous=sorted(old_rows,key=lambda r:(-period['previous'][r['ticker']],r['ticker']))
            old_ranks={r['ticker']:i for i,r in enumerate(previous,1)}
            for r in old_rows:
                self.assertAlmostEqual(period['current'][r['ticker']],r['return'])
                self.assertEqual(old_ranks[r['ticker']]-r['rank'],r['rankChange'])
if __name__=='__main__':unittest.main()
