import type {ResearchEvent} from './events';

// Standalone member announcements share the original announcement queue category.
export const premiumToolsAnnouncement: ResearchEvent = {
  type: 'LEARNING_LIBRARY_ANNOUNCEMENT',
  key: 'LEARNING_LIBRARY_ANNOUNCEMENT:premium-tools-2026-11-03',
  entityId: 'premium-tools-2026-11-03',
  updateId: null,
  publishedAt: '2026-11-03',
  subject: 'New in Premium: an expanded Sector Gauge and a position sizing calculator',
  preview: 'Explore sector leadership, size a trade, and scan the latest research more easily.',
  label: 'PREMIUM MEMBER UPDATE',
  headline: 'Three updates inside Sacco Premium',
  summary: `Hi everyone,

**Sector Gauge**
I’ve expanded the gauge to cover all 11 sectors. You can compare six timeframes on one page, from one month to a year. Select a sector to see which of its industries and themes are leading.

**Position sizing calculator**
On Tools I Use, enter your planned entry, stop and risk budget to see how many whole shares fit the trade. Add a target to see the potential reward relative to your risk.

**Weekly Outlooks and Opportunities**
I’ve put my take and the key decisions up front so you can scan them quickly. Expand the original research or trade history whenever you want the full detail.

Justin
Sacco Financial`,
  cta: 'EXPLORE THE SECTOR GAUGE',
  path: '/premium/market-strength',
  details: [],
};
