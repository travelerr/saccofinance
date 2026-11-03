import type {ResearchEvent} from './events';

// Standalone member announcements share the original announcement queue category.
export const premiumToolsAnnouncement: ResearchEvent = {
  type: 'LEARNING_LIBRARY_ANNOUNCEMENT',
  key: 'LEARNING_LIBRARY_ANNOUNCEMENT:premium-tools-2026-11-03',
  entityId: 'premium-tools-2026-11-03',
  updateId: null,
  publishedAt: '2026-11-03',
  subject: 'What’s new in Sacco Premium',
  preview: 'An expanded Sector Gauge, a position sizing calculator, easier-to-scan research, and two video lessons.',
  label: 'PREMIUM MEMBER UPDATE',
  headline: 'Four updates inside Sacco Premium',
  summary: `Hi everyone,

**Sector Gauge**
I’ve expanded the gauge to cover all 11 sectors. You can compare six timeframes on one page, from one month to a year. Select a sector to see which of its industries and themes are leading.

**Position sizing calculator**
On Tools I Use, enter your planned entry, stop and risk budget to see how many whole shares fit the trade. Add a target to see the potential reward relative to your risk.

**Weekly Outlooks and Opportunities**
I’ve put my take and the key decisions up front so you can scan them quickly. Expand the original research or trade history whenever you want the full detail.

**Learning Library**
The first two lessons are ready to watch. In Lesson 1, I walk through how I find stocks. In Lesson 2, I apply that process to a stock opportunity in real time. I’ll add more videos to the library over time.

Justin
Sacco Financial`,
  cta: 'OPEN YOUR PREMIUM DASHBOARD',
  path: '/premium/dashboard',
  details: [],
};
