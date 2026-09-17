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
test('one real ZS record, one initial update, and Dashboard/board share server-only selectors',()=>{
 const data=require('../lib/premium-opportunities.ts');
 assert.equal(data.opportunities.length,1);assert.equal(data.opportunityUpdates.length,1);
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
