'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
export default function PaymentPending(){const router=useRouter();const [attempts,setAttempts]=useState(0);useEffect(()=>{if(attempts>=20)return;const timer=setTimeout(()=>{setAttempts(n=>n+1);router.refresh();},3000);return()=>clearTimeout(timer);},[attempts,router]);return <><p role="status">{attempts<20?'Verifying your payment. This page will update automatically.':'Payment confirmation is taking longer than expected. Refresh to check again; do not purchase a second subscription.'}</p><button type="button" className="button" onClick={()=>router.refresh()}>Check payment status</button></>;}
