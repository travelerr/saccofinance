 'use client';
import {useRef,useState} from 'react';
export default function PrivateOfferLink({url}:{url:string}){
 const input=useRef<HTMLInputElement>(null);const [status,setStatus]=useState('');
 async function copy(){try{await navigator.clipboard.writeText(url);setStatus('Link copied.');}catch{input.current?.focus();input.current?.select();setStatus('Select and copy the link below.');}}
 return <div style={{marginTop:24}}><label htmlFor="private-offer-url">Private invitation link</label><input ref={input} id="private-offer-url" readOnly value={url} onFocus={e=>e.currentTarget.select()} style={{display:'block',width:'100%',minWidth:0,padding:12,margin:'8px 0 12px',color:'var(--brand-text)',background:'var(--brand-surface)',border:'1px solid var(--brand-line)',borderRadius:4}}/><button type="button" className="button" onClick={copy}>Copy link</button><p role="status" aria-live="polite">{status}</p></div>;
}
