const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');const assert=require('node:assert/strict');const {test}=require('node:test');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8').replace("import 'server-only';",''),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
const data=require('../lib/premium-opportunities.ts');const model=require('../lib/premium-content.ts');
test('one real Issue 001 supplies the exact publication, week, posture and index levels',()=>{
 const issues=data.getPublishedWeeklyOutlooks();assert.equal(issues.length,1);const o=issues[0];assert.equal(o,data.getLatestWeeklyOutlook());
 assert.equal(o.id,'weekly-outlook-001');assert.equal(o.title,'The Market Survived the Rate Hike. Now It Has to Prove It.');
 assert.deepEqual([o.publishedAt,o.weekOf,o.weekEnd],['2026-09-20','2026-09-21','2026-09-25']);
 assert.deepEqual(o.marketLevels,[{index:'S&P 500',support:7507},{index:'Nasdaq Composite',support:25800}]);
 assert.equal(o.marketPosture,'Selective / Waiting for confirmation');assert.equal(model.weeklyOutlookHref(o),'/premium/issue-001');
 assert.equal(o.events.length,5);assert.equal(o.events.filter(e=>e.day==='Thursday / September 24').length,2);
 assert.match(o.read,/Federal Reserve raised rates by 25 basis points/);assert.match(o.gamePlan,/We're waiting\.\n\nAt least initially\./);
});
test('weekly opportunity references resolve to canonical objects without copying trade data',()=>{
 const o=data.getLatestWeeklyOutlook();const records=data.getWeeklyOutlookOpportunities(o);
 assert.deepEqual(records.map(r=>r.ticker),['RKLB','NOW','ZS','SPCX']);
 for(const record of records)assert.equal(record,data.opportunities.find(r=>r.id===record.id));
 assert.deepEqual(o.opportunityCommentary.map(c=>c.opportunityId),o.opportunityIds);
 for(const c of o.opportunityCommentary)assert.deepEqual(Object.keys(c).sort(),['body','opportunityId']);
 const s=records[3];assert.equal(s.tradeStatus,'Watching');assert.equal(s.trade,undefined);assert.equal(s.targets,undefined);
 assert.equal(records[1].trade.entryPrice,undefined);assert.equal(records[0].trade.quantity,undefined);
 assert.deepEqual(records.slice(0,3).map(r=>[r.trade.stopPrice,r.trade.firstTargetPrice]),[[55,85],[130,175],[160,230]]);
});
test('both routes require Premium and use the same research renderer; dashboard consumes the selector',()=>{
 for(const file of ['app/premium/issue-001/page.tsx','app/premium/weekly-outlook/page.tsx']){
  const source=fs.readFileSync(path.join(__dirname,'..',file),'utf8');assert.match(source,/await requirePremium\(\)/);assert.match(source,/<WeeklyOutlookResearch/);assert.doesNotMatch(source,/ARCHIVED PROTOTYPE|Turbulence\. Patience/);
 }
 const dashboard=fs.readFileSync(path.join(__dirname,'../app/premium/dashboard/page.tsx'),'utf8');assert.match(dashboard,/getLatestWeeklyOutlook\(\)/);assert.match(dashboard,/outlook.marketPosture/);
});
