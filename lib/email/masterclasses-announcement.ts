import type {ResearchEvent} from './events';
import {masterclasses} from '../masterclasses/catalog';
const first=masterclasses.find(e=>e.id==='how-i-find-my-next-stock-trade')!;
// Keep the original announcement identity when rescheduling to preserve duplicate-send protection.
export const masterclassesAnnouncement:ResearchEvent={
 type:'LEARNING_LIBRARY_ANNOUNCEMENT',key:'LEARNING_LIBRARY_ANNOUNCEMENT:masterclasses-2026-11-19',entityId:'masterclasses-2026-11-19',updateId:null,publishedAt:'2026-11-10',
 subject:'Introducing Sacco Premium Live Masterclasses!',preview:'Our first live session is Wednesday, November 18 at 7:00 PM Eastern. Included with your membership.',
 label:'NEW PREMIUM BENEFIT',headline:'Monthly Live Masterclasses',
 charts:[{id:'masterclass-thumbnail',src:first.thumbnail,alt:first.title,caption:'Wednesday, November 18, 2026 · 7:00 PM Eastern'}],
 summary:`I'm excited to announce a brand-new feature coming to Sacco Premium: **Monthly Live Masterclasses!**

Starting Wednesday, November 18, I'll be hosting live sessions exclusively for Sacco Premium members.

We'll dive into trading strategies, technical analysis, finding stock opportunities, managing risk, and the research process behind my own investment decisions.

You'll also be able to join live, ask questions, and work through the markets with me in real time.

**Our first masterclass: How I Find My Next Stock Trade**
Wednesday, November 18
7:00 PM Eastern

{{chart:masterclass-thumbnail}}

Can't make it live? No problem. Every masterclass will be recorded and added to the Masterclasses library so you can watch whenever it's convenient.

**This is included with your existing Sacco Premium membership at no additional cost.**

Head over to the new Masterclasses tab to view the upcoming session and set a YouTube reminder.

Looking forward to seeing everyone there!

Justin
Sacco Financial`,
 cta:'VIEW THE UPCOMING MASTERCLASS',path:'/premium/masterclasses',details:[],
 disclosure:'For educational and informational purposes only. This is not personalized investment advice. Investing involves risk, including loss of principal.',
};

const reminderId = 'masterclass-reminder-2026-11-18';
export const masterclassNovember18Reminder: ResearchEvent = {
 type: 'LEARNING_LIBRARY_ANNOUNCEMENT',
 key: `LEARNING_LIBRARY_ANNOUNCEMENT:${reminderId}`,
 entityId: reminderId,
 updateId: null,
 publishedAt: '2026-11-17',
 subject: 'Reminder: Join me live Wednesday at 7 p.m. Eastern',
 preview: 'How I Find My Next Stock Trade starts Wednesday, November 18. Bring your questions for live Q&A.',
 label: 'LIVE MASTERCLASS REMINDER',
 headline: first.title,
 summary: `Join me **Wednesday, November 18 at 7:00 p.m. Eastern** for our first Sacco Premium live masterclass.

I’ll walk you through how I narrow a list of stocks to one trade worth taking. We’ll start with sector strength, look at an individual stock’s chart, and work through where I’d enter, where I’d put my stop, and how much I’d risk.

[Open the YouTube livestream](https://youtube.com/live/${first.videoId}) to set a reminder now or watch on Wednesday. Bring your questions. I’ll take them in the live chat.

If you can’t join live, you’ll be able to watch the recording in the Masterclasses tab.

See you Wednesday,
Justin
Sacco Financial`,
 cta: 'View the Masterclass on Sacco Premium',
 path: '/premium/masterclasses',
 details: [],
};

// Separate reminder identity preserves send history for the earlier announcement.
const tonightId = 'masterclass-tonight-2026-11-18';
export const masterclassTonightReminder: ResearchEvent = {
 type: 'LEARNING_LIBRARY_ANNOUNCEMENT',
 key: `LEARNING_LIBRARY_ANNOUNCEMENT:${tonightId}`,
 entityId: tonightId,
 updateId: null,
 publishedAt: '2026-11-18',
 subject: 'We’re going live tonight at 7 p.m. Eastern!',
 preview: 'Join our first Sacco Premium Live Masterclass: How I Find My Next Stock Trade.',
 label: 'LIVE TONIGHT · 7 P.M. EASTERN',
 headline: first.title,
 summary: `Hey everyone,

Quick reminder: our first Sacco Premium Live Masterclass starts **tonight, Wednesday, November 18, at 7 p.m. Eastern!**

I’ll walk through how I find stock opportunities, evaluate technical setups, and plan entries, stops, targets, and risk. Bring your questions—we’ll have live Q&A through YouTube chat.

[Join the YouTube livestream](https://youtube.com/live/${first.videoId})

Can’t make it live? The recording will be available in the Masterclasses library afterward.

See you there!

Justin
Sacco Financial`,
 cta: 'OPEN THE MASTERCLASS',
 path: '/premium/masterclasses',
 details: [],
};
