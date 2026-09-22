import {localDevelopment} from '@/lib/local-development';
import {premiumAccess} from '@/lib/premium-access';
import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import path from 'node:path';
import type { StrengthSnapshot } from '@/lib/market-strength';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const state=globalThis as typeof globalThis & {strengthRefresh?:Promise<void>;strengthAttempt?:number;strengthFailed?:boolean};
async function readSnapshot():Promise<StrengthSnapshot|null>{
  try{return JSON.parse(await readFile(path.join(process.cwd(),'data/market-strength/latest.json'),'utf8'));}catch{return null;}
}
export async function GET(){
  const access=await premiumAccess();
  if(!access.allowed) return NextResponse.json({error:access.user?"Premium access required":"Authentication required"},{status:access.user?403:401,headers:{"Cache-Control":"private, no-store"}});
  const snapshot=await readSnapshot();
  if(process.env.VERCEL||localDevelopment()){
    return NextResponse.json({snapshot,refreshing:false,refreshFailed:false},{headers:{'Cache-Control':'no-store'}});
  }
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  if(snapshot?.checkedDate!==today&&!state.strengthRefresh&&Date.now()-(state.strengthAttempt||0)>3600000){
    state.strengthAttempt=Date.now();
    state.strengthFailed=false;
    state.strengthRefresh=new Promise<void>((resolve)=>{
      execFile('python3',[path.join(process.cwd(),'scripts/refresh-market-strength.py')],{timeout:180000,maxBuffer:1024*1024},error=>{
        state.strengthFailed=Boolean(error);state.strengthRefresh=undefined;resolve();
      });
    });
  }
  return NextResponse.json({snapshot,refreshing:Boolean(state.strengthRefresh),refreshFailed:Boolean(state.strengthFailed)},{headers:{'Cache-Control':'no-store'}});
}
