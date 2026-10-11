// Dedicated process: no request-lifetime background work and no Next dotenv loading.
const fs=require('node:fs'),Module=require('node:module'),ts=require('typescript');
if(!process.argv.includes('--configured'))Object.assign(process.env,require('./local-environment.cjs').appEnv(require('./local-environment.cjs').runtime()));
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const load=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};return load.call(this,id,...args);};
const {processNextResearchEmail}=require('../lib/email/queue-worker.ts');
let stopping=false;for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{stopping=true;});
(async()=>{console.log('Research email worker started.');do{try{const result=await processNextResearchEmail();if(result)console.log(JSON.stringify(result));}catch{console.error('Research worker unavailable; check configuration, database, and queue migration.');}if(!stopping&&!process.argv.includes('--once'))await new Promise(r=>setTimeout(r,2000));}while(!stopping&&!process.argv.includes('--once'));})();
