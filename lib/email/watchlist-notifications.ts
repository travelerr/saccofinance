import {publishedWatchlists} from '../premium-watchlist';
import type {ResearchEvent} from './events';
// Reuse the general member-announcement queue; nothing is automatically sent.
export function watchlistNotifications():ResearchEvent[]{return publishedWatchlists().map(edition=>({
 type:'LEARNING_LIBRARY_ANNOUNCEMENT',key:'LEARNING_LIBRARY_ANNOUNCEMENT:watchlist-'+edition.id,entityId:'watchlist-'+edition.id,updateId:null,publishedAt:edition.date,
 subject:'On My Radar: '+edition.candidates.map(s=>s.ticker+(s.tentative?'?':'')).join(', '),
 preview:'A look at the stocks I’m researching between trades.',label:'SACCO PREMIUM WATCHLIST',headline:edition.title,
 summary:edition.introduction+'\n\n'+edition.candidates.map(s=>'**'+s.ticker+' — '+s.company+'**'+(s.tentative?' · Tentative':'')+(s.whyWatching?'\n'+s.whyWatching:'')+(s.confirmation?'\nWhat I need to see: '+s.confirmation:'')+(s.invalidation?'\nWhat would change my view: '+s.invalidation:'')).join('\n\n')+'\n\nThese are research candidates, not instructions to buy. I’m staying selective rather than forcing a trade.\n\nJustin\nSacco Financial',
 cta:'VIEW MY WATCHLIST',path:'/premium/watchlist#'+edition.id,details:[],
}));}
