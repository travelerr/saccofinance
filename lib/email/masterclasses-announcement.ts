import type {ResearchEvent} from './events';
import {masterclasses} from '../masterclasses/catalog';
const first=masterclasses.find(e=>e.id==='how-i-find-my-next-stock-trade')!;
// Uses the existing member-announcement queue category and its duplicate-send protection.
export const masterclassesAnnouncement:ResearchEvent={
 type:'LEARNING_LIBRARY_ANNOUNCEMENT',key:'LEARNING_LIBRARY_ANNOUNCEMENT:masterclasses-2026-11-19',entityId:'masterclasses-2026-11-19',updateId:null,publishedAt:'2026-11-10',
 subject:'Introducing Sacco Premium Live Masterclasses!',preview:'Our first live session is Thursday, November 19 at 7:00 PM Eastern. Included with your membership.',
 label:'NEW PREMIUM BENEFIT',headline:'Monthly Live Masterclasses',
 charts:[{id:'masterclass-thumbnail',src:first.thumbnail,alt:first.title,caption:'Thursday, November 19, 2026 · 7:00 PM Eastern'}],
 summary:`I'm excited to announce a brand-new feature coming to Sacco Premium: **Monthly Live Masterclasses!**

Starting Thursday, November 19, I'll be hosting live sessions exclusively for Sacco Premium members.

We'll dive into trading strategies, technical analysis, finding stock opportunities, managing risk, and the research process behind my own investment decisions.

You'll also be able to join live, ask questions, and work through the markets with me in real time.

**Our first masterclass: How I Find My Next Stock Trade**
Thursday, November 19
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
