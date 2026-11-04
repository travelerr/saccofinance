const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict'),{test}=require('node:test');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8').replace("import 'server-only';",''),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {weeklyOutlooks,opportunities}=require('../lib/premium-opportunities.ts');
const {outlookBriefs,outlookCalendar}=require('../lib/outlook-briefs.ts');
const {currentPositionSummary}=require('../lib/opportunity-presentation.ts');
test('every published issue has five editorial summary fields and a dated calendar without mutating the original',()=>{
 const before=JSON.stringify(weeklyOutlooks);
 for(const o of weeklyOutlooks.filter(o=>o.publicationState==='published')){
  const b=outlookBriefs[o.id];assert.ok(b,o.id);for(const k of ['take','market','sectors','positions','plan'])assert.ok(b[k]?.trim());
  const events=outlookCalendar(o);assert.ok(events.length>=4,o.id);for(const e of events){assert.ok(e.day);assert.ok(e.event);}
 }
 assert.equal(JSON.stringify(weeklyOutlooks),before);
});
test('current position summary follows canonical changes, preserves proposed stops, and does not reopen closed trades',()=>{
 const current=opportunities.find(o=>o.id==='opportunity-013');assert.match(currentPositionSummary(current),/closed/);const ar={...current,tradeStatus:'Active'};assert.match(currentPositionSummary(ar),/100 shares.*41.66/);assert.match(currentPositionSummary(ar),/proposed.*39.75.*no stop order/);
 const changed={...ar,trade:{...ar.trade,quantity:50,entryPrice:42,stopPrice:41,proposedStopPrice:undefined}};
 assert.match(currentPositionSummary(changed),/50 shares.*\$42.*documented stop is \$41/);
 assert.doesNotMatch(currentPositionSummary(changed),/39.75|100 shares/);
 const closed=opportunities.find(o=>o.id==='opportunity-011');assert.match(currentPositionSummary(closed),/closed/);assert.doesNotMatch(currentPositionSummary(closed),/holding|raised my stop/);
 const watching=opportunities.find(o=>o.id==='opportunity-012');assert.match(currentPositionSummary(watching),/not opened/);
});
