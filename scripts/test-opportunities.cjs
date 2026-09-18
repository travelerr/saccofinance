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
test('ZS remains unchanged and Dashboard/board share canonical server-only selectors',()=>{
 const data=require('../lib/premium-opportunities.ts');
 assert.equal(data.opportunities.length,4);assert.equal(data.getOpportunityUpdates('opportunity-001').length,1);
 const zs=data.getPublishedOpportunity('zscaler-001');assert.ok(zs);assert.equal(zs.id,'opportunity-001');
 assert.equal(zs.tradeStatus,'Active');assert.equal(zs.technicalStage,'Stage 1 → Stage 2');
 assert.deepEqual([zs.trade.entryPrice,zs.trade.stopPrice,zs.trade.firstTargetPrice],[190,160,230]);
 assert.equal(zs.trade.quantity,undefined);assert.equal(zs.trade.exitedAt,undefined);assert.equal(zs.secondaryEntry,undefined);assert.equal(zs.catalysts,undefined);assert.equal(zs.targets,undefined);
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
 assert.equal(d.getPublishedOpportunities().length,4);
 assert.equal(new Set(d.opportunities.map(o=>o.id)).size,4);
 const r=d.getPublishedOpportunity('rocket-lab-002');
 assert.equal(r.id,'opportunity-002');assert.equal(r.tradeStatus,'Active');assert.equal(r.technicalStage,null);
 assert.deepEqual([r.trade.enteredAt,r.trade.entryPrice,r.trade.stopPrice,r.trade.firstTargetPrice],['2026-09-04',64,55,85]);
 assert.equal(r.trade.quantity,undefined);assert.equal(r.targets,undefined);assert.equal(r.trade.exitedAt,undefined);
 assert.equal(r.researchPublishedAt,'2026-09-13');assert.equal(r.addedToArchiveAt,'2026-09-18');
 const n=d.getPublishedOpportunity('servicenow-004');
 assert.equal(n.id,'opportunity-004');assert.equal(n.tradeStatus,'Active');assert.equal(n.technicalStage,null);
 assert.deepEqual([n.trade.enteredAt,n.trade.quantity,n.trade.stopPrice,n.trade.firstTargetPrice],['2026-05-28',45,130,175]);
 assert.equal(n.trade.entryPrice,undefined);assert.equal(n.trade.entryType,'accumulation');assert.equal(n.targets,undefined);
 const nu=d.getOpportunityUpdates(n.id);assert.equal(nu.length,2);
 assert.deepEqual(nu.map(u=>u.eventDate),['2026-05-28','2026-09-18']);
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
 const figures=d.opportunities.flatMap(o=>o.charts||(o.chart?[o.chart]:[]));assert.equal(figures.length,5);
 const route=fs.readFileSync(path.join(__dirname,'../app/api/premium/chart/[name]/route.ts'),'utf8');
 for(const figure of figures){const name=figure.src.split('/').pop();assert.match(figure.src,/^\/api\/premium\/chart\//);assert.ok(fs.existsSync(path.join(__dirname,'../data/premium-assets',name+'.png')));assert.ok(route.includes("'"+name+"'"));}
 assert.match(route,/premiumAccess\(\)/);assert.match(route,/private, no-store/);
 assert.doesNotMatch(fs.readFileSync(path.join(__dirname,'../app/premium/dashboard/page.tsx'),'utf8'),/filter\(isCurrentOpportunity\)\.slice/);
});
