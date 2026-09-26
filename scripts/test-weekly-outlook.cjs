const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');const assert=require('node:assert/strict');const {test}=require('node:test');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8').replace("import 'server-only';",''),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
const data=require('../lib/premium-opportunities.ts');const model=require('../lib/premium-content.ts');
test('one real Issue 001 supplies the exact publication, week, posture and index levels',()=>{
 const issues=data.getPublishedWeeklyOutlooks();assert.equal(issues.length,2);const o=issues.find(o=>o.id==='weekly-outlook-001');
 assert.equal(o.id,'weekly-outlook-001');assert.equal(o.title,'The Market Survived the Rate Hike. Now It Has to Prove It.');
 assert.deepEqual([o.publishedAt,o.weekOf,o.weekEnd],['2026-09-20','2026-09-21','2026-09-25']);
 assert.deepEqual(o.marketLevels,[{index:'S&P 500',support:7507},{index:'Nasdaq Composite',support:25800}]);
 assert.equal(o.marketPosture,'Selective / Waiting for confirmation');assert.equal(model.weeklyOutlookHref(o),'/premium/issue-001');
 assert.equal(o.events.length,5);assert.equal(o.events.filter(e=>e.day==='Thursday / September 24').length,2);
 assert.match(o.read,/Federal Reserve raised rates by 25 basis points/);assert.match(o.gamePlan,/We're waiting\.\n\nAt least initially\./);
});
test('weekly opportunity references resolve to canonical objects without copying trade data',()=>{
 const o=data.weeklyOutlooks.find(o=>o.id==='weekly-outlook-001');const records=data.getWeeklyOutlookOpportunities(o);
 assert.deepEqual(records.map(r=>r.ticker),['RKLB','NOW','ZS','SPCX']);
 for(const record of records)assert.equal(record,data.opportunities.find(r=>r.id===record.id));
 assert.deepEqual(o.opportunityCommentary.map(c=>c.opportunityId),o.opportunityIds);
 for(const c of o.opportunityCommentary)assert.deepEqual(Object.keys(c).sort(),['body','opportunityId']);
 const s=records[3];assert.equal(s.tradeStatus,'Watching');assert.equal(s.trade,undefined);assert.equal(s.targets,undefined);
 assert.equal(records[1].trade.entryPrice,undefined);assert.equal(records[0].trade.quantity,undefined);
 assert.deepEqual(records.slice(0,3).map(r=>[r.trade.stopPrice,r.trade.firstTargetPrice]),[[55,85],[130,175],[160,230]]);
});
test('both routes require Premium and use the same research renderer; dashboard consumes the selector',()=>{
 for(const file of ['app/premium/issue-001/page.tsx','app/premium/issue-002/page.tsx','app/premium/weekly-outlook/page.tsx']){
  const source=fs.readFileSync(path.join(__dirname,'..',file),'utf8');assert.match(source,/await requirePremium\(\)/);assert.match(source,/<WeeklyOutlookResearch/);assert.doesNotMatch(source,/ARCHIVED PROTOTYPE|Turbulence\. Patience/);
 }
 const dashboard=fs.readFileSync(path.join(__dirname,'../app/premium/dashboard/page.tsx'),'utf8');assert.match(dashboard,/getLatestWeeklyOutlook\(\)/);assert.match(dashboard,/outlook.marketPosture/);
});

test('Issue 002 is the single latest issue with dated editorial sector snapshots',()=>{
 const o=data.getLatestWeeklyOutlook();assert.equal(o.id,'weekly-outlook-002');assert.equal(data.weeklyOutlooks.filter(x=>x.id===o.id).length,1);
 assert.equal(o.title,'The Market Still Looks Strong. I Don’t Think the Rate Hike Has Hit Yet.');
 assert.deepEqual([o.publishedAt,o.weekOf,o.weekEnd,o.perspectiveDate],['2026-09-26','2026-09-28','2026-10-02','2026-09-26']);
 assert.equal(model.weeklyOutlookHref(o),'/premium/issue-002');assert.equal(o.marketPosture,'Selective / Expecting higher volatility');
 assert.deepEqual(o.sectorSnapshots.map(s=>[s.ticker,s.periods.map(p=>p.returnPct),s.periods.map(p=>p.rank)]),[
 ['SMH',[7.12,9.82,-2.97,52.19,64.90,87.60],[1,2,11,2,1,1]],
 ['CIBR',[1.51,10.69,23.25,64.02,42.02,37.03],[2,1,3,1,3,7]],
 ['IGV',[1.30,4.59,24.35,32.60,-0.98,-6.99],[3,3,1,3,16,21]],
 ['SEA',[-4.29,-1.96,17.78,17.98,38.01,46.03],[22,6,4,6,4,5]]]);
 assert.deepEqual(o.sectorSnapshots[0].periods.map(p=>p.period),['1W','1M','3M','6M','9M','12M']);
 assert.equal(o.sectorAreas.find(a=>a.classification==='Cooling').area,'Shipping & Air Cargo');assert.match(o.sectorFocus,/SPY gained \+0.85%/);
 assert.match(o.sectorSnapshots[3].commentary,/19 places/);
 const index=fs.readFileSync(path.join(__dirname,'../app/premium/weekly-outlook/page.tsx'),'utf8');assert.match(index,/outlooks=\{outlooks.slice\(1\)\}/);
});
test('Issue 002 references all five unchanged trades; scenario and radar cannot create positions',()=>{
 const o=data.getLatestWeeklyOutlook(),records=data.getWeeklyOutlookOpportunities(o);
 assert.deepEqual(records.map(r=>r.ticker),['ZS','NOW','RKLB','SPCX','MSTR']);
 for(const record of records)assert.equal(record,data.opportunities.find(r=>r.id===record.id));
 assert.deepEqual(o.opportunityCommentary.map(c=>c.opportunityId),o.opportunityIds);
 assert.equal(records[3].tradeStatus,'Watching');assert.equal(records[3].trade,undefined);assert.equal(records[1].trade.entryPrice,undefined);
 assert.deepEqual(records.filter(r=>r.trade).map(r=>[r.ticker,r.trade.stopPrice,r.trade.firstTargetPrice]),[['ZS',160,230],['NOW',130,175],['RKLB',55,85],['MSTR',123,196]]);
 assert.deepEqual([records[4].trade.quantity,records[4].trade.entryPrice,records[4].preferredAddZone],[10,160,'$144–$148']);
 assert.equal(data.opportunities.length,5);assert.ok(!data.opportunities.some(r=>['GOOG','GOOGL','META'].includes(r.ticker)));
 const s=o.bitcoinScenario;assert.deepEqual([s.bitcoinReference,s.bitcoinScenario,s.netBitcoinValuePerShare,s.mnav],[77288,125000,118.99,1.10]);
 assert.equal(Math.round(s.netBitcoinValuePerShare*s.bitcoinScenario/s.bitcoinReference*s.mnav),212);assert.equal(s.displayRange,'~$210–$212');
 assert.equal(s.assumptions.length,4);assert.equal(o.longTermRadar.length,3);
 assert.match(fs.readFileSync(path.join(__dirname,'../components/premium/weekly-outlook.tsx'),'utf8'),/NOT A PRICE TARGET/);
 assert.match(o.events.find(e=>e.title.startsWith('Oura IPO')).description,/tentative/);
});
test('Issue 002 email is prepared once with its own copy and existing stable duplicate-send key',()=>{
 const {researchEvents}=require('../lib/email/events.ts');const {renderResearchEmail}=require('../lib/email/templates.ts');
 const events=researchEvents(data.weeklyOutlooks,data.opportunities,data.opportunityUpdates).filter(e=>e.entityId==='weekly-outlook-002');assert.equal(events.length,1);
 const event=events[0];assert.equal(event.key,'WEEKLY_OUTLOOK_PUBLISHED:weekly-outlook-002');assert.equal(event.subject,'New Weekly Outlook: '+data.getLatestWeeklyOutlook().title);
 assert.equal(event.cta,'READ THE WEEKLY OUTLOOK');assert.equal(event.path,'/premium/issue-002');assert.equal(event.summary,data.getLatestWeeklyOutlook().notificationSummary);
 const email=renderResearchEmail(event,'https://saccofinancial.com');assert.equal(email.url,'https://saccofinancial.com/premium/issue-002');assert.match(email.text,/Leadership is narrowing while rates remain elevated/);
});

test('Issue 002 uses the existing member shell and active Weekly Outlook navigation',()=>{
 for(const file of ['components/premium/product-frame.tsx','components/premium/navigation.tsx'])assert.ok(fs.readFileSync(path.join(__dirname,'..',file),'utf8').includes('/premium/issue-002'));
});
