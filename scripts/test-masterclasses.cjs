const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict'),{test}=require('node:test');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {masterclasses,masterclassLibrary,masterclassDate}=require('../lib/masterclasses/catalog.ts');
const first=masterclasses[0];
test('scheduled stream remains visible during the session; only ready recordings enter library',()=>{
 const now=Date.parse(first.startsAt)+3600000;
 assert.equal(masterclassLibrary([first],now).upcoming.id,first.id);
 const completed={...first,status:'completed'};
 assert.equal(masterclassLibrary([completed],now).recordings.length,0);
 const recorded={...completed,recordingId:first.videoId};
 assert.equal(masterclassLibrary([recorded],now).recordings.length,1);
 assert.equal(masterclassLibrary([recorded],now).upcoming,undefined);
 assert.equal(masterclassLibrary([{...first,status:'canceled'}],now).upcoming,undefined);
 assert.match(masterclassDate(first.startsAt),/7:00 PM EST/);
});
test('announcement renders a valid unsent snapshot with thumbnail, member destination and opt-out',()=>{
 const {masterclassesAnnouncement:event}=require('../lib/email/masterclasses-announcement.ts');
 const {renderResearchEmail}=require('../lib/email/templates.ts');
 const {validateEmailSnapshot,unsubscribePlaceholder}=require('../lib/email/snapshot.ts');
 const origin='https://saccofinancial.com';
 const snapshot={version:1,...renderResearchEmail(event,origin,unsubscribePlaceholder(origin))};
 validateEmailSnapshot(snapshot,origin);
 assert.ok(snapshot.html.includes(first.thumbnail));
 assert.ok(snapshot.html.includes('/premium/masterclasses'));
 assert.ok(snapshot.html.includes(unsubscribePlaceholder(origin)));
});
