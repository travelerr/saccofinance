import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {premiumAccess} from '@/lib/premium-access';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){
 const access=await premiumAccess();
 const headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
 if(!access.allowed)return new Response(null,{status:access.user?403:401,headers});
 try{
  const file=await readFile(path.join(process.cwd(),'data/premium-assets/stock-selection-strategy.pdf'));
  return new Response(new Uint8Array(file),{headers:{...headers,'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="Sacco_Premium_Stock_Selection_Strategy.pdf"'}});
 }catch{return new Response(null,{status:404,headers});}
}
