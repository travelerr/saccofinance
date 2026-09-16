// Load the repository's TypeScript model using its existing TypeScript dependency.
const fs=require('node:fs');const ts=require('typescript');const assert=require('node:assert/strict');const {test}=require('node:test');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
const m=require('../lib/premium-content.ts');
// Synthetic model fixture only; never imported by the application or published.
const base={id:'test-only-id',slug:'test-only',ticker:'TEST',company:'Test fixture',title:'Test fixture',publicationState:'published',publishedAt:'2026-01-01',updatedAt:'2026-01-02',sector:'Test',stage:'Test',whySurfaced:'Test',setupThesis:'Test',nextCondition:'Test',fundamentalCase:'Test',thesisChanges:'Test',justinsTake:'Test',status:'Watching'};
const entry={enteredAt:'2026-01-02',entryPrice:10,documentation:'Explicit test documentation'};
test('unpublished, incomplete and unknown detail records are inaccessible',()=>{
 for(const record of [{...base,publicationState:'draft'},{...base,publicationState:'archived'},{...base,fundamentalCase:''},{...base,publishedAt:'bad-date'}]){assert.equal(m.getPublishedOpportunity(record.slug,[record]),undefined);assert.deepEqual(m.getPublishedOpportunities([record]),[]);}
 assert.equal(m.getPublishedOpportunity('unknown',[base]),undefined);assert.equal(m.getPublishedOpportunity(base.slug,[base]).id,base.id);
});
test('Confirmed is publishable without a trade; Active and Closed require explicit evidence',()=>{
 assert.equal(m.isPublishableOpportunity({...base,status:'Confirmed'}),true);
 for(const status of ['Active','Closed'])assert.equal(m.isPublishableOpportunity({...base,status}),false);
 assert.equal(m.isPublishableOpportunity({...base,status:'Active',trade:entry}),true);
 assert.equal(m.isPublishableOpportunity({...base,status:'Active',trade:{...entry,documentation:''}}),false);
 assert.equal(m.isPublishableOpportunity({...base,status:'Closed',trade:entry}),false);
 assert.equal(m.isPublishableOpportunity({...base,status:'Closed',trade:{...entry,exitedAt:'2026-01-03',exitPrice:11}}),true);
});
test('all six status filters work and terminal records stay in archive and detail lookup',()=>{
 const records=m.opportunityStatuses.map((status,i)=>({...base,id:'test-'+i,slug:'test-'+i,status,trade:{...entry,exitedAt:'2026-01-03',exitPrice:11}}));
 assert.equal(m.filterOpportunities(records,'current','All').length,4);assert.equal(m.filterOpportunities(records,'archive','All').length,2);
 for(const status of m.opportunityStatuses){const view=['Closed','Invalidated'].includes(status)?'archive':'current';assert.equal(m.filterOpportunities(records,view,status).length,1);}
 for(const record of records)assert.ok(m.getPublishedOpportunity(record.slug,records));
});
test('updates retain unchanged statuses, sort chronologically and hide drafts or undocumented trades',()=>{
 const update={id:'update',opportunityId:base.id,publishedAt:'2026-01-03',publicationState:'published',statusBefore:'Watching',statusAfter:'Watching',title:'Test',explanation:'Test'};
 const records=[update,{...update,id:'earlier',publishedAt:'2026-01-02'},{...update,id:'draft',publicationState:'draft'},{...update,id:'active',statusAfter:'Active'}];
 assert.deepEqual(m.getOpportunityUpdates(base.id,records).map(u=>u.id),['earlier','update']);
});
test('production source has no seeded records; Dashboard and board share published selectors',()=>{
 const source=fs.readFileSync(require('node:path').join(__dirname,'../lib/premium-opportunities.ts'),'utf8');assert.match(source,/import 'server-only'/);assert.match(source,/opportunities:Opportunity\[\]=\[\]/);assert.match(source,/opportunityUpdates:OpportunityUpdate\[\]=\[\]/);
 for(const file of ['app/premium/dashboard/page.tsx','app/premium/opportunities/page.tsx'])assert.match(fs.readFileSync(require('node:path').join(__dirname,'..',file),'utf8'),/getPublishedOpportunities\(\)/);
});
