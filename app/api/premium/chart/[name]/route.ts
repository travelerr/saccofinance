import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {premiumAccess} from '@/lib/premium-access';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{name:string}>}){
 const access=await premiumAccess();
 if(!access.allowed)return new Response(null,{status:access.user?403:401,headers:{'Cache-Control':'private, no-store'}});
 const{name}=await params;if(!['zs-2026-09-16','rklb-daily-chart','now-2026-09-18','spcx-stage-analysis','spcx-setup'].includes(name))return new Response(null,{status:404});
 try{const file=await readFile(path.join(process.cwd(),'data/premium-assets',name+'.png'));return new Response(new Uint8Array(file),{headers:{'Content-Type':'image/png','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}catch{return new Response(null,{status:404});}
}
