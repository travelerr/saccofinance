const fs=require('node:fs'),ts=require('typescript');
const {test}=require('node:test'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {recurringLeaders,periodKeys}=require('../lib/market-strength.ts');
function snapshot(lists){return {periods:Object.fromEntries(periodKeys.map((key,i)=>[key,{rows:lists[i].map((ticker,index)=>({ticker,name:ticker,rank:index+1}))}]))};}
test('frequency wins, ties use average rank, eighth place is excluded, snapshot is unchanged',()=>{
 const data=snapshot(periodKeys.map((_,i)=>['B','C',...(i<5?['A']:['D']),`E${i}`,`F${i}`,`G${i}`,`H${i}`,'X']));
 const before=JSON.stringify(data),result=recurringLeaders(data);
 assert.deepEqual(result.map(r=>r.ticker),['B','C','A']);
 assert.deepEqual(result.map(r=>r.periods.length),[6,6,5]);
 assert.equal(JSON.stringify(data),before);
});
test('equal frequency and average rank use ticker for a stable order',()=>{
 const data=snapshot(periodKeys.map((_,i)=>i%2?['B','A']:['A','B']));
 assert.deepEqual(recurringLeaders(data).map(r=>r.ticker),['A','B']);
});
test('empty rankings produce no invented leaders',()=>{
 assert.deepEqual(recurringLeaders(snapshot(periodKeys.map(()=>[]))),[]);
});
