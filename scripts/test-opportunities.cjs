// Load the repository's TypeScript model using its existing TypeScript dependency.
const fs=require('node:fs');const ts=require('typescript');const assert=require('node:assert/strict');const {test}=require('node:test');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8').replace("import 'server-only';",''),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
const m=require('../lib/premium-content.ts');
// Synthetic model fixture only; never imported by the application or published.
const base={id:'test-only-id',slug:'test-only',ticker:'TEST',company:'Test fixture',title:'Test fixture',publicationState:'published',publishedAt:'2026-01-01',updatedAt:'2026-01-02',sector:'Test',technicalStage:'Test',whySurfaced:'Test',setupThesis:'Test',nextCondition:'Test',fundamentalCase:'Test',thesisChanges:'Test',justinsTake:'Test',tradeStatus:'Watching'};
const entry={enteredAt:'2026-01-02',entryPrice:10,documentation:'Explicit test documentation'};
test('unpublished, incomplete and unknown detail records are inaccessible',()=>{
 for(const record of [{...base,publicationState:'draft'},{...base,publicationState:'archived'},{...base,fundamentalCase:''},{...base,publishedAt:'bad-date'}]){assert.equal(m.getPublishedOpportunity(record.slug,[record]),undefined);assert.deepEqual(m.getPublishedOpportunities([record]),[]);}
 assert.equal(m.getPublishedOpportunity('unknown',[base]),undefined);assert.equal(m.getPublishedOpportunity(base.slug,[base]).id,base.id);
});
test('Confirmed is publishable without a trade; Active and Closed require explicit evidence',()=>{
 assert.equal(m.isPublishableOpportunity({...base,tradeStatus:'Confirmed'}),true);
 for(const status of ['Active','Closed'])assert.equal(m.isPublishableOpportunity({...base,tradeStatus:status}),false);
 assert.equal(m.isPublishableOpportunity({...base,tradeStatus:'Active',trade:entry}),true);
 assert.equal(m.isPublishableOpportunity({...base,tradeStatus:'Active',trade:{...entry,documentation:''}}),false);
 assert.equal(m.isPublishableOpportunity({...base,tradeStatus:'Closed',trade:entry}),false);
 assert.equal(m.isPublishableOpportunity({...base,tradeStatus:'Closed',trade:{...entry,exitedAt:'2026-01-03',exitPrice:11}}),true);
});
test('all six status filters work and terminal records stay in archive and detail lookup',()=>{
 const records=m.opportunityStatuses.map((status,i)=>({...base,id:'test-'+i,slug:'test-'+i,tradeStatus:status,trade:{...entry,exitedAt:'2026-01-03',exitPrice:11}}));
 assert.equal(m.filterOpportunities(records,'current','All').length,4);assert.equal(m.filterOpportunities(records,'archive','All').length,2);
 for(const status of m.opportunityStatuses){const view=['Closed','Invalidated'].includes(status)?'archive':'current';assert.equal(m.filterOpportunities(records,view,status).length,1);}
 for(const record of records)assert.ok(m.getPublishedOpportunity(record.slug,records));
});
test('updates retain unchanged statuses, sort chronologically and hide drafts or undocumented trades',()=>{
 const update={id:'update',opportunityId:base.id,publishedAt:'2026-01-03',publicationState:'published',tradeStatusBefore:'Watching',tradeStatusAfter:'Watching',title:'Test',explanation:'Test'};
 const records=[update,{...update,id:'earlier',publishedAt:'2026-01-02'},{...update,id:'draft',publicationState:'draft'},{...update,id:'active',tradeStatusAfter:'Active'}];
 assert.deepEqual(m.getOpportunityUpdates(base.id,records).map(u=>u.id),['earlier','update']);
});
test('ZS current position and Dashboard/board share canonical server-only selectors',()=>{
 const data=require('../lib/premium-opportunities.ts');
 assert.equal(data.opportunities.length,7);assert.equal(data.getOpportunityUpdates('opportunity-001').length,3);
 const zs=data.getPublishedOpportunity('zscaler-001');assert.ok(zs);assert.equal(zs.id,'opportunity-001');
 assert.equal(zs.tradeStatus,'Active');assert.equal(zs.technicalStage,'Stage 1 → Stage 2');
 assert.deepEqual([zs.trade.entryPrice,zs.trade.stopPrice,zs.trade.firstTargetPrice],[190.07,205,230]);
 assert.equal(zs.trade.quantity,10);assert.equal(zs.trade.exitedAt,undefined);assert.equal(zs.secondaryEntry,undefined);assert.equal(zs.catalysts,undefined);assert.equal(zs.targets,undefined);
 assert.equal(data.getOpportunityUpdates(zs.id)[0].tradeStatusBefore,null);
 assert.ok(fs.existsSync(require('node:path').join(__dirname,'../data/premium-assets/zs-2026-09-16.png')));
 assert.equal(zs.chart.src,'/api/premium/chart/zs-2026-09-16');
 assert.equal(fs.existsSync(require('node:path').join(__dirname,'../public/images/opportunities/zs-2026-09-16.png')),false);
 const source=fs.readFileSync(require('node:path').join(__dirname,'../lib/premium-opportunities.ts'),'utf8');assert.match(source,/import 'server-only'/);
 for(const file of ['app/premium/dashboard/page.tsx','app/premium/opportunities/page.tsx'])assert.match(fs.readFileSync(require('node:path').join(__dirname,'..',file),'utf8'),/getPublishedOpportunities\(\)/);
});
test('technical-stage edits never change Active trade status or current visibility',()=>{
 const data=require('../lib/premium-opportunities.ts');const zs=data.opportunities[0];
 for(const technicalStage of ['Stage 2 Confirmed','Technically invalidated']){
  const edited={...zs,technicalStage};assert.equal(edited.tradeStatus,'Active');assert.ok(m.isPublishableOpportunity(edited));assert.ok(m.isCurrentOpportunity(edited));
 }
});

test('the three backfilled records preserve explicit trade facts and omit unavailable facts',()=>{
 const d=require('../lib/premium-opportunities.ts');
 assert.equal(d.getPublishedOpportunities().length,7);
 assert.equal(new Set(d.opportunities.map(o=>o.id)).size,7);
 const r=d.getPublishedOpportunity('rocket-lab-002');
 assert.equal(r.id,'opportunity-002');assert.equal(r.tradeStatus,'Active');assert.equal(r.technicalStage,null);
 assert.deepEqual([r.trade.enteredAt,r.trade.entryPrice,r.trade.stopPrice,r.trade.firstTargetPrice],['2026-09-04',64,55,85]);
 assert.equal(r.trade.quantity,undefined);assert.equal(r.targets,undefined);assert.equal(r.trade.exitedAt,undefined);
 assert.equal(r.researchPublishedAt,'2026-09-13');assert.equal(r.addedToArchiveAt,'2026-09-18');
 const n=d.getPublishedOpportunity('servicenow-004');
 assert.equal(n.id,'opportunity-004');assert.equal(n.tradeStatus,'Closed');assert.equal(n.technicalStage,null);
 assert.deepEqual([n.trade.enteredAt,n.trade.quantity,n.trade.stopPrice,n.trade.firstTargetPrice],['2026-05-28',45,130,175]);
 assert.equal(n.trade.entryPrice,119);assert.equal(n.trade.entryType,'accumulation');assert.equal(n.targets,undefined);
 const nu=d.getOpportunityUpdates(n.id);assert.equal(nu.length,3);
 assert.deepEqual(nu.map(u=>u.eventDate),['2026-05-28','2026-09-18','2026-09-28']);
 for(const key of ['quantity','entryPrice','stopPrice','firstTargetPrice'])assert.equal(nu[0].trade[key],undefined);
 assert.equal(nu[1].trade.quantity,45);
 assert.deepEqual(d.getOpportunityUpdates(r.id).map(u=>u.eventDate),['2026-09-04']);
});
test('SPCX remains a waiting Stage 1 setup without any trade or invented research date',()=>{
 const d=require('../lib/premium-opportunities.ts');const s=d.getPublishedOpportunity('spacex-003');
 assert.equal(s.id,'opportunity-003');assert.equal(s.tradeStatus,'Watching');assert.equal(s.technicalStage,'Stage 1 — Accumulation');
 assert.equal(s.trade,undefined);assert.equal(s.targets,undefined);assert.equal(s.researchPublishedAt,undefined);
 assert.equal(s.setupRange,'~$105–$150');assert.equal(s.entryFramework,'~$122');assert.equal(s.confirmation,'~$150');assert.equal(s.riskInvalidation,'~$105');
 assert.match(s.nextAreaToWatch,/172.*only after a confirmed breakout.*not an active trade target/);
 assert.equal(s.charts.length,2);assert.ok(s.charts.every(c=>c.asOf===undefined));
 const u=d.getOpportunityUpdates(s.id);assert.equal(u.length,1);assert.equal(u[0].eventDate,undefined);assert.equal(u[0].trade,undefined);
 assert.match(u[0].explanation,/original research\/video date is not established/);
});
test('unknown entry requires explicit accumulation evidence; an unassigned stage never infers a trade',()=>{
 assert.equal(m.isPublishableOpportunity({...base,technicalStage:null}),true);
 assert.equal(m.isPublishableOpportunity({...base,technicalStage:null,tradeStatus:'Active'}),false);
 assert.equal(m.isPublishableOpportunity({...base,technicalStage:null,tradeStatus:'Active',trade:{...entry,entryPrice:undefined}}),false);
 const accumulation={enteredAt:'2026-01-02',entryType:'accumulation',documentation:'Explicit documented ownership and accumulation start.'};
 assert.equal(m.isPublishableOpportunity({...base,technicalStage:null,tradeStatus:'Active',trade:accumulation}),true);
 for(const trade of [{...accumulation,documentation:''},{...accumulation,enteredAt:'unknown'},{...accumulation,entryPrice:-1}])assert.equal(m.isPublishableOpportunity({...base,tradeStatus:'Active',trade}),false);
});
test('all chart assets use the authenticated route and the Dashboard does not truncate the board',()=>{
 const path=require('node:path');const d=require('../lib/premium-opportunities.ts');
 const figures=d.opportunities.flatMap(o=>o.charts||(o.chart?[o.chart]:[]));assert.equal(figures.length,9);
 const route=fs.readFileSync(path.join(__dirname,'../app/api/premium/chart/[name]/route.ts'),'utf8');
 for(const figure of figures){const name=figure.src.split('/').pop();assert.match(figure.src,/^\/api\/premium\/chart\//);assert.ok(fs.existsSync(path.join(__dirname,'../data/premium-assets',name+'.png')));assert.ok(route.includes("'"+name+"'"));}
 assert.match(route,/premiumAccess\(\)/);assert.match(route,/private, no-store/);
 assert.doesNotMatch(fs.readFileSync(path.join(__dirname,'../app/premium/dashboard/page.tsx'),'utf8'),/filter\(isCurrentOpportunity\)\.slice/);
});

test('MSTR preserves the starter trade separately from its unfilled add zone and dated chart evidence',()=>{
 const d=require('../lib/premium-opportunities.ts');const o=d.getPublishedOpportunity('strategy-005');
 assert.equal(o.id,'opportunity-005');assert.equal(o.tradeStatus,'Active');assert.equal(o.technicalStage,'Stage 2');
 assert.deepEqual([o.trade.enteredAt,o.trade.quantity,o.trade.entryPrice,o.trade.stopPrice,o.trade.firstTargetPrice],['2026-09-23',10,160,123,196]);
 assert.equal(o.preferredAddZone,'$144–$148');assert.equal(o.trade.exitedAt,undefined);assert.equal(o.targets,undefined);
 assert.deepEqual(o.discoveryChain,['Crypto','Bitcoin','Technical setup','MSTR','Trade']);
 assert.equal(o.fundamentalHeading,'Why MSTR / The Equity Vehicle');
 assert.deepEqual(o.charts.map(c=>c.placement),['origin','framework','confirmation']);
 assert.ok(o.charts.every(c=>c.asOf==='2026-09-23'&&c.source&&c.alt&&c.caption));
 assert.match(o.technicalConfirmation,/previously valid.*166.97/);assert.match(o.nextCondition,/no purchase there has been made/);
 const updates=d.getOpportunityUpdates(o.id);assert.equal(updates.length,2);assert.deepEqual(updates[0].trade,o.trade);
 assert.equal(d.getPublishedOpportunities()[0].id,'opportunity-001');
});

test('NOW closes with verified gross results, preserves history and prepares a unique manual notification',()=>{
 const d=require('../lib/premium-opportunities.ts');const o=d.getPublishedOpportunity('servicenow-004');
 assert.equal(o.tradeStatus,'Closed');assert.equal(o.trade.exitPrice,130.79);assert.equal(o.trade.exitedAt,'2026-09-28');assert.equal(o.trade.exitTime,'9:11:43 AM');assert.equal(o.trade.exitReason,'Stop triggered');
 const result=m.realizedTradeResult(o);assert.equal(result.costBasis,5355);assert.equal(result.saleProceeds,5885.55);assert.equal(result.realizedDollarPnL,530.55);assert.equal(result.realizedPercentReturn.toFixed(1),'9.9');
 assert.equal(m.isCurrentOpportunity(o),false);assert.equal(m.filterOpportunities(d.getPublishedOpportunities(),'archive','Closed')[0].id,o.id);
 assert.equal(d.getOpportunityUpdates(o.id)[1].trade.entryPrice,undefined);assert.equal(o.originalResearchAt,'2026-09-18');assert.equal(o.followUp,'Watching for re-entry');
 const events=require('../lib/email/events.ts').researchEvents([],d.opportunities,d.opportunityUpdates);const event=events.find(e=>e.updateId==='opportunity-004-closed-2026-09-28');
 assert.equal(event.subject,'Opportunity Update: ServiceNow Position Closed +9.9%');assert.equal(event.type,'OPPORTUNITY_MATERIAL_UPDATE');assert.equal(event.path,'/premium/opportunities/servicenow-004');assert.match(event.summary,/before any fees or taxes/);
 for(const other of d.opportunities.filter(x=>x.id!==o.id))assert.equal(m.realizedTradeResult(other),null);
 const closed={...o,trade:{...o.trade,exitPrice:100}};assert.equal(m.realizedTradeResult(closed).realizedDollarPnL,-855);
 assert.equal(m.realizedTradeResult({...o,trade:{...o.trade,entryPrice:undefined}}),null);
});

test('IONQ is a legacy wheel with distinct broker basis, open credits and no launch notification',()=>{
 const d=require('../lib/premium-opportunities.ts');const o=d.getPublishedOpportunity('ionq-006');
 assert.equal(d.opportunities.filter(x=>x.ticker==='IONQ').length,1);assert.equal(o.id,'opportunity-006');assert.equal(o.tradeStatus,'Active');assert.equal(o.positionOrigin,'Legacy');assert.equal(o.strategy,'Wheel Strategy');assert.equal(o.technicalStage,null);
 assert.equal(o.publishedAt,'2026-09-28');assert.equal(o.trade.entryPrice,45);assert.equal(o.trade.quantity,100);assert.equal(o.trade.entryType,'put-assignment');assert.equal(o.trade.stopPrice,undefined);assert.equal(o.trade.firstTargetPrice,undefined);assert.equal(m.realizedTradeResult(o),null);
 assert.deepEqual(o.wheel.fills.map(f=>[f.filledAt,f.optionType,f.strike,f.expiresAt,f.premiumPerShare,f.outcome]),[['2026-06-22','Put',45,'2026-07-17',1.1,'Assigned'],['2026-07-30','Call',45,'2026-08-28',1.45,'Not verified'],['2026-09-08','Call',50,'2026-10-09',2,'Open']]);
 assert.equal(o.wheel.fills.reduce((sum,f)=>sum+Math.round(f.premiumPerShare*100)*f.contracts*f.multiplier,0)/100,455);assert.equal(o.wheel.fills.find(f=>f.id===o.wheel.currentCallId).outcome,'Open');assert.ok(m.isCurrentOpportunity(o));
 const {researchEvents}=require('../lib/email/events.ts');assert.equal(researchEvents([],d.opportunities,d.opportunityUpdates).some(e=>e.entityId===o.id),false);
 const future={...d.getOpportunityUpdates(o.id)[0],id:'test-future-management',suppressNotification:false};assert.ok(researchEvents([],[o],[future]).some(e=>e.updateId===future.id));
});

test('MSTR technical update preserves execution and remains outside material emails',()=>{
 const d=require('../lib/premium-opportunities.ts');const o=d.getPublishedOpportunity('strategy-005');const u=d.getOpportunityUpdates(o.id).at(-1);
 assert.equal(d.opportunities.filter(x=>x.ticker==='MSTR').length,1);assert.equal(u.eventDate,'2026-10-01');assert.equal(u.title,'Technical Confirmation — Stage 2 Now Showing Daily & Weekly');assert.deepEqual(u.trade,o.trade);assert.equal(u.tradeStatusAfter,'Active');assert.equal(u.suppressNotification,true);assert.match(u.explanation,/daily and weekly scans/);assert.match(u.explanation,/153.09/);assert.match(u.explanation,/164.58/);
 assert.ok(fs.existsSync(require('node:path').join(__dirname,'../data/premium-assets/mstr-technical-2026-10-01.png')));assert.equal(u.chart.src,'/api/premium/chart/mstr-technical-2026-10-01');
 assert.equal(require('../lib/email/events.ts').researchEvents([],d.opportunities,d.opportunityUpdates).some(e=>e.updateId===u.id),false);
});

test('EPAM is a single Premium-originated starter with one new-position notification',()=>{
 const d=require('../lib/premium-opportunities.ts');const o=d.getPublishedOpportunity('epam-007');
 assert.equal(d.opportunities.filter(o=>o.ticker==='EPAM').length,1);assert.equal(o.positionOrigin,'Sacco Premium');assert.equal(o.tradeStatus,'Active');assert.equal(o.technicalStage,'Stage 1 / Early transition');
 assert.deepEqual([o.trade.enteredAt,o.trade.quantity,o.trade.entryPrice,o.trade.stopPrice,o.trade.firstTargetPrice,o.trade.secondTargetPrice],['2026-10-01',15,116,100,145,220]);assert.equal(m.realizedTradeResult(o),null);
 assert.equal(d.getOpportunityUpdates(o.id).length,1);assert.deepEqual(d.getOpportunityUpdates(o.id)[0].trade,o.trade);
 const {researchEvents}=require('../lib/email/events.ts');const events=researchEvents(d.weeklyOutlooks,d.opportunities,d.opportunityUpdates).filter(e=>e.entityId===o.id);
 assert.equal(events.length,1);assert.equal(events[0].type,'OPPORTUNITY_PUBLISHED');assert.equal(events[0].path,'/premium/opportunities/epam-007');assert.match(events[0].summary,/15 shares at \$116/);
 assert.match(o.researchSections.find(s=>s.title.startsWith('Selective')).body,/does not establish broad institutional accumulation/);
 assert.match(o.researchSections.find(s=>s.title.startsWith('Next Fundamental')).body,/date pending company confirmation/);
 assert.equal(o.researchSections.find(s=>s.table).table.rows.length,4);
 assert.ok(fs.existsSync(require('node:path').join(__dirname,'../data/premium-assets/epam-2026-10-01.png')));
});
test('EPAM scenarios derive from execution levels and never report realized profit',()=>{
 const {tradeScenarios}=require('../lib/trade-scenarios.ts');const d=require('../lib/premium-opportunities.ts');const t=d.getPublishedOpportunity('epam-007').trade;const s=tradeScenarios(t);
 assert.equal(s.capital,1740);assert.equal(s.riskTotal,240);assert.equal(s.riskPerShare,16);assert.equal(s.riskPct.toFixed(1),'13.8');
 assert.deepEqual(s.targets.map(t=>[t.gainPerShare,t.gainTotal,t.gainPct.toFixed(1),t.rewardRisk.toFixed(2)]),[[29,435,'25.0','1.81'],[104,1560,'89.7','6.50']]);
 assert.equal(tradeScenarios({...t,entryPrice:120}).capital,1800);assert.equal(tradeScenarios({...t,stopPrice:120}),null);assert.equal(tradeScenarios(undefined),null);
});

test('ZS October 5 risk update preserves history, verifies the position and prepares one manual event',()=>{
 const d=require('../lib/premium-opportunities.ts');const o=d.getPublishedOpportunity('zscaler-001');const u=d.getOpportunityUpdates(o.id);assert.equal(d.opportunities.filter(o=>o.ticker==='ZS').length,1);
 assert.equal(o.tradeStatus,'Active');assert.deepEqual([o.trade.quantity,o.trade.entryPrice,o.trade.stopPrice,o.trade.firstTargetPrice],[10,190.07,205,230]);assert.equal(o.trade.secondTargetPrice,undefined);assert.equal(o.trade.exitedAt,undefined);assert.equal(m.realizedTradeResult(o),null);
 assert.equal(o.updatedAt,'2026-10-06');assert.equal(u.length,3);assert.deepEqual([u[0].trade.entryPrice,u[0].trade.stopPrice,u[0].trade.firstTargetPrice],[190,160,230]);assert.equal(u[0].trade.quantity,undefined);
 const update=u[1];assert.equal(update.trade.stopPrice,195);assert.equal(update.tradeStatusBefore,'Active');assert.equal(update.tradeStatusAfter,'Active');assert.match(update.explanation,/49.30/);assert.match(update.explanation,/conditional calculation, not realized profit or a guaranteed outcome/);assert.match(update.explanation,/does not trigger during extended-hours/);assert.match(o.riskUpdate.warning,/NOT a guaranteed exit price/);assert.equal(o.riskUpdate.previousStop,195);
 assert.equal(o.nextCatalyst,undefined);assert.doesNotMatch(o.riskInvalidation,/stop and technical invalidation are \$160/);
 const {researchEvents}=require('../lib/email/events.ts');const {renderResearchEmail}=require('../lib/email/templates.ts');const events=researchEvents(d.weeklyOutlooks,d.opportunities,d.opportunityUpdates).filter(e=>e.updateId===update.id);assert.equal(events.length,1);
 assert.equal(events[0].subject,'Opportunity Update: ZS Stop Raised Ahead of Investor Day');assert.equal(events[0].cta,'VIEW THE ZSCALER UPDATE');assert.equal(events[0].path,'/premium/opportunities/zscaler-001');const email=renderResearchEmail(events[0],'https://saccofinancial.com');assert.match(email.text,/does not trigger during premarket or extended-hours/);assert.match(email.text,/Investing involves risk/);assert.doesNotMatch(email.text,/our 10 shares|guaranteed profit|profit locked in/);
});

test('ZS October 6 stop is 205 with immutable 160/195 history and a distinct manual email',()=>{
 const d=require('../lib/premium-opportunities.ts');const o=d.getPublishedOpportunity('zscaler-001');const history=d.getOpportunityUpdates(o.id);assert.deepEqual(history.map(u=>u.trade.stopPrice),[160,195,205]);assert.deepEqual(history.map(u=>u.publishedAt),['2026-09-16','2026-10-05','2026-10-06']);
 assert.equal(o.tradeStatus,'Active');assert.deepEqual([o.trade.quantity,o.trade.entryPrice,o.trade.stopPrice,o.trade.firstTargetPrice],[10,190.07,205,230]);assert.equal(o.trade.secondTargetPrice,undefined);assert.equal(m.realizedTradeResult(o),null);assert.deepEqual(history[2].trade,o.trade);assert.notEqual(history[1].trade,o.trade);
 assert.equal(Math.round((o.trade.stopPrice-o.trade.entryPrice)*o.trade.quantity*100)/100,149.30);assert.equal(((205/190.07-1)*100).toFixed(2),'7.86');assert.match(history[2].explanation,/hypothetical, not realized profit/);assert.match(history[2].explanation,/not a live quote/);assert.equal(o.nextCatalyst,undefined);
 const {researchEvents}=require('../lib/email/events.ts');const {renderResearchEmail}=require('../lib/email/templates.ts');const events=researchEvents(d.weeklyOutlooks,d.opportunities,d.opportunityUpdates);const e=events.find(e=>e.updateId===history[2].id);assert.equal(events.filter(e=>e.updateId===history[2].id).length,1);assert.equal(e.subject,'Opportunity Update: ZS Stop Raised to $205');assert.equal(e.cta,'VIEW THE ZSCALER UPDATE');assert.equal(e.path,'/premium/opportunities/zscaler-001');assert.notEqual(e.key,events.find(e=>e.updateId===history[1].id).key);const email=renderResearchEmail(e,'https://saccofinancial.com');assert.match(email.text,/actual fill may differ/);assert.match(email.text,/hypothetical, not guaranteed or realized/);assert.doesNotMatch(email.text,/profit locked in|risk-free|cannot lose|target achieved/);
});
