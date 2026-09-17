const fs=require('node:fs');const ts=require('typescript');const assert=require('node:assert/strict');const{test}=require('node:test');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
const{hasPremiumAccess}=require('../lib/premium-membership.ts');const{safePremiumReturn}=require('../lib/auth-paths.ts');
test('access is denied for missing, disabled, expired or malformed grants',()=>{
 const now=Date.parse('2026-09-16T00:00:00Z');
 for(const grant of [null,undefined,{enabled:false,access_expires_at:null},{enabled:true,access_expires_at:'invalid'},{enabled:true,access_expires_at:'2026-09-16T00:00:00Z'}])assert.equal(hasPremiumAccess(grant,now),false);
 assert.equal(hasPremiumAccess({enabled:true,access_expires_at:null},now),true);
 assert.equal(hasPremiumAccess({enabled:true,access_expires_at:'2026-09-17T00:00:00Z'},now),true);
});
test('return destination stays inside Premium and prevents redirects to auth loops or external URLs',()=>{
 for(const value of [null,'https://evil.example','//evil.example','/premium/../about','/premium/%2e%2e/about','/premium/login','/premium/auth/confirm','/premium/access','/premium/set-password','/premium/\\evil'])assert.equal(safePremiumReturn(value),'/premium/dashboard');
 assert.equal(safePremiumReturn('/premium/opportunities/zscaler-001?view=setup#updates'),'/premium/opportunities/zscaler-001?view=setup#updates');
});
