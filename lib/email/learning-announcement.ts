import type {ResearchEvent} from './events';

/** Manually queued once through the existing admin notification workflow. */
export const learningLibraryAnnouncement:ResearchEvent={
 key:'LEARNING_LIBRARY_ANNOUNCEMENT:learning-library-launch',
 type:'LEARNING_LIBRARY_ANNOUNCEMENT',
 entityId:'learning-library-launch',
 updateId:null,
 publishedAt:'2026-10-22T12:00:00-04:00',
 subject:'New in Sacco Premium: The Learning Library',
 preview:'Two videos to walk you through my research process—with more coming.',
 label:'LEARNING LIBRARY',
 headline:'Two lessons ready to watch',
 summary:"Hey everyone,\n\nI’ve added a Learning Library to Sacco Premium, with two videos ready to watch:\n\nLesson 1 — How I Find Stocks\nMy complete research process, from market conditions and sector strength to individual stock setups.\n\nLesson 2 — Finding a Stock Opportunity\nA real-time walkthrough showing how I find an idea, review the chart and fundamentals, and plan an entry, stop, and target.\n\nMore videos are coming. These first two are a great place to start—or revisit how I approach the research behind the Opportunity Board.\n\nJustin\nSacco Financial",
 cta:'EXPLORE THE LEARNING LIBRARY',
 path:'/premium/learn',
 details:[],
 disclosure:'This content is educational and informational and does not constitute personalized investment advice. Investing involves risk, including loss of principal.'
};
