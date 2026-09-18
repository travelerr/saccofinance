import type {ReactNode} from 'react';
import {premiumDate} from '@/lib/premium-content';
export default function PremiumResearchHeader({kind,identifier,title,summary,metadata,children}:{kind:string;identifier?:string;title:ReactNode;summary?:string;metadata?:{label:string;value:string}[];children?:ReactNode}){
 return <header className="premium-research-header"><div className="premium-research-id"><span>SACCO PREMIUM RESEARCH</span><span>{kind}{identifier&&` / ${identifier}`}</span></div><h1>{title}</h1>{metadata&&<dl className="premium-research-metadata">{metadata.map(m=><div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>)}</dl>}{summary&&<div className="premium-research-read"><span>THE READ</span><p>{summary}</p></div>}{children}</header>;
}
export function researchNumber(id:string){const number=id.match(/-(\d+)$/)?.[1];return number?`#${number}`:undefined;}
export {premiumDate};
