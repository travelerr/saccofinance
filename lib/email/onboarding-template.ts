import {renderResearchEmail} from './templates';
export type OnboardingStep=0|2|5;
export const onboardingCopy={
 0:{subject:'Welcome to Sacco Premium',headline:'Welcome to Sacco Premium!',cta:'Explore Your Premium Dashboard',path:'/premium/dashboard',paragraphs:[
 'First, thank you for subscribing. I really appreciate your support.',
 'I built Premium to give you a deeper look at how I research stocks, identify opportunities, and manage my actual investments.',
 "If you’re wondering where to start, here’s how I approach the market:\n\nMarket → Sector → ETF → Stock → Setup → Trade",
 'Inside Premium, you’ll find:\n\nWeekly Market Outlook: What I’m watching across the market and the catalysts coming up.\n\nSector Gauge: Which areas are outperforming or underperforming the S&P 500.\n\nOpportunity Board: The companies I’m researching, potential trade setups, and my actual positions.\n\nTrade Updates: How my investment decisions develop, including both winning and losing trades.',
 'My suggestion? Start with the Opportunity Board and take a look at a few of the companies I’m currently watching.',
 'And remember, this isn’t about copying every trade I make. It’s about understanding the research and risk-management process behind those decisions.',
 'Thanks again for being here!\n\nJustin\nSacco Financial'
 ]},
 2:{subject:'The feature I want you to explore',headline:'Explore the Opportunity Board',cta:'Explore the Opportunity Board',path:'/premium/opportunities',paragraphs:[
 'Hey!\n\nYou’ve had a couple of days to explore Sacco Premium, so I wanted to show you one of my favorite parts of the platform: the Opportunity Board.',
 'This is where I document the companies I’m researching and the trades I’m actually making.',
 'You’ll notice three types of Opportunities:\n\nWatching: Companies I’m interested in, but haven’t necessarily purchased.\n\nActive: Positions I’ve opened, including my entries, stops, targets, and ongoing updates.\n\nClosed: Completed trades, including the original research, how I managed them, and the final results.',
 'And yes, I document the losses too. The goal is to show the entire decision-making process, not just highlight winning trades.',
 'I’d encourage you to open an Opportunity and read through its timeline. You’ll see how the original research connects to what actually happens afterward.',
 'I’ll continue adding research and documenting material changes as new setups develop.\n\nJustin\nSacco Financial'
 ]},
 5:{subject:'How I actually find stocks',headline:'From market strength to a potential setup',cta:'Explore the Sector Gauge and Opportunities',path:'/premium/dashboard',paragraphs:[
 'One of the questions I get most often is how I find stocks to research.',
 'I don’t start by randomly searching through thousands of companies. I start with the broader market.',
 'Then I use the Sector Gauge to identify which industries are showing relative strength. From there, I examine ETFs tracking those sectors and look through their holdings for companies with attractive technical setups.',
 'Once I find something interesting, I investigate the fundamentals.',
 'An example from October 2026 was Centene (CNC). After noticing strength in healthcare, I reviewed the IHF ETF, worked through its holdings, and identified CNC as a potential Stage 2 recovery setup.',
 'But I didn’t immediately buy it. I documented the research, technical levels, and risks, then added it as a Watching opportunity.',
 'That’s the process I want you to understand. The Weekly Outlook provides my market context, the Sector Gauge helps me explore leadership, and the Opportunity Board records the resulting research and decisions.',
 'And if there are features you’d like to see added to Premium, I’d love to hear your suggestions.\n\nJustin\nSacco Financial'
 ]}
} as const;
export function onboardingWindow(step:OnboardingStep,startedAt:string,now=Date.now()){
 const age=now-Date.parse(startedAt);return age>=step*86400000&&age<({0:2,2:5,5:7}[step])*86400000;
}
export function renderOnboardingEmail(step:OnboardingStep,origin:string,unsubscribe?:string){
 const copy=onboardingCopy[step];
 return renderResearchEmail({type:'MEMBER_ONBOARDING',entityId:'onboarding-day-'+step,label:'GETTING STARTED',subject:copy.subject,headline:copy.headline,preview:copy.headline,summary:(step===0?['Your membership is ready. If you haven’t set a password yet, open Account and choose “Set or change your password.” If you already have one, use your existing login.',...copy.paragraphs]:copy.paragraphs).join('\n\n'),details:[],cta:copy.cta,path:copy.path,disclosure:'Educational and informational research, not personalized investment advice. Investing involves risk, including loss of principal. My personal trading results are not subscriber performance; past performance does not guarantee future results.'},origin,unsubscribe);
}
