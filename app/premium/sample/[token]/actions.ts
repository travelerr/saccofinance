'use server';
import {analyticsAllowed,CONSENT_COOKIE} from '@/lib/analytics/policy';
import {cookies,headers} from 'next/headers';
import {localDevelopment} from '@/lib/local-development';
import {redirect} from 'next/navigation';
import {emailDatabase} from '@/lib/email/database';
import {sampleHash,sampleEnabled} from '@/lib/sample/server';
export async function confirmSample(form:FormData){const token=String(form.get('token')||'');sampleHash(token);if(!sampleEnabled())throw Error('Sample unavailable');const {data,error}=await (await emailDatabase()).rpc('confirm_premium_sample',{p_hash:sampleHash(token)});if(error||!data)redirect('/premium/sample/'+token+'?error=expired');if(analyticsAllowed((await cookies()).get(CONSENT_COOKIE)?.value,(await headers()).get('sec-gpc')==='1'))(await cookies()).set('sf_sample',token,{httpOnly:true,secure:!localDevelopment(),sameSite:'lax',path:'/premium',maxAge:30*86400});redirect('/premium/sample/'+token);}
