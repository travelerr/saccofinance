const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),assert=require('node:assert/strict'),{test}=require('node:test'),{createHash}=require('node:crypto');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8').replace("import 'server-only';",''),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {weeklyOutlook008:o}=require('../lib/weekly-outlook-008.ts');
const data=require('../lib/premium-opportunities.ts');
const {researchEvents}=require('../lib/email/events.ts');
const {renderResearchEmail}=require('../lib/email/templates.ts');
const {validateEmailSnapshot,unsubscribePlaceholder,personalizeEmailSnapshot}=require('../lib/email/snapshot.ts');
const origin='https://saccofinancial.com';
const event=researchEvents([{...o,publicationState:'published'}],[],[])[0];
const snapshot={version:1,...renderResearchEmail(event,origin,unsubscribePlaceholder(origin))};
test('one issue and event, all six untouched images, canonical CTA and opt-out',()=>{
 assert.equal(data.weeklyOutlooks.filter(x=>x.id===o.id).length,1);
 assert.equal(researchEvents([o],[],[]).length,o.publicationState==='published'?1:0);
 assert.equal(o.charts.length,6);validateEmailSnapshot(snapshot,origin);
 assert.equal((snapshot.html.match(/<img /g)||[]).length,6);
 assert.equal(new URL(snapshot.url).pathname,'/premium/issue-008');
 assert.ok(!snapshot.html.includes('{{chart:'));
 const source='/tmp/codex-remote-attachments/01a0b589-ebce-7de1-98f4-4ee2d475ffe9/C3F0E027-F006-46AF-9FB8-7383DEA6F163';
 o.charts.forEach((c,i)=>{const dest=fs.readFileSync(path.join(__dirname,'../public',c.src));assert.equal(dest.readUInt16BE(0),0xffd8);if(fs.existsSync(source))assert.equal(createHash('sha256').update(dest).digest('hex'),createHash('sha256').update(fs.readFileSync(`${source}/${i+1}-Photo-${i+1}.jpg`)).digest('hex'));assert.ok(snapshot.html.includes(origin+c.src));assert.ok(snapshot.text.includes(c.caption));});
 const personalized=personalizeEmailSnapshot(snapshot,origin,origin+'/email/unsubscribe?token='+'a'.repeat(64));assert.ok(!personalized.html.includes(unsubscribePlaceholder(origin)));assert.ok(personalized.headers['List-Unsubscribe-Post']);
 assert.ok(snapshot.html.length<102400,'Avoid Gmail clipping');
});
test('image support rejects external, private, tracking and executable attributes',()=>{
 const src=origin+o.charts[0].src;
 for(const bad of ['https://evil.example/chart.jpg',origin+'/api/premium/chart/private',src+'?tracking=person',origin+'/images/premium/weekly-outlook/issue-008/chart-99.jpg','data:image/svg+xml,evil'])assert.throws(()=>validateEmailSnapshot({...snapshot,html:snapshot.html.replaceAll(src,bad)},origin));
 for(const extra of ['onerror="alert(1)"','srcset="https://evil.example/x 2x"','src="https://evil.example/x"','height="1"'])assert.throws(()=>validateEmailSnapshot({...snapshot,html:snapshot.html.replace('<img ',`<img ${extra} `)},origin));
 assert.throws(()=>validateEmailSnapshot({...snapshot,html:snapshot.html+'<script>alert(1)</script>'},origin));
});
test('last-week execution list matches authoritative records; no fabricated adds or stops as exits',()=>{
 const executions=data.opportunities.flatMap(x=>{const t=x.trade;if(!t)return [];const inWeek=d=>d>='2026-11-02'&&d<='2026-11-06';return [...(inWeek(t.enteredAt)?[[x.ticker,'bought',t.enteredAt,t.entryPrice,t.quantity]]:[]),...(inWeek(t.exitedAt)?[[x.ticker,'sold',t.exitedAt,t.exitPrice,t.quantity]]:[])];}).sort((a,b)=>a[0].localeCompare(b[0]));
 assert.deepEqual(executions,[['AR','sold','2026-11-04',39.25,100],['CNC','sold','2026-11-05',75.05,15],['EPAM','sold','2026-11-02',144.64,15],['WAY','bought','2026-11-04',28.57,20],['WK','sold','2026-11-04',84.98,5]]);
 for(const [ticker,,date,price] of executions){assert.ok(o.articleMarkdown.includes('**'+ticker+' —'));assert.ok(o.articleMarkdown.includes('$'+price));}
 assert.match(o.articleMarkdown,/not watching setups or stop adjustments/);
 assert.match(o.charts[1].caption,/not independently reconciled/);assert.match(o.charts[3].caption,/universe is unspecified/);assert.match(o.charts[4].caption,/not Friday’s close/);
});
