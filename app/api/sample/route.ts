import {requestSample} from '@/lib/sample/server';
import {normalizeSampleEmail} from '@/lib/sample/content';
export const runtime='nodejs';
const generic={message:'If this address is eligible, your sample link will arrive shortly. Already requested one? Use your original email; each address receives one sample.'};
export async function POST(request:Request){
 const origin=process.env.AUTH_SITE_URL;
 if(!origin||request.headers.get('origin')!==origin)return Response.json({message:'Please use the sample form on our website.'},{status:403});
 const reader=request.body?.getReader();if(!reader)return Response.json({message:'Enter your email address.'},{status:400});
 let body='';let size=0;const decoder=new TextDecoder();
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();return Response.json({message:'Request too large.'},{status:413});}body+=decoder.decode(value,{stream:true});}
 let input;
 try{input=JSON.parse(body);normalizeSampleEmail(input.email);if(typeof input.marketing!=='boolean')throw Error();}catch{return Response.json({message:'Enter a valid email address.'},{status:400});}
 if(input.website)return Response.json(generic);
 // Deployment must preserve the trusted reverse proxy's client address header.
 const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 try{await requestSample(input.email,input.marketing,ip);return Response.json(generic,{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({message:'The sample service is temporarily unavailable. Please try again later.'},{status:503});}
}
